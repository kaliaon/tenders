# Tenders Backend API

A RESTful API backend for a tender management system.

## Features

- User authentication (register, login)
- User profile management
- CRUD operations for tenders
- Search and filter tenders by various criteria
- Subscribe/unsubscribe to tenders
- Role-based authorization (user, admin)

## API Documentation

API endpoints are documented in [api.md](api.md)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd tenders-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your settings

# Set up PostgreSQL
# Make sure PostgreSQL is installed and running
# Create a database named 'tenders_db' (or as configured in .env)
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=3000

# PostgreSQL settings
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=tenders_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Database sync
DB_FORCE_SYNC=false

# JWT settings
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

## Running the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcrypt.js for password hashing

## Project Structure

```
├── config             # Configuration files
├── controllers        # Route controllers
├── middleware         # Custom middleware
├── models             # Sequelize models
├── routes             # API routes
├── utils              # Utility functions
├── index.js           # Application entry point
├── .env               # Environment variables (create this)
└── README.md          # Project documentation
```

## License

ISC
