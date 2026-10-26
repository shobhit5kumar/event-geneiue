#!/usr/bin/env python3
"""
EventGenie AI - Local Backend & Proxy Server
Standard Library Python 3.14 (Zero external pip dependencies required)
Features:
- Static file serving (HTML, CSS, JS, JSON)
- Persistent JSON events database API (/api/events)
- Secure Google Gemini AI Proxy (/api/ai/chat, /api/ai/plan) with automatic .env loader
- Demo Mode fallback when no API key is provided
"""

import http.server
import socketserver
import os
import sys
import json
import urllib.request
import urllib.error

PORT = int(os.environ.get("PORT", 3000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
EVENTS_FILE = os.path.join(DATA_DIR, "events.json")
ENV_FILE = os.path.join(BASE_DIR, ".env")

# Global runtime API key state
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

def load_env_file():
    """Simple .env file parser (without needing python-dotenv)"""
    global GEMINI_API_KEY
    if os.path.isfile(ENV_FILE):
        try:
            with open(ENV_FILE, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k == "GEMINI_API_KEY" and v:
                            GEMINI_API_KEY = v
                            os.environ["GEMINI_API_KEY"] = v
        except Exception as e:
            print(f"[Warning] Could not load .env file: {e}")

load_env_file()

class EventGenieHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP Request Handler supporting Static Files & REST API"""

    def end_headers(self):
        # Enable CORS for local development
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        url_path = self.path.split("?")[0]

        # API: Status check
        if url_path == "/api/status":
            self.send_json_response(200, {
                "status": "online",
                "hasGeminiKey": bool(GEMINI_API_KEY and len(GEMINI_API_KEY.strip()) > 10),
                "version": "1.0.0"
            })
            return

        # API: Get saved events
        if url_path == "/api/events":
            events = self.load_events_from_disk()
            self.send_json_response(200, events)
            return

        # Fallback to static file serving
        return super().do_GET()

    def do_POST(self):
        url_path = self.path.split("?")[0]
        content_len = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_len) if content_len > 0 else b"{}"

        try:
            payload = json.loads(post_data.decode("utf-8")) if post_data else {}
        except Exception:
            payload = {}

        # API: Save/Update Events
        if url_path == "/api/events":
            if isinstance(payload, list):
                self.save_events_to_disk(payload)
                self.send_json_response(200, {"success": True, "count": len(payload)})
            else:
                self.send_json_response(400, {"error": "Expected array of events"})
            return

        # API: Set custom Gemini Key dynamically
        if url_path == "/api/settings/key":
            global GEMINI_API_KEY
            new_key = payload.get("key", "").strip()
            GEMINI_API_KEY = new_key
            self.send_json_response(200, {
                "success": bool(new_key),
                "hasGeminiKey": bool(new_key),
                "message": "API Key updated successfully" if new_key else "Switched to Demo AI Mode"
            })
            return

        # API: AI Chat Proxy
        if url_path == "/api/ai/chat":
            user_msg = payload.get("message", "")
            event_ctx = payload.get("eventContext", {})
            history = payload.get("history", [])
            client_key = payload.get("clientKey", "")
            active_key = client_key or GEMINI_API_KEY

            if not active_key:
                # Return demo signal
                self.send_json_response(200, {
                    "isDemo": True,
                    "message": "No API key configured; client will use offline domain engine."
                })
                return

            reply = self.call_gemini_chat(active_key, user_msg, event_ctx, history)
            self.send_json_response(200, {
                "reply": reply,
                "source": "Gemini AI Live",
                "isDemo": False
            })
            return

        # API: AI Plan Synthesis Proxy
        if url_path == "/api/ai/plan":
            form_data = payload.get("formData", {})
            client_key = payload.get("clientKey", "")
            active_key = client_key or GEMINI_API_KEY

            if not active_key:
                self.send_json_response(200, {"isDemo": True})
                return

            plan_result = self.call_gemini_plan(active_key, form_data)
            if plan_result:
                self.send_json_response(200, plan_result)
            else:
                self.send_json_response(200, {"isDemo": True})
            return

        self.send_json_response(404, {"error": "Endpoint not found"})

    def send_json_response(self, code, data):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def load_events_from_disk(self):
        if os.path.isfile(EVENTS_FILE):
            try:
                with open(EVENTS_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"[Error] Failed to read {EVENTS_FILE}: {e}")
        return []

    def save_events_to_disk(self, events):
        try:
            os.makedirs(DATA_DIR, exist_ok=True)
            with open(EVENTS_FILE, "w", encoding="utf-8") as f:
                json.dump(events, f, indent=2)
        except Exception as e:
            print(f"[Error] Failed to save {EVENTS_FILE}: {e}")

    def call_gemini_chat(self, key, message, event_ctx, history):
        """Calls Google Gemini REST API using urllib"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
        
        system_instruction = (
            "You are EventGenie AI, an elite, warm, and highly practical event planning consultant. "
            "You help organizers plan weddings, birthdays, college festivals, corporate galas, and parties. "
            "Always give specific, budget-conscious, realistic advice with actionable steps. "
            "When suggesting budget allocations, remind users that exact figures depend on local vendor quotes."
        )

        contents = []
        if event_ctx:
            ctx_summary = f"[Event Context: '{event_ctx.get('title')}', Type: {event_ctx.get('type')}, Guests: {event_ctx.get('guests')}, Budget: {event_ctx.get('budget')}, Theme: '{event_ctx.get('theme')}', Location: '{event_ctx.get('location')}']"
            contents.append({"role": "user", "parts": [{"text": f"Context: {ctx_summary}"}]})
            contents.append({"role": "model", "parts": [{"text": "Understood. I have the event context loaded and ready to help."}]})

        contents.append({"role": "user", "parts": [{"text": message}]})

        req_body = {
            "contents": contents,
            "systemInstruction": {"parts": [{"text": system_instruction}]},
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1000}
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(req_body).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=15) as res:
                res_data = json.loads(res.read().decode("utf-8"))
                candidates = res_data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "")
        except Exception as e:
            print(f"[Gemini API Error] {e}")
            return f"Note: Gemini Live API request encountered an issue ({e}). Switched smoothly to local advisory mode."

        return "I am ready to assist with any event planning questions!"

    def call_gemini_plan(self, key, form_data):
        """Generates structured event plan using Gemini API"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
        
        prompt = f"""Generate a comprehensive JSON event plan for:
Event Type: {form_data.get('type')}
Title: {form_data.get('title')}
Host: {form_data.get('hostName')}
Guests: {form_data.get('guestCount')}
Target Budget: {form_data.get('currency', '$')}{form_data.get('targetBudget')}
Location: {form_data.get('location')}
Theme: {form_data.get('theme')}
Notes: {form_data.get('specialNotes')}

Respond ONLY with valid JSON matching this schema:
{{
  "plan": {{
    "executiveSummary": "string",
    "colorPalette": [ {{"name": "...", "hex": "#..."}} ],
    "venues": [ {{"name": "...", "type": "...", "capacity": "...", "pros": "...", "cons": "...", "estimatedCost": "..."}} ],
    "decor": {{ "concept": "...", "entrance": "...", "tables": "...", "lighting": "...", "photobooth": "..." }},
    "catering": {{ "style": "...", "appetizers": ["..."], "mains": ["..."], "desserts": ["..."], "signatureDrinks": ["..."], "perGuestEstimate": 50 }},
    "entertainment": {{ "musicGenre": "...", "highlights": ["..."] }}
  }}
}}"""

        req_body = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.4, "maxOutputTokens": 2048, "responseMimeType": "application/json"}
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(req_body).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=20) as res:
                res_data = json.loads(res.read().decode("utf-8"))
                text = res_data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(text)
        except Exception as e:
            print(f"[Gemini Plan Error] {e}")
            return None

def run_server():
    os.chdir(BASE_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), EventGenieHandler) as httpd:
        print("\n==================================================")
        print(f"[*] EventGenie AI Server running at http://localhost:{PORT}")
        print(f"    Directory: {BASE_DIR}")
        print(f"    Gemini Live API: {'CONFIGURED (Live)' if GEMINI_API_KEY else 'OFFLINE (Demo AI Mode Ready)'}")
        print("==================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
