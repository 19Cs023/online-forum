import { useState, useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Box, Button, Paper, TextField, Typography, Switch, FormControlLabel } from '@mui/material';

const AddQuestion = ({ onAddNote, initialData, onCancel }) => {
  const [title, setTitle] = useState(initialData?.question || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.topic || 'General');
  const [isresolved, setIsResolved] = useState(initialData?.isresolved || false);
  
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
          ]
        },
        placeholder: 'Write your note here...'
      });
      quillRef.current.on('text-change', () => {
        setContent(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.question || initialData.title || '');
      setContent(initialData.content || '');
      setCategory(initialData.topic || initialData.category || 'General');
      setIsResolved(initialData.isresolved || false);
      
      if (quillRef.current && initialData.content) {
        const currentHTML = quillRef.current.root.innerHTML;
        if (currentHTML !== initialData.content) {
          quillRef.current.clipboard.dangerouslyPasteHTML(initialData.content);
        }
      }
    } else {
      setTitle('');
      setContent('');
      setCategory('General');
      setIsResolved(false);
      if (quillRef.current) {
        quillRef.current.setText('');
      }
    }
  }, [initialData]);

  // Used if no onAddNote is passed
  const postNote = async (note) => {
    try {
      const token = localStorage.getItem('token');
      const url = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${url}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(note)
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      const newNote = await response.json();
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (onAddNote) {
      onAddNote({ question: title, content, topic: category, isresolved });
    } else {
      await postNote({ question: title, content, topic: category, isresolved });
    }

    setTitle('');
    setContent('');
    setCategory('General');
    setIsResolved(false);
    if (quillRef.current) {
      quillRef.current.setText('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black' }}>
        {initialData ? 'Edit Note' : 'Create a New Note'}
      </Typography>
      
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

         <TextField
          label="Category"
          variant="outlined"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={isresolved}
              onChange={(e) => setIsResolved(e.target.checked)}
              color="primary"
            />
          }
          label="Is Resolved"
        />
        <Box sx={{ '.ql-editor': { minHeight: '150px' } }}>
          <div ref={editorRef} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
          >
            {initialData ? 'Save Changes' : 'Save Note'}
          </Button>
          {onCancel && (
            <Button 
              variant="outlined" 
              color="secondary" 
              size="large"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default AddQuestion;