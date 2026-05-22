import { createContext, useState, useEffect, } from 'react';
import axios from 'axios';

const AppContext = createContext();
export const AppProvider = ({ children }) => {
    const [isSearched, setIsSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [question, setQuestion] = useState(null);
    const [comments, setComments] = useState([]);
    const [pagination, setPagination] = useState(null);
    const url = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';

    const search = async (query) => {
        setIsSearched(true);
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${url}/api/questions/search?q=${encodeURIComponent(query)}`);
            setSearchResults(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while searching');
            
        } finally {
            setLoading(false);
        }
    };

    const questionDetails = async (questionId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${url}/api/questions/${questionId}`);
            setQuestion(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching question details');
            
        } finally {
            setLoading(false);
        }
    };

    const answerDetails = async (answerId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${url}/api/answers/${answerId}`);
            setAnswer(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching answer details');
            
        } finally {
            setLoading(false);
        }   
    };

    const commentDetails = async (answerId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${url}/api/comments/answer/${answerId}`);
            setComments(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching comments');
            
        } finally {
            setLoading(false);
        }
    };
    

    const allquestions = async (page = 1, limit = 10) => {
        setLoading(true);
        setError(null); 
        try {
            const response = await axios.get(`${url}/api/questions?page=${page}&limit=${limit}`);
            setSearchResults(response.data.data);
            setPagination(response.data.pagination);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching questions');
            
        } finally {
            setLoading(false);
        }
    };

    const allanswers = async (page, limit) => {
        setLoading(true);
        setError(null);
        try {   
            const response = await axios.get(`${url}/api/answers?page=${page}&limit=${limit}`);
            setSearchResults(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching answers');
            
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        // allquestions(1, 10); // fetched locally by AllQuestionsCard now
       
    }, []);

    const contextValue = {
        url,
        isSearched,
        searchResults,
        pagination,
        loading,
        error,
        answer,
        question,
        comments,
        search,
        questionDetails,
        answerDetails,
        commentDetails,
        allquestions,
        allanswers,
        setIsSearched
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContext;
