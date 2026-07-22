import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BookMarked = () => {
   const [bookmarked, setBookmarked] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

     // Assuming you store the user ID in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const UserId = storedUser?._id;
    
    useEffect(() => {
       const fetchBookmarkedQuestions = async () => {
           try {
               const token = localStorage.getItem('token'); // whatever key you store it under
               const response = await fetch(`/api/questions/bookmarked`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
        
        });
            if(!response.ok){
                throw new Error('Failed to fetch bookmarked questions');
            }
            const data = await response.json();
               setBookmarked(Array.isArray(data) ? data : []);
           } catch (err) {
               setError(err.message);
           } finally {
               setLoading(false);
           }
       };

       fetchBookmarkedQuestions();
    }, [UserId]);

    if (loading) {
        return <Typography variant="body2" color="textSecondary">Loading...</Typography>;
    }
    if (error) {
        return <Typography variant="body2" color="error">{error}</Typography>;
    }

    return (
        <Box>
            {bookmarked.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                    No bookmarked questions yet.
                </Typography>
            )}
            {bookmarked.map((question) => (
                <Card key={question._id} variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Link to={`/questions/${question._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography variant="h6" sx={{ textDecoration: 'none', color: 'primary.main' }}>
                                    {question.question || question.title || "Untitled Question"}
                                </Typography>
                            </Link>
                            {question.isresolved && (
                                <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Solved"
                                    color="success"
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            By {question.recorded_by?.name || "Unknown"} | Topic: {question.topic}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default BookMarked;