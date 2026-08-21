# Handy Hire - Complete Setup Guide

## 🎉 Welcome! Your app is ready to run!

This guide will walk you through setting up and running your complete Handy Hire application.

## Prerequisites

Before you start, make sure you have:
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **Git** installed
- **Google Maps API Key** ([Get one here](https://developers.google.com/maps))
- **Stripe API Keys** ([Get them here](https://dashboard.stripe.com/))

## ⚡ Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/Elrod777/handy-hire.git
cd handy-hire
```

### 2. Setup Database

**Option A: Using Docker (Recommended)**

If you have Docker installed:

```bash
# Create .env file in project root with:
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
STRIPE_PUBLIC_KEY=your_stripe_public_key

# Start all services
docker-compose up
```

Then skip to step 5 (the database will be ready automatically).

**Option B: Manual Setup**

1. Open PostgreSQL and create a database:

```sql
CREATE DATABASE handy_hire;
```

2. Connect to it:

```sql
\c handy_hire
```

3. Run the schema file:

```sql
\i database/schema.sql
```

### 3. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `server/.env`** and add your values:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://handyhire_user:handyhire_password@localhost:5432/handy_hire
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10

STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLIC_KEY=pk_test_your_stripe_key

GOOGLE_MAPS_API_KEY=your_google_maps_api_key

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
MAIL_FROM=noreply@handyhire.com

CLIENT_URL=http://localhost:3000
```

**Start the backend:**

```bash
npm run dev
```

You should see: `Server running on port 5000`

### 4. Setup Frontend

In a **new terminal**:

```bash
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `client/.env`** and add your values:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
```

**Start the frontend:**

```bash
npm start
```

The app will automatically open at `http://localhost:3000`

### 5. Test the Application

#### Create Test Accounts

**Customer Account:**
- Click "Register"
- Select "Customer"
- Email: `customer@test.com`
- Password: `password123`

**Handyperson Account:**
- Click "Register"
- Select "Handyperson"
- Email: `handyperson@test.com`
- Password: `password123`

#### Test Features

1. **Login** as a customer
2. **Post a Job** (use these coordinates for testing: Lat: 40.7128, Lng: -74.0060)
3. **Logout** and login as handyperson
4. **View Jobs** on the home page
5. **Apply for a Job**
6. Login as customer, go to Bookings to confirm
7. Send **Messages** between customer and handyperson

---

## 📁 Project Structure

```
handy-hire/
├── server/                    # Backend (Node.js/Express)
│   ├── config/               # Configuration files
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth, validation, error handling
│   ├── routes/               # API routes
│   ├── server.js             # Entry point
│   └── package.json
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API calls
│   │   ├── context/          # State management
│   │   ├── styles/           # CSS files
│   │   └── App.js            # Main app
│   └── package.json
├── database/
│   └── schema.sql            # PostgreSQL schema
├── docker-compose.yml        # Docker configuration
└── README.md
```

---

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/logout        - Logout user
```

### Jobs
```
GET    /api/jobs               - Get all jobs
GET    /api/jobs/:id           - Get job details
POST   /api/jobs               - Create job (customer only)
PUT    /api/jobs/:id           - Update job
DELETE /api/jobs/:id           - Delete job
```

### Bookings
```
POST   /api/bookings           - Create booking
GET    /api/bookings           - Get user's bookings
GET    /api/bookings/:id       - Get booking details
PUT    /api/bookings/:id/status - Update booking status
```

### Handypeople
```
GET    /api/handypeople        - Get all handypeople
GET    /api/handypeople/:id    - Get handyperson profile
PUT    /api/handypeople/:id    - Update profile
```

### Messages
```
POST   /api/messages           - Send message
GET    /api/messages/:bookingId - Get messages for booking
GET    /api/messages           - Get conversations
```

### Reviews
```
POST   /api/reviews            - Create review
GET    /api/reviews/:handypersonId - Get handyperson reviews
```

### Payments
```
POST   /api/payments/create-intent - Create payment intent
POST   /api/payments/confirm   - Confirm payment
```

---

## 🛠️ Troubleshooting

### "Cannot connect to database"
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env`
- Verify database credentials
- Run: `psql -U handyhire_user -d handy_hire`

### "Port 3000 already in use"
```bash
# Kill the process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Port 5000 already in use"
```bash
# Kill the process using port 5000
# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

### "Google Maps API key is invalid"
- Check your API key is correct
- Enable "Maps JavaScript API" in Google Cloud Console
- Check that your domain is authorized

### "Stripe key is invalid"
- Use test keys (sk_test_... and pk_test_...)
- Make sure you copied the full key
- Check it's not expired

### npm install fails
```bash
# Clear cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Key Features Implemented

✅ **User Authentication**
- Separate roles: Customer & Handyperson
- JWT-based authentication
- Password hashing with bcrypt

✅ **Job Management**
- Post jobs with budget, category, location
- Browse available jobs
- Filter by category, budget, location

✅ **Location Services**
- Google Maps integration
- Job location display on map
- Coordinates-based job filtering

✅ **Booking System**
- Apply for jobs
- Confirm bookings
- Track booking status

✅ **Real-time Messaging**
- Chat between customers and handypeople
- Message history
- Socket.io integration ready

✅ **Ratings & Reviews**
- 5-star rating system
- Customer reviews for handypeople
- Average rating calculation

✅ **Payment Integration**
- Stripe payment processing
- Payment intent creation
- Payment confirmation

---

## 🚀 Deployment

### Deploy to Heroku

**Backend:**
```bash
cd server
heroku login
heroku create your-app-name-api
git push heroku main
heroku config:set DATABASE_URL=your_db_url
heroku config:set JWT_SECRET=your_secret
# ... set other env variables
```

**Frontend:**
```bash
cd client
npm run build
netlify deploy --prod --dir=build
```

### Deploy with Docker

```bash
docker-compose -f docker-compose.yml up -d
```

---

## 📝 Environment Variables

### Backend (.env)
```
PORT                    - Server port (default: 5000)
NODE_ENV                - Environment (development/production)
DATABASE_URL           - PostgreSQL connection string
JWT_SECRET             - Secret key for JWT tokens
JWT_EXPIRE             - Token expiration (default: 7d)
BCRYPT_ROUNDS          - Password hashing rounds (default: 10)
STRIPE_SECRET_KEY      - Stripe secret API key
STRIPE_PUBLIC_KEY      - Stripe public API key
GOOGLE_MAPS_API_KEY    - Google Maps API key
MAIL_HOST              - Email server host
MAIL_PORT              - Email server port
MAIL_USER              - Email username
MAIL_PASS              - Email password
MAIL_FROM              - From email address
CLIENT_URL             - Frontend URL
```

### Frontend (.env)
```
REACT_APP_API_URL              - Backend API URL
REACT_APP_GOOGLE_MAPS_API_KEY  - Google Maps API key
REACT_APP_STRIPE_PUBLIC_KEY    - Stripe public key
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📞 Support

- **Email**: support@handyhire.com
- **GitHub Issues**: [Report a bug](https://github.com/Elrod777/handy-hire/issues)
- **Documentation**: Check README.md

---

## 📋 Next Steps

### Backend Enhancements
- [ ] Add email notifications
- [ ] Implement WebSocket for real-time updates
- [ ] Add job application system
- [ ] Background job scheduling
- [ ] Admin dashboard API

### Frontend Enhancements
- [ ] Mobile responsive design
- [ ] Dark mode
- [ ] Real-time notifications
- [ ] User profile management
- [ ] Advanced job filtering
- [ ] Rating and review UI

### Infrastructure
- [ ] CI/CD pipeline
- [ ] Automated testing
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🎯 Quick Checklist

- [ ] Clone repository
- [ ] Install Node.js & PostgreSQL
- [ ] Setup database
- [ ] Configure backend .env
- [ ] Install backend dependencies
- [ ] Start backend server
- [ ] Configure frontend .env
- [ ] Install frontend dependencies
- [ ] Start frontend server
- [ ] Test registration & login
- [ ] Test job posting
- [ ] Test bookings
- [ ] Test messaging

---

**You're all set! 🎉 Happy coding!**

If you run into any issues, check the Troubleshooting section or create an issue on GitHub.
