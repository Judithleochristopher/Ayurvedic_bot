import { useState, useEffect } from "react";
import { getQuizStart, postQuizAnswer } from "../api";
import "../fullscreen.css";

export default function Quiz({ onQuit }) {
  const [question, setQuestion] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function start() {
      const data = await getQuizStart();
      setQuestion(data.question);
      setTotalQuestions(data.total_questions);
    }
    start();
  }, []);

  async function handleAnswer(selectedOption) {
    const response = await postQuizAnswer({
      question_id: question.id,
      selected_option: selectedOption,
    });
    setLastAnswerCorrect(response.correct);
    setShowExplanation(true);
    if (response.correct) setScore((s) => s + 1);

    if (response.next_question) {
      setTimeout(() => {
        setQuestion(response.next_question);
        setShowExplanation(false);
        setLastAnswerCorrect(null);
      }, 3000);
    } else {
      setTimeout(() => {
        setCompleted(true);
      }, 3000);
    }
  }

  if (!question) {
    return (
      <div className="modern-quiz">
        <div className="quiz-header">
          <h2>🧠 Ayurvedic Knowledge Quiz</h2>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: '0%' }}></div>
          </div>
        </div>
        <div className="quiz-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading quiz questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <div className="modern-quiz">
        <div className="quiz-header">
          <h2>🎉 Quiz Completed!</h2>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="quiz-content">
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#3d8767', fontSize: '28px', margin: '20px 0' }}>
              Your Score: {score}/{totalQuestions} ({percentage}%)
            </h3>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
              {percentage >= 80 ? '🌟 Excellent knowledge of Ayurveda!' :
               percentage >= 60 ? '👍 Good understanding!' :
               '📚 Keep learning about Ayurveda!'}
            </p>
          </div>
        </div>
        <div className="quiz-controls">
          <div></div>
          <button className="quiz-btn" onClick={() => {
            console.log('Back to Chat clicked');
            onQuit();
          }}>Back to Chat</button>
        </div>
      </div>
    );
  }

  const progress = ((question.id - 1) / totalQuestions) * 100;

  return (
    <div className="modern-quiz">
      <div className="quiz-header">
        <h2>🧠 Ayurvedic Knowledge Quiz</h2>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          Question {question.id} of {totalQuestions}
        </p>
      </div>
      
      <div className="quiz-content">
        <div className="quiz-question">{question.question}</div>
        
        <div className="quiz-options">
          {question.options.map((opt) => (
            <button 
              key={opt} 
              className="quiz-option" 
              onClick={() => handleAnswer(opt)} 
              disabled={showExplanation}
            >
              {opt}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className={`quiz-explanation ${lastAnswerCorrect ? 'correct' : 'incorrect'}`}>
            <strong>{lastAnswerCorrect ? '✅ Correct!' : '❌ Incorrect.'}</strong>
            <br />{question.explanation}
          </div>
        )}
      </div>
      
      <div className="quiz-controls">
        <div className="quiz-score">Score: {score}/{totalQuestions}</div>
        <button className="quiz-btn secondary" onClick={() => {
          console.log('Exit Quiz clicked');
          onQuit();
        }}>Exit Quiz</button>
      </div>
    </div>
  );
}
