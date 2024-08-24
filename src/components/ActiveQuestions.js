import React, { useEffect, useState } from 'react';
import { request } from '../api';

const ActiveQuestions = ({ minTimeLeftForActiveQues }) => {
    const [activeQuestions, setActiveQuestions] = useState([]);
    const [selectedValues, setSelectedValues] = useState({
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
    });
    const [shouldFetch, setShouldFetch] = useState(true); // Flag to control fetching

    const handleOptionChange = (name, value) => {
        setSelectedValues(prevValues => {
            const updatedValues = { ...prevValues };
            Object.keys(updatedValues).forEach(key => {
                if (updatedValues[key] === value) {
                    updatedValues[key] = ''; // Reset the previous selection
                }
            });
            updatedValues[name] = value;
            return updatedValues;
        });
    };

    const fetchActiveQuestions = async () => {
        try {
            const response = await request("GET", "/api/question/y", {});
            setActiveQuestions(response.data);
            if (response.data.length > 0) {
                setShouldFetch(false); // Stop fetching when there are active questions
            } else {
                setShouldFetch(true);
            }
        } catch (error) {
            console.error('Error fetching active questions:', error);
        }
    };

    const handleSubmit = async (event, questionId, isAutoSubmit = false) => {
        event.preventDefault();
        let formData;

        if (isAutoSubmit) {
            const formElement = document.getElementById(`form-${questionId}`);
            formData = new FormData(formElement);
        } else {
            formData = new FormData(event.target);
        }

        const answers = {
            optionA: formData.get('optionA'),
            optionB: formData.get('optionB'),
            optionC: formData.get('optionC'),
            optionD: formData.get('optionD'),
            time: formData.get('time'),
        };

        if (!isAutoSubmit && (!answers.optionA || !answers.optionB || !answers.optionC || !answers.optionD)) {
            alert('Please select answers before submission.');
            return;
        }

        if (formData.get('submitAllowed') === "yes") {
            try {
                await request("POST", `/api/answer/${questionId}`, answers);
                alert('Answer submitted!');
                setSelectedValues({ // Reset selected options
                    optionA: '',
                    optionB: '',
                    optionC: '',
                    optionD: '',
                });
            } catch (error) {
                // Check if the error response contains the backend message
                if (error.response && error.response.data) {
                    alert(error.response.data); // Display the backend response message
                } else {
                    alert('Error submitting answer!'); // Fallback error message
                }
            } finally {
                fetchActiveQuestions(); // Refresh active questions
            }
        } else {
            fetchActiveQuestions(); // Refresh active questions
        }
    };

    useEffect(() => {
        let fetchInterval;
        const timeUpdateInterval = setInterval(() => {
            setActiveQuestions(prevQuestions => {
                const updatedQuestions = prevQuestions.map(q => ({
                    ...q,
                    timeLeft: q.timeLeft > 0 ? q.timeLeft - 1 : 0
                }));
                return updatedQuestions;
            });
        }, 1000); // Update time every second

        if (shouldFetch) {
            fetchInterval = setInterval(fetchActiveQuestions, 1000); // Fetch every second
        }

        return () => {
            if (fetchInterval) clearInterval(fetchInterval);
            clearInterval(timeUpdateInterval);
        };
    }, [shouldFetch]);

    useEffect(() => {
        activeQuestions.forEach((question) => {
            if (question.timeLeft === 0) {
                handleSubmit(new Event('submit'), question.questionId, true); // Auto submit when time left is 0
                question.timeLeft = 90;
            }
        });
    }, [activeQuestions]);

    const ordinalWords = ['First', 'Second', 'Third', 'Fourth'];

    return (
        <div>
            <h2>Active Question:</h2>
            {activeQuestions.length > 0 ? (
                activeQuestions.map((item, index) => {
                    const options = [
                        { label: 'A', value: item.optA, name: 'optionA' },
                        { label: 'B', value: item.optB, name: 'optionB' },
                        { label: 'C', value: item.optC, name: 'optionC' },
                        { label: 'D', value: item.optD, name: 'optionD' }
                    ];

                    return (
                        <div className="question-box" key={index}>
                            <h3>Question:</h3>
                            <div className="progress-container">
                                <div 
                                    className="progress-bar" 
                                    style={{ width: `${(item.timeLeft / 90) * 60}%` }}
                                ></div>
                                <span className="time-left">{item.timeLeft} seconds Left</span>
                            </div><br />
                            <p>{item.ques}</p>
                            {item.answerDto ? (
                                <div>
	                            <h3>Your Answer:</h3>
                                    <p>
                                        1: {item.answerDto.ans1 || 'No Data'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        2: {item.answerDto.ans2 || 'No Data'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        3: {item.answerDto.ans3 || 'No Data'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        4: {item.answerDto.ans4 || 'No Data'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </p>
                                    <form id={`form-${item.questionId}`}>
                                        <input type="hidden" name="questionId" value={item.questionId} />
                                        <input type="hidden" name="submitAllowed" value="no" />
                                        <input type="hidden" name="time" value={item.timeLeft} />
                                        <input type="hidden" name="optionA" value={item.answerDto.ans1 || '\0'} />
                                        <input type="hidden" name="optionB" value={item.answerDto.ans2 || '\0'} />
                                        <input type="hidden" name="optionC" value={item.answerDto.ans3 || '\0'} />
                                        <input type="hidden" name="optionD" value={item.answerDto.ans4 || '\0'} />
                                    </form>
                                </div>
                            ) : (
                            <form id={`form-${item.questionId}`} onSubmit={(e) => handleSubmit(e, item.questionId)}>
                                <input type="hidden" name="questionId" value={item.questionId} />
                                <input type="hidden" name="submitAllowed" value="yes" />
                                <input type="hidden" name="time" value={item.timeLeft} />
                                {options.map((opt, optIndex) => (
                                    <div key={optIndex}>
                                        <p>{opt.label}) {opt.value}<br />
                                            {[1, 2, 3, 4].map((num) => (
                                                <label key={num} className="l-radio">
                                                    <input
                                                        type="radio"
                                                        name={opt.name}
                                                        value={num}
                                                        required
                                                        checked={selectedValues[opt.name] === `${num}`}
                                                        onChange={() => handleOptionChange(opt.name, `${num}`)}
                                                    />
                                                    <span>{ordinalWords[num - 1]}</span>
                                                </label>
                                            ))}
                                        </p>
                                    </div>
                                ))}
                                <button type="submit">Submit</button>
                            </form>
                            )}
                        </div>
                    );
                })
            ) : (
                <p>
                    Currently, there is no active question.<br />
                    {minTimeLeftForActiveQues !== null && minTimeLeftForActiveQues != `Infinity` && `One will be appearing in ${minTimeLeftForActiveQues} seconds.`}
                </p>
            )}
        </div>
    );
};

export default ActiveQuestions;
