import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Stack, 
  Divider, 
  Pagination, 
  CircularProgress 
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AppContext from '../context/AppContext';
import Sidebar from '../layout/sidebar';
import Comments from '../components/Comments';

const QuestionDetail = () => {
  const { id } = useParams();
  const { questionDetails, question, loading, error } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const answersPerPage = 5;

  useEffect(() => {
    if (id) {
      questionDetails(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !question) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
     return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Sidebar />
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        </Box>
     );
  }

  // Handle both possible backend structures for safety
  const answers = question.answers || [];
  
  // Local pagination logic for answers
  const totalPages = Math.ceil(answers.length / answersPerPage);
  const currentAnswers = answers.slice((page - 1) * answersPerPage, page * answersPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center' }}>
        <Container maxWidth="lg">
          
          {/* Question Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {question.title || 'Question Title'}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              {question.tags && question.tags.map((tag, idx) => (
                <Chip 
                  key={idx} 
                  label={tag} 
                  variant="outlined" 
                  size="small" 
                  sx={{ mr: 1, mb: 1, color: 'primary.main', borderColor: 'primary.main' }} 
                />
              ))}
            </Box>

            <Typography variant="body1" sx={{ mt: 2, mb: 2, whiteSpace: 'pre-wrap' }}>
              {question.description || question.body || 'Question description...'}
            </Typography>
            <Divider />
          </Box>

          {/* Answers Section */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </Typography>
            
            <Stack spacing={2} sx={{ mt: 2 }}>
              {currentAnswers.length > 0 ? (
                currentAnswers.map((ans, idx) => (
                  <Card key={ans._id || idx} variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Stack direction="row" spacing={3}>
                        {/* Vote Section */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }}>
                          <ThumbUpIcon sx={{ color: 'text.secondary', mb: 1, cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
                          <Typography variant="h6" color="text.secondary">
                            {ans.likes || 0}
                          </Typography>
                        </Box>
                        
                        {/* Answer Content */}
                        <Box sx={{ width: '100%' }}>
                           <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                             {ans.body || ans.content}
                           </Typography>
                           
                           <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
                             <Typography variant="caption" color="text.secondary">
                               Answered by {ans.userId?.username || ans.author || 'User'}
                             </Typography>
                           </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No answers yet. Be the first to answer!
                </Typography>
              )}
            </Stack>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="large"
                />
              </Box>
            )}
          </Box>

          {/* Comments Section */}
          <Box sx={{ mt: 6, mb: 4 }}>
            <Divider sx={{ mb: 4 }} />
            <Comments questionId={id} />
          </Box>

        </Container>
      </Box>
    </Box>
  );
};

export default QuestionDetail;
