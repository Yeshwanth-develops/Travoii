# Project Architecture — Travoii

Travoii is a full-stack, real-time collaborative travel planner built using Next.js, Socket.IO, Mongoose, and AI. Below is the technical architecture, project layout, and data flow design.

---

## 🏗️ Technology Stack

```mermaid
graph TD
    subgraph Frontend [Client / User Interface]
        React[React 19 & Next.js App Router]
        Tailwind[Tailwind CSS]
        SocketIOClient[Socket.IO Client]
    end

    subgraph Backend [Server Layer]
        CustomServer[Node.js Custom Server server.js]
        NextJSHandler[Next.js Request Handler]
        SocketIOServer[Socket.IO Server]
        NextAuth[NextAuth.js]
    end

    subgraph Database & External [Data & Services]
        MongoDB[MongoDB Atlas]
        OpenAI[OpenAI API gpt-4o-mini]
        OSM[OpenStreetMap Nominatim]
    end

    React -->|HTTP Requests| NextJSHandler
    React -->|Real-time Events| SocketIOServer
    NextJSHandler -->|Mongoose| MongoDB
    NextJSHandler -->|Fetch| OpenAI
    NextJSHandler -->|Fetch| OSM
```

---

## 📂 Project Structure Map

Here is how the directories and core files align functionally:

```
travoii/
 ├── app/                             # Next.js App Router
 │    ├── api/                        # Backend REST Endpoints
 │    │    ├── auth/                  # NextAuth & Sign-up routes
 │    │    ├── location/              # Nominatim location search API
 │    │    └── trip/                  # Trip CRUD & Itinerary Generation APIs
 │    ├── create-trip/                # Form page to create a trip
 │    └── dashboard/                  # Core user interface & trips grid
 ├── components/                      # Reusable UI widgets
 │    ├── InviteBox.tsx               # Collaboration invitation inputs
 │    ├── ItineraryBox.tsx            # Renders day-by-day itineraries
 │    └── MembersList.tsx             # Shows members belonging to the trip
 ├── lib/                             # Core utilities and singletons
 │    ├── auth.ts                     # Authentication helper & NextAuth config
 │    ├── db.ts                       # Cached Mongoose database connection client
 │    ├── socketClient.ts             # Socket.IO client initialization
 │    └── useSocket.ts                # React hooks wrapping real-time events
 ├── models/                          # Mongoose ODM schemas & database models
 │    ├── User.ts                     # User sign-up profiles
 │    ├── Trip.ts                     # Trip details (budget, destination, stops)
 │    ├── Member.ts                   # Trip membership mappings & roles
 │    └── Itinerary.ts                # Day-by-day plan structure
 └── server.js                        # Main Entry Point (integrates HTTP server & Socket.IO)
```

---

## 🔄 Core Data Flows

### 1. Trip Creation & Location Search
* **Search**: The client queries `/api/location/search?q=...` as they type in the location input box. The server forwards this query to the public **OpenStreetMap Nominatim API**, formatting the returned results as standard location options.
* **Creation**: Submitting the form triggers a `POST` request to `/api/trip/create`. The route stores the trip parameters (title, budget, locations, stops) in MongoDB and maps the creator as the first `admin` member of the trip.

### 2. AI Itinerary Generation
```mermaid
sequenceDiagram
    participant User as Client UI
    participant Server as Next.js API Route
    participant DB as MongoDB (Itineraries)
    participant AI as OpenAI (GPT-4o-mini)

    User->>Server: Click "Generate Itinerary" (POST /api/trip/generate-itinerary)
    Server->>DB: Check if itinerary already exists for Trip ID
    alt Exists
        DB-->>Server: Return existing itinerary
        Server-->>User: Render existing day-wise plan
    else New Itinerary
        Server->>AI: Send prompt (budget, destination, stops)
        AI-->>Server: Return structured JSON (Day-wise activities & costs)
        Server->>DB: Save new Itinerary document
        Server-->>User: Instantly remount & render day-wise plan
    end
```

### 3. Real-Time Socket Collaboration
When users are viewing the dashboard:
* **Connection**: The client initializes a WebSockets connection utilizing the helper [useSocket.ts](file:///e:/Travoii/lib/useSocket.ts) pointing to `/api/socket`.
* **Rooms**: The server places users into distinct rooms categorized by `tripId`.
* **Syncing**: When a user invites another member via [InviteBox.tsx](file:///e:/Travoii/components/InviteBox.tsx), it fires a server action which emits a Socket.IO event. Other clients joined in the same `tripId` room instantly receive the event and refresh their member list automatically.

---

## 🗄️ Database Schema Design

* **User**: Stores email, name, and hashed passwords.
* **Trip**: Holds trip details including arrays of `stops` and a reference to the `createdBy` user.
* **Member**: Bridges users and trips. Assigns roles (`admin`, `member`) and tracks members via `userEmail` and `tripId`.
* **Itinerary**: Maps to a specific `tripId`. Houses nested arrays representing `days`, which contain `activities` and the corresponding `estimatedCost`.
