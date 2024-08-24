import React, { useState } from 'react';
import PendingQuestions from './PendingQuestions';
import ActiveQuestions from './ActiveQuestions';
import CompletedQuestions from './CompletedQuestions';
import '../css/Question.css'

const Question = () => {

    const [minTimeLeftForActiveQues, setMinTimeLeftForActiveQues] = useState(null);

    const updateMinTimeLeft = (timeLeft) => {
        setMinTimeLeftForActiveQues(timeLeft);
    };

    return (
        <div>
            <PendingQuestions updateMinTimeLeft={updateMinTimeLeft} />
            <ActiveQuestions minTimeLeftForActiveQues={minTimeLeftForActiveQues} />
            <CompletedQuestions />
        </div>
    );
};

export default Question;
