import csv
from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import SessionLocal, engine, Base

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- Quiz questions data ---
quiz_questions = [
    {
        "id": 1,
        "question": "Which herb is best known for calming the mind?",
        "options": ["Tulsi", "Brahmi", "Neem", "Ashwagandha"],
        "answer": "Brahmi",
        "explanation": "Brahmi helps reduce stress and improves mental clarity."
    },
    {
        "id": 2,
        "question": "Which dosha is associated with the fire element?",
        "options": ["Kapha", "Pitta", "Vata", "All of the above"],
        "answer": "Pitta",
        "explanation": "Pitta dosha is linked to fire, governing metabolism and digestion."
    },
    # ... other quiz questions ...
    {
        "id": 15,
        "question": "In Ayurveda, what is ‘Dinacharya’?",
        "options": ["Daily routine", "Seasonal cleanse", "Yoga practice", "Herbal medicine"],
        "answer": "Daily routine",
        "explanation": "Dinacharya refers to daily lifestyle and habits to maintain balance."
    }
]

# CORS middleware configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency: get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Enhanced CSV loader for Ayurvedic remedies
def load_rules_from_csv(file_path):
    symptom_data_map = {}
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            symptom = row['symptom'].strip().lower()
            symptom_data_map[symptom] = {
                "remedies": [r.strip() for r in row['remedies'].split(';')],
                "description": row.get('description', ''),
                "usage": row.get('usage', ''),
                "precautions": row.get('precautions', ''),
                "image_url": row.get('image_url', '')
            }
    return symptom_data_map

# Load Ayurvedic remedies mapping
symptom_data_map = load_rules_from_csv(r"C:\Users\Judithleochristopher\Documents\KB_BOT\backend\ayurvedic_dataset_extended_110.csv")

# Symptom extraction helper
def extract_symptoms_from_text(text):
    text = text.lower()
    extracted = []
    for symptom in symptom_data_map.keys():
        if symptom in text:
            extracted.append(symptom)
    return extracted

# CRUD Helpers for herbs
def get_herb(db: Session, herb_id: int):
    return db.query(models.Herb).filter(models.Herb.id == herb_id).first()

def get_herbs(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Herb).offset(skip).limit(limit).all()

def create_herb(db: Session, herb: schemas.HerbCreate):
    db_herb = models.Herb(name=herb.name, properties=herb.properties, usage=herb.usage)
    db.add(db_herb)
    db.commit()
    db.refresh(db_herb)
    return db_herb

# Herbs CRUD endpoints
@app.get("/herbs/", response_model=List[schemas.Herb])
def read_herbs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    herbs = get_herbs(db, skip=skip, limit=limit)
    return herbs

@app.get("/herbs/{herb_id}", response_model=schemas.Herb)
def read_herb(herb_id: int, db: Session = Depends(get_db)):
    herb = get_herb(db, herb_id)
    if herb is None:
        raise HTTPException(status_code=404, detail="Herb not found")
    return herb

@app.post("/herbs/", response_model=schemas.Herb)
def create_new_herb(herb: schemas.HerbCreate, db: Session = Depends(get_db)):
    return create_herb(db, herb)

# Ayurvedic remedies chatbot endpoint
@app.post("/query")
def get_ayurvedic_suggestions(user_input: str = Body(..., embed=True)):
    symptoms = extract_symptoms_from_text(user_input)
    results = []
    for symptom in symptoms:
        data = symptom_data_map.get(symptom)
        if data:
            results.append({
                "symptom": symptom,
                "remedies": data["remedies"],
                "description": data.get("description", ""),
                "usage": data.get("usage", ""),
                "precautions": data.get("precautions", ""),
                "image_url": data.get("image_url", "")
            })
    if results:
        return {
            "status": "success",
            "message": "Here are your Ayurvedic remedy details.",
            "data": results
        }
    else:
        return {
            "status": "fail",
            "message": (
                "Sorry, I could not find a specific remedy for your symptoms. "
                "Please try to describe symptoms clearly or consult an Ayurvedic practitioner."
            ),
            "data": []
        }

# --- Quiz API Endpoints ---

@app.get("/quiz/start")
def start_quiz():
    # Return first quiz question and total count
    return {"status": "success", "question": quiz_questions[0], "total_questions": len(quiz_questions)}

@app.post("/quiz/answer")
def answer_question(data: dict = Body(...)):
    qid = data.get("question_id")
    selected = data.get("selected_option")

    question = next((q for q in quiz_questions if q["id"] == qid), None)
    if not question:
        return {"status": "fail", "error": "Question not found"}

    correct = (selected == question["answer"])

    current_index = quiz_questions.index(question)
    next_question = quiz_questions[current_index + 1] if current_index + 1 < len(quiz_questions) else None

    return {
        "status": "success",
        "correct": correct,
        "explanation": question["explanation"],
        "next_question": next_question
    }
