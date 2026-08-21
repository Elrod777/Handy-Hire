import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/jobcard.css';

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p className="category">{job.category}</p>
      <p className="description">{job.description.substring(0, 100)}...</p>
      <div className="job-footer">
        <span className="budget">${job.budget_min} - ${job.budget_max}</span>
        <Link to={`/jobs/${job.id}`} className="view-btn">View Details</Link>
      </div>
    </div>
  );
};

export default JobCard;