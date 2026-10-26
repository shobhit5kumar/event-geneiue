/**
 * EventGenie AI - Default Sample Events & Pre-configured Data
 * Provides instant test data for Weddings, Birthdays, and College Galas
 */
const DEFAULT_EVENTS = [
  {
    id: "event-1",
    type: "wedding",
    title: "Royal Botanical Garden Wedding",
    hostName: "Elena & Julian Vance",
    date: "2026-11-14",
    location: "Savannah, Georgia (Rosewood Conservatory)",
    venueType: "hybrid",
    guestCount: 200,
    theme: "Enchanted Botanical Romance",
    vibe: "Romantic, Lush, Twilight Candlelit, Timeless",
    targetBudget: 35000,
    currency: "$",
    specialNotes: "Focus on organic garden florals, sustainable locally sourced menu, acoustic harpist for vows, and late-night artisan pizza bar.",
    plan: {
      executiveSummary: "A breathtaking celebration marrying historic botanical garden elegance with modern twilight romance. Natural floral arches, warm fairy lights, and an immersive culinary journey create an intimate atmosphere for 200 cherished guests.",
      colorPalette: [
        { name: "Deep Emerald", hex: "#064E3B" },
        { name: "Dusty Rose", hex: "#E0A9A5" },
        { name: "Champagne Gold", hex: "#D4AF37" },
        { name: "Ivory Silk", hex: "#F8F6F0" },
        { name: "Sage Green", hex: "#84A98C" }
      ],
      venues: [
        {
          name: "The Rosewood Glass Conservatory",
          type: "Glass Atrium & Historic Orangery",
          capacity: "Up to 250 guests",
          pros: "Climate-controlled glass ceilings, 360-degree garden views, built-in ambient fairy lighting",
          cons: "Strict sound curfew at 11:30 PM",
          estimatedCost: "$8,500 - $10,500"
        },
        {
          name: "Magnolia Manor Estate Grounds",
          type: "Outdoor Meadow & Open Marquee",
          capacity: "Up to 300 guests",
          pros: "Grand lawn, ancient live oaks with Spanish moss, flexible vendor policy",
          cons: "Requires independent tent rental and generator hookup",
          estimatedCost: "$7,000 - $9,200"
        },
        {
          name: "Savannah River Courtyard",
          type: "Waterfront Brick Terrace",
          capacity: "Up to 220 guests",
          pros: "Stunning sunset views over the water, historical charm",
          cons: "Limited parking requiring dedicated guest shuttles",
          estimatedCost: "$6,500 - $8,000"
        }
      ],
      decor: {
        concept: "Living garden installation with suspended eucalyptus garlands, vintage brass candelabras, and sheer champagne draping.",
        entrance: "Grand arch of white garden roses, Italian ruscus, and antique lantern pathway.",
        tables: "Farmhouse raw oak tables adorned with velvet runners, tapered ivory candles, and gold-rimmed crystal glassware.",
        lighting: "Warm 2400K micro-fairy light canopy overhead with uplighting on specimen botanical trees.",
        photobooth: "Living moss and floral wall featuring a custom neon script reading 'Forever Starts Tonight'."
      },
      catering: {
        style: "Dual-plated dinner preceded by interactive cocktail hour chef stations.",
        appetizers: ["Brie & Fig Puff Pastry Tartlets", "Smoked Salmon Crostini with Dill Cream", "Prosciutto-Wrapped Asparagus Tips"],
        mains: ["Pan-Seared Sea Bass with Lemon Caper Emulsion", "Slow-Braised Short Ribs over Truffled Polenta", "Wild Mushroom Risotto with Herb Crisp (Vegan)"],
        desserts: ["Tiered Naked Lemon-Lavender Wedding Cake", "Miniature Salted Caramel Crème Brûlées", "Late-Night Woodfired Artisan Pizzas"],
        signatureDrinks: ["The 'Blushing Bride' (Elderflower Gin Fizz with Rose Petals)", "The 'Savannah Dusk' (Bourbon, Blackberry Puree, Fresh Thyme)"],
        perGuestEstimate: 65
      },
      entertainment: {
        musicGenre: "Live acoustic strings for ceremony, followed by an energetic 6-piece soul & funk live band for the reception.",
        highlights: [
          "Harp & Cello processional entrance",
          "Sunset Champagne Toast on the Conservatory terrace",
          "Choreographed first dance with low-lying dry ice cloud effect",
          "Cold-spark fountain sendoff at midnight"
        ],
        keyMoments: ["First Look: 3:30 PM", "Vows: 5:00 PM", "Cocktail Hour: 5:45 PM", "Grand Entry: 7:00 PM", "Cake Cutting: 8:45 PM"]
      }
    },
    budget: {
      categories: [
        {
          id: "cat-venue",
          name: "Venue & Facilities",
          icon: "building",
          percentage: 26,
          estimatedAmount: 9100,
          items: [
            { id: "b-1", name: "Conservatory Rental (10 hrs)", estimated: 8500, actual: 8500, paid: true, notes: "Deposit paid on contract signing" },
            { id: "b-2", name: "Bridal Suite & Groom Lounge fee", estimated: 600, actual: 550, paid: true, notes: "Early access from 10 AM included" }
          ]
        },
        {
          id: "cat-catering",
          name: "Catering & Bar Service",
          icon: "utensils",
          percentage: 34,
          estimatedAmount: 11900,
          items: [
            { id: "b-3", name: "Plated 3-Course Dinner (200 guests @ $45/pp)", estimated: 9000, actual: 9200, paid: false, notes: "Includes service staff and china" },
            { id: "b-4", name: "Open Bar Package & Signature Cocktails", estimated: 2200, actual: 2100, paid: false, notes: "4 hours open bar + 2 licensed bartenders" },
            { id: "b-5", name: "Wedding Cake & Dessert Station", estimated: 700, actual: 650, paid: true, notes: "Tasting completed and deposit secured" }
          ]
        },
        {
          id: "cat-decor",
          name: "Decor, Florals & Ambience",
          icon: "sparkles",
          percentage: 15,
          estimatedAmount: 5250,
          items: [
            { id: "b-6", name: "Ceremony Arch & Living Floral Installations", estimated: 2400, actual: 2500, paid: true, notes: "Custom garden rose & greenery arrangement" },
            { id: "b-7", name: "Table Centerpieces & Velvet Runners", estimated: 1600, actual: 1500, paid: false, notes: "20 tables @ $75/table" },
            { id: "b-8", name: "Canopy Fairy Lighting & Uplights", estimated: 1250, actual: 1200, paid: false, notes: "Setup begins at 11 AM" }
          ]
        },
        {
          id: "cat-photo",
          name: "Photography & Videography",
          icon: "camera",
          percentage: 11,
          estimatedAmount: 3850,
          items: [
            { id: "b-9", name: "Lead Photographer + Second Shooter (8 hrs)", estimated: 2600, actual: 2600, paid: true, notes: "Includes drone aerial footage + engagement album" },
            { id: "b-10", name: "Cinematic Highlight Film (4K)", estimated: 1250, actual: 1250, paid: false, notes: "Teaser delivered within 72 hrs" }
          ]
        },
        {
          id: "cat-entertainment",
          name: "Music & Entertainment",
          icon: "music",
          percentage: 9,
          estimatedAmount: 3150,
          items: [
            { id: "b-11", name: "Ceremony Strings Duo (Harp & Cello)", estimated: 950, actual: 900, paid: true, notes: "30 min prelude + ceremony + recessional" },
            { id: "b-12", name: "Reception 6-Piece Funk & Pop Band + Sound", estimated: 2200, actual: 2300, paid: false, notes: "Includes MC services & wireless mics" }
          ]
        },
        {
          id: "cat-misc",
          name: "Stationery, Favors & Contingency",
          icon: "gift",
          percentage: 5,
          estimatedAmount: 1750,
          items: [
            { id: "b-13", name: "Custom Foil Invitations & Calligraphy RSVP", estimated: 650, actual: 620, paid: true, notes: "Wax sealed and mailed" },
            { id: "b-14", name: "Guest Favors (Savannah Wildflower Honey jars)", estimated: 500, actual: 480, paid: true, notes: "Hand-tagged 200 jars" },
            { id: "b-15", name: "Emergency Cushion & Contingency Fund", estimated: 600, actual: 0, paid: false, notes: "Reserved for last-minute needs" }
          ]
        }
      ]
    },
    checklist: [
      { id: "chk-1", title: "Finalize Conservatory booking and execute contract", milestone: "6+ Months Out", deadline: "2026-05-15", priority: "high", completed: true, notes: "Contract signed, 50% deposit processed" },
      { id: "chk-2", title: "Hire lead photographer and schedule engagement photoshoot", milestone: "6+ Months Out", deadline: "2026-06-01", priority: "high", completed: true, notes: "Portfolio verified and retainer paid" },
      { id: "chk-3", title: "Menu and wine tasting with gourmet caterer", milestone: "2-3 Months Out", deadline: "2026-08-20", priority: "medium", completed: true, notes: "Selected sea bass and braised short ribs" },
      { id: "chk-4", title: "Send formal invitation suite and launch RSVP web portal", milestone: "2-3 Months Out", deadline: "2026-09-01", priority: "high", completed: true, notes: "RSVP deadline set for Oct 10" },
      { id: "chk-5", title: "Conduct floral mock-up and finalize table arrangements", milestone: "1 Month Out", deadline: "2026-10-15", priority: "medium", completed: true, notes: "Reviewed linen samples and brass taper holders" },
      { id: "chk-6", title: "Final headcount confirmation with caterer and seating chart", milestone: "1 Month Out", deadline: "2026-10-25", priority: "high", completed: false, notes: "Awaiting 8 pending RSVPs" },
      { id: "chk-7", title: "Submit ceremony playlist and 'do not play' list to band", milestone: "1 Week Out", deadline: "2026-11-07", priority: "medium", completed: false, notes: "Band leader confirmed rehearsal" },
      { id: "chk-8", title: "Pack bridal emergency kit (steamer, pins, flats, mints)", milestone: "1 Week Out", deadline: "2026-11-12", priority: "low", completed: false, notes: "Kit prepared in bridal suite travel bag" },
      { id: "chk-9", title: "Marriage license pickup and officiant briefing", milestone: "Event Day", deadline: "2026-11-14", priority: "high", completed: false, notes: "Assigned to maid of honor for safe keeping" }
    ],
    schedule: [
      { time: "10:00 AM", title: "Bridal Suite & Groom Lounge Open", description: "Hair & makeup artists arrive. Mimosa bar and light brunch served.", category: "Prep", icon: "sparkles" },
      { time: "11:30 AM", title: "Florist & Decor Setup Begins", description: "Conservatory arch construction, table linens, and lighting rig install.", category: "Logistics", icon: "truck" },
      { time: "02:00 PM", title: "Photographer & Videographer Arrival", description: "Detail flat-lays, dress shots, and getting-ready candids.", category: "Media", icon: "camera" },
      { time: "03:30 PM", title: "Private First Look & Couple Portraits", description: "Intimate moment in the secret botanical garden courtyard.", category: "Photo", icon: "heart" },
      { time: "04:30 PM", title: "Guest Arrival & Welcome Refreshments", description: "Acoustic strings begin prelude music. Sparkling lavender lemonade offered.", category: "Ceremony", icon: "users" },
      { time: "05:00 PM", title: "Wedding Ceremony", description: "Processional, personal vows, ring exchange, and grand recessional.", category: "Ceremony", icon: "ring" },
      { time: "05:45 PM", title: "Sunset Cocktail Hour", description: "Signature cocktails, passed hors d'oeuvres, and sunset terrace mingling.", category: "Reception", icon: "glass-water" },
      { time: "07:00 PM", title: "Grand Entrance & Plated Dinner", description: "Welcome toasts, blessing, and 3-course dinner service.", category: "Dinner", icon: "utensils" },
      { time: "08:15 PM", title: "First Dance & Parent Dances", description: "Low-lying fog effect for choreographed first dance.", category: "Party", icon: "music" },
      { time: "08:45 PM", title: "Cake Cutting & Dessert Bar", description: "Celebratory champagne toast followed by high-energy dance floor opening.", category: "Party", icon: "cake" },
      { time: "11:45 PM", title: "Cold-Spark Fountain Grand Sendoff", description: "Farewell promenade through sparkling fountains to getaway vintage roadster.", category: "Farewell", icon: "star" }
    ],
    vendors: [
      {
        id: "v-1",
        category: "Venue",
        name: "Rosewood Glass Conservatory",
        contactPerson: "Sarah Jenkins (Event Director)",
        phone: "+1 (912) 555-0142",
        email: "events@rosewoodconservatory.com",
        status: "Booked",
        quoteAmount: 9050,
        notes: "Security deposit paid. Certificate of insurance filed."
      },
      {
        id: "v-2",
        category: "Catering",
        name: "Savannah Heritage Culinary Arts",
        contactPerson: "Chef Marcus DuPont",
        phone: "+1 (912) 555-0188",
        email: "inquiries@savannahheritagecatering.com",
        status: "Booked",
        quoteAmount: 11300,
        notes: "Menu locked. Includes 10 vegan/gluten-free special plates."
      },
      {
        id: "v-3",
        category: "Photography",
        name: "Lumière Garden Studio",
        contactPerson: "Claire Moreau",
        phone: "+1 (912) 555-0219",
        email: "claire@lumierestudio.com",
        status: "Booked",
        quoteAmount: 3850,
        notes: "Full day coverage with second shooter and drone aerials."
      },
      {
        id: "v-4",
        category: "Florals & Decor",
        name: "Botanica Bloom Floral Design",
        contactPerson: "Hannah Wu",
        phone: "+1 (912) 555-0374",
        email: "hello@botanicabloom.com",
        status: "Deposit Paid",
        quoteAmount: 5200,
        notes: "Final walkthrough scheduled 2 weeks before the event."
      },
      {
        id: "v-5",
        category: "Entertainment",
        name: "The Velvet Rhythm 6-Piece Collective",
        contactPerson: "Damian Cole",
        phone: "+1 (912) 555-0455",
        email: "booking@velvetrhythm.com",
        status: "Quote Received",
        quoteAmount: 3200,
        notes: "Reviewing standard rider and staging power requirements."
      }
    ]
  },
  {
    id: "event-2",
    type: "birthday",
    title: "Cyberpunk Neon 21st Birthday",
    hostName: "Liam 'Kairo' Chen",
    date: "2026-12-05",
    location: "Austin, Texas (The Warehouse District)",
    venueType: "indoor",
    guestCount: 80,
    theme: "Futuristic Neon Cyberpunk",
    vibe: "High Energy, Synthwave, Immersive Glow, Edgy",
    targetBudget: 6500,
    currency: "$",
    specialNotes: "Blacklight neon face painting booth, retro arcade machines, laser light show, and DJ spinning synthwave/EDM.",
    plan: {
      executiveSummary: "An electrifying neon underworld experience commemorating a milestone 21st birthday. Industrial loft aesthetics, reactive UV lighting, retro arcade pods, and high-energy electronic beats.",
      colorPalette: [
        { name: "Cyber Cyan", hex: "#00F0FF" },
        { name: "Neon Magenta", hex: "#FF007F" },
        { name: "Electric Violet", hex: "#7928CA" },
        { name: "Matte Obsidian", hex: "#111827" },
        { name: "Laser Lime", hex: "#39FF14" }
      ],
      venues: [
        {
          name: "District 7 Industrial Loft",
          type: "Exposed Brick Warehouse & Mezzanine",
          capacity: "Up to 120 guests",
          pros: "Complete blackout capability, powerful sound system, street art murals",
          cons: "No on-site kitchen, requires food truck catering",
          estimatedCost: "$1,800 - $2,200"
        },
        {
          name: "The Arcade Matrix Lounge",
          type: "Retro Arcade Bar",
          capacity: "Up to 90 guests",
          pros: "Includes 25 free-play arcade cabinets and neon bar",
          cons: "Private buyout only available Sunday - Thursday",
          estimatedCost: "$2,200 - $2,600"
        }
      ],
      decor: {
        concept: "Neo-Tokyo street alley with custom glowing LED signs, UV blacklight floodlights, and chrome metallic accents.",
        entrance: "Fog tunnel with laser grid projection and glowing wristband dispensary.",
        tables: "High-top cocktail barrels wrapped in circuit board graphics with neon wire centerpieces.",
        lighting: "UV high-output wash lights, laser matrix beams, and synced LED strobe tubes.",
        photobooth: "Matrix bullet-time 180-degree multi-camera rig with holographic infinity mirrors."
      },
      catering: {
        style: "Night-market street food bites and liquid nitrogen glowing mocktails/cocktails.",
        appetizers: ["Tokyo Street Yakitori Skewers", "Korean Fried Chicken Bao Buns", "Loaded Truffle Waffle Fries"],
        mains: ["Gourmet Sliders on Charcoal Brioche", "Spicy Dan Dan Noodle Bowls in take-out boxes"],
        desserts: ["Neon Glazed Mochi Donuts", "Liquid Nitrogen Dragon Breath Popcorn"],
        signatureDrinks: ["The 'Glitch in the Matrix' (Blue Curaçao, Vodka, Glow Tonic with UV activation)", "The 'Cyber Stride' (Dragonfruit, Lime, Ginger Beer)"],
        perGuestEstimate: 32
      },
      entertainment: {
        musicGenre: "Synthwave, Cyber-Bass, and 2000s remixes mixed live by a headline club DJ.",
        highlights: [
          "UV Fluorescent body painting artist station",
          "Street Fighter II & Mario Kart multiplayer tournament on 150-inch projector",
          "Midnight countdown with CO2 cryo-cannon blast"
        ],
        keyMoments: ["Doors Open: 8:00 PM", "Arcade Tournament Finals: 10:30 PM", "Midnight Cryo Blast: 12:00 AM"]
      }
    },
    budget: {
      categories: [
        {
          id: "cat-venue",
          name: "Loft Venue & Permits",
          icon: "building",
          percentage: 28,
          estimatedAmount: 1820,
          items: [
            { id: "b-21", name: "Warehouse Loft Rental (7 hrs)", estimated: 1600, actual: 1600, paid: true, notes: "Security deposit included" },
            { id: "b-22", name: "Special Event Audio & Night Permit", estimated: 220, actual: 200, paid: true, notes: "City permit granted" }
          ]
        },
        {
          id: "cat-catering",
          name: "Street Food Trucks & Bar",
          icon: "utensils",
          percentage: 32,
          estimatedAmount: 2080,
          items: [
            { id: "b-23", name: "Asian Fusion Food Truck Minimum (80 guests)", estimated: 1500, actual: 1550, paid: false, notes: "Unlimited bao and sliders for 3 hrs" },
            { id: "b-24", name: "UV Reactive Bar Ingredients & Kegs", estimated: 580, actual: 600, paid: false, notes: "Special quinine tonic for blacklight glow" }
          ]
        },
        {
          id: "cat-decor",
          name: "Neon Lighting & Laser Setup",
          icon: "sparkles",
          percentage: 20,
          estimatedAmount: 1300,
          items: [
            { id: "b-25", name: "High-Power UV Cannons & Laser Beams Rental", estimated: 750, actual: 700, paid: true, notes: "Tech delivery and rigging on Friday" },
            { id: "b-26", name: "Custom 'KAIRO 21' Neon Flex Sign", estimated: 350, actual: 340, paid: true, notes: "Keepsake sign after the party" },
            { id: "b-27", name: "UV Body Paint Supplies & Glow Accessories", estimated: 200, actual: 180, paid: true, notes: "500 glow sticks, neon tapes, and glasses" }
          ]
        },
        {
          id: "cat-entertainment",
          name: "DJ & Interactive Entertainment",
          icon: "music",
          percentage: 15,
          estimatedAmount: 975,
          items: [
            { id: "b-28", name: "Club Resident DJ + Sound Equipment (4 hrs)", estimated: 700, actual: 750, paid: false, notes: "Custom synthwave transition set" },
            { id: "b-29", name: "CO2 Blast Cannon Rental & Tank", estimated: 275, actual: 250, paid: false, notes: "Midnight celebration drop" }
          ]
        },
        {
          id: "cat-misc",
          name: "Photography & Contingency",
          icon: "camera",
          percentage: 5,
          estimatedAmount: 325,
          items: [
            { id: "b-30", name: "Flash & Neon Nightlife Photographer (3 hrs)", estimated: 325, actual: 325, paid: false, notes: "Delivers 100 edited high-contrast photos" }
          ]
        }
      ]
    },
    checklist: [
      { id: "chk-21", title: "Reserve District 7 Loft and sign noise agreements", milestone: "2-3 Months Out", deadline: "2026-10-01", priority: "high", completed: true, notes: "Deposit confirmed" },
      { id: "chk-22", title: "Lock in Asian Fusion food truck booking", milestone: "1 Month Out", deadline: "2026-11-05", priority: "high", completed: true, notes: "Dietary options for vegetarians secured" },
      { id: "chk-23", title: "Order custom neon flex sign with birthday name", milestone: "1 Month Out", deadline: "2026-11-10", priority: "medium", completed: true, notes: "Delivered and tested" },
      { id: "chk-24", title: "Curate Spotify sample vibe playlist for DJ alignment", milestone: "1 Week Out", deadline: "2026-11-28", priority: "medium", completed: true, notes: "Shared with DJ" },
      { id: "chk-25", title: "Pickup CO2 cryo-cannon and safety goggles", milestone: "Event Day", deadline: "2026-12-05", priority: "high", completed: false, notes: "Assigned to co-host" }
    ],
    schedule: [
      { time: "05:00 PM", title: "Load-in & Lighting Rigging", description: "UV blacklights, lasers, and haze machines setup.", category: "Setup", icon: "truck" },
      { time: "07:30 PM", title: "Food Truck Parking & Power Hookup", description: "Street food service warms up.", category: "Food", icon: "utensils" },
      { time: "08:00 PM", title: "Doors Open & Neon Body Paint Station", description: "Guests receive glowing bracelets and blacklight face designs.", category: "Reception", icon: "users" },
      { time: "09:30 PM", title: "DJ Takes the Decks", description: "Bass drops and high-energy party mix starts.", category: "Party", icon: "music" },
      { time: "11:55 PM", title: "Birthday Countdown", description: "Lights dim to pure blacklight, champagne bottles pop.", category: "Celebration", icon: "sparkles" },
      { time: "12:00 AM", title: "CO2 Blast & Beat Drop", description: "Dual cryo-cannon blast illuminates the dance floor.", category: "Party", icon: "star" },
      { time: "02:00 AM", title: "Event Concludes & Rideshare Coordinated", description: "Taxis and designated drivers assist guests home.", category: "Wrap-up", icon: "clock" }
    ],
    vendors: [
      {
        id: "v-21",
        category: "Venue",
        name: "District 7 Industrial Warehouse",
        contactPerson: "Alex Rivera",
        phone: "+1 (512) 555-0891",
        email: "booking@district7atx.com",
        status: "Booked",
        quoteAmount: 1800,
        notes: "Includes access to service elevator."
      },
      {
        id: "v-22",
        category: "Catering",
        name: "Bao & Blade Night Market Truck",
        contactPerson: "Kenji Sato",
        phone: "+1 (512) 555-0723",
        email: "catering@baoblade.com",
        status: "Booked",
        quoteAmount: 1550,
        notes: "Serving 8:00 PM - 11:30 PM."
      },
      {
        id: "v-23",
        category: "Entertainment",
        name: "DJ Neuro (Apex Talent)",
        contactPerson: "Jordan Miller",
        phone: "+1 (512) 555-0312",
        email: "jordan@apextalent.io",
        status: "Booked",
        quoteAmount: 750,
        notes: "Bringing Pioneer CDJ setup and subwoofer."
      }
    ]
  },
  {
    id: "event-3",
    type: "college",
    title: "TechNova 2026: College Tech Fest & Cultural Gala",
    hostName: "Engineering Students Council & Dean's Office",
    date: "2026-11-20",
    location: "North Campus Auditorium & Quad",
    venueType: "hybrid",
    guestCount: 500,
    theme: "Innovate, Inspire, Ignite",
    vibe: "Intellectual, Inspiring, Festive, Dynamic",
    targetBudget: 15000,
    currency: "$",
    specialNotes: "24-hour hackathon showcase, keynote AI tech leaders, battle of the college bands, drone light show, and alumni networking lounge.",
    plan: {
      executiveSummary: "A flagship multi-disciplinary university festival uniting 500 students, faculty, and industry pioneers. Features an innovation exhibition, hackathon demo pit, culinary food stalls, and an evening cultural headline concert.",
      colorPalette: [
        { name: "Electric Indigo", hex: "#4F46E5" },
        { name: "Bright Cyan", hex: "#06B6D4" },
        { name: "Solar Amber", hex: "#F59E0B" },
        { name: "Charcoal Slate", hex: "#1E293B" },
        { name: "Pure Frost", hex: "#F8FAFC" }
      ],
      venues: [
        {
          name: "University Grand Amphitheater & Quad",
          type: "Indoor Auditorium + Outdoor Festival Lawn",
          capacity: "Up to 750 attendees",
          pros: "Zero facility rental cost (campus subsidized), high-capacity fiber internet, stage lighting ready",
          cons: "Requires campus security coordination and cleanup crew overtime",
          estimatedCost: "$1,200 (Facilities & Security overtime)"
        }
      ],
      decor: {
        concept: "Modern high-tech festival aesthetics with geodesic interactive domes, LED banner displays, and sponsor display pods.",
        entrance: "Futuristic arch with animated programmable LED pixel strips and digital credential scanning.",
        tables: "Modular standing charging hubs and communal brainstorming benches in the innovation tent.",
        lighting: "Intelligent moving head stage beam fixtures and outdoor fairy tree wraps across the campus quad.",
        photobooth: "360-degree rotating video spinner with personalized TechNova branded motion overlay."
      },
      catering: {
        style: "Continuous festival refreshment stations, sponsored caffeine bar, and evening dinner buffet.",
        appetizers: ["Street Taco Trio", "Mini Vegetable Samosas with Mint Chutney", "Falafel & Hummus Pita Pockets"],
        mains: ["Gourmet Burger Bar with vegan patties", "Thai Basil Fried Rice & Teriyaki Bowls"],
        desserts: ["Churro Station with warm chocolate dip", "Ice Cream Cookie Sandwich Bar"],
        signatureDrinks: ["The 'Code Runner' (Matcha Iced Latte with Vanilla Foam)", "The 'Debug Spritz' (Sparkling Blood Orange & Rosemary)"],
        perGuestEstimate: 14
      },
      entertainment: {
        musicGenre: "Campus acoustic opening acts, battle of the college bands, followed by an EDM headline producer.",
        highlights: [
          "Keynote address by leading Generative AI researcher",
          "Hackathon Grand Pitch Finals with $5,000 in student grants",
          "Drone Formation Light Display over the campus lake",
          "Inter-collegiate Battle of the Bands"
        ],
        keyMoments: ["Opening Ceremony: 09:30 AM", "Hackathon Pitches: 02:00 PM", "Drone Show: 07:30 PM", "Headline Band: 08:30 PM"]
      }
    },
    budget: {
      categories: [
        {
          id: "cat-venue",
          name: "Campus Facilities & Safety",
          icon: "building",
          percentage: 10,
          estimatedAmount: 1500,
          items: [
            { id: "b-41", name: "Campus Security & First Aid Personnel", estimated: 800, actual: 750, paid: true, notes: "6 officers on duty across 12 hrs" },
            { id: "b-42", name: "Facilities Crew Overnight Cleanup & Waste Mgmt", estimated: 700, actual: 700, paid: false, notes: "Recycling and trash sorting" }
          ]
        },
        {
          id: "cat-catering",
          name: "Food Stalls, Meals & Caffeine Bar",
          icon: "utensils",
          percentage: 35,
          estimatedAmount: 5250,
          items: [
            { id: "b-43", name: "Lunch & Dinner Meal Vouchers (500 students)", estimated: 4000, actual: 4100, paid: false, notes: "Subsidized meal coupons redeemed at quad food trucks" },
            { id: "b-44", name: "Hackathon 24-hr Cold Brew & Energy Bar", estimated: 1250, actual: 1200, paid: true, notes: "Sponsored partly by local roaster" }
          ]
        },
        {
          id: "cat-entertainment",
          name: "Stage AV, Bands & Drone Light Show",
          icon: "music",
          percentage: 32,
          estimatedAmount: 4800,
          items: [
            { id: "b-45", name: "Concert Line-Array Sound & Lighting Rig", estimated: 2500, actual: 2500, paid: true, notes: "Full trussing, stage monitors, and sound engineer" },
            { id: "b-46", name: "Headline Guest Musical Artist Performance Fee", estimated: 1500, actual: 1500, paid: false, notes: "Contract signed, hotel provided" },
            { id: "b-47", name: "Synchronized Quad Drone Light Show (15 mins)", estimated: 800, actual: 800, paid: false, notes: "FAA cleared campus airspace" }
          ]
        },
        {
          id: "cat-decor",
          name: "Tents, Badges & Stage Branding",
          icon: "sparkles",
          percentage: 13,
          estimatedAmount: 1950,
          items: [
            { id: "b-48", name: "Stage Backdrop Banner & Quad Directional Signs", estimated: 750, actual: 720, paid: true, notes: "Eco-friendly recyclable cardboard & vinyl" },
            { id: "b-49", name: "Attendee NFC Smart Lanyards & Swag Bags", estimated: 1200, actual: 1150, paid: true, notes: "500 customized lanyard kits" }
          ]
        },
        {
          id: "cat-misc",
          name: "Prizes, Trophies & Emergency Fund",
          icon: "gift",
          percentage: 10,
          estimatedAmount: 1500,
          items: [
            { id: "b-50", name: "Hackathon Cash Prizes & Laser-Cut Trophies", estimated: 1000, actual: 1000, paid: true, notes: "Disbursed to top 3 winning projects" },
            { id: "b-51", name: "Event Contingency & Weather Rain Tents", estimated: 500, actual: 200, paid: false, notes: "Reserve funds" }
          ]
        }
      ]
    },
    checklist: [
      { id: "chk-41", title: "Submit quad sound amplification and event permit to Dean", milestone: "2-3 Months Out", deadline: "2026-09-10", priority: "high", completed: true, notes: "Dean of Student Affairs approved" },
      { id: "chk-42", title: "Confirm industry keynote speaker travel itinerary", milestone: "1 Month Out", deadline: "2026-10-15", priority: "high", completed: true, notes: "Flight and guest hotel confirmed" },
      { id: "chk-43", title: "Finalize 24-hr Hackathon problem statements and judges", milestone: "1 Month Out", deadline: "2026-10-25", priority: "high", completed: true, notes: "4 corporate sponsors providing mentors" },
      { id: "chk-44", title: "Inspect quad electrical load and test backup generators", milestone: "1 Week Out", deadline: "2026-11-15", priority: "high", completed: false, notes: "Facilities electrician walkthrough at 2 PM" },
      { id: "chk-45", title: "Stage soundcheck and band rehearsal schedule", milestone: "Event Day", deadline: "2026-11-20", priority: "medium", completed: false, notes: "Soundcheck runs 11 AM - 1 PM" }
    ],
    schedule: [
      { time: "08:00 AM", title: "Registration & Swag Distribution", description: "Check-in at Quad welcome tent. NFC wristbands assigned.", category: "Registration", icon: "users" },
      { time: "09:30 AM", title: "Inaugural Ceremony & AI Keynote", description: "Welcome address by University President and Keynote Speaker.", category: "Keynote", icon: "sparkles" },
      { time: "11:30 AM", title: "Hackathon Kickoff & Innovation Expo Open", description: "50 student project booths open to public voting.", category: "Expo", icon: "star" },
      { time: "01:00 PM", title: "Quad Food Truck Plaza Opens", description: "Live acoustic performances while attendees enjoy lunch.", category: "Lunch", icon: "utensils" },
      { time: "03:30 PM", title: "Inter-Collegiate Esports Tournament", description: "Auditorium main screen broadcast with live student casting.", category: "Gaming", icon: "music" },
      { time: "06:00 PM", title: "Hackathon Finalist Pitches & Awards", description: "Top 5 teams present to corporate venture judges.", category: "Awards", icon: "gift" },
      { time: "07:30 PM", title: "Spectacular Drone Light Show", description: "100 drones illuminate the campus quad in 3D animated formations.", category: "Show", icon: "sparkles" },
      { time: "08:15 PM", title: "Headline Band Concert & Cultural Gala", description: "High-octane musical performance and festival finale.", category: "Concert", icon: "music" },
      { time: "11:00 PM", title: "Closing Remarks & Quad Cleanup", description: "Eco-volunteers initiate campus restoration.", category: "Wrap-up", icon: "clock" }
    ],
    vendors: [
      {
        id: "v-41",
        category: "Audio/Visual",
        name: "Campus Stage & Rigging Pro",
        contactPerson: "Dave Kowalski",
        phone: "+1 (555) 019-4421",
        email: "dave@stageworkspro.com",
        status: "Booked",
        quoteAmount: 2500,
        notes: "Sound engineer on site for full 14 hours."
      },
      {
        id: "v-42",
        category: "Entertainment",
        name: "SkyLume Drone Shows LLC",
        contactPerson: "Maya Patel",
        phone: "+1 (555) 019-8812",
        email: "flight@skylumedrones.com",
        status: "Booked",
        quoteAmount: 800,
        notes: "Flight trajectory cleared with local municipal aviation."
      },
      {
        id: "v-43",
        category: "Catering",
        name: "Metro Food Truck Syndicate (4 trucks)",
        contactPerson: "Leo Rossi",
        phone: "+1 (555) 019-3390",
        email: "trucks@metrosyndicate.com",
        status: "Booked",
        quoteAmount: 4100,
        notes: "Serving Mexican, Asian, Italian, and Vegan comfort."
      }
    ]
  }
];

// Advisory Vendor Knowledge Base & Inspection Checklists
const VENDOR_ADVISORY_GUIDE = [
  {
    category: "Venue & Facilities",
    icon: "building",
    importance: "Critical - Sets baseline capacity, curfew, acoustics & logistics",
    recommendedPct: "25% - 30%",
    keyQuestions: [
      "What is the exact curfew for amplified music and vendor load-out?",
      "Are we required to use your preferred caterers or is there an outside catering buyout fee?",
      "What backup indoor spaces are guaranteed in case of rain/inclement weather?",
      "Is an event liability insurance policy required, and what minimum coverage is needed?",
      "How many dedicated electrical circuits (amps) are available for DJ/lighting setups?"
    ],
    redFlags: [
      "No written policy on weather contingency or sound limitations",
      "Hidden service charges or unmentioned cleaning/security overtime fees"
    ]
  },
  {
    category: "Catering & Bar Service",
    icon: "utensils",
    importance: "High - Directly impacts guest satisfaction and per-guest budget",
    recommendedPct: "30% - 35%",
    keyQuestions: [
      "Does your per-guest quote include service staff, linens, silverware, and cleanup?",
      "How do you handle dietary requirements (vegan, halal, kosher, severe nut allergies)?",
      "Do you provide a complimentary pre-event tasting session for the host?",
      "What is your bartender-to-guest ratio (industry standard is 1 per 50-75 guests)?",
      "Can we supply our own alcohol, and if so, what is your corkage fee per bottle?"
    ],
    redFlags: [
      "Refusal to provide a sample contract breakdown with staffing hours",
      "No food safety certifications or lack of commercial kitchen licensing"
    ]
  },
  {
    category: "Decor, Florals & Ambience",
    icon: "sparkles",
    importance: "Medium to High - Establishes visual aesthetic & photo moments",
    recommendedPct: "12% - 18%",
    keyQuestions: [
      "Do you handle setup, teardown, and end-of-night floral donation/disposal?",
      "Are floral mockups or 3D visual renders included before final commitment?",
      "What seasonal blooms can you recommend to maximize volume without exceeding budget?",
      "Can arrangements from the ceremony be repurposed for reception tables or photo backdrops?"
    ],
    redFlags: [
      "No contingency plan for out-of-stock seasonal flowers",
      "Lack of real portfolio photos or reliance exclusively on stock imagery"
    ]
  },
  {
    category: "Photography & Videography",
    icon: "camera",
    importance: "High - The permanent heirloom memories of your event",
    recommendedPct: "10% - 15%",
    keyQuestions: [
      "Will the principal photographer whose portfolio I viewed personally shoot the event?",
      "What is your timeline for delivering a teaser gallery (typically 48-72 hrs) and full gallery?",
      "Do you carry backup camera bodies, dual memory card slots, and offsite cloud backups?",
      "Do we receive full high-resolution digital print release rights?",
      "What is your backup protocol if the lead shooter falls ill on event day?"
    ],
    redFlags: [
      "No replacement photographer guarantee in the contract",
      "Shooting on single-slot cameras without instant redundancy"
    ]
  },
  {
    category: "Music, DJ & Entertainment",
    icon: "music",
    importance: "High - Drives the tempo, emotional peaks, and energy of the crowd",
    recommendedPct: "8% - 12%",
    keyQuestions: [
      "Do you act as Master of Ceremonies (MC) for announcements and schedule cues?",
      "Can we submit a curated 'Must-Play' and 'Do-Not-Play' song list?",
      "Is backup audio gear (wireless mics, mixer, speaker) brought on-site?",
      "Are wireless lapel mics included for outdoor ceremonies or keynote speakers?"
    ],
    redFlags: [
      "Unwillingness to accommodate specific cultural music requests",
      "No sound level monitoring or lack of commercial music licensing"
    ]
  }
];

// Quick AI Assistant Prompt Chips
const QUICK_PROMPTS = [
  { label: "💡 Budget Optimization", prompt: "What are 5 clever ways to reduce costs for this event without sacrificing guest experience?" },
  { label: "📸 Photo Booth Ideas", prompt: "Suggest 3 unique, Instagram-worthy photo booth or interactive installation concepts for this theme." },
  { label: "💌 RSVP Message Draft", prompt: "Draft a polite and engaging reminder message to send to guests who haven't RSVP'd yet." },
  { label: "🍸 Signature Drinks", prompt: "Create 2 signature cocktail and 1 mocktail concepts with recipes and playful names tailored to this theme." },
  { label: "🌧️ Weather Contingency", prompt: "How should we structure our Plan B weather contingency timeline and vendor communication?" },
  { label: "⏱️ Schedule Review", prompt: "Analyze our event-day schedule. Are there any bottlenecks or rushed transitions we should adjust?" }
];
