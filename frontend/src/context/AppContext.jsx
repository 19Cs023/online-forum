import { createContext, useState, useEffect, } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AppContext = createContext();
export const AppProvider = ({ children }) => {
    const [isSearched, setIsSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [question, setQuestion] = useState(null);
    const [comments, setComments] = useState([]);

    const search = async (query) => {
        setIsSearched(true);
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
            setSearchResults(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while searching');
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const questionDetails = async (questionId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/questions/${questionId}`);
            setQuestion(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching question details');
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const answerDetails = async (answerId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/answers/${answerId}`);
            setAnswer(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching answer details');
            toast.error(error);
        } finally {
            setLoading(false);
        }   
    };

    const commentDetails = async (answerId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/comments/answer/${answerId}`);
            setComments(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching comments');
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };
    

    const allquestions = async (page, limit) => {
        setLoading(true);
        setError(null); 
        try {
            const response = await axios.get(`/api/questions?page=${page}&limit=${limit}`);
            setSearchResults(response.data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching questions');
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const allanswers = async (page, limit) => {
        setLoading(true);
        setError(null);
        try {   
            const response = await axios.get(`/api/answers?page=${page}&limit=${limit}`);
            setSearchResults(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching answers');
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };
    


    const addcomment = async (answerId, commentData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`/api/comments/answer/${answerId}`, commentData);
            setComments(prevComments => [...prevComments, response.data]);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while adding comment');
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addanswer = async (questionId, answerData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`/api/answers`, { ...answerData, question_id: questionId });
            setAnswer(response.data);
        } catch (err) { 
            setError(err.response?.data?.error || 'An error occurred while adding answer');
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    const addcommentToAnswer = async (answerId, commentData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`/api/comments/answer/${answerId}`, commentData);
            setComments(prevComments => [...prevComments, response.data]);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while adding comment');
            toast.error(error);
        } finally {
            setLoading(false);
        }   
    };
    
    useEffect(() => {
        allquestions(1, 10);
        allanswers(1, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const contextValue = {
        isSearched,
        searchResults,
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
        addcomment,
        addanswer,
        addcommentToAnswer,
        setIsSearched
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContext;