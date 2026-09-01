import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobsProvider } from './context/JobsContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import Bookings from './pages/Bookings';
import Messages from './pages/Messages';
import HandypersonProfile from './pages/HandypersonProfile';
import Earnings from './pages/Earnings';
import NotFound from './pages/NotFound';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <JobsProvider>
        <Router>
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/handypeople/:id" element={<HandypersonProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </Router>
      </JobsProvider>
    </AuthProvider>
  );
}

export default App;