import React, { useEffect, useState } from 'react';
import { request } from '../api';

const PendingQuestions = ({updateMinTimeLeft}) => {
    const [shouldFetchPending, setShouldFetchPending] = useState(true);
    const [pendingQuestions, setPendingQuestions] = useState([]);

    useEffect(() => {
        const fetchPendingQuestions = async () => {
            try {
                const response = await request("GET", "/api/question/p", {});
                setPendingQuestions(response.data);
                if (response.data.length > 0) {
                    setShouldFetchPending(false); // Stop refreshing every 10 seconds if there are pending questions
                } else {
                    setShouldFetchPending(true); // Keep refreshing every 10 seconds if there are no pending questions
                }
            } catch (error) {
                console.error('Error fetching pending questions:', error);
            }
        };

        fetchPendingQuestions();

        const pendingInterval = setInterval(() => {
            if (shouldFetchPending) {
                fetchPendingQuestions();
            }
        }, 10000); // Refresh every 10 seconds if needed

        const updateTime = () => {
            setPendingQuestions(prevQuestions => {
                const updatedQuestions = prevQuestions.map(q => ({
                    ...q,
                    timeLeft: q.timeLeft > 0 ? q.timeLeft - 1 : 0
                }));

                const newMinTimeLeft = Math.min(...updatedQuestions.map(item => item.timeLeft));
                updateMinTimeLeft(newMinTimeLeft);
                
                if (updatedQuestions.some(q => q.timeLeft === 0)) {
                    setShouldFetchPending(true); // Trigger refresh if any timeLeft is 0
                }

                return updatedQuestions;
            });
        };

        const timeUpdateInterval = setInterval(updateTime, 1000); // Update every second

        return () => {
            clearInterval(pendingInterval);
            clearInterval(timeUpdateInterval);
        };
    }, [shouldFetchPending]);

    return (
        <div>
            {pendingQuestions.length > 0 && (
                <div>
                    <h2>Next Question:</h2>
                    <ul className="question-list">
                        {pendingQuestions.map((item, index) => (
                            <li key={index} className="question-box">
                                <h3>Question:</h3>
                                <p>{item.ques}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PendingQuestions;
