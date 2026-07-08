# 🌍 Travoii — Real-Time Collaborative Travel Planner

Travoii is a full-stack web application that allows users to collaboratively plan trips, manage group members, and generate intelligent itineraries using AI.

Built with modern technologies, this project demonstrates real-time collaboration, authentication, and AI-powered features.

---

## 🚀 Features

### 🔐 Authentication & Profile Settings
* **Secure Auth**: Login & signup using NextAuth with JWT session strategy.
* **Account Settings**: Fully functional user profile management to update display names and change passwords securely (hashed via `bcrypt`). Client sessions update instantly.

### 🧳 Trip Management & Dynamic Routing
* **Detailed Routing**: Dedicated dynamic trip details view (`/trips/[id]`) highlighting stops, budget tracking, and itinerary timelines.
* **Location Autocomplete**: Live search dropdowns for start locations, destinations, and multi-stop plans, powered server-side by the **OpenStreetMap Nominatim API**.

### 👥 Group Collaboration & Real-Time Sync
* **Invite Members**: Invite co-travelers via email with role-based access.
* **Live Sockets**: Real-time collaborative updates using Socket.IO—watch co-travelers join, invite members, and update information instantly without refreshing the page.

### 🤖 AI Itinerary Generator (Gemini & OpenAI)
* **Intelligent Plans**: Generates customized day-wise itineraries matching your destination, budget, and stops.
* **Dual Provider Support**: Primary integration with **Google Gemini** (`gemini-2.5-flash`, `gemini-2.0-flash`) and fallback to **OpenAI** (`gpt-4o-mini`).
* **Caching & Regeneration**: Generates itineraries once, caches them in MongoDB to reduce costs, and offers a sleek **Regenerate Itinerary** action to rebuild plans on demand.
* **Resilient Failovers**: Multi-model retry chains with robust offline stubs ensure a seamless user experience during API outages or quota limits.

---

## 🏗️ Tech Stack

### Frontend
* **Next.js 16** (App Router)
* **React 19**
* **Tailwind CSS**
* **Lucide React** (Icons)

### Backend
* **Next.js API Routes** (Full-stack Serverless handlers)
* **Socket.IO** (Real-time WebSockets synchronization)
* **NextAuth.js** (Session management)

### Database & External Services
* **MongoDB Atlas** (Cloud Database)
* **Mongoose ODM** (Object Modeling)
* **Google Gemini API** & **OpenAI API** (Intelligent generation)
* **OpenStreetMap Nominatim API** (Geocoding / Autocomplete)

---

## 📂 Project Structure

```
app/
 ├── account/                 # User settings page
 ├── api/                     # Backend endpoints
 │    ├── auth/               # Login & Signup routes
 │    ├── location/           # Geocoding autocomplete suggestions
 │    ├── trip/               # Trip CRUD & Itinerary engines
 │    └── user/               # Profile updates endpoint
 ├── create-trip/             # New trip creation form
 ├── dashboard/               # Core hub listing user's trips
 └── trips/                   # Trips listing & dynamic details page
      ├── [id]/               # Single trip workspace
      └── page.tsx            # Grid of all user trips
components/                  # Shared components
 ├── InviteBox.tsx            # Travel member invitation form
 ├── ItineraryBox.tsx         # Displays day-by-day itineraries
 └── MembersList.tsx          # Real-time list of co-travelers
lib/                         # Core config & helpers
 ├── auth.ts                  # NextAuth credentials initialization
 ├── db.ts                    # Cached database client
 ├── socketClient.ts          # Socket.IO client setup
 └── useSocket.ts             # WebSockets hooks for react
models/                      # MongoDB schemas
 ├── User.ts                  # User accounts
 ├── Trip.ts                  # Travel itineraries
 ├── Member.ts                # Collaboration mapping & roles
 └── Itinerary.ts             # AI-generated itineraries
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Yeshwanth-develops/Travoii.git
cd travoii
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables
Create a `.env.local` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://username:password@shard1,shard2,shard3/?ssl=true&replicaSet=atlas-replica-shard-0&authSource=admin

# NextAuth config
NEXTAUTH_SECRET=your_nextauth_jwt_secret
NEXTAUTH_URL=http://localhost:3000

# AI Provider Keys
GEMINI_API_KEY=your_gemini_api_key_studio
OPENAI_API_KEY=your_openai_api_key
```
> [!NOTE]  
> If you have a local network DNS resolver issue (like JioFiber) causing `querySrv ECONNREFUSED` errors, use the standard `mongodb://` replica set connection string format instead of `mongodb+srv://`.

### 4️⃣ Run the project
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 How to Use
1. **Sign up & Log in**: Register a new user account.
2. **Create a Trip**: Set your title, budget, route, and use autocomplete to search for cities.
3. **Open Trip Workspace**: Click the trip title to navigate to the dynamic trip dashboard.
4. **Invite Co-travelers**: Enter their email. Once they log in, they will be synced into the workspace.
5. **Generate AI Plan**: Click to let Gemini/OpenAI build your itinerary. Click regenerate anytime to rewrite.

---

## 📸 Screenshots
<img width="939" height="470" alt="image" src="https://github.com/user-attachments/assets/5d8f1108-932a-4f07-bebf-274af0dada1e" />

<p></p>

<img width="519" height="487" alt="image" src="https://github.com/user-attachments/assets/ad8c17db-5c05-43db-af3c-9ebebd1022ba" />

<p></p>

<img width="468" height="412" alt="{FA20621A-7571-45B2-A2FC-7FE9DCFC167F}" src="https://github.com/user-attachments/assets/749bfe49-d2f4-4073-ac73-6fdacaf59435" />

<p></p>

<img width="447" height="445" alt="image" src="https://github.com/user-attachments/assets/f002dbca-49be-41c1-9077-176e37a069cf" />

---

## 🤝 Contributing
Contributions are welcome! Feel free to fork and improve.

---

## 📄 License
This project is licensed under the MIT License.

---

## 👨‍💻 Author
**Yeshwanth Sunkara**
* LinkedIn: [https://www.linkedin.com/in/yeshwanthsunkara/](https://www.linkedin.com/in/yeshwanthsunkara/)
