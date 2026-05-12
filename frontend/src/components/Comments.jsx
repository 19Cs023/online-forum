import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './Comments.css';

const fetchComments = async () => {
  const { data } = await axios.get('http://localhost:5000/api/comments');
  return data;
};

const Comments = () => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState({ title: '', content: '' });

  const { 
    data: comments = [], 
    isLoading: isFetching, 
    error: fetchError 
  } = useQuery({
    queryKey: ['comments'],
    queryFn: fetchComments,
  });

  const mutation = useMutation({
    mutationFn: async (commentData) => {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      return await axios.post('http://localhost:5000/api/comments', commentData, config);
    },
    onSuccess: () => {
      setNewComment({ title: '', content: '' });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    }
  });

  const handleChange = (e) => {
    setNewComment({ ...newComment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(newComment);
  };

  if (isFetching) return <div className="comments-section">Loading comments...</div>;

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      {(fetchError || mutation.isError) && (
        <p className="error">
          {fetchError ? 'Failed to load comments.' : 'Failed to post comment. Ensure you are signed in.'}
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="comment-form">
        <input 
          type="text" 
          name="title" 
          placeholder="Comment Title" 
          value={newComment.title} 
          onChange={handleChange} 
          required 
        />
        <textarea 
          name="content" 
          placeholder="Write your comment..." 
          value={newComment.content} 
          onChange={handleChange} 
          required 
        />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-item">
            <h4>{comment.title}</h4>
            <p>{comment.content}</p>
            <small>
              By {comment.recorded_by?.name || 'Anonymous'} on {new Date(comment.created).toLocaleDateString()}
            </small>
          </div>
        ))}
        {comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
      </div>
    </div>
  );
};

export default Comments;
