import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, Typography, Pagination, Box, Chip } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from "react-router-dom";
import AppContext from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import QuestionDetail from "../pages/QuestionDetail";


const AllQuestionsCard = () => {
    const { allquestions, searchResults, pagination, loading, error } = useContext(AppContext);
    const [page, setPage] = useState(1);

    useEffect(() => {
        allquestions(page, 10); // Fetch 10 questions per page
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (loading && !searchResults) {
        return <Typography variant="body2" color="textSecondary">Loading...</Typography>;
    }   
    if (error) {
        return <Typography variant="body2" color="error">{error}</Typography>;
    }   

    return (
        <Box>
            {searchResults && searchResults.map((question) => (
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
            
            {pagination && pagination.pages > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination 
                        count={pagination.pages} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary" 
                    />
                </Box>
            )}
        </Box>
    );
};

export default AllQuestionsCard;
