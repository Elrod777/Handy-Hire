import React, { useEffect, useState } from 'react';
import * as bookingsService from '../services/bookingsService';
import '../styles/bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingsService.getBookings();
        setBookings(data);
      } catch (err) {
        setError('Error fetching bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bookings">
      <h1>My Bookings</h1>
      {bookings.length > 0 ? (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>Booking #{booking.id}</h3>
                <span className={`status ${booking.status}`}>{booking.status}</span>
              </div>
              <p><strong>Price:</strong> ${booking.agreed_price}</p>
              <p><strong>Date:</strong> {booking.scheduled_date ? new Date(booking.scheduled_date).toLocaleDateString() : 'Not scheduled'}</p>
              {booking.scheduled_time && <p><strong>Time:</strong> {booking.scheduled_time}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings yet</p>
      )}
    </div>
  );
};

export default Bookings;