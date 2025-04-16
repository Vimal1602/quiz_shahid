from fastapi import FastAPI, UploadFile, File, HTTPException, Form
import ollama
import PyPDF2 # type: ignore
import io
import logging
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
from pydantic import BaseModel
import datetime
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

# Models to validate request payload
class OptionDetail(BaseModel):
    index: int
    content: str
    isCorrect: bool
    isSelected: bool

class AnswerDetail(BaseModel):
    questionId: str
    questionText: str
    selectedOptionIndex: int
    selectedOptionContent: Optional[str]
    correctOptionIndex: int
    correctOptionContent: str
    isCorrect: bool
    options: List[OptionDetail]

class UserDetails(BaseModel):
    name: str
    email: str

class QuizSubmission(BaseModel):
    quizId: str
    userId: str
    userDetails: Dict
    answers: List[Dict]
    score: int
    totalQuestions: int
    timeSpent: int



@app.post("/generate-da")
def assess_quiz(submission: QuizSubmission):
    # Extracting strengths and weaknesses from the quiz answers
    collection=db["reports"]
    print("Submission data:", submission.dict())
    prompt = f"Evaluate these quiz answers: {submission.answers}. Identify strengths and weaknesses and give an analysis report on what the strengths and weakness are and the things where he will struggle moving forward in this subject or topic."
    response = ollama.chat(model='llama3.2:1b', messages=[{"role": "user", "content": prompt}])
    # Extract strengths and weaknesses from the response
    analysis = response.get('message', {}).get('content', "No content returned.")
    collection.insert_one({
        "quizId": submission.quizId,
        "user_id": submission.userId,
        "analysis": analysis,
    })
    assignment_prompt = f"Generate a digital assignment for the subject {submission.quizId}  that focuses more on the following weaknesses and less on the strengths: {analysis}. The assignment should help the student improve in the areas of weakness."

    # Get the assignment from ollama model
    assignment_response = ollama.chat(model='llama3.2:1b', messages=[{"role": "user", "content": assignment_prompt}])
    digital_assignment = assignment_response.get('message', {}).get('content', "No content returned.")

    return {"assessment": digital_assignment}



@app.post("/evaluate_DA")
def evaluate_DA(assignment_text: str = Form(...),user_id: str = Form(...),subject_name: str = Form(...)):
    try:
        collection=db["quiz_report"]

        # Find the swot_report using user_id and subject_name, projecting only the swot_report field
        swot_report = collection.find_one(
            {"user_id": user_id, "subject_name": subject_name},
            {"_id": 0, "swot_report": 1}  # Exclude _id and include only swot_report
        )

        if not swot_report:
            raise HTTPException(status_code=404, detail="SWOT report not found for the given user and subject.")
        
        prompt = f"Evaluate this assignment:\n{assignment_text}\nThe student's strength and weakness is report is {swot_report}.Provide a score out of 100 with feedback on where to improve or if he has done a perfect job with the digital assignment."
        response = ollama.chat(model='llama3.2:1b', messages=[{"role": "user", "content": prompt}])
        return {"evaluation": response.get('message', {}).get('content', "No content returned.")}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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

        response = ollama.chat(model='llama3.2:1b', messages=[{"role": "user", "content": prompt}])
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