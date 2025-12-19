<div align="center">

# 🚀 TaskMasterX

### Collaborative Task Management Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-success?style=for-the-badge&logo=vercel&v=1)](https://collaborative-task-manager-tau.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-blue?style=for-the-badge&v=1)](https://collaborative-task-manager-backend-q30s.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub%20Repository-black?style=for-the-badge&logo=github&v=1)](https://github.com/JadhaoR181/collaborative-task-manager)

</div>


*A production-ready, real-time collaborative task manager built for modern teams*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 📸 Preview

<table>
  <tr>
    <td width="68%" valign="top">
      <img src="images/dashboard_page.png" alt="TaskMasterX Dashboard" style="border-radius: 8px;" />
    </td>
    <td width="32%" valign="top">
      <img src="images/mobile_preview.png" alt="Mobile View" style="border-radius: 8px;" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <sub><i>🖥️ Full-featured desktop experience with real-time updates</i></sub>
    </td>
    <td align="center">
      <sub><i>📱 Fully responsive mobile interface</i></sub>
    </td>
  </tr>
</table>

---

## ✨ Features

### 🔐 **Secure Authentication**
- JWT-based authentication with HttpOnly cookies
- Bcrypt password hashing
- Cross-origin request support (CORS-enabled)
- Protected API routes with middleware

### 📋 **Advanced Task Management**
- **Full CRUD Operations** with role-based permissions
- **Smart Assignment System** - Assign tasks to team members
- **Priority Levels** - HIGH, MEDIUM, LOW
- **Status Tracking** - To Do, In Progress, Completed
- **Due Date Management** with automatic overdue detection

### ⚡ **Real-Time Collaboration**
- **Socket.io Integration** for instant updates
- **Live Notifications** - Task assignments, completions, and updates
- **User-specific Rooms** for targeted real-time events
- **Animated Notification Bell** with unread badge counter

### 📊 **Intelligent Dashboard**
- **4 Quick-View Cards**: All Tasks, Assigned to Me, Created by Me, Overdue
- **Status Distribution**: To Do, In Progress, Completed counters
- **Advanced Filtering** by status and priority
- **Smart Sorting** by due date
- **Responsive Grid Layout** optimized for all devices

### 🔔 **Notification System**
- **Persistent Notifications** stored in database
- **Real-time Delivery** via WebSockets
- **Mark as Read** functionality
- **Overdue Alerts** with duplicate prevention
- **Visual Feedback** with toast notifications

### 👤 **User Profile Management**
- View and update profile information
- Secure profile endpoint
- Seamless navigation flow

### 🎨 **Modern UI/UX**
- **Tailwind CSS** for sleek, responsive design
- **Framer Motion** for smooth animations
- **Color-coded Priority** badges (RED - High, ORANGE - Medium, GRAY - Low)
- **Status-based Theming** with visual indicators
- **Mobile-First** responsive design

---

## 🏗️ Architecture
```mermaid
graph TB
    A[Client Browser] -->|HTTPS| B[Frontend - Vercel]
    B -->|REST API| C[Backend - Render]
    B -->|WebSocket| C
    C -->|Prisma ORM| D[PostgreSQL - Render]
    C -->|Cron Jobs| E[Overdue Checker]
    E -->|Notifications| D
```

### **Layered Backend Architecture**
```
backend/
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Data access layer
├── dtos/           # Data transfer objects (Zod validation)
├── sockets/        # Real-time event handlers
├── middlewares/    # Auth & error handling
└── tests/          # Unit tests (Jest)
```

## 🎨 Design Decisions & Architecture Rationale

This section explains the key technical decisions made during development and the rationale behind them.

---

### **Why PostgreSQL?**
PostgreSQL was selected as the primary database due to the following reasons:

- **Relational Data Model**: Tasks have clear relationships with users (creator, assignee, notifications), making a relational database ideal.
- **ACID Compliance**: Ensures strong data consistency for critical operations like task creation, assignment, and status updates.
- **Advanced Querying**: Supports complex filtering, sorting, and joins efficiently (e.g., dashboard statistics).
- **Scalability**: Handles growing datasets better than file-based or lightweight databases.
- **Prisma ORM Support**: Excellent TypeScript integration with type-safe queries and schema migrations.
- **Future Flexibility**: PostgreSQL’s JSONB support allows schema evolution without major refactoring.

---

### **JWT Authentication Strategy**
Authentication is implemented using **JWT tokens stored in HttpOnly cookies** for enhanced security.

- **HttpOnly Cookies**: Prevents access via JavaScript, mitigating XSS attacks.
- **Secure Flag (Production)**: Cookies are transmitted only over HTTPS.
- **SameSite=None**: Required for cross-origin authentication between Vercel (frontend) and Render (backend).
- **Token Expiry**: JWT tokens expire after a defined duration, forcing re-authentication.
- **Middleware Protection**: All protected routes are guarded using an authentication middleware that verifies JWT validity.

This approach balances **security, usability, and cross-platform compatibility**.

---

### **Service Layer Architecture**
The backend follows a **clean 3-layer architecture** to ensure separation of concerns:

#### **1️⃣ Controllers**
- Handle HTTP requests and responses
- Validate incoming data using DTOs
- Call appropriate service methods
- Return standardized API responses

#### **2️⃣ Services**
- Contain core business logic
- Enforce permissions and validation rules
- Coordinate between repositories
- Emit Socket.io events for real-time updates
- Handle edge cases and error scenarios

#### **3️⃣ Repositories**
- Handle direct database access using Prisma
- Perform pure CRUD operations
- No business logic included

#### **Request Flow**
Client Request → Controller → Service → Repository → Database
↓
Socket.io Events


This architecture improves:
- ✅ Maintainability
- ✅ Testability
- ✅ Scalability
- ✅ Code readability

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%" valign="top">

### **Frontend**
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)

- **React Query (TanStack)** - Server state management
- **Socket.io Client** - Real-time communication
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

</td>
<td width="50%" valign="top">

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.1-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.11-3178C6?logo=postgreSQL&logoColor=white)

- **PostgreSQL** - Primary database
- **Socket.io** - WebSocket server
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Zod** - Schema validation
- **Node-cron** - Scheduled tasks

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Git

### 1️⃣ Clone Repository
```bash
git clone https://github.com/JadhaoR181/collaborative-task-manager.git
cd collaborative-task-manager
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

**Configure `.env`:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmaster"
JWT_SECRET="your-super-secret-key-change-this"
CLIENT_URL="http://localhost:5173"
PORT=5000
```

**Initialize Database:**
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Backend runs on `http://localhost:5000` 🎉

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env
```

**Configure `.env`:**
```env
VITE_API_URL=http://localhost:5000
```

**Start Development Server:**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173` 🎨

---

## 🧪 Testing Strategy

The backend includes unit tests to validate core business logic and ensure system reliability.

---

### **Testing Tools**
- **Jest** – Test runner and assertion library
- **Supertest** – API endpoint testing
- **Mocked Prisma Client** – Isolated database logic testing

---

### **Test Coverage Areas**

#### **1️⃣ Task Creation & Validation**
- Valid task creation with correct input
- Required field validation (title, due date)
- Priority and status defaults
- Creator auto-assignment logic

---

#### **2️⃣ Permission Enforcement**
- Only task creators can delete tasks
- Only assignees can update task status
- Unauthorized actions return proper HTTP errors (403 / 401)

---

#### **3️⃣ Overdue Notification Logic**
- Detects tasks past due date
- Skips completed tasks
- Prevents duplicate overdue notifications
- Persists notifications in database

---

#### **4️⃣ Task Deletion Authorization (Service-Level Test)**
- Verifies that **non-creators cannot delete tasks**
- Confirms correct error handling when deletion is attempted by unauthorized users
- Ensures business rules are enforced at the **service layer**, not just routes

**Example Test:**
```ts
deleteTask(taskId, userId)
// Throws error if userId !== creatorId

```

### **Running Tests**
```bash
cd backend
npm test
npm test -- --coverage

---
```

## ⚖️ Trade-offs & Assumptions

Due to time constraints and scope limitations, certain trade-offs and assumptions were made during development.

---

### **Trade-offs**

#### **1. Overdue Task Detection**
- **Decision**: Overdue tasks are checked using an hourly cron job.
- **Trade-off**: Notifications may be delayed by up to 59 minutes.
- **Reason**: Reduces server load and complexity while remaining acceptable for task management use cases.

---

#### **2. Single Assignee per Task**
- **Decision**: Each task can have only one assignee.
- **Trade-off**: Team-based tasks require multiple task entries.
- **Reason**: Simplifies permission handling and notification logic.

---

#### **3. No Task Comments or Activity Logs**
- **Decision**: Focused on core task and notification functionality.
- **Trade-off**: Users cannot discuss tasks within the platform.
- **Reason**: Prioritized required assignment features under limited time.

---

#### **4. Role-Based Permissions Simplification**
- **Decision**: Only creators can delete tasks; only assignees can update status.
- **Trade-off**: Creators cannot mark tasks as completed.
- **Reason**: Enforces accountability and avoids conflicting updates.

---

### **Assumptions**

- All users are authenticated and trusted team members.
- Open user registration without admin approval.
- All dates are stored in UTC; client handles timezone conversion.
- Users will access the app using modern browsers with WebSocket support.
- Notifications are consumed in-app (no email or SMS alerts).

These assumptions helped reduce system complexity while meeting assignment requirements.

---

## 📋 Task Permissions Matrix

| Action | Creator | Assignee |
|--------|---------|----------|
| **Create Task** | ✅ | ✅ |
| **View Task** | ✅ | ✅ |
| **Update Details** | ✅ | ❌ |
| **Update Status** | ❌ | ✅ |
| **Delete Task** | ✅ | ❌ |
| **Reassign** | ✅ | ❌ |

---

## 🌐 Deployment

### Production URLs
| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | Vercel | [collaborative-task-manager-tau.vercel.app](https://collaborative-task-manager-tau.vercel.app) |
| **Backend** | Render | [https://collaborative-task-manager-backend-q30s.onrender.com](https://collaborative-task-manager-backend-q30s.onrender.com) |
| **Database** | Render | PostgreSQL (Managed) |

### Environment Variables (Production)
**Backend:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secure random string
- `CLIENT_URL` - Frontend domain
- `NODE_ENV=production`

**Frontend:**
- `VITE_API_URL` - Backend API URL

---

## 📊 Project Structure
```
collaborative-task-manager/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API & Socket services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Helper functions
│   └── public/              # Static assets
│
└── backend/
    ├── src/
    │   ├── controllers/     # Route handlers
    │   ├── services/        # Business logic
    │   ├── repositories/    # Database operations
    │   ├── dtos/           # Validation schemas
    │   ├── middlewares/    # Auth & error handling
    │   ├── sockets/        # WebSocket handlers
    │   └── tests/          # Jest test suites
    └── prisma/
        └── schema.prisma   # Database schema
```

---

## 🎯 Key Features Implementation

### Real-Time Notifications Flow
```typescript
// Backend emits event
io.to(`user-${assigneeId}`).emit('notification', {
  type: 'TASK_ASSIGNED',
  message: 'You have been assigned a new task',
  taskId: task.id
});

// Frontend listens
socket.on('notification', (data) => {
  queryClient.invalidateQueries(['notifications']);
  toast.success(data.message);
});
```

### Automatic Overdue Detection
- **Cron Job** runs every hour
- Checks tasks with `dueDate < now` and status ≠ "COMPLETED"
- Creates notification only if not previously notified
- Updates `overdueNotified` flag to prevent spam

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login        - Login user
POST   /api/auth/logout       - Logout user
GET    /api/users/me      - Get current user
```

### Task Endpoints
```
GET    /api/tasks             - Get all tasks (with filters)
POST   /api/tasks             - Create new task
GET    /api/tasks/:id         - Get task by ID
PATCH  /api/tasks/:id         - Update task
DELETE /api/tasks/:id         - Delete task
PATCH  /api/tasks/:id/status  - Update task status
```

### Notification Endpoints
```
GET    /api/notifications     - Get user notifications
PATCH  /api/notifications/:id - Mark as read
```

---

## 🏆 Project Highlights

✅ **Production-Ready** - Deployed and fully functional  
✅ **Type-Safe** - Full TypeScript implementation  
✅ **Real-Time** - Instant updates via WebSockets  
✅ **Secure** - JWT authentication with HttpOnly cookies  
✅ **Tested** - Jest unit tests for critical flows  
✅ **Scalable** - Clean architecture with separation of concerns  
✅ **Responsive** - Mobile-first design approach  
✅ **Modern Stack** - Latest technologies and best practices  

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Ravindra Jadhav**  
*Full-Stack Developer*

[![GitHub](https://img.shields.io/badge/GitHub-black?style=for-the-badge&logo=github)](https://github.com/JadhaoR181)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/ravindrajadhav08)
[![Email](https://img.shields.io/badge/Email-red?style=for-the-badge&logo=gmail)](mailto:jadhaor181@gmail.com)


</div>

---

## 🙏 Acknowledgments

- Built as part of the **AbleSpace Full-Stack Engineering Assessment**
- Inspired by modern task management tools like Asana and Trello
- Special thanks to the open-source community

---

<div align="center">

**⭐ If you found this project helpful, please consider giving it a star!**

Made with ❤️ by [Ravindra Jadhav](https://github.com/JadhaoR181)

</div>
