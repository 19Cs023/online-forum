import { useState, useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';

const AddAnswer = ({ onAddNote, userId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  
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
            ['link', 'image', 'code-block'],
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

  // Used if no onAddNote is passed
  const postNote = async (note) => {
    try {
      const targetUserId = userId || '000000000000000000000000';
      const response = await fetch(`/api/answers/user/${targetUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
      onAddNote({ title, content, category });
    } else {
      await postNote({ title, content, category });
    }

    setTitle('');
    setContent('');
    setCategory('General');
    if (quillRef.current) {
      quillRef.current.setText('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black' }}>
        Create a New Note
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
        <Box sx={{ '.ql-editor': { minHeight: '150px' } }}>
          <div ref={editorRef} />
        </Box>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          size="large"
          sx={{ mt: 1, alignSelf: 'flex-start' }}
        >
          Save Note
        </Button>
      </Box>
    </Paper>
  );
};

export default AddAnswer;