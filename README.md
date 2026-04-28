# TaskFlow 

A full-stack task management application built with Angular, Node.js, Express, and MongoDB.


---

##  Features

-  JWT Authentication — Register & Login
-  Kanban Boards with Drag & Drop
-  Task Management — Create, Edit, Delete, Assign
-  Team Management — Add & Remove Members
-  Comments on Tasks
-  Reports & Statistics
-  Real-time Notifications
- Smart Search
- Dark Mode
-  Mobile Responsive

---

##  Tech Stack

**Frontend:**
- Angular 17
- Angular CDK (Drag & Drop)
- SCSS
- TypeScript

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

---

##  Project Structure

```
taskflow/
├── task-management-api/        ← Backend (port 5000)
│   ├── src/
│   │   ├── config/             ← Database connection
│   │   ├── controllers/        ← Business logic
│   │   ├── middleware/         ← Auth, validation, errors
│   │   ├── models/             ← MongoDB schemas
│   │   └── routes/             ← API endpoints
│   ├── server.js
│   └── package.json
│
└── task-management-frontend/   ← Frontend (port 4200)
    └── src/
        └── app/
            ├── auth/           ← Login & Register
            ├── boards/         ← Boards management
            ├── kanban/         ← Kanban board
            ├── tasks/          ← Task modal
            ├── teams/          ← Team management
            ├── reports/        ← Statistics
            ├── settings/       ← User settings
            ├── core/           ← Guards, interceptors, services
            └── shared/         ← Navbar, Sidebar, Layout
```

---

##  Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) or [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Angular CLI](https://angular.io/cli)
- [Git](https://git-scm.com/)

---

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nourhane-1/taskflow.git
cd taskflow
```

### 2. Setup the Backend

```bash
cd task-management-api
npm install
```

Create a `.env` file in `task-management-api/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> **Note:** If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskflow`

Start the Backend:

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### 3. Setup the Frontend

```bash
cd ../task-management-frontend
npm install
```

Make sure `src/environments/environment.ts` contains:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

Start the Frontend:

```bash
ng serve
```

Open your browser at `http://localhost:4200`

---

##  API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/me` | Update profile | ✅ |

### Boards
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/boards` | Get all boards | ✅ |
| POST | `/api/boards` | Create board | ✅ |
| GET | `/api/boards/:id` | Get board | ✅ |
| PUT | `/api/boards/:id` | Update board | ✅ |
| DELETE | `/api/boards/:id` | Delete board | ✅ |
| GET | `/api/boards/:id/members` | Get members | ✅ |
| POST | `/api/boards/:id/members` | Add member | ✅ |
| DELETE | `/api/boards/:id/members/:userId` | Remove member | ✅ |

### Lists
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/boards/:boardId/lists` | Get lists | ✅ |
| POST | `/api/boards/:boardId/lists` | Create list | ✅ |
| PUT | `/api/lists/:id` | Update list | ✅ |
| DELETE | `/api/lists/:id` | Delete list | ✅ |

### Tasks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/lists/:listId/tasks` | Get tasks | ✅ |
| POST | `/api/lists/:listId/tasks` | Create task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| PATCH | `/api/tasks/:id/status` | Update status | ✅ |
| PATCH | `/api/tasks/:id/assign` | Assign task | ✅ |
| PATCH | `/api/tasks/:id/move` | Move task | ✅ |
| POST | `/api/tasks/:id/comments` | Add comment | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |

---


##  Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/taskflow` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `NODE_ENV` | Environment | `development` |

---

##  License

This project is licensed under the MIT License.

---

##  Author

**Nour** — [GitHub](https://github.com/nourhane-1)
