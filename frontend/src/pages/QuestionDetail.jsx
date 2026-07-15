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
  CircularProgress,
  Button
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import IconButton from "@mui/material/IconButton";
import AppContext from '../context/AppContext';
import Sidebar from '../layout/sidebar';
import Comments from '../components/Comments';
import AddAnswer from '../components/AddAnswer';


const QuestionDetail = () => {
  const { id } = useParams();
  const { questionDetails, question, loading, error, url } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const [showAddAnswer, setShowAddAnswer] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const answersPerPage = 5;

  useEffect(() => {
    if (id) {
      questionDetails(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Keep local bookmark state in sync with whatever the backend says,
  // but only on the initial load of a given question — NOT on every
  // refetch (e.g. the one triggered by liking an answer), otherwise
  // an unrelated action would stomp the user's just-clicked bookmark.
  const bookmarkInitialized = React.useRef(null);
  useEffect(() => {
    if (question && bookmarkInitialized.current !== id) {
      setBookmarked(Boolean(question.isBookmarked || question.bookmarked));
      bookmarkInitialized.current = id;
    }
  }, [question, id]);

  const handleBookmark = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to bookmark a question.');
      return;
    }
    if (bookmarkLoading) return; // guard against double-clicks

    const apiURL = url || 'http://localhost:5000';
    const wasBookmarked = bookmarked;

    setBookmarkLoading(true);
    try {
      const response = await fetch(`${apiURL}/api/questions/${id}/bookmark`, {
        // Backend only registers PUT for this route, and
        // updateBookmarkStatus expects the target state explicitly.
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookmarked: !wasBookmarked
        })
      });

      if (!response.ok) {
        let bodyText = '';
        try { bodyText = await response.text(); } catch {throw new Error(`Request failed with status ${response.status}`);}
        throw new Error(`Request failed with status ${response.status}: ${bodyText}`);
      }

      // If the API returns the new state, trust that over our guess.
      let nextState = !wasBookmarked;
      try {
        const data = await response.json();
        if (typeof data?.bookmarked === 'boolean') {
          nextState = data.bookmarked;
        }
      } catch {
        // No JSON body — fall back to the optimistic toggle above.
      }

      setBookmarked(nextState);
    } catch (err) {
      console.error(err);
      alert('Something went wrong updating your bookmark. Please try again.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) {
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

  if (!question) {
    return null;
  }

  // Handle both possible backend structures for safety
  const answers = question.answers || [];
  
  // Local pagination logic for answers
  const totalPages = Math.ceil(answers.length / answersPerPage);
  const currentAnswers = answers.slice((page - 1) * answersPerPage, page * answersPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleAddAnswer = async (answerData) => {
    try {
      const token = localStorage.getItem('token');
      const apiURL = url || 'http://localhost:5000';
      const response = await fetch(`${apiURL}/api/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tittle: answerData.title,
          content: answerData.content,
          topic: answerData.category,
          question_id: id // Ensure the answer is attached to this question
        })
      });

      if (response.ok) {
        setShowAddAnswer(false);
        questionDetails(id); // reload the question so the new answer appears
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (answerId, currentLikes) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to like an answer.');
        return;
      }
      const apiURL = url || 'http://localhost:5000';
      const response = await fetch(`${apiURL}/api/answers/${answerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          likes: (currentLikes || 0) + 1
        })
      });

      if (response.ok) {
        questionDetails(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center' }}>
        <Container maxWidth="lg">
          
          {/* Question Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {question.question || question.title || 'Question Title'}
            </Typography>

            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              <IconButton
                onClick={handleBookmark}
                color={bookmarked ? "primary" : "default"}
                aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                disabled={bookmarkLoading}
              >
                {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {bookmarkLoading ? 'Updating…' : (bookmarked ? 'Bookmarked' : 'Not Bookmarked')}
              </Typography>
            </Stack>

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

            <Typography 
              variant="body1" 
              component="div"
              sx={{ mt: 2, mb: 2, whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: question.content || question.description || question.body || 'Question description...' }}
            />
            <Divider />
          </Box>

          {/* Answers Section */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => setShowAddAnswer(!showAddAnswer)}>
                {showAddAnswer ? "Cancel" : "Post Answer"}
              </Button>
            </Box>
            
            {showAddAnswer && (
              <Box sx={{ mb: 4 }}>
                <AddAnswer onAddNote={handleAddAnswer} />
              </Box>
            )}
            
            <Stack spacing={2} sx={{ mt: 2 }}>
              {currentAnswers.length > 0 ? (
                currentAnswers.map((ans, idx) => (
                  <Card key={ans._id || idx} variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Stack direction="row" spacing={3}>
                        {/* Vote Section */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }}>
                          <ThumbUpIcon 
                             onClick={() => handleLike(ans._id, ans.likes)}
                             sx={{ color: 'text.secondary', mb: 1, cursor: 'pointer', '&:hover': { color: 'primary.main' } }} 
                          />
                          <Typography variant="h6" color="text.secondary">
                            {ans.likes || 0}
                          </Typography>
                        </Box>
                        
                        {/* Answer Content */}
                        <Box sx={{ width: '100%' }}>
                           {(ans.tittle || ans.title) && (
                             <Typography variant="h6" fontWeight="bold" gutterBottom>
                               {ans.tittle || ans.title}
                             </Typography>
                           )}
                           {(ans.topic || ans.category) && (
                             <Chip 
                               label={ans.topic || ans.category} 
                               variant="outlined" 
                               size="small" 
                               sx={{ mb: 2, color: 'primary.main', borderColor: 'primary.main' }} 
                             />
                           )}
                           {ans.created_at && (
                             <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                               Answered on {new Date(ans.date).toLocaleDateString()}
                             </Typography>
                           )}
                           <Typography 
                             variant="body1" 
                             component="div"
                             sx={{ whiteSpace: 'pre-line', mb: 2 }}
                             dangerouslySetInnerHTML={{ __html: ans.body || ans.content }}
                           />
                           
                           <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2, gap: 1 }}>
                             {(ans.userId?.profilepicture || ans.recorded_by?.profilepicture) ? (
                               <Box
                                 component="img"
                                 src={`http://localhost:5000/${(ans.userId?.profilepicture || ans.recorded_by?.profilepicture || '').replace(/\\/g, '/')}`}
                                 alt={ans.userId?.username || ans.recorded_by?.name || 'User'}
                                 sx={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                               />
                             ) : (
                               <Box sx={{ 
                                 width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', 
                                 color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                 fontSize: '0.75rem', fontWeight: 'bold' 
                               }}>
                                 {(ans.userId?.username || ans.author || ans.recorded_by?.name || 'U').charAt(0).toUpperCase()}
                               </Box>
                             )}
                             <Typography variant="caption" color="text.secondary">
                               Answered by {ans.userId?.username || ans.author || ans.recorded_by?.name || 'User'}
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