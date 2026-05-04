# 🌍 Travoii — Real-Time Collaborative Travel Planner

Travoii is a full-stack web application that allows users to collaboratively plan trips, manage group members, and generate intelligent itineraries using AI.

Built with modern technologies, this project demonstrates real-time collaboration, authentication, and AI-powered features.

---

## 🚀 Features

### 🔐 Authentication

* Secure login & signup using NextAuth
* Session-based authentication
* Protected routes

### 🧳 Trip Management

* Create and manage trips
* Add start location, destination, budget
* Multi-stop travel planning

### 👥 Group Collaboration

* Invite members via email
* Role-based access (admin/member)
* View all members in a trip

### ⚡ Real-Time Updates

* Live updates using Socket.IO
* Instant member sync across multiple users
* No page refresh required

### 🤖 AI Itinerary Generator

* Generates personalized day-wise travel plans
* Based on destination and budget
* Uses OpenAI API

---

## 🏗️ Tech Stack

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS

### Backend

* Next.js API Routes (Full-stack)
* NextAuth (Authentication)
* Socket.IO (Real-time)

### Database

* MongoDB Atlas
* Mongoose ODM

### AI Integration

* OpenAI API

---

## 📂 Project Structure

```
app/
 ├── api/
 │    ├── auth/
 │    ├── trip/
 │
components/
 ├── InviteBox.tsx
 ├── MembersList.tsx
 ├── ItineraryBox.tsx

lib/
 ├── db.ts
 ├── socket.ts

models/
 ├── User.ts
 ├── Trip.ts
 ├── Member.ts
 ├── Itinerary.ts
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/travoii.git
cd travoii
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Configure environment variables

Create a `.env.local` file:

```
MONGODB_URI=your_mongodb_connection
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_key
```

### 4️⃣ Run the project

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🧪 How to Use

1. Sign up / Login
2. Create a trip
3. Invite members
4. Watch real-time updates
5. Generate itinerary

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

## 🔥 Key Highlights

* Real-time multi-user collaboration
* AI-powered itinerary generation
* Full-stack Next.js architecture
* Clean UI with Tailwind CSS

---

## 🚀 Future Improvements

* Google Maps integration
* Weather API integration
* AI-based personalized recommendations
* Expense splitting system

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork and improve.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Yeshwanth Sunkara**

* LinkedIn: https://www.linkedin.com/in/yeshwanthsunkara/

---
