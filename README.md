# Handy Hire - Connecting Customers with Handypeople

A modern web application that connects customers with skilled handypeople for various services. Features include job posting, real-time location tracking, secure payments, messaging, and ratings.

## Features

- **User Authentication**: Separate roles for Customers and Handypeople
- **Job Management**: Post, browse, and book jobs
- **Location Services**: Integrated Google Maps for address sharing and job site discovery
- **Real-time Messaging**: Chat between customers and handypeople
- **Payment Processing**: Secure Stripe integration
- **Reviews & Ratings**: 5-star rating system
- **Notifications**: Real-time updates on job status
- **Job Filtering**: Search by location, category, and availability

## Tech Stack

- **Frontend**: React, React Router, Axios, Google Maps API
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe API
- **Real-time**: Socket.io for messaging
- **Deployment**: Docker, Heroku/AWS ready

## Project Structure

```
handy-hire/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   ├── package.json
│   └── .env.example
├── server/                 # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── database/               # PostgreSQL setup
│   └── schema.sql
└── docker-compose.yml      # Docker configuration
```

## Getting Started

### Prerequisites
- Node.js v16+
- PostgreSQL 12+
- Git
- Google Maps API Key
- Stripe API Keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Elrod777/handy-hire.git
   cd handy-hire
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Fill in your environment variables
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   npm start
   ```

4. **Setup Database**
   - Create PostgreSQL database
   - Run database/schema.sql

## Environment Variables

### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/handy_hire
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_password
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Jobs
- `GET /api/jobs` - Get all available jobs
- `POST /api/jobs` - Create new job (Customer only)
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job (Customer only)
- `DELETE /api/jobs/:id` - Delete job (Customer only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Handypeople
- `GET /api/handypeople` - Get all handypeople
- `GET /api/handypeople/:id` - Get handyperson profile
- `PUT /api/handypeople/:id` - Update profile

### Messaging
- `GET /api/messages/:jobId` - Get messages for a job
- `POST /api/messages` - Send message
- `GET /api/conversations` - Get user's conversations

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/:handypersonId` - Get reviews for handyperson

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment

## Development

```bash
# Start backend in development mode
cd server && npm run dev

# Start frontend
cd client && npm start

# Run tests
npm test

# Build for production
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@handyhire.com or open an issue on GitHub.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced job filtering & recommendations
- [ ] Job history & analytics dashboard
- [ ] Insurance integration
- [ ] Video verification
- [ ] Background checks
- [ ] Multi-language support
- [ ] Payment split between multiple handypeople

---

Built with ❤️ by Handy Hire Team