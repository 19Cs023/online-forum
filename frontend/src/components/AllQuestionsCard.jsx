import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, Typography, Pagination, Box } from "@mui/material";
import { Link } from "react-router-dom";
import AppContext from '../context/AppContext';

const AllQuestionsCard = () => {
    const { allquestions, searchResults, pagination, loading, error } = useContext(AppContext);
    const [page, setPage] = useState(1);

    useEffect(() => {
        allquestions(page, 10); // Fetch 10 questions per page
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (loading) {
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
                        <Typography variant="h6" component={Link} to={`/questions/${question._id}`} sx={{ textDecoration: 'none', color: 'primary.main' }}>  
                            {question.question || question.title || "Untitled Question"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
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
