import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://localhost:5000/api/questions/search?q=${encodeURIComponent(query)}`);
        setQuestions(response.data.data || []);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) return <div className="search-results-center">Searching...</div>;
  if (error) return <div className="search-results-center error">{error}</div>;

  return (
    <div className="search-results-container">
      <h2>Search Results for "{query}"</h2>
      
      {questions.length === 0 ? (
        <div className="no-search-results">No questions found matching your query.</div>
      ) : (
        <div className="search-questions-list">
          {questions.map(question => (
            <div key={question._id} className="search-question-card">
              <Link to={`/questions/${question._id}`} className="search-question-title-link">
                <h4>{question.question}</h4>
              </Link>
              <span className="search-question-tag">{question.topic}</span>
              <p className="search-question-excerpt" dangerouslySetInnerHTML={{ __html: question.content }} />
              <div className="search-question-meta">
                Published: {new Date(question.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;