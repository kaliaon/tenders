# Database Scripts

This directory contains scripts for database operations.

## Seed Data Script

The `seedData.js` script is used to populate the database with initial mock data for testing and development purposes.

### What it does:

1. Clears existing data in the database (using `force: true` in sequelize sync)
2. Creates mock users (admin and regular user)
3. Creates mock tenders with various categories and statuses
4. Associates tenders with the admin user

### How to run:

Use the NPM script:

```bash
npm run seed
```

Or run directly with Node:

```bash
node scripts/seedData.js
```

### Note:

This script will drop and recreate all tables, deleting any existing data. It should only be used in development or testing environments, not in production.

### Mock Data:

The script populates the database with the following:

- 2 users (admin and regular user)
- 5 tenders with different statuses and categories
- All tenders are associated with the admin user
