import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper, Stack } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import axios from 'axios';
import DOMPurify from 'dompurify';
import AppContext from '../context/AppContext';

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const { url } = useContext(AppContext);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`${url}/api/answers/suggestions`);
        setSuggestions(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };
    if (url) {
      fetchSuggestions();
    }
  }, [url]);

  return (
    <Box sx={{ width: 300, padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThumbUpIcon color="primary" />
          Top Answers
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List disablePadding>
          {suggestions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
              No suggestions found.
            </Typography>
          ) : suggestions.map((item, index) => (
            <React.Fragment key={item._id}>
              <ListItem alignItems="flex-start" disablePadding sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2" color="primary" sx={{ cursor: 'pointer', mb: 0.5, fontWeight: 'bold' }}>
                  {item.question_id ? item.question_id.question : (item.title || "Untitled")}
                </Typography>
                <ListItemText
                  primary={
                    <Typography
                      component="div"
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content || '') }} />
                    </Typography>
                  }
                  secondary={
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }} component="span">
                      <ThumbUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" component="span">
                        {item.likes}
                      </Typography>
                    </Stack>
                  }
                  secondaryTypographyProps={{ component: 'div' }}
                  sx={{ m: 0, width: '100%' }}
                />
              </ListItem>
              {index < suggestions.length - 1 && <Divider sx={{ mb: 2, width: '100%' }} />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Suggestions;