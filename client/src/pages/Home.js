import React, { useContext, useEffect, useState } from 'react';
import { JobsContext } from '../context/JobsContext';
import JobCard from '../components/JobCard';
import JobMap from '../components/JobMap';
import '../styles/home.css';

const Home = () => {
  const { jobs, fetchJobs, loading } = useContext(JobsContext);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchJobs(filters);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    fetchJobs(filters);
  };

  return (
    <div className="home">
      <section className="hero">
        <h1>Find Skilled Handypeople Near You</h1>
        <p>Post your job or find local professionals to get work done</p>
      </section>

      <section className="filters">
        <input
          type="text"
          name="category"
          placeholder="Search by category..."
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minBudget"
          placeholder="Min Budget"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="maxBudget"
          placeholder="Max Budget"
          onChange={handleFilterChange}
        />
        <button onClick={handleSearch}>Search</button>
      </section>

      <section className="map-section">
        {jobs.length > 0 && <JobMap jobs={jobs} onMarkerClick={(job) => console.log(job)} />}
      </section>

      <section className="jobs-list">
        <h2>Available Jobs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : jobs.length > 0 ? (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p>No jobs found. Try adjusting your filters.</p>
        )}
      </section>
    </div>
  );
};

export default Home;