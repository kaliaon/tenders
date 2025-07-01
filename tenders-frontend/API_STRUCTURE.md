# API Structure for Tenders Backend

This document outlines the API endpoints that should be implemented by the backend to work with the frontend application.

## Configuration

The frontend is configured to work with both a simulated backend (for development) and a real backend API. The configuration settings are located in `src/utils/apiConfig.js`. To switch between simulated and real backend, change the `useBackend` setting:

```javascript
// Development environment settings
const DEV_CONFIG = {
  useBackend: false, // Set to true to use real backend API, false to use simulated API
  apiBaseUrl: "http://localhost:8000/api", // Default backend API URL
  simulateNetworkDelay: 300, // Milliseconds to simulate network delay in mock responses
};
```

## API Endpoints

### Authentication

#### Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "full_name": "User Name",
    "role": "user",
    "token": "auth-token-here"
  }
  ```

#### Register

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "password123",
    "full_name": "New User"
  }
  ```
- **Success Response**:
  ```json
  {
    "id": 3,
    "email": "newuser@example.com",
    "full_name": "New User",
    "role": "user",
    "token": "auth-token-here"
  }
  ```

### Users

#### Get User Profile

- **URL**: `/api/users/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response**:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "full_name": "User Name",
    "role": "user"
  }
  ```

#### Update User Profile

- **URL**: `/api/users/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "full_name": "Updated Name"
  }
  ```
- **Success Response**:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Updated Name",
    "role": "user"
  }
  ```

#### Change Password

- **URL**: `/api/users/:id/password`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "currentPassword": "oldPassword",
    "newPassword": "newPassword"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true
  }
  ```

### Tenders

#### Get All Tenders

- **URL**: `/api/tenders`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>` (optional)
- **Success Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Project Title",
      "description": "Project Description",
      "budget": 100000,
      "deadline": "2023-12-31",
      "status": "open",
      "category": "IT және цифрландыру",
      "createdAt": "2023-05-15",
      "company": "Company Name",
      "location": "Location",
      "requirements": ["Requirement 1", "Requirement 2"],
      "contact": "contact@example.com"
    }
    // ...more tenders
  ]
  ```

#### Get Tender by ID

- **URL**: `/api/tenders/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>` (optional)
- **Success Response**:
  ```json
  {
    "id": 1,
    "title": "Project Title",
    "description": "Project Description",
    "budget": 100000,
    "deadline": "2023-12-31",
    "status": "open",
    "category": "IT және цифрландыру",
    "createdAt": "2023-05-15",
    "company": "Company Name",
    "location": "Location",
    "requirements": ["Requirement 1", "Requirement 2"],
    "contact": "contact@example.com"
  }
  ```

#### Create Tender

- **URL**: `/api/tenders`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "New Tender",
    "description": "Description",
    "budget": 200000,
    "deadline": "2024-05-30",
    "category": "Құрылыс",
    "company": "Company Name",
    "location": "Location",
    "requirements": ["Requirement 1", "Requirement 2"],
    "contact": "contact@example.com"
  }
  ```
- **Success Response**:
  ```json
  {
    "id": 6,
    "title": "New Tender",
    "description": "Description",
    "budget": 200000,
    "deadline": "2024-05-30",
    "status": "open",
    "category": "Құрылыс",
    "createdAt": "2023-10-15",
    "company": "Company Name",
    "location": "Location",
    "requirements": ["Requirement 1", "Requirement 2"],
    "contact": "contact@example.com"
  }
  ```

#### Update Tender

- **URL**: `/api/tenders/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "status": "in_progress"
  }
  ```
- **Success Response**:
  ```json
  {
    "id": 1,
    "title": "Updated Title",
    "description": "Project Description",
    "budget": 100000,
    "deadline": "2023-12-31",
    "status": "in_progress",
    "category": "IT және цифрландыру",
    "createdAt": "2023-05-15",
    "company": "Company Name",
    "location": "Location",
    "requirements": ["Requirement 1", "Requirement 2"],
    "contact": "contact@example.com"
  }
  ```

#### Delete Tender

- **URL**: `/api/tenders/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response**:
  ```json
  {
    "success": true
  }
  ```

#### Search Tenders

- **URL**: `/api/tenders/search`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>` (optional)
- **Query Parameters**: `query=search term`
- **Success Response**:
  ```json
  [
    // Tenders matching the search term
  ]
  ```

#### Filter Tenders

- **URL**: `/api/tenders/filter`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>` (optional)
- **Query Parameters**:
  - `category=IT және цифрландыру`
  - `status=open`
  - `minBudget=10000`
  - `maxBudget=500000`
- **Success Response**:
  ```json
  [
    // Filtered tenders
  ]
  ```

### Subscriptions

#### Subscribe to Tender

- **URL**: `/api/tenders/:id/subscribe`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "userId": 1
  }
  ```
- **Success Response**:
  ```json
  {
    "id": 123,
    "tenderId": 1,
    "userId": 1,
    "createdAt": "2023-10-15T14:30:00.000Z"
  }
  ```

#### Unsubscribe from Tender

- **URL**: `/api/tenders/:id/subscribe`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "userId": 1
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true
  }
  ```

#### Get User Subscriptions

- **URL**: `/api/users/:id/subscriptions`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response**:
  ```json
  [
    {
      "subscription": {
        "id": 123,
        "tenderId": 1,
        "userId": 1,
        "createdAt": "2023-10-15T14:30:00.000Z"
      },
      "tender": {
        "id": 1,
        "title": "Project Title"
        // other tender fields
      }
    }
  ]
  ```

#### Check if User is Subscribed to Tender

- **URL**: `/api/tenders/:tenderId/subscriptions/:userId`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response**:
  ```json
  true
  ```
  or
  ```json
  false
  ```

## Data Models

### User

```json
{
  "id": 1,
  "email": "user@example.com",
  "password": "hashed_password", // Not included in responses
  "full_name": "User Name",
  "role": "user", // "user" or "admin"
  "token": "auth-token" // Included only in auth responses
}
```

### Tender

```json
{
  "id": 1,
  "title": "Tender Title",
  "description": "Tender Description",
  "budget": 100000,
  "deadline": "2023-12-31",
  "status": "open", // "open", "closed", "in_progress", "awarded"
  "category": "Category Name",
  "createdAt": "2023-05-15",
  "company": "Company Name",
  "location": "Location",
  "requirements": ["Requirement 1", "Requirement 2"],
  "contact": "contact@example.com"
}
```

### Subscription

```json
{
  "id": 123,
  "tenderId": 1,
  "userId": 1,
  "createdAt": "2023-10-15T14:30:00.000Z"
}
```
