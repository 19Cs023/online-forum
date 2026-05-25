import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box, Typography, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogContent } from '@mui/material';
import AppContext from '../context/AppContext';
import AddQuestion from './AddQuestions';
import AddAnswer from './AddAnswer';

const UserAccount = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null); // the item object
  const [editType, setEditType] = useState(''); // 'question' or 'answer'

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/signin');
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);

      const host = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';

      // Fetch fresh user data to get photo
      try {
        const uRes = await fetch(`${host}/api/users/${parsedUser._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (uRes.ok) {
          const uData = await uRes.json();
          setUser(uData);
        }
      } catch (e) {
        console.error("Failed to fetch full user info", e);
      }
      // Fetch User's Questions
      const qRes = await fetch(`${host}/api/questions/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (qRes.ok) {
        const qData = await qRes.json();
        setQuestions(qData.data || qData || []);
      }

      // Fetch User's Answers
      const aRes = await fetch(`${host}/api/answers/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (aRes.ok) {
        const aData = await aRes.json();
        setAnswers(aData || []);
      }

    } catch (err) {
      console.error('Error fetching account data:', err);
      setError('Failed to load user account info.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    const token = localStorage.getItem('token');
    const host = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${host}/api/questions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setQuestions(questions.filter(q => q._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnswer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this answer?')) return;
    const token = localStorage.getItem('token');
    const host = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${host}/api/answers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAnswers(answers.filter(a => a._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (item, type) => {
    setEditItem(item);
    setEditType(type);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    const token = localStorage.getItem('token');
    const host = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      if (editType === 'question') {
        const body = {
          question: updatedData.question || updatedData.title,
          topic: updatedData.topic || updatedData.category,
          content: updatedData.content
        };
        const res = await fetch(`${host}/api/questions/${editItem._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          const updated = await res.json();
          setQuestions(questions.map(q => q._id === editItem._id ? { ...q, ...updated } : q));
        }
      } else if (editType === 'answer') {
        const body = {
          tittle: updatedData.title || updatedData.tittle,
          topic: updatedData.topic || updatedData.category,
          content: updatedData.content
        };
        const res = await fetch(`${host}/api/answers/${editItem._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          const updated = await res.json();
          setAnswers(answers.map(a => a._id === editItem._id ? { ...a, ...updated } : a));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditModalOpen(false);
      setEditItem(null);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={5}>{error}</Typography>;
  if (!user) return <Typography align="center" mt={5}>User not found</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, bgcolor: '#f5f5f5', p: 3, borderRadius: 2 }}>
        {user.profilepicture ? (
          <Box
            component="img"
            src={`http://localhost:5000/${user.profilepicture.replace(/\\/g, '/')}`}
            alt={user.name}
            sx={{
              width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', mr: 3
            }}
          />
        ) : (
          <Box sx={{
            width: 80, height: 80, borderRadius: '50%', bgcolor: 'primary.main',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 'bold', mr: 3
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Box>
        )}
        <Box>
          <Typography variant="h4">{user.name}</Typography>
          <Typography variant="body1" color="text.secondary">{user.email}</Typography>
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} centered sx={{ mb: 3 }}>
        <Tab label={`My Questions (${questions.length})`} />
        <Tab label={`My Answers (${answers.length})`} />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          {questions.length === 0 ? (
            <Typography align="center" color="text.secondary">No questions created yet.</Typography>
          ) : (
            questions.map(q => (
              <Card key={q._id} sx={{ mb: 2, borderBottom: q.isresolved ? '4px solid #4caf50' : 'none' }}>
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="h6" onClick={() => navigate(`/questions/${q._id}`)} sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                    {q.question}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Topic: {q.topic} • Created: {new Date(q.createdAt).toLocaleDateString()}
                    {q.isresolved && <Typography component="span" sx={{ color: '#4caf50', ml: 1, fontWeight: 'bold' }}>✓ Resolved</Typography>}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button size="small" onClick={() => handleEditClick(q, 'question')}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteQuestion(q._id)}>Delete</Button>
                </CardActions>
              </Card>
            ))
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          {answers.length === 0 ? (
            <Typography align="center" color="text.secondary">No answers created yet.</Typography>
          ) : (
            answers.map(a => (
              <Card key={a._id} sx={{ mb: 2 }}>
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="h6" onClick={() => a.question_id && navigate(`/questions/${a.question_id._id || a.question_id}`)} sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                    {a.tittle || 'Answer Title'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Topic: {a.topic} • Likes: {a.likes || 0} • Created: {new Date(a.createdAt).toLocaleDateString()}</Typography>
                  <Box sx={{ mt: 1, maxHeight: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Typography variant="body2" color="text.secondary" component="div" dangerouslySetInnerHTML={{ __html: a.content }} />
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button size="small" onClick={() => handleEditClick(a, 'answer')}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteAnswer(a._id)}>Delete</Button>
                </CardActions>
              </Card>
            ))
          )}
        </Box>
      )}

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 0 }}>
          {editType === 'question' ? (
            <AddQuestion 
              initialData={editItem} 
              onAddNote={handleSaveEdit} 
              onCancel={() => setEditModalOpen(false)} 
            />
          ) : (
            <AddAnswer 
              initialData={editItem} 
              onAddNote={handleSaveEdit} 
              onCancel={() => setEditModalOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserAccount;