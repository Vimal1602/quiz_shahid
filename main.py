from fastapi import FastAPI, UploadFile, File, HTTPException, Form
import ollama
import PyPDF2 # type: ignore
import io
import logging
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pymongo import MongoClient
client = MongoClient("mongodb+srv://Zocket:Zocket1234%25%5E@cluster0.vt3ph.mongodb.net/")  # Replace with your Mongo URI if needed
db = client["final_proj"]
quiz_collection = db["quizzes"]
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuizRequest(BaseModel):
    topic: str
    num_questions: int

def generate_quiz(topic: str, num_questions: int = 10) -> str:
    print("Generating quiz...")
    prompt = f"""Generate a {num_questions}-question multiple-choice quiz on {topic}.
    Very Important:
    1) No unnecessart formatting and all, just give in the format that is mentioned below.
    2)The response should strictly follow this JSON array format without any text:
    
    [
      {{ "question": "What is React?", "options": ["Library", "Framework", "Language", "Tool"], "answer": "Library" }},
      {{ "question": "What is JSX?", "options": ["Java", "XML", "JS + XML", "Python"], "answer": "JS + XML" }}
    ]
    
    Ensure the response has exactly {num_questions} questions in the same JSON structure with no explanation or additional text.
    """

    response = ollama.chat(model='llama3.2', messages=[{"role": "user", "content": prompt}])
    print(response.get('message', {}).get('content', "[]"))
    # Extracting the content and returning it as a JSON string
    return response.get('message', {}).get('content', "[]")

@app.post("/generate_quiz")
def generate_quiz_api(quiz_request: QuizRequest):
    quiz = generate_quiz(quiz_request.topic, quiz_request.num_questions)
    return {"quiz": quiz}

@app.get("/")
def home():
    return {"message": "FastAPI is running!"}

@app.post("/assess_quiz")
def assess_quiz(quiz_answers: dict):
    prompt = f"Evaluate these quiz answers: {quiz_answers}. Identify strengths and weaknesses and suggest a topic combining both."
    response = ollama.chat(model='llama3', messages=[{"role": "user", "content": prompt}])
    
    return {"assessment": response.get('message', {}).get('content', "No content returned.")}

@app.post("/evaluate_assignment")
def evaluate_assignment(file: UploadFile = File(...)):
    try:
        contents = file.file.read()
        file.file.close()  # Close the file after reading
        
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
        text = "\n".join([page.extract_text() or "" for page in pdf_reader.pages])  # Handle None cases
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text extracted from the PDF.")

        prompt = f"Evaluate this assignment:\n{text}\nProvide a score out of 100 with feedback."

        response = ollama.chat(model='llama3', messages=[{"role": "user", "content": prompt}])
        return {"evaluation": response.get('message', {}).get('content', "No content returned.")}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))




# def generate_quiz(topic: str, num_questions: int = 10) -> str:
#     prompt = f"""Generate a {num_questions}-question multiple-choice quiz on {topic}.
#       Provide four options per question and indicate the correct answer.sample quizdata will be "[
#   { question: "What is React?", options: ["Library", "Framework", "Language", "Tool"], answer: "Library" },
#   { question: "What is JSX?", options: ["Java", "XML", "JS + XML", "Python"], answer: "JS + XML" },
# ]; """
#     response = ollama.chat(model='llama3', messages=[{"role": "user", "content": prompt}])
#     return response.get('message', {}).get('content', "No content returned.")
#     #the return type of the llm response should match with quizdata
# #     const quizData = [
# #   { question: "What is React?", options: ["Library", "Framework", "Language", "Tool"], answer: "Library" },
# #   { question: "What is JSX?", options: ["Java", "XML", "JS + XML", "Python"], answer: "JS + XML" },
# # ];



#@app.post("/generate_quiz")
#def generate_quiz_api(topic: str, num_questions: int = 5):
    #quiz = generate_quiz(topic, num_questions)
    #return {"quiz": quiz}