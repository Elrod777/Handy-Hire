import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as jobsService from '../services/jobsService';
import * as bookingsService from '../services/bookingsService';
import '../styles/jobdetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobsService.getJobById(id);
        setJob(data);
      } catch (err) {
        setError('Error fetching job details');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);
      await bookingsService.createBooking({
        job_id: parseInt(id),
        application_id: 1,
        agreed_price: job.budget_max,
        scheduled_date: new Date().toISOString().split('T')[0]
      });
      navigate('/bookings');
    } catch (err) {
      setError('Error applying for job');
      console.error('Error applying for job:', err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!job) return <div className="error">Job not found</div>;

  return (
    <div className="job-details">
      <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
      <h1>{job.title}</h1>
      <p className="description">{job.description}</p>
      <div className="job-info">
        <div className="info-item">
          <span className="label">Category:</span>
          <span>{job.category}</span>
        </div>
        <div className="info-item">
          <span className="label">Budget:</span>
          <span>${job.budget_min} - ${job.budget_max}</span>
        </div>
        <div className="info-item">
          <span className="label">Location:</span>
          <span>{job.location_address}</span>
        </div>
        {job.required_skills && (
          <div className="info-item">
            <span className="label">Required Skills:</span>
            <span>{job.required_skills}</span>
          </div>
        )}
        {job.duration_estimate && (
          <div className="info-item">
            <span className="label">Duration:</span>
            <span>{job.duration_estimate}</span>
          </div>
        )}
      </div>
      <button onClick={handleApply} className="apply-btn" disabled={applying}>
        {applying ? 'Applying...' : 'Apply for This Job'}
      </button>
    </div>
  );
};

export default JobDetails;