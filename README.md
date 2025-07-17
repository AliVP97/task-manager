# Task Manager Application

A modern, full-stack task management application built with React, Node.js, and SQLite. This application demonstrates production-ready development practices with comprehensive CRUD operations, responsive design, and robust error handling.

## 🚀 Features

### Core Functionality

- **Complete CRUD Operations**: Create, read, update, and delete tasks
- **Real-time Status Updates**: Toggle task completion with visual feedback
- **Advanced Filtering**: Filter tasks by status (all, pending, complete)
- **Flexible Sorting**: Sort by creation date, update date, description, or status
- **Inline Editing**: Edit task descriptions directly in the interface
- **Form Validation**: Client-side and server-side validation with error messages
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Technical Features

- **RESTful API**: Proper HTTP methods and status codes
- **Error Handling**: Comprehensive error handling on both client and server
- **Loading States**: Visual feedback during API operations
- **Data Persistence**: SQLite database with proper schema design
- **Security**: Input validation, rate limiting, and security headers
- **Modern UI**: Clean, accessible design with smooth animations

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **Vite** for build tooling

### Backend

- **Node.js** with Express
- **SQLite3** for database
- **UUID** for unique identifiers
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **CORS** for cross-origin requests

## 📋 Prerequisites

- Docker and Docker Compose
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd task-manager
```

### 2. Start with Docker Compose

```bash
# Build and start all services
docker-compose up --build
```

This will start:

- Frontend server on `http://localhost:5173`
- Backend server on `http://localhost:3000`

The application will be ready when you see the message that both services are running.

### 3. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
task-manager/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── database/
│   │   │   │   └── init.js      # Database initialization
│   │   │   ├── middleware/
│   │   │   │   ├── errorHandler.js  # Error handling middleware
│   │   │   │   └── validation.js    # Input validation
│   │   │   ├── routes/
│   │   │   │   └── tasks.js     # Task routes
│   │   │   └── server.js        # Express server setup
│   │   ├── data/                # SQLite database files (gitignored)
│   │   ├── Dockerfile          # Backend container configuration
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── components/      # React components
│       │   ├── context/         # React Context API
│       │   ├── services/        # API service layer
│       │   └── main.tsx         # Entry point
│       ├── Dockerfile          # Frontend container configuration
│       └── package.json
├── docker-compose.yml          # Docker services configuration
├── .env.example               # Environment variables template
└── README.md
```

## 🔌 API Endpoints

### Tasks API

| Method | Endpoint                                | Description        | Body                                        |
| ------ | --------------------------------------- | ------------------ | ------------------------------------------- |
| GET    | `/api/tasks`                            | Get all tasks      | -                                           |
| GET    | `/api/tasks?status=pending`             | Get filtered tasks | -                                           |
| GET    | `/api/tasks?sort=created_at&order=DESC` | Get sorted tasks   | -                                           |
| GET    | `/api/tasks/:id`                        | Get specific task  | -                                           |
| POST   | `/api/tasks`                            | Create new task    | `{ description: string, status?: string }`  |
| PUT    | `/api/tasks/:id`                        | Update task        | `{ description?: string, status?: string }` |
| DELETE | `/api/tasks/:id`                        | Delete task        | -                                           |

### Example API Responses

#### GET /api/tasks

```json
{
  "tasks": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "description": "Complete project documentation",
      "status": "pending",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "filters": {
    "status": null,
    "sort": "created_at",
    "order": "DESC"
  }
}
```

#### POST /api/tasks

```json
{
  "message": "Task created successfully",
  "task": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "description": "New task description",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

## 🗄️ Database Schema

### Tasks Table

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL CHECK(length(description) <= 500),
  status TEXT NOT NULL CHECK(status IN ('pending', 'complete')) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Environment Configuration

The application uses Docker environment variables for configuration. All values are hardcoded in docker-compose.yml for simplicity:

### Backend Environment

```
PORT=3000
HOST=0.0.0.0
```

### Frontend Environment

```
VITE_PORT=5173
VITE_API_URL=http://localhost:3000
```

These values are configured in the docker-compose.yml file and passed to the containers at build and runtime.

## 🧪 Available Scripts

### Root Directory

- `npm run dev` - Start both backend and frontend in development mode
- `npm run frontend` - Start frontend in development mode
- `npm run backend` - Start backend in development mode

### Backend Directory

- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend in production mode

### Frontend Directory

- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: Helmet.js for security headers
- **CORS Configuration**: Proper cross-origin resource sharing
- **SQL Injection Prevention**: Parameterized queries
- **Data Sanitization**: Input sanitization and validation

## 📱 Responsive Design

The application is fully responsive with breakpoints for:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Design Features

- **Modern UI**: Clean, card-based design with subtle shadows
- **Color-coded Status**: Visual indicators for task status
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages

---

Built with ❤️ using React, Node.js, and modern web technologies.
