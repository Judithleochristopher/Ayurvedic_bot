## 🌿 Ayurvedic Chatbot
A web-based Ayurvedic Chatbot that provides herb information, natural remedies for symptoms, and location-based suggestions for Ayurvedic stores.
The system integrates a React frontend, FastAPI backend, and a CSV-based knowledge base for structured and reliable responses.

## 📌 Features
🌱 Herb Information System
Displays herb name, scientific name, description, usage, precautions, and images
Data sourced from a CSV knowledge base

## 🩺 Symptom-Based Remedy Suggestions
Suggests natural Ayurvedic remedies for common symptoms
Responses generated through backend logic via FastAPI

## 📍 Location-Based Recommendations
Provides nearby Ayurvedic store suggestions
Displays locally available herbs and basic recommendations

## 💬 Interactive Chat Interface
Real-time conversational UI built using React
Structured response cards for better readability

## 🏗️ System Architecture
Frontend (React)
→ Sends user queries to backend
→ Displays chatbot responses (herb cards, remedies, store info)

Backend (FastAPI)
→ Identifies query type (Herb / Symptom / Location)
→ Fetches data from CSV, database, or external APIs
→ Returns structured JSON responses

## Knowledge Sources
📄 CSV File – Herb data (knowledge base)
🗄️ Remedy database / rule-based logic
🌐 External APIs – location & store data
🔄 Workflow
User enters a query in the chatbot.
Frontend sends the query to FastAPI.
Backend classifies the query:
Herb query → CSV Knowledge Base
Symptom query → Remedy logic / database
Location query → External API
Backend returns a structured response.
Frontend displays the result in chat format.

## 🧠 Knowledge Base
The chatbot uses a CSV file as its primary knowledge base for herbs.

## 📚 Use Cases
Students learning about Ayurveda
Users seeking natural remedies
Educational and academic demonstrations
Health-tech prototype projects

## 📄 License
This project is developed for educational purposes.
