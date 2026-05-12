import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserAccount.css';

const UserAccount = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        navigate('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);

        // Fetch fresh user data if needed
        // const config = {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // };
        // const userResponse = await axios.get(`http://localhost:5000/api/users/${parsedUser._id}`, config);
        // setUser(userResponse.data);

      } catch (err) {
        console.error('Error fetching account data:', err);
        setError('Failed to load user account info.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) return <div className="account-center">Loading account details...</div>;
  if (error) return <div className="account-center error">{error}</div>;
  if (!user) return <div className="account-center">User not found</div>;

  return (
    <div className="account-container">
      <div className="account-header">
        <div className="account-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="account-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="account-content">
        <h3>Welcome to your Dashboard</h3>
        <p>This is your MERN skeleton account page. You can customize this component to add more features.</p>
      </div>
    </div>
  );
};

export default UserAccount;
