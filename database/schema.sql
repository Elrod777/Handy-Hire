-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('customer', 'handyperson')),
  profile_picture_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create handypeople_specialties table
CREATE TABLE handypeople_specialties (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialty VARCHAR(100) NOT NULL,
  experience_years INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'cancelled')),
  location_address VARCHAR(500),
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  required_skills TEXT,
  preferred_availability DATE,
  duration_estimate VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job_applications table
CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  handyperson_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposed_price DECIMAL(10, 2),
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, handyperson_id)
);

-- Create bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  handyperson_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id INTEGER REFERENCES job_applications(id) ON DELETE SET NULL,
  agreed_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'in_progress', 'completed', 'cancelled')),
  scheduled_date DATE,
  scheduled_time TIME,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  stripe_payment_intent_id VARCHAR(255),
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  message TEXT NOT NULL,
  related_booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create handyperson_ratings table (aggregated ratings)
CREATE TABLE handyperson_ratings (
  id SERIAL PRIMARY KEY,
  handyperson_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_location ON jobs(location_latitude, location_longitude);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_handyperson_id ON bookings(handyperson_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_messages_booking_id ON messages(booking_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_reviews_handyperson_id ON reviews(reviewee_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create function to update handyperson ratings
CREATE OR REPLACE FUNCTION update_handyperson_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE handyperson_ratings
  SET average_rating = (
    SELECT AVG(rating)::DECIMAL(3, 2) FROM reviews WHERE reviewee_id = NEW.reviewee_id
  ),
  total_reviews = (
    SELECT COUNT(*) FROM reviews WHERE reviewee_id = NEW.reviewee_id
  ),
  updated_at = CURRENT_TIMESTAMP
  WHERE handyperson_id = NEW.reviewee_id;
  
  IF NOT FOUND THEN
    INSERT INTO handyperson_ratings (handyperson_id, average_rating, total_reviews)
    VALUES (
      NEW.reviewee_id,
      NEW.rating::DECIMAL(3, 2),
      1
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for review insertion
CREATE TRIGGER trg_update_handyperson_rating
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_handyperson_rating();