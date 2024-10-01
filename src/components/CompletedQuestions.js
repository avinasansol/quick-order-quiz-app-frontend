import React, { useEffect, useState } from 'react';
import { request } from '../api';

const CompletedQuestions = () => {
    const [completedQuestions, setCompletedQuestions] = useState([]);

    useEffect(() => {
        const fetchCompletedQuestions = async () => {
            try {
                const response = await request("GET", "/api/question/c", {});
                setCompletedQuestions(response.data);
            } catch (error) {
                console.error('Error fetching completed questions:', error);
            }
        };

        fetchCompletedQuestions();

        const completedInterval = setInterval(fetchCompletedQuestions, 20000); // Refresh every 20 seconds

        return () => {
            clearInterval(completedInterval);
        };
    }, []);

    return (
        <div>
            <h2>Completed Questions:</h2>
            {completedQuestions.length > 0 ? (
                <ul className="question-list">
                    {completedQuestions.map((item, index) => (
                        <li key={index} className="question-box">
                            <h3>Question #{index}:</h3>
                            <p>{item.ques}</p>
                            <p>A) {item.optA}</p>
                            <p>B) {item.optB}</p>
                            <p>C) {item.optC}</p>
                            <p>D) {item.optD}</p>
                            <h3>Correct Answer:</h3>
                            <p>
                                1: {item.correctAns1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                2: {item.correctAns2}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                3: {item.correctAns3}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                4: {item.correctAns4}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </p>
                            <h3>Your Answer:</h3>
                            {item.answerDto ? (
                                <div>
                                    <p>
                                        1: {item.answerDto.ans1 || 'No Data'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        2: {item.answerDto.ans2 || 'No Data'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        3: {item.answerDto.ans3 || 'No Data'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        4: {item.answerDto.ans4 || 'No Data'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </p>
                                    <p>Points scored: {item.answerDto.points || '0'}</p>
                                </div>
                            ) : (
                                <div>
                                    <p>Not Submitted.</p>
                                    <p>Points scored: 0</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Currently, there are no completed questions.</p>
            )}
        </div>
    );
};

export default CompletedQuestions;
