# Attendance Management System

A full-stack, role-based Attendance Management System built with **React.js**, **Node.js**, **Express**, and **MongoDB Atlas**.

---

##  Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Step-by-Step Setup](#step-by-step-setup)
  - [1. Clone / Download the Project](#1-clone--download-the-project)
  - [2. MongoDB Atlas Setup](#2-mongodb-atlas-setup)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Seed Admin Account](#4-seed-admin-account)
  - [5. Frontend Setup](#5-frontend-setup)
  - [6. Run the Project](#6-run-the-project)
- [Default Login Credentials](#default-login-credentials)
- [How to Use the System](#how-to-use-the-system)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

##  Project Overview

This is a production-ready attendance management platform where:

- **Admin** creates and manages all user accounts, students, teachers, subjects, fees, timetables, and exam schedules
- **Teachers** log in with admin-created credentials, view their assigned subjects, and mark/edit student attendance
- **Students** log in with admin-created credentials and view their attendance, fees, timetable, and exam dates

>  There is **no public registration**. All accounts are created by the Admin only.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js (Vite) | UI Framework |
| Tailwind CSS | Styling |
| React Router DOM | Page Routing |
| Axios | API Calls |
| Framer Motion | Animations |
| Recharts | Attendance Charts |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB Atlas | Cloud Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication Tokens |
| bcryptjs | Password Hashing |
| Multer | Profile Image Upload |

---

##  Features

###  Admin
- Create login accounts for teachers and students
- Upload profile pictures for any user
- Manage Students (Add, Edit, Delete)
- Manage Teachers (Add, Edit, Delete, Assign Subjects)
- Manage Subjects (Add, Edit, Delete, Assign Teacher)
- View & Filter all Attendance Records
- Assign Fees to each student (amount, due date, paid/pending)
- Assign Timetable for students and teachers
- Assign Exam Schedule for students

###  Teacher
- Login using admin-created credentials
- View assigned subjects only
- Mark attendance (Present/Absent toggle per student)
- View attendance history
- View personal timetable
- View profile (read-only)

###  Student
- Login using admin-created credentials
- View attendance with charts and subject-wise breakdown
- View fee payment status
- View personal timetable
- View exam schedule
- View profile (read-only)

---

##  Prerequisites

Make sure you have the following installed on your computer:

| Software | Version | Download |
|----------|---------|----------|
| Node.js | v18 or higher | https://nodejs.org |
| npm | v8 or higher | (comes with Node.js) |
| Git | Any | https://git-scm.com |
| VS Code | Any | https://code.visualstudio.com |

---

##  Project Structure

```
Attendance System Management/
├── server/                  ← Backend (Node.js + Express)
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Subject.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── teacherRoutes.js
│   │   ├── subjectRoutes.js
│   │   └── attendanceRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── uploads/             ← Profile images stored here
│   ├── .env                 ← Environment variables
│   ├── index.js             ← Entry point
│   ├── seed.js              ← Admin account seeder
│   └── package.json
│
└── client/                  ← Frontend (React + Vite)
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── admin/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Users.jsx
    │   │   │   ├── Students.jsx
    │   │   │   ├── Teachers.jsx
    │   │   │   ├── Subjects.jsx
    │   │   │   ├── Attendance.jsx
    │   │   │   ├── Fees.jsx
    │   │   │   ├── Timetable.jsx
    │   │   │   ├── Exams.jsx
    │   │   │   └── Profile.jsx
    │   │   ├── teacher/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Attendance.jsx
    │   │   │   └── Profile.jsx
    │   │   └── student/
    │   │       ├── Dashboard.jsx
    │   │       ├── Attendance.jsx
    │   │       └── Profile.jsx
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js
    └── package.json
```

---

##  Step-by-Step Setup

### 1. Clone / Download the Project

If using Git:
```bash
git clone <your-repo-url>
cd "Attendance System Management"
```

Or simply open the project folder in VS Code.

---

### 2. MongoDB Atlas Setup

> MongoDB Atlas is the cloud database. Follow these steps carefully.

**Step 1** — Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.

**Step 2** — Create a new **Free Cluster** (M0 tier — Free forever).

**Step 3** — Create a database user:
- Go to **Database Access** → **Add New Database User**
- Set a username and password (save these!)
- Give role: **Read and Write to any database**

**Step 4** — Whitelist your IP:
- Go to **Network Access** → **Add IP Address**
- Click **Allow Access from Anywhere** → `0.0.0.0/0`
- Click **Confirm**

**Step 5** — Get your connection string:
- Go to **Clusters** → **Connect** → **Connect your application**
- Copy the connection string. It looks like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
- Replace `<username>` and `<password>` with your actual credentials
- Add your database name at the end:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/attendance
```

---

### 3. Backend Setup

Open a terminal and navigate to the `server` folder:

```bash
cd server
```

**Install dependencies:**
```bash
npm install
```

**Create the `.env` file** inside the `server/` folder:
```bash
# Create a new file called .env in the server/ folder
```

Add the following content to `.env`:
```env
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/attendance
JWT_SECRET=anysecretkey123
PORT=5000
```

>  Replace `MONGO_URI` with your actual MongoDB Atlas connection string.

**Verify `server/package.json`** has `"type": "module"`:
```json
{
  "name": "server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  }
}
```

---

### 4. Seed Admin Account

This creates the first Admin login. Run this **only once**:

```bash
cd server
node seed.js
```

You should see:
```
 MongoDB connected
Admin created: admin / admin123
```

> After this step, you can log in as Admin using `admin` / `admin123`.

---

### 5. Frontend Setup

Open a **new terminal** and navigate to the `client` folder:

```bash
cd client
```

**Install dependencies:**
```bash
npm install
```

**Verify `vite.config.js`** has the proxy configured:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

---

### 6. Run the Project

You need **two terminals open at the same time**.

**Terminal 1 — Start Backend:**
```bash
cd server
npm run dev
```

Expected output:
```
 MongoDB connected
 Server on port 5000
```

**Terminal 2 — Start Frontend:**
```bash
cd client
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

**Open your browser and go to:**
```
http://localhost:5173/login
```

---

##  Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Teacher | Created by Admin | Set by Admin |
| Student | Created by Admin | Set by Admin |

---

##  How to Use the System

### First Time Setup (Follow This Order)

```
Step 1 → Login as Admin (admin / admin123)
Step 2 → Go to "User Accounts" → Create a Teacher user account
Step 3 → Go to "Teachers" → Add teacher profile → Link to the user
Step 4 → Go to "Subjects" → Create subjects → Assign to teacher
Step 5 → Go to "User Accounts" → Create Student user accounts
Step 6 → Go to "Students" → Add student profiles → Link to users
Step 7 → Go to "Fees" → Assign fees to each student
Step 8 → Go to "Timetable" → Assign timetable to students and teachers
Step 9 → Go to "Exam Dates" → Assign exam schedule to students
Step 10 → Teacher logs in → Goes to Attendance → Marks attendance
Step 11 → Student logs in → Views dashboard, attendance, fees, timetable
```

### Admin Workflow
1. **Create User** (User Accounts page) → gives them a username + password
2. **Create Profile** (Students/Teachers page) → adds their full details
3. **Link the profile** to the user account created in step 1

### Teacher Workflow
1. Login with admin-created credentials
2. Go to **Attendance** → Select Subject → Select Date
3. Click each student's status button to toggle **Present ✓** / **Absent ✗**
4. Click **Save Attendance**

### Student Workflow
1. Login with admin-created credentials
2. **Dashboard** shows attendance %, fees status, timetable, and exam dates
3. **Attendance page** shows detailed records with subject-wise breakdown

---

##  API Endpoints

### Auth Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/create-user` | Admin | Create user account |
| GET | `/api/auth/users` | Admin | Get all users |
| PUT | `/api/auth/users/:id` | Admin | Edit user |
| DELETE | `/api/auth/users/:id` | Admin | Delete user |
| PUT | `/api/auth/profile-image` | Auth | Update own profile image |
| PUT | `/api/auth/users/:id/profile-image` | Admin | Update user's profile image |
| GET | `/api/auth/me` | Auth | Get current user |

### Student Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/students` | Admin/Teacher | Get all students |
| POST | `/api/students` | Admin | Add student |
| GET | `/api/students/me` | Student | Get own profile |
| PUT | `/api/students/:id` | Admin | Update student |
| DELETE | `/api/students/:id` | Admin | Delete student |
| PUT | `/api/students/:id/fees` | Admin | Update fees |
| PUT | `/api/students/:id/timetable` | Admin | Update timetable |
| PUT | `/api/students/:id/exams` | Admin | Update exam dates |

### Teacher Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/teachers` | Admin | Get all teachers |
| POST | `/api/teachers` | Admin | Add teacher |
| GET | `/api/teachers/me` | Teacher | Get own profile |
| PUT | `/api/teachers/:id` | Admin | Update teacher |
| DELETE | `/api/teachers/:id` | Admin | Delete teacher |
| PUT | `/api/teachers/:id/timetable` | Admin | Update timetable |

### Subject Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/subjects` | Auth | Get all subjects |
| POST | `/api/subjects` | Admin | Create subject |
| PUT | `/api/subjects/:id` | Admin | Update subject |
| DELETE | `/api/subjects/:id` | Admin | Delete subject |

### Attendance Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/attendance` | Auth | Get attendance (filtered by role) |
| POST | `/api/attendance` | Teacher | Mark attendance |
| PUT | `/api/attendance/:id` | Teacher/Admin | Edit attendance record |

---


##  Support

If you encounter issues:
1. Check the **backend terminal** for error messages
2. Check **browser DevTools → Console** for frontend errors
3. Check **browser DevTools → Network** tab for API response status codes

---

*Built with using React, Node.js, Express & MongoDB*
