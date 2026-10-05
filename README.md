# 🛒 MyShop - Full Stack E-Commerce Application

MyShop is a full-stack e-commerce web application built with React.js, Django REST Framework and PostgreSQL.

The project includes user authentication, product management, shopping cart, buying/order functionality and an admin dashboard.

## 🚀 Live Demo

🌐 **Live Website:**  
https://my-shop-lemon-six.vercel.app

💻 **GitHub Repository:**  
https://github.com/surajkumar6596/MyShop

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- JavaScript
- HTML5
- CSS3

### Backend
- Python
- Django
- Django REST Framework
- JWT Authentication

### Database
- PostgreSQL
- Neon

### Deployment
- GitHub
- Render
- Vercel

## ✨ Features

### 👤 User Features
- User registration
- User login
- JWT authentication
- Product browsing
- Product search
- Add products to cart
- Buy products
- Order functionality

### 👨‍💼 Admin Features
- Admin authentication
- Admin dashboard
- Product management
- Add products
- Delete products
- User management
- Order management
- Cart management
- Dashboard statistics

### 🖼️ Product Features
- Product images
- Product name
- Product price
- Product description
- Product category

## 🔐 Authentication

The application uses JWT-based authentication.

After login, the backend provides:

- Access token
- Refresh token

Protected API requests use:

```text
Authorization: Bearer <access_token>
```

Admin APIs are protected using Django REST Framework permissions.

## 🏗️ Project Architecture

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ React Frontend   │
                    │     Vercel       │
                    └────────┬─────────┘
                             │
                         REST API
                             │
                             ▼
                    ┌──────────────────┐
                    │ Django + DRF     │
                    │     Render       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ PostgreSQL       │
                    │      Neon        │
                    └──────────────────┘
```

## 📂 Project Structure

```text
MyShop/
│
├── backend/
│   └── MyShop_Backend/
│       ├── manage.py
│       ├── accounts/
│       ├── products/
│       ├── carts/
│       ├── MyShop_Backend/
│       └── requirements.txt
│
├── frontend/
│   └── MyShop-Frontend/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vercel.json
│
└── .gitignore
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/surajkumar6596/MyShop.git
cd MyShop
```

### 2. Backend Setup

```bash
cd backend/MyShop_Backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run Django:

```bash
python manage.py runserver
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend/MyShop-Frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

## 🔑 Environment Variables

### Backend

Example:

```text
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-backend-domain
DATABASE_URL=your-postgresql-database-url
```

### Frontend

```text
VITE_API_URL=your-backend-api-url
```


## ☁️ Deployment

### Backend

The Django REST API is deployed using:

**Render**

### Frontend

The React frontend is deployed using:

**Vercel**

### Database

The PostgreSQL production database is hosted using:

**Neon**

## 📸 Screenshots

Screenshots of the application can be added here.

### Home Page

_Add screenshot here_

### Products

_Add screenshot here_

### Login

_Add screenshot here_

### Shopping Cart

_Add screenshot here_

### Admin Dashboard

_Add screenshot here_

## 📚 What I Learned

Through this project, I learned how to:

- Build a full-stack application
- Develop REST APIs using Django REST Framework
- Implement JWT authentication
- Connect Django with PostgreSQL
- Build React frontend components
- Connect React with REST APIs
- Implement admin functionality
- Manage Git and GitHub
- Deploy a Django backend
- Deploy a React frontend
- Configure production environment variables
- Configure CORS
- Connect a cloud PostgreSQL database
- Debug production deployment issues

## 🔮 Future Improvements

Some improvements planned for future versions:

- Payment gateway integration
- Product reviews and ratings
- Wishlist functionality
- Better image storage
- Email notifications
- Advanced product filtering
- Improved responsive UI
- Order tracking
- Better admin analytics

## 👨‍💻 Author

**Suraj Kumar**

GitHub:  
https://github.com/surajkumar6596

---

⭐ If you find this project interesting, feel free to explore the repository.
