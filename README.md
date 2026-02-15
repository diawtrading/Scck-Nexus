# SCCK ERP NEXUS - Production Deployment Guide

## Overview
SCCK ERP NEXUS is a comprehensive Enterprise Resource Planning system designed for cocoa cooperatives. This guide covers deployment, configuration, and operation in a production environment.

## Project Structure
```
.
├── src/                    # Frontend files
│   └── index.html         # Main application
├── api/                   # Backend API endpoints
│   ├── auth.js           # Authentication endpoints
│   ├── producers.js      # Producer management
│   ├── collections.js    # Collection tracking
│   ├── finance.js        # Financial management
│   ├── inventory.js      # Inventory management
│   ├── employees.js      # HR management
│   ├── customers.js      # Customer management
│   ├── suppliers.js      # Supplier management
│   ├── projects.js       # Project management
│   ├── dashboard.js      # Dashboard data
│   └── reports.js        # Reporting endpoints
├── db/                    # Database management
│   └── database.js       # SQLite database config
├── server.js             # Express server
├── package.json          # Dependencies
├── .env                  # Environment configuration
└── README.md             # This file
```

## Prerequisites
- Node.js 16+ and npm 8+
- SQLite 3.30+
- Linux/macOS/Windows OS
- 2GB RAM minimum
- 5GB storage minimum

## Installation

### 1. Clone/Setup Repository
```bash
cd /SCCK_ERP_NEXUS
npm install
```

### 2. Configure Environment
Copy and edit `.env` file:
```bash
cp .env.example .env
```

Key settings to configure:
- `NODE_ENV=production`
- `PORT=3000` (or your preferred port)
- `JWT_SECRET` (strong random string, minimum 32 characters)
- `ALLOWED_ORIGINS` (your domain URLs)
- `DB_PATH` (database location)

### 3. Initialize Database
The database initializes automatically on first run. To seed sample data:
```bash
node -e "const DB = require('./db/database'); const db = new DB(); db.initialize(); db.seedInitialData();"
```

### 4. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run prod
```

Server will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (admin only)
- `POST /api/auth/demo-login` - Demo account login
- `GET /api/auth/verify` - Verify token

### Producers
- `GET /api/producers` - List all producers
- `POST /api/producers` - Create producer
- `GET /api/producers/:id` - Get producer details
- `PUT /api/producers/:id` - Update producer
- `DELETE /api/producers/:id` - Delete producer
- `GET /api/producers/stats/overview` - Producer statistics

### Collections
- `GET /api/collections` - List all collections
- `POST /api/collections` - Create collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection
- `GET /api/collections/stats/summary` - Collection summary

### Finance
- `GET /api/finance/transactions` - List transactions
- `POST /api/finance/transactions` - Create transaction
- `GET /api/finance/report` - Financial report

### Inventory
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `GET /api/inventory/alerts/low-stock` - Low stock alerts

### Employees
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `GET /api/employees/payroll/summary` - Payroll summary

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/stats/overview` - Customer statistics

### Suppliers
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Create supplier
- `GET /api/suppliers/stats/overview` - Supplier statistics

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `POST /api/projects/:id/progress` - Update progress
- `GET /api/projects/stats/overview` - Project statistics

### Dashboard
- `GET /api/dashboard/kpis` - KPI data
- `GET /api/dashboard/revenue-trend` - Revenue trends
- `GET /api/dashboard/zone-performance` - Zone performance
- `GET /api/dashboard/quality-distribution` - Quality distribution
- `GET /api/dashboard/recent-activity` - Recent activity

### Reports
- `GET /api/reports/financial` - Financial report
- `GET /api/reports/production` - Production report
- `GET /api/reports/hr` - HR report
- `GET /api/reports/inventory` - Inventory report
- `GET /api/reports/export/:format` - Export data (csv/json)

## Demo Accounts
Three demo accounts are available for testing:
- **CEO**: ceo@scck.com / ceo123
- **CFO**: cfo@scck.com / cfo123
- **COO**: ops@scck.com / ops123

## Deployment Options

### Docker Deployment
```bash
docker build -t scck-erp-nexus .
docker run -p 3000:3000 -v scck_data:/app/data scck-erp-nexus
```

### Docker Compose
```bash
docker-compose up -d
```

### Manual Server (Linux/Ubuntu 20+)
1. Install Node.js
2. Clone repository
3. Configure `.env`
4. Run: `npm install && npm start`
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "scck-erp"
   pm2 save
   ```

### Cloud Platforms

**Heroku:**
```bash
heroku login
heroku create scck-erp-nexus
git push heroku main
```

**AWS/Google Cloud/Azure:**
- Use App Engine, Cloud Run, or similar services
- Configure environment variables in platform settings
- Map ports correctly

## Security Considerations

### Production Checklist
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS/SSL certificates
- [ ] Implement rate limiting
- [ ] Setup database backups
- [ ] Use environment variables for all secrets
- [ ] Enable CORS restrictions
- [ ] Setup logging and monitoring
- [ ] Regular security updates

### API Security
- Authentication via JWT tokens
- Role-based access control (RBAC)
- Input validation with Joi
- SQL injection prevention (parameterized queries)
- Password hashing with bcryptjs
- CORS enabled
- Rate limiting per IP

## Database Backups

### Daily Backup
```bash
sqlite3 ./data/scck_erp.db ".backup './backups/scck_erp_$(date +%Y%m%d).db'"
```

### Automated Backup (cron)
```bash
0 2 * * * sqlite3 /path/to/scck_erp.db ".backup '/path/to/backups/scck_erp_$(date +\%Y\%m\%d).db'"
```

## Monitoring & Logging

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Logs Location
- Development: Console output
- Production: Configure logging middleware

### Performance Monitoring
- Monitor API response times
- Track database query performance
- Monitor server resource usage

## Troubleshooting

### Database Locked Error
```bash
# Clear locks
rm -f ./data/scck_erp.db-wal
rm -f ./data/scck_erp.db-shm
```

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### High Memory Usage
Check for connection leaks and optimize queries.

## Upgrading

1. Backup database
2. Update dependencies: `npm update`
3. Test in development
4. Deploy to production
5. Monitor for errors

## Support & Documentation

- Issues: Create an issue on the repository
- Documentation: See `/docs/` folder
- API Reference: `/docs/api-reference.md`

## License
MIT License - See LICENSE file

## Version
**Current Version:** 1.0.0
**Last Updated:** February 2026
**Status:** Production Ready
