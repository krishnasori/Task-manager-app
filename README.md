# System_Tasks (Personal Task Manager)

**Brief:** Exercise 1 - Personal Task Manager  
A robust, full-stack task management interface designed with a dark, atmospheric terminal aesthetic. It allows users to initialize, track, search, filter, and purge tasks with real-time UI updates and backend data persistence.

**Live Demo:** [Link to be added after deployment]

---

##  Tech Stack

* **Frontend:** React (Vite) - Chosen for its lightning-fast HMR and minimal overhead.
* **Backend:** Node.js with Express - Provides a lightweight, unopinionated server environment.
* **Storage:** Native Node `fs` (JSON File) - Selected to demonstrate data persistence across server restarts without the overhead of spinning up a full relational database for a simple CRUD application.
* **Styling:** Custom CSS - Zero external libraries. Focuses on CSS animations, interactive pseudo-classes, and responsive flexbox layouts.

---

##  Key Features & Bonus Requirements Completed

* **CRUD Operations:** Full Create, Read, Update, and Delete functionality.
* **Data Persistence (Bonus):** Tasks survive server restarts by writing to a local `tasks.json` file.
* **Real-time Search (Bonus):** Instantly filter the task list by title without server round-trips.
* **Dynamic Metrics:** Tracks and filters Active vs. Completed tasks.
* **Overdue Highlighting:** Automatically detects and visually flags overdue tasks based on current system time.

---

##  How to Run Locally

Prerequisites: Ensure you have Node.js installed.

**1. Clone the repository**
\`\`\`bash
git clone <your-github-repo-url>
cd task-manager-app
\`\`\`

**2. Start the Backend Server**
Open a terminal and navigate to the server directory:
\`\`\`bash
cd server
npm install
npm start
\`\`\`
*(The backend will run on http://localhost:3000)*

**3. Start the Frontend Application**
Open a second terminal and navigate to the client directory:
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`
*(The frontend will run on http://localhost:5173)*

---

##  API Documentation

The backend acts as a RESTful API proxy, storing data in `server/tasks.json`.

| Method | Endpoint | Description | Request Body | Response Shape |
|--------|----------|-------------|--------------|----------------|
| `GET` | `/tasks` | Fetches all tasks, sorted newest first. | None | `Array<Task>` |
| `POST` | `/tasks` | Creates a new task. | `{ title: string, dueDate: string }` | `Task` object |
| `PUT` | `/tasks/:id` | Updates a task (e.g., toggles completion). | `{ completed: boolean }` | `Task` object |
| `DELETE`| `/tasks/:id` | Permanently removes a task. | None | `{ message: string }` |

---

##  Project Structure
\`\`\`text
task-manager-app/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx         # Main UI, logic, dynamic filtering, and API calls
│   │   ├── App.css         # Neon terminal styling & animations
│   │   └── main.jsx        # React DOM rendering
├── server/                 # Node.js + Express Backend
│   ├── index.js            # API routing and File System logic
│   ├── tasks.json          # Persistent database file
│   └── package.json        # Server dependencies
└── README.md               # You are here
\`\`\`

---

##  Next Steps
Given more time, here is how I would scale this application:
1.  **Database Migration:** Swap the `fs` JSON logic for a PostgreSQL database via Prisma ORM for better scaling and concurrent read/writes.
2.  **Authentication:** Implement JWT (JSON Web Tokens) to allow multiple users to maintain private, isolated task lists.
3.  **Drag-and-Drop:** Integrate a library like `@dnd-kit/core` to allow manual reordering of the task list items.