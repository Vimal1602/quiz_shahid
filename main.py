from fastapi import FastAPI, UploadFile, File, HTTPException, Form
import ollama
import PyPDF2 # type: ignore
import json
import random
import io
import logging
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
from pydantic import BaseModel
import datetime
from datetime import timedelta
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

def generate_quizs(topic: str, num_questions: int = 10) -> str:
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

    response = ollama.chat(model='llama3.2:1b', messages=[{"role": "user", "content": prompt}])
    print(response.get('message', {}).get('content', "[]"))
    # Extracting the content and returning it as a JSON string
    return response.get('message', {}).get('content', "[]")

@app.post("/generate_quiz")
def generate_quiz_api(quiz_request: QuizRequest):
    quiz = generate_quiz(quiz_request.topic, quiz_request.num_questions)
    return {"quiz": quiz}

def generate_quiz(topic: str, num_questions: int = 5) -> dict:
    print("Generating quiz...")
    
    prompt = f"""Generate a {num_questions}-question multiple-choice quiz on the topic "{topic}".

IMPORTANT:
- Format each question with keys: "text", "options", and "correctAnswer"
- Options should be a list of 4 strings.
- correctAnswer should be an integer index (0 to 3) of the correct option.
- Return only a valid JSON array of questions like this:

[
  {{
    "text": "What is a queue?",
    "options": ["FIFO", "LIFO", "Tree", "Graph"],
    "correctAnswer": 0
  }},
  ...
]
DO NOT add any explanations or notes outside the array.
"""

    response = ollama.chat(model='llama3.2:1b', messages=[{"role": "user", "content": prompt}])
    questions_raw = response.get('message', {}).get('content', "[]")

    try:
        questions_json = json.loads(questions_raw)
    except json.JSONDecodeError:
        print("Error parsing JSON from Ollama response.")
        return {}

    # MongoDB style formatted quiz
    quiz_doc = {
        "id": f"{topic.lower().replace(' ', '-')}-{random.randint(100,999)}",
        "title": topic,
        "description": f"Test your knowledge on {topic}.",
        "duration": 5,
        "subject": topic,
        "questions": [],
    }

    for idx, q in enumerate(questions_json, start=1):
        quiz_doc["questions"].append({
            "id": idx,
            "text": q["text"],
            "options": q["options"],
            "correctAnswer": q["correctAnswer"]
        })

    return quiz_doc

quizzes_collection = db["quizzes"]
@app.post("/generate-quiz")
def generate_quiz_api(quiz_request: QuizRequest):
    quiz_doc = generate_quiz(quiz_request.topic, quiz_request.num_questions)
    
    if not quiz_doc:
        return {"error": "Quiz generation failed"}
    
    result = quizzes_collection.insert_one(quiz_doc)
    return {"message": "Quiz saved successfully", "quiz_id": str(result.inserted_id)}

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
    assignment_prompt = f"Generate a digital assignment for the subject {submission.quizId}  that focuses more on the following weaknesses and less on the strengths: {analysis}. The assignment should help the student improve in the areas of weakness.IMPORTANT- Explain the assignment in around 100 words and make it such that the assignment is complex in nature."

    # Get the assignment from ollama model
    assignment_response = ollama.chat(model='llama3.2:1b', messages=[{"role": "user", "content": assignment_prompt}])
    digital_assignment = assignment_response.get('message', {}).get('content', "No content returned.")

    assignment_doc = {
        "id": f"assign-{random.randint(100, 999)}",
        "title": submission.quizId,
        "description": digital_assignment,
        "subject": submission.quizId,
        "dueDate": (datetime.datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d")
    }
    assignments_collection = db["assignments"]
    result = assignments_collection.insert_one(assignment_doc)
    assignment_doc["_id"] = str(result.inserted_id)

    return {
        "message": "Assignment generated and saved successfully.",
        # "assignment_id": str(result.inserted_id),
        "assignment": assignment_doc
    }
    # return {"assessment": digital_assignment}





@app.post("/evaluate-da")
def evaluate_DA(assignment_text: str = Form(...),user_id: str = Form(...),subject_name: str = Form(...)):
    try:
        collection=db["DA_Analysis"]

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
    
class AssignmentSubmission(BaseModel):
    assignmentId: str
    studentId: str
    answer: str
    submittedAt: str
    grade: Optional[float] = None
    feedback: Optional[str] = None

@app.post("/api/submit-assignment")
async def submit_assignment(submission: AssignmentSubmission):
    print("Received submission:", submission)

    # Analyze the answer using an LLM
    analysis_prompt = f"""
    A student has submitted an answer for an assignment.

    Student's Answer:
    {submission.answer}

    Please generate:
    1. A short analysis of the student's understanding of the topic.
    2. Highlight any strengths.
    3. Suggest improvements.

    Format:
    {{
      "analysis": "...",
      "strengths": "...",
      "improvements": "..."
    }}
    """

    try:
        collection1 = db["assignment_submissions"]
        response = ollama.chat(model="llama3.2:1b", messages=[{"role": "user", "content": analysis_prompt}])
        ai_feedback = response.get('message', {}).get('content', "No Content returned.")
        print("AI Feedback:", ai_feedback)
        # collection1.insert_one({"ai_feedback":ai_feedback,"user_id":submission.studentId,"quizId":submission.assignmentId,"answer":submission.answer})
        collection1.update_one(
    {"user_id": submission.studentId, "quizId": submission.assignmentId},  # Find condition
    {
        "$set": {
            "ai_feedback": ai_feedback,
            "answer": submission.answer,
            "updatedAt": datetime.utcnow()
        }
    },
    upsert=True
)
    except Exception as e:
        print(f"Error generating analysis: {e}")
        ai_feedback = "{}"

    # Parse the AI feedback
    import json
    try:
        feedback_data = json.loads(ai_feedback)
    except json.JSONDecodeError:
        feedback_data = {
            "analysis": "Unable to generate detailed analysis.",
            "strengths": "N/A",
            "improvements": "N/A"
        }

    # Here you would usually save the submission + feedback into MongoDB
    # For now, just return it back
    return {
        "message": "Assignment submitted and analyzed successfully",
        "submission": submission.dict(),
        "analysis": feedback_data
    }


# @app.post("/evaluate_assignment")
# def evaluate_assignment(file: UploadFile = File(...)):
#     try:
#         contents = file.file.read()
#         file.file.close()  # Close the file after reading
        
#         pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
#         text = "\n".join([page.extract_text() or "" for page in pdf_reader.pages])  # Handle None cases
        
#         if not text.strip():
#             raise HTTPException(status_code=400, detail="No text extracted from the PDF.")

#         prompt = f"Evaluate this assignment:\n{text}\nProvide a score out of 100 with feedback."

#         response = ollama.chat(model='llama3.2:1b', messages=[{"role": "user", "content": prompt}])
#         return {"evaluation": response.get('message', {}).get('content', "No content returned.")}
    
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))




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