-- Add platform earnings tracking table
CREATE TABLE platform_earnings (
  id SERIAL PRIMARY KEY,
  payment_id VARCHAR(255) UNIQUE NOT NULL,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  platform_fee DECIMAL(10, 2) NOT NULL,
  handyperson_payout DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add handyperson payouts table
CREATE TABLE handyperson_payouts (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  handyperson_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  stripe_transfer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP
);

-- Add admin payouts table (for you to withdraw)
CREATE TABLE admin_payouts (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  stripe_payout_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_platform_earnings_status ON platform_earnings(status);
CREATE INDEX idx_platform_earnings_created ON platform_earnings(created_at);
CREATE INDEX idx_handyperson_payouts_handyperson ON handyperson_payouts(handyperson_id);
CREATE INDEX idx_handyperson_payouts_status ON handyperson_payouts(status);
CREATE INDEX idx_admin_payouts_status ON admin_payouts(status);