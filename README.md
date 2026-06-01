![Todo App Banner]!(https://github.com/NethranjaliSE/project-images/blob/main/docs/todo_banner.png)

# 📝 Full-Stack Todo Web Application

🚀 **Live Demo:** [Visit the Application Here](https://todo-web-app-next-js-laravel-postgr-xi.vercel.app/)

A robust, production-ready Full-Stack Todo application designed to manage daily tasks efficiently. Built with a decoupled architecture featuring a modern **Next.js** frontend and a secure **Laravel** API backend, all powered by a **PostgreSQL** database.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js, React, Tailwind CSS |
| **Backend** | Laravel, PHP 8.x |
| **Database** | PostgreSQL |
| **Authentication** | Laravel Sanctum |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## ✨ Features

- 🔐 **Secure Authentication** — User registration and login protected by Laravel Sanctum.
- ✅ **Full CRUD Operations** — Create, read, update, and delete daily tasks.
- 📱 **Responsive Design** — Mobile-friendly, modern UI built with Tailwind CSS.
- 🌐 **Production-Ready CORS** — Configured cross-origin resource sharing between frontend and backend.

---

## ⚙️ Required Environment Variables

To run this project locally, you will need to create `.env` files in both the frontend and backend directories.

### Backend (`todo-backend/.env`)

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY= # Generate this using 'php artisan key:generate'
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration (PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# CORS & Authentication
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### Frontend (`todo-frontend/.env.local`)

```env
# Point this to your backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

---

## 🚀 Local Setup & Run Instructions

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18+)
- [PHP](https://www.php.net/) (v8.2+)
- [Composer](https://getcomposer.org/)
- [PostgreSQL](https://www.postgresql.org/)

---

### 1. Backend Setup (Laravel)

**1. Navigate to the backend directory:**
```bash
cd todo-backend
```

**2. Install PHP dependencies:**
```bash
composer install
```

**3. Copy the environment file and configure your database settings:**
```bash
cp .env.example .env
```

**4. Generate the application key:**
```bash
php artisan key:generate
```

**5. Run the database migrations:**
```bash
php artisan migrate
```

**6. Start the backend server:**
```bash
php artisan serve
```

> The backend will now be running on `http://localhost:8000`

---

### 2. Frontend Setup (Next.js)

**1. Open a new terminal and navigate to the frontend directory:**
```bash
cd todo-frontend
```

**2. Install JavaScript dependencies:**
```bash
npm install
```

**3. Create your local environment file:**
```bash
cp .env.example .env.local
```

**4. Start the development server:**
```bash
npm run dev
```

> The frontend will now be running on `http://localhost:3000`

---

## ☁️ Deployment Notes

This application is deployed across two platforms to handle the decoupled architecture:

- **Frontend:** Hosted on [Vercel](https://vercel.com/) for optimized Next.js performance and static rendering.
- **Backend & Database:** Hosted on [Render](https://render.com/) utilizing Docker containers and a managed PostgreSQL instance.

> ⚠️ **Note:** Because the backend is on a free Render tier, it may take **30–50 seconds** to wake up on the first request if it has been idle for 15 minutes.
