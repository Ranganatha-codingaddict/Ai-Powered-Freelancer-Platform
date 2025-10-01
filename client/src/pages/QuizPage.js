import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const QuizPage = () => {
    const { userId } = useParams(); // Get userId from URL
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch the quiz
    const fetchQuiz = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/users/${userId}/quiz`);
            setQuiz(response.data);
            setAnswers(new Array(response.data.questions.length).fill(-1)); // Initialize answers
        } catch (err) {
            setError('Failed to load quiz.');
            console.error('Error fetching quiz:', err);
        }
    };

    // Handle answer selection
    const handleAnswerChange = (questionIndex, optionIndex) => {
        const updatedAnswers = [...answers];
        updatedAnswers[questionIndex] = optionIndex;
        setAnswers(updatedAnswers);
    };

    // Submit the quiz
    const handleSubmit = async () => {
        setError('');
        setResult(null);
    
        try {
            const response = await axios.post(`http://localhost:8081/api/users/quiz/${userId}`, {
                quiz: JSON.stringify(quiz),
                answers: answers.join(','),
            });
    
            console.log("Quiz submission response:", response.data); // Debugging log
            setResult(response.data.result);
    
            // Ensure correct truthy check
            if (response.data.result === true) {
                navigate(`/signup?role=freelancer&userId=${userId}`);
            } else {
                setError('You did not pass the quiz. Please try again.');
            }
        } catch (err) {
            setError('Failed to submit quiz.');
            console.error('Error submitting quiz:', err);
        }
    };
    
    // Load quiz on component mount
    useEffect(() => {
        fetchQuiz();
    }, []);

    if (!quiz) {
        return <div>Loading quiz...</div>;
    }

    return (
        <div>
            <h2>Quiz</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {result !== null && (
                <p>{result ? 'Quiz passed! Redirecting to registration...' : 'Quiz failed. Try again.'}</p>
            )}
            {quiz.questions.map((question, qIndex) => (
                <div key={qIndex}>
                    <p>{question.question}</p>
                    {question.options.map((option, oIndex) => (
                        <div key={oIndex}>
                            <input
                                type="radio"
                                name={`question-${qIndex}`}
                                checked={answers[qIndex] === oIndex}
                                onChange={() => handleAnswerChange(qIndex, oIndex)}
                            />
                            <label>{option}</label>
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit Quiz</button>
        </div>
    );
};

export default QuizPage;