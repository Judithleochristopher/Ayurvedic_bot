import { useState, useEffect, useRef } from "react";
import { getAyurvedicSuggestions } from "../api";
import { searchHerb, isHerbQuery } from "../herbDatabase";
import { isLocationQuery, processLocationQuery } from "../locationService";
import Quiz from "./Quiz";
import "../fullscreen.css";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load chat history on component mount
  useEffect(() => {
    const savedChat = localStorage.getItem('ayurbot-chat-history');
    if (savedChat) {
      setChatLog(JSON.parse(savedChat));
    }
  }, []);

  // Save chat history whenever chatLog changes
  useEffect(() => {
    if (chatLog.length > 0) {
      localStorage.setItem('ayurbot-chat-history', JSON.stringify(chatLog));
    }
  }, [chatLog]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    if (!input.trim() && !uploadedFile) return;

    // If user types "start quiz", activate quiz mode
    if (input.toLowerCase() === "start quiz") {
      setQuizActive(true);
      setInput("");
      return;
    }

    const userMessage = { 
      sender: "user", 
      text: input,
      file: uploadedFile ? {
        name: uploadedFile.name,
        type: uploadedFile.type,
        size: uploadedFile.size
      } : null,
      timestamp: new Date().toISOString()
    };
    setChatLog((prev) => [...prev, userMessage]);

    let botMessage;

    // Check query type and respond accordingly
    console.log('Input:', input);
    console.log('Is location query:', isLocationQuery(input));
    
    if (isLocationQuery(input)) {
      console.log('Processing location query...');
      try {
        const locationInfo = await processLocationQuery(input);
        console.log('Location info:', locationInfo);
        botMessage = {
          sender: "bot",
          text: locationInfo,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Location error:', error);
        botMessage = {
          sender: "bot",
          text: "Sorry, I couldn't access your location. Please enable location services or try asking about a specific city.",
          timestamp: new Date().toISOString()
        };
      }
    } else if (isHerbQuery(input)) {
      const herbInfo = searchHerb(input);
      
      if (herbInfo) {
        botMessage = {
          sender: "bot",
          text: {
            type: "herb",
            data: herbInfo
          },
          timestamp: new Date().toISOString()
        };
      } else {
        botMessage = {
          sender: "bot",
          text: "I couldn't find specific information about that herb. Could you please be more specific or try asking about common Ayurvedic herbs like turmeric, ashwagandha, neem, tulsi, ginger, brahmi, amla, or triphala?",
          timestamp: new Date().toISOString()
        };
      }
    } else {
      // Get structured remedy data for symptoms
      const response = await getAyurvedicSuggestions({ user_input: input });
      botMessage = {
        sender: "bot",
        text: response.status === "success" ? response.data : response.message,
        timestamp: new Date().toISOString()
      };
    }

    setChatLog((prev) => [...prev, botMessage]);
    
    // Speak the bot response
    speakText(getBotResponseText(botMessage.text));
    
    setInput("");
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const clearHistory = () => {
    setChatLog([]);
    localStorage.removeItem('ayurbot-chat-history');
  };

  const exportChat = () => {
    const chatText = chatLog.map(msg => {
      const timestamp = new Date(msg.timestamp).toLocaleString();
      const sender = msg.sender === 'user' ? 'You' : 'AyurBot';
      let content = `[${timestamp}] ${sender}: `;
      
      if (msg.file) {
        content += `[File: ${msg.file.name}] `;
      }
      
      if (Array.isArray(msg.text)) {
        content += msg.text.map(remedy => 
          `${remedy.remedies.join(', ')} - ${remedy.description}`
        ).join('\n');
      } else {
        content += msg.text;
      }
      
      return content;
    }).join('\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ayurbot-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getBotResponseText = (text) => {
    if (Array.isArray(text)) {
      return text.map(remedy => 
        `${remedy.remedies.join(', ')}: ${remedy.description}`
      ).join('. ');
    } else if (text?.type === 'herb') {
      const herb = text.data;
      return `${herb.name}: ${herb.description}. It can be found in ${herb.whereFound}. Available as ${herb.forms.slice(0, 3).join(', ')}.`;
    } else {
      return text;
    }
  };

  const getLocationInfo = async () => {
    setIsGettingLocation(true);
    try {
      const locationInfo = await processLocationQuery("find stores near me");
      const botMessage = {
        sender: "bot",
        text: locationInfo,
        timestamp: new Date().toISOString()
      };
      setChatLog((prev) => [...prev, botMessage]);
      speakText("I found some Ayurvedic stores and local herb information for your area.");
    } catch (error) {
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I couldn't access your location. Please enable location services or try asking about a specific city like 'stores in New York'.",
        timestamp: new Date().toISOString()
      };
      setChatLog((prev) => [...prev, errorMessage]);
    }
    setIsGettingLocation(false);
  };

  const handleQuitQuiz = () => {
    console.log('Quitting quiz, returning to chat');
    setQuizActive(false);
  };

  return (
    <>
      {quizActive ? (
        <Quiz onQuit={handleQuitQuiz} />
      ) : (
        <div className="fullscreen-chat">
          <div className="chat-header">
            <div className="chat-controls">
              <button className="control-btn" onClick={clearHistory} title="Clear History">
                🗑️
              </button>
              <button className="control-btn" onClick={exportChat} title="Export Chat">
                💾
              </button>
              <button 
                className={`control-btn ${isGettingLocation ? 'loading' : ''}`} 
                onClick={getLocationInfo} 
                disabled={isGettingLocation}
                title="Find Nearby Stores"
              >
                {isGettingLocation ? '🔄' : '📍'}
              </button>
              {isSpeaking && (
                <button className="control-btn speaking" onClick={stopSpeaking} title="Stop Speaking">
                  🔇
                </button>
              )}
            </div>
          </div>
          
          <div className="chat-log">
            {chatLog.length === 0 && (
              <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
                <h3>🌿 Welcome to AyurBot!</h3>
                <p>Describe your symptoms and I'll suggest Ayurvedic remedies for you.</p>
                <p>Ask about herbs like "turmeric", "ashwagandha", or "where to find neem"</p>
                <p>Try "find stores near me", "nearby stores", or "local herbs"</p>
                <p>You can also type "start quiz" to take a health assessment.</p>
                <p>Upload images or documents for better analysis!</p>
              </div>
            )}
            {chatLog.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                <div className="message-header">
                  <strong>{msg.sender === "user" ? "You" : "🌿 AyurBot"}</strong>
                  {msg.timestamp && (
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                {msg.file && (
                  <div className="file-attachment">
                    📄 {msg.file.name} ({(msg.file.size / 1024).toFixed(1)} KB)
                  </div>
                )}
                {msg.sender === "bot" ? (
                  Array.isArray(msg.text) ? (
                    msg.text.map((ans, j) => (
                      <div key={j} className="remedy-card">
                        <h4>{ans.remedies.join(", ")}</h4>
                        {ans.image_url && (
                          <img
                            src={ans.image_url}
                            alt={ans.remedies.join(", ")}
                          />
                        )}
                        <p><strong>Description:</strong> {ans.description}</p>
                        <p><strong>Usage:</strong> {ans.usage}</p>
                        <p><strong>Precautions:</strong> {ans.precautions}</p>
                      </div>
                    ))
                  ) : msg.text?.type === "location" ? (
                    <div className="location-info-card">
                      <div className="location-header">
                        <h3>📍 Your Location: {msg.text.data.location.city}, {msg.text.data.location.country}</h3>
                      </div>

                      {msg.text.data.stores.length > 0 && (
                        <div className="location-section">
                          <h4>🏢 Nearby Ayurvedic Stores</h4>
                          {msg.text.data.stores.map((store, idx) => (
                            <div key={idx} className="store-card">
                              <h5>{store.name}</h5>
                              <p>📍 {store.address}</p>
                              <p>📞 {store.phone}</p>
                              <p>⭐ Rating: {store.rating}/5</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="location-section">
                        <h4>🌱 Local Herb Availability</h4>
                        <p><strong>Climate Type:</strong> {msg.text.data.climate}</p>
                        <div className="herb-tags">
                          {msg.text.data.localHerbs.map((herb, idx) => (
                            <span key={idx} className="local-herb-tag">{herb}</span>
                          ))}
                        </div>
                      </div>

                      <div className="location-section">
                        <h4>🌦️ Weather-Based Recommendations</h4>
                        <p><strong>Current Conditions:</strong> {msg.text.data.weather.condition} ({msg.text.data.weather.temperature}°C)</p>
                        <div className="weather-recommendations">
                          <h5>✅ Recommended:</h5>
                          <ul>
                            {msg.text.data.recommendations.suggestions.map((suggestion, idx) => (
                              <li key={idx}>{suggestion}</li>
                            ))}
                          </ul>
                          <h5>❌ Avoid:</h5>
                          <ul>
                            {msg.text.data.recommendations.avoid.map((avoid, idx) => (
                              <li key={idx}>{avoid}</li>
                            ))}
                          </ul>
                          <p><strong>Tip:</strong> {msg.text.data.recommendations.tips}</p>
                        </div>
                      </div>
                    </div>
                  ) : msg.text?.type === "location_error" ? (
                    <div className="error-message">
                      ⚠️ {msg.text.message}
                    </div>
                  ) : msg.text?.type === "herb" ? (
                    <div className="herb-info-card">
                      <div className="herb-header">
                        <h3>🌿 {msg.text.data.name}</h3>
                        <p className="scientific-name">{msg.text.data.scientificName}</p>
                      </div>
                      
                      <div className="herb-section">
                        <h4>📜 Description</h4>
                        <p>{msg.text.data.description}</p>
                      </div>

                      <div className="herb-section">
                        <h4>🌍 Where to Find</h4>
                        <p><strong>Origin:</strong> {msg.text.data.whereFound}</p>
                        <p><strong>Availability:</strong> {msg.text.data.availability}</p>
                      </div>

                      <div className="herb-section">
                        <h4>📊 Available Forms</h4>
                        <div className="herb-tags">
                          {msg.text.data.forms.map((form, idx) => (
                            <span key={idx} className="herb-tag">{form}</span>
                          ))}
                        </div>
                      </div>

                      <div className="herb-section">
                        <h4>🎯 Uses & Benefits</h4>
                        <div className="herb-tags">
                          {msg.text.data.uses.map((use, idx) => (
                            <span key={idx} className="use-tag">{use}</span>
                          ))}
                        </div>
                      </div>

                      <div className="herb-section">
                        <h4>⚡ Properties</h4>
                        <div className="herb-tags">
                          {msg.text.data.properties.map((prop, idx) => (
                            <span key={idx} className="property-tag">{prop}</span>
                          ))}
                        </div>
                      </div>

                      <div className="herb-section">
                        <h4>📏 Dosage</h4>
                        <p>{msg.text.data.dosage}</p>
                      </div>

                      <div className="herb-section warning">
                        <h4>⚠️ Precautions</h4>
                        <p>{msg.text.data.precautions}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="message-text">{msg.text}</div>
                  )
                ) : (
                  <div className="message-text">{msg.text}</div>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <div className="input-row">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                className="file-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload File"
              >
                📁
              </button>
              <button 
                type="button" 
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={isListening ? stopListening : startListening}
                title={isListening ? "Stop Listening" : "Voice Input"}
              >
                {isListening ? '🔴' : '🎤'}
              </button>
              <input
                type="text"
                placeholder="Describe your symptoms or type 'start quiz'..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
              <button type="button" onClick={handleSubmit}>Send</button>
            </div>
            {uploadedFile && (
              <div className="file-preview">
                📄 {uploadedFile.name} - Ready to send
                <button onClick={() => {
                  setUploadedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}>✕</button>
              </div>
            )}
            {isListening && (
              <div className="voice-status">
                🎤 Listening... Speak now!
              </div>
            )}
            {isSpeaking && (
              <div className="voice-status">
                🔊 AyurBot is speaking...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
