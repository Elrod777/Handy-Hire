import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as jobsService from '../services/jobsService';
import '../styles/postjob.css';

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    budget_min: '',
    budget_max: '',
    location_address: '',
    location_latitude: '',
    location_longitude: '',
    required_skills: '',
    preferred_availability: '',
    duration_estimate: ''
  });

  if (!user || user.user_type !== 'customer') {
    return <div className="error">Only customers can post jobs</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobsService.createJob(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error posting job');
      console.error('Error posting job:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job">
      <h1>Post a New Job</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Fix Kitchen Sink"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            placeholder="Describe the job in detail..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option>Plumbing</option>
              <option>Electrical</option>
              <option>Carpentry</option>
              <option>Painting</option>
              <option>Cleaning</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Min Budget ($) *</label>
            <input
              type="number"
              name="budget_min"
              value={formData.budget_min}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Max Budget ($) *</label>
            <input
              type="number"
              name="budget_max"
              value={formData.budget_max}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Location Address *</label>
          <input
            type="text"
            name="location_address"
            placeholder="Full address"
            value={formData.location_address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Latitude *</label>
            <input
              type="number"
              step="0.0001"
              name="location_latitude"
              value={formData.location_latitude}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Longitude *</label>
            <input
              type="number"
              step="0.0001"
              name="location_longitude"
              value={formData.location_longitude}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Required Skills</label>
          <input
            type="text"
            name="required_skills"
            placeholder="e.g., Plumbing, Pipe Repair"
            value={formData.required_skills}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Preferred Date</label>
            <input
              type="date"
              name="preferred_availability"
              value={formData.preferred_availability}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Duration Estimate</label>
            <input
              type="text"
              name="duration_estimate"
              placeholder="e.g., 2 hours"
              value={formData.duration_estimate}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default PostJob;