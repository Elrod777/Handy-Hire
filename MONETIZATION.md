# Monetization Guide - How You Make Money

## 💰 Your Revenue Model

You earn **15% commission** on every job completed through your Handy Hire platform. Here's how it works:

### Payment Flow

```
Customer pays for job
        ↓
Total amount collected via Stripe
        ↓
   ┌────┴────┐
   ↓         ↓
 15%        85%
  YOU    Handyperson
  ↓         ↓
 Earnings  Payment
 (Payout)  (Transfer)
```

## 📊 Example Earnings

**Job value: $100**
- Your platform fee: **$15** (15%)
- Handyperson gets: $85 (85%)

**Job value: $500**
- Your platform fee: **$75** (15%)
- Handyperson gets: $425 (85%)

**Job value: $1000**
- Your platform fee: **$150** (15%)
- Handyperson gets: $850 (85%)

## 🔄 Complete Payment Process

### Step 1: Customer Posts Job
- Customer creates job listing
- Specifies job budget ($X to $Y)

### Step 2: Handyperson Applies
- Handyperson applies for the job
- Customer reviews application

### Step 3: Booking Confirmed
- Customer and Handyperson agree on price
- Booking is created

### Step 4: Customer Makes Payment
- Customer pays via Stripe (using credit/debit card)
- Funds are charged to customer's card
- Payment is processed through your Stripe account

### Step 5: Money Distribution
- **85% to Handyperson**: Automatically transferred to handyperson's Stripe connected account
- **15% to You**: Added to your platform earnings (ready to withdraw)
- Transaction is recorded in your Earnings Dashboard

### Step 6: You Request Payout
- Go to **Earnings** page → **Request Payout**
- Enter amount (minimum $10)
- Funds are transferred to your bank account within 2-3 business days

## 💳 Setting Up Payment Processing

### 1. Stripe Connect Account

You need a Stripe account to process payments:

```bash
# Sign up at: https://dashboard.stripe.com/
# Use your test keys first (sk_test_... pk_test_...)
# Switch to live keys when ready
```

### 2. Configure Environment Variables

**Backend (.env)**
```env
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLIENT_URL=https://yourdomain.com
```

**Frontend (.env)**
```env
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
REACT_APP_API_URL=https://your-api.herokuapp.com
```

### 3. Connect Handyperson Stripe Accounts

Handypeople need to connect their own Stripe account to receive payouts:

```javascript
// This happens during onboarding
// Redirect handyperson to Stripe Connect
const redirectUrl = `https://connect.stripe.com/oauth/authorize?
  client_id=${process.env.STRIPE_CONNECT_ID}&
  state=${handyperson_id}&
  stripe_user[email]=${handyperson.email}`;
```

## 📈 Earnings Dashboard

Access your earnings at: `/earnings`

### Features:
- **Total Earnings**: All-time platform fees collected
- **Completed Earnings**: Money ready to withdraw
- **Pending Earnings**: Money from jobs still being completed
- **Transaction History**: Detailed list of all jobs and earnings
- **Payout Management**: Request withdrawals anytime

## 🏦 Withdrawal Process

### Request a Payout

1. Go to **Earnings** page
2. Click **Request Payout**
3. Enter amount (minimum $10)
4. Submit request

### Payout Timeline
- Request submitted → Processing
- Stripe processes → 2-3 business days
- Funds appear in your bank account

### Payout Limits
- **Minimum**: $10
- **Maximum**: Your available balance
- **No limits** on frequency (but consider bank transfer fees)

## 📱 Real-Time Tracking

### Database Tables for Earnings

**platform_earnings**
- Tracks every transaction
- Records your 15% fee
- Tracks handyperson 85% payment
- Status: pending, succeeded, failed

**handyperson_payouts**
- Tracks what handypeople are owed
- Automatically creates when payment succeeds
- Handles transfers to handyperson accounts

**admin_payouts**
- Tracks your withdrawal requests
- Records payout status
- Shows completion dates

## 🔐 Security & Compliance

### Stripe Security
- ✅ PCI DSS Level 1 certified
- ✅ Encrypted card processing
- ✅ No card data stored on your servers
- ✅ Automatic fraud detection

### Webhook Verification
```javascript
// Stripe sends webhooks to verify payments
POST /api/payments/webhook

// Verifies:
// - payment_intent.succeeded
// - payment_intent.payment_failed
// - payout.paid
// - payout.failed
```

## 💡 Revenue Optimization

### Strategies to Increase Earnings

1. **Grow Your User Base**
   - More jobs = More fees
   - Market to customers and handyspeople
   - Improve user experience

2. **Increase Average Job Value**
   - Premium features for high-value jobs
   - Featured listings
   - Job promotion

3. **Higher Completion Rate**
   - Better matching algorithm
   - Quality reviews and ratings
   - Dispute resolution

4. **Additional Revenue Streams** (Future)
   - Premium subscriptions
   - Featured job listings
   - Job promotion/boosting
   - Verified badges
   - Background check fees
   - Insurance add-ons

## 📊 Example Monthly Earnings

**Scenario: 100 jobs completed per month**

| Job Value | Jobs | Platform Fee (15%) | Monthly |
|-----------|------|-------------------|----------|
| $100      | 30   | $15 each          | $450    |
| $250      | 40   | $37.50 each       | $1,500  |
| $500      | 20   | $75 each          | $1,500  |
| $1000     | 10   | $150 each         | $1,500  |
| **Total** | **100** | | **$4,950/month** |

**Annual Revenue: ~$59,400**

## 🚀 Getting Started with Monetization

### Checklist

- [ ] Create Stripe account
- [ ] Get test API keys
- [ ] Test payment flow
- [ ] Verify earnings tracking
- [ ] Request test payouts
- [ ] Upgrade to live keys
- [ ] Test live payments
- [ ] Monitor earnings dashboard
- [ ] Process first real payout

## 🔗 API Endpoints for Earnings

### Get Your Earnings
```bash
GET /api/payments/earnings

Response:
{
  "summary": {
    "total_earnings": 1500.00,
    "completed_earnings": 1200.00,
    "pending_earnings": 300.00,
    "total_transactions": 25
  },
  "recentTransactions": [
    {
      "id": 1,
      "booking_id": 5,
      "platform_fee": 50.00,
      "handyperson_payout": 285.00,
      "status": "succeeded",
      "job_title": "Fix Kitchen Sink",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2024-09-01T10:00:00Z"
    }
  ]
}
```

### Request Payout
```bash
POST /api/payments/payout

Body:
{
  "amount": 500.00
}

Response:
{
  "message": "Payout requested successfully",
  "payoutId": "po_1234567890",
  "amount": 500.00,
  "status": "processing"
}
```

## 📞 Support

### Payment Issues
- Check Stripe dashboard for transaction details
- Review webhook logs
- Contact Stripe support

### Payout Issues
- Verify bank account details in Stripe
- Check for daily payout limits
- Review payout status in earnings dashboard

## 📚 Resources

- **Stripe Docs**: https://stripe.com/docs
- **Stripe Dashboard**: https://dashboard.stripe.com/
- **Stripe Support**: https://support.stripe.com/
- **Your Earnings Page**: `/earnings`

---

**Start earning today!** 💰

Your platform is fully monetized and ready to generate revenue. Monitor your Earnings Dashboard regularly and watch your income grow!
