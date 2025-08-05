CampusBuddy x Avinya-AstraX

AI-Powered Student Life Platform for Delhi Campuses

    A unified platform to tackle food waste, student nutrition, lost & found inefficiencies, and scholarship complexity—built for Delhi’s students using AI, ML, and real-time web tech.

🏆 Achievements

    🥇 Winner - Avinya 2025, NSUT
    CampusBuddy x Avinya-AstraX was runnerup at Avinya 2025, NSUT’s premier tech innovation competition, standing out among thousands of participants for its practical impact and Delhi-centric AI-first design.

🔗 Related Project Links

    📁 ML Code Repository: Avinya-AstraX ML Code

    📊 Pitch Deck (PPT): View Here

    🔁 Workflow Demo: claude.site Artifact

📌 Problem Statement
❌ Major Challenges Faced by Delhi Students:

    Food Waste in Canteens – Manual prediction causes 30% surplus daily.

    Unhealthy Diet Choices – No personalized guidance → poor eating habits.

    Lost & Found Chaos – Paper-based process → 3+ days to recover items.

    Scholarship Confusion – 100+ scattered schemes → missed deadlines.

✅ Our Solution: CampusBuddy

An integrated Next.js web app combining:

    AI Canteen Manager

    Smart Lost & Found

    1-Click Scholarship Finder

Each module is powered by machine learning and focused on the Delhi ecosystem.
🔍 Features Overview
🍽️ AI Canteen Manager

    Demand Prediction: Predicts canteen demand using weather + student voting (reduces waste by 40%).

    Nutrition Scanner: QR-based food tracking via TensorFlow.js assigns points:

        🥗 +15 pts: High-fiber

        🍗 +10 pts: Protein-rich

        🚫 -5 pts: Junk food

    Avatars & Leaderboards: Earn titles like "Chaat Champion" and unlock weekly rewards (e.g., free momos).

    Live Dashboard: Tracks food savings and healthy swaps across campuses.

🔍 Smart Lost & Found

    Heatmaps: Delhi University campus maps highlight red zones for frequent item loss (e.g., metro gates).

    AI Image Recognition: Upload a photo → item auto-tagged using MobileNet (TensorFlow.js).

    WhatsApp Alerts: Twilio-powered notifications when an item is found—no app needed.

    Metro Card Tracking: Integrated with DMRC to check last-used stations for lost cards.

🎓 1-Click Scholarship Finder

    Auto-Matching: 100+ Delhi government schemes scraped and matched with student profiles using Hugging Face NLP.

    One-Click Apply: Forms pre-filled using a mock DigiLocker API.

    Bilingual Alerts: Deadline notifications sent in Hindi & English ("Kal 5 PM tak submit karo!").

🧠 Technology Stack
Layer	Tools Used
Frontend	Next.js, Tailwind CSS, Leaflet.js
Backend	Firebase (Auth, Postgresql), Twilio API
Machine Learning	TensorFlow.js, MobileNet, Hugging Face Transformers
Data Processing	Cheerio.js (for scraping), DigiLocker API (mock)
Messaging	WhatsApp integration via Twilio
Mapping	Leaflet.js for heatmaps and geofenced zones
📈 Business Model
🟢 Primary Revenue Streams
Stream	Description	Revenue Potential
Canteen Analytics	₹2K–5K/month for AI demand reports, nutrition data	₹25K/month (NSUT pilot)
Sponsored Listings	₹500/day for dishes, ₹300–1K/day for local ads	Local cafes, stationery shops
Scholarship Promotion	₹10K/month from coaching institutes + affiliate sales	5–10% commission
🟡 Secondary Revenue Streams

    CSR Campaigns: 5% platform fee on food redistribution with NGOs like Robin Hood Army.

    White-Label Licensing: ₹50K/year for customized platforms for universities.

    Gamified Sponsorships: ₹20K per challenge hosted by brands (e.g., Red Bull).

🗺️ Delhi Rollout Plan
Phase	Target	Revenue Goal
Phase 1	NSUT Pilot	₹1.5–2 Lakh/month
Phase 2	DU, DTU, IIT Delhi	₹15–20 Lakh/month
🧩 Implementation Steps
🔹 AI Canteen Module

    Train ML model using mock canteen sales + Delhi weather data.

    Implement QR-based food scanner using Next.js webcam API.

    Store user health points and dish analytics in Firebase.

🔹 Lost & Found Module

    Use Leaflet.js for campus maps with geofenced zones.

    Recognize items with MobileNet in TensorFlow.js.

    Send alerts using Twilio’s WhatsApp API.

🔹 Scholarship Module

    Scrape Delhi government portals with Cheerio.js.

    Match scholarships using HuggingFace Transformers.

    Enable one-click apply with mock DigiLocker integration.

💻 Installation & Setup

git clone https://github.com/yourusername/CampusBuddy.git
cd CampusBuddy
npm install
npm run dev

    ⚠️ You'll need:

        neon config keys

        Twilio API credentials

        ML models (refer ML Repo)

📸 Demo & UI Preview

    🔁 Workflow Demo

    📊 Pitch Deck (PDF)

    🧠 ML Code


🤝 Contributing

We welcome PRs, issues, and feature suggestions.

    Fork the repo

    Create a new branch (git checkout -b feature-name)

    Commit your changes (git commit -am 'Add feature')

    Push to GitHub (git push origin feature-name)

    Create a Pull Request

📄 License

This project is licensed under the MIT License – feel free to use and modify!