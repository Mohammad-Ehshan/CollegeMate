# import os
# import google.generativeai as genai
# import torch
# import torch.nn as nn
# import pandas as pd
# import numpy as np
# import re
# import sqlite3
# import cv2
# import tempfile
# import smtplib
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText
# from datetime import datetime, timedelta
# from sklearn.preprocessing import MinMaxScaler
# from sklearn.model_selection import train_test_split
# from fastapi import FastAPI, UploadFile, File, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, EmailStr
# from typing import Optional, List
# from PIL import Image
# import io

# from ultralytics import YOLO

# # Load environment variables
# from dotenv import load_dotenv
# load_dotenv()

# # Initialize FastAPI app
# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --------------- Pydantic Models ---------------
# class ForecastRequest(BaseModel):
#     query: str
#     language: str = "English"

# class ForecastResponse(BaseModel):
#     explanation: str
#     predicted_attendance: int

# class NutritionRequest(BaseModel):
#     query: str
#     language: str = "English"

# class NutritionResponse(BaseModel):
#     suggestion: str

# class Feedback(BaseModel):
#     meal: str
#     taste: str
#     waste: str
#     comment: Optional[str] = None

# class ScholarshipRequest(BaseModel):
#     country: str = "India"
#     level: str = "Undergraduate"
#     field: str = "STEM"
#     count: int = 5

# class ScholarshipItem(BaseModel):
#     name: str
#     provider: str
#     amount: str
#     deadline: str
#     eligibility: str

# class LostItemRequest(BaseModel):
#     description: str
#     recipient_email: EmailStr

# class LostItemResponse(BaseModel):
#     found: bool
#     matched_labels: List[str]

# # --------------- Shared Setup --------------- 
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# # --------------- Forecasting Service ---------------
# # Load dataset and prepare model
# df = pd.read_csv("mess_data_5000_days.csv")
# df['date'] = pd.to_datetime(df['date'])
# df['day'] = df['date'].dt.dayofweek
# df['month'] = df['date'].dt.month
# df['menu_encoded'] = df['menu'].astype('category').cat.codes

# features = ['day', 'month', 'menu_encoded']
# target = ['attendees']

# scaler = MinMaxScaler()
# X = scaler.fit_transform(df[features])
# y = df[target].values
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# class ANNModel(nn.Module):
#     def __init__(self):
#         super().__init__()
#         self.fc1 = nn.Linear(len(features), 64)
#         self.relu = nn.ReLU()
#         self.fc2 = nn.Linear(64, 32)
#         self.out = nn.Linear(32, 1)
    
#     def forward(self, x):
#         x = self.relu(self.fc1(x))
#         x = self.relu(self.fc2(x))
#         return self.out(x)

# ann_model = ANNModel()

# # Train the model (basic quick training) (new code)
# loss_fn = nn.MSELoss()
# optimizer = torch.optim.Adam(ann_model.parameters(), lr=0.01)
# X_tensor = torch.tensor(X_train, dtype=torch.float32)
# y_tensor = torch.tensor(y_train, dtype=torch.float32)

# for epoch in range(100):
#     ann_model.train()
#     optimizer.zero_grad()
#     outputs = ann_model(X_tensor)
#     loss = loss_fn(outputs, y_tensor)
#     loss.backward()
#     optimizer.step()

# # Save the model
# torch.save(ann_model.state_dict(), "ann_model.pth")


# ann_model.load_state_dict(torch.load("ann_model.pth"))
# ann_model.eval()

# FORECAST_SYSTEM_PROMPT = """
# You are a mess forecasting assistant. Based on historical data, predict attendees.
# Use context like date, day, menu. Return short explanations with emojis and markdown.
# """

# def extract_date(text):
#     try:
#         for line in text.split('\n'):
#             if line.lower().startswith("date:"):
#                 return pd.to_datetime(line.split(":")[1].strip()).date()
#     except:
#         return datetime.now().date()

# def translate_response(text, target_lang):
#     if target_lang == "English":
#         return text
#     model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
#     return model.generate_content(f"Translate to {target_lang} preserving emojis/markdown:\n{text}").text

# @app.post("/forecast", response_model=ForecastResponse)
# async def forecast(request: ForecastRequest):
#     model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
    
#     # Extract structured info
#     context_response = model.generate_content(
#         f"{FORECAST_SYSTEM_PROMPT}\nExtract date/menu from: {request.query}"
#     )
#     date = extract_date(context_response.text)
    
#     # Prepare input features
#     input_data = pd.DataFrame([{
#         'day': date.weekday(),
#         'month': date.month,
#         'menu_encoded': 1  # Default value
#     }])
#     scaled_input = scaler.transform(input_data)
#     input_tensor = torch.tensor(scaled_input, dtype=torch.float32)
    
#     # Predict attendance
#     with torch.no_grad():
#         predicted = max(0, int(ann_model(input_tensor).item()))
    
#     # Generate explanation
#     explanation_prompt = f"""
#     {FORECAST_SYSTEM_PROMPT}
#     User asked: {request.query}
#     Forecast: Around {predicted} students expected.
#     Explain professionally with factors, emojis, and bullet points.
#     """
#     explanation = model.generate_content(explanation_prompt).text
#     return {
#         "explanation": translate_response(explanation, request.language),
#         "predicted_attendance": predicted
#     }

# # --------------- Nutrition Service ---------------
# NUTRITION_SYSTEM_PROMPT = """
# Suggest healthy meal combos based on protein/fiber/calories. 
# Use emojis and markdown. End with 🎉 You earned 10 Green Points!
# """

# menu_items = {
#     "Biryani": {"calories": 480, "protein": 12, "fiber": 3},
#     "Rajma": {"calories": 220, "protein": 9, "fiber": 6},
#     "Salad": {"calories": 70, "protein": 2, "fiber": 4},
#     "Paneer": {"calories": 300, "protein": 18, "fiber": 1},
#     "Fried Rice": {"calories": 420, "protein": 7, "fiber": 2},
#     "Daal": {"calories": 150, "protein": 10, "fiber": 5},
#     "Roti": {"calories": 100, "protein": 3, "fiber": 2},
# }

# @app.post("/nutrition", response_model=NutritionResponse)
# async def nutrition_suggestion(request: NutritionRequest):
#     model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
#     menu_summary = "\n".join(
#         f"- {item}: {info['calories']} cal, {info['protein']}g protein, {info['fiber']}g fiber"
#         for item, info in menu_items.items()
#     )
    
#     response = model.generate_content(
#         f"{NUTRITION_SYSTEM_PROMPT}\nMenu:\n{menu_summary}\nUser: {request.query}"
#     )
#     return {"suggestion": translate_response(response.text, request.language)}

# # --------------- Feedback Service ---------------
# def init_db():
#     conn = sqlite3.connect("mess_feedback.db")
#     c = conn.cursor()
#     c.execute('''CREATE TABLE IF NOT EXISTS feedback
#                 (date TEXT, meal TEXT, taste TEXT, waste TEXT, comment TEXT)''')
#     conn.commit()
#     return conn

# @app.post("/feedback")
# async def submit_feedback(feedback: Feedback):
#     conn = init_db()
#     c = conn.cursor()
#     today = datetime.now().strftime("%Y-%m-%d")
#     c.execute("INSERT INTO feedback VALUES (?, ?, ?, ?, ?)",
#               (today, feedback.meal, feedback.taste, feedback.waste, feedback.comment))
#     conn.commit()
#     return {"message": "Feedback submitted successfully"}

# @app.get("/feedback")
# async def get_feedback(timeframe: str = "today"):
#     conn = init_db()
#     df = pd.read_sql_query("SELECT * FROM feedback", conn)
    
#     if timeframe == "today":
#         today = datetime.now().strftime("%Y-%m-%d")
#         return df[df['date'] == today].to_dict(orient='records')
#     elif timeframe == "weekly":
#         last_week = datetime.now() - timedelta(days=7)
#         return df[pd.to_datetime(df['date']) >= last_week].to_dict(orient='records')
#     return df.to_dict(orient='records')

# # --------------- Scholarship Service ---------------
# SCHOLARSHIP_PROMPT = """
# You are a scholarship assistant. Generate a list of scholarships based on the user's request.
# Return ONLY a markdown table with the following columns:
# Name | Provider | Amount | Deadline | Eligibility
# **Do not include any explanation, JSON, or text outside the table. Just give the markdown table.**
# """

# @app.post("/scholarships", response_model=List[ScholarshipItem])
# async def find_scholarships(request: ScholarshipRequest):
#     model = genai.GenerativeModel('gemini-1.5-flash')
#     response = model.generate_content(
#         f"{SCHOLARSHIP_PROMPT}\nGenerate {request.count} scholarships for {request.level} students "
#         f"in {request.country} studying in the field of {request.field}."
#     )
    
#     # Parse markdown table
#     table_data = []
#     for line in response.text.strip().split('\n'):
#         if '|' not in line:
#             continue
#         columns = [col.strip() for col in line.split('|')[1:-1]]
#         if len(columns) == 5:
#             table_data.append({
#                 "name": columns[0],
#                 "provider": columns[1],
#                 "amount": columns[2],
#                 "deadline": columns[3],
#                 "eligibility": columns[4]
#             })
#     return table_data

# # --------------- Lost & Found Service ---------------
# # Load model (downloads yolov8n.pt on first use)
# yolo_model = YOLO("yolov8n.pt")  # You can change to yolov8s.pt/yolov8m.pt for better accuracy

# def send_email(subject, body, recipient_email):
#     sender_email = os.getenv("SMTP_EMAIL")
#     sender_password = os.getenv("SMTP_PASSWORD")
    
#     msg = MIMEMultipart()
#     msg['From'] = sender_email
#     msg['To'] = recipient_email
#     msg['Subject'] = subject
#     msg.attach(MIMEText(body, 'plain'))

#     try:
#         server = smtplib.SMTP('smtp.gmail.com', 587)
#         server.starttls()
#         server.login(sender_email, sender_password)
#         server.sendmail(sender_email, recipient_email, msg.as_string())
#         server.quit()
#         return True
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")

# @app.post("/lost-and-found")
# async def detect_lost_item(
#     description: str = Form(...),
#     recipient_email: str = Form(...),
#     video: UploadFile = File(...)
# ):
#     temp_video_path = os.path.join(tempfile.gettempdir(), video.filename)
    
#     try:
#         with open(temp_video_path, "wb") as f:
#             f.write(video.file.read())
        
#         cap = cv2.VideoCapture(temp_video_path)
#         if not cap.isOpened():
#             raise HTTPException(status_code=400, detail="Could not open video file")
        
#         item_found = False
#         matched_labels = []

#         while cap.isOpened():
#             ret, frame = cap.read()
#             if not ret:
#                 break

#             # Run YOLOv8 detection
#             results = yolo_model.predict(frame, verbose=False)
#             if results and results[0].boxes:
#                 boxes = results[0].boxes
#                 for box in boxes:
#                     cls = int(box.cls[0].item())
#                     conf = box.conf[0].item()
#                     label = yolo_model.names[cls]
#                     if conf > 0.4 and label.lower() in description.lower():
#                         matched_labels.append(label)
#                         item_found = True

#         cap.release()

#         if item_found:
#             unique_labels = list(set(matched_labels))
#             send_email(
#                 subject="Lost Item Found!",
#                 body=f"Your lost item ({', '.join(unique_labels)}) has been found in the CCTV footage.",
#                 recipient_email=recipient_email
#             )
        
#         return {
#             "found": item_found,
#             "matched_labels": list(set(matched_labels)) if item_found else []
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
#     finally:
#         if os.path.exists(temp_video_path):
#             os.remove(temp_video_path)















# yolo_model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# def send_email(subject, body, recipient_email):
#     sender_email = os.getenv("SMTP_EMAIL")
#     sender_password = os.getenv("SMTP_PASSWORD")
    
#     msg = MIMEMultipart()
#     msg['From'] = sender_email
#     msg['To'] = recipient_email
#     msg['Subject'] = subject
#     msg.attach(MIMEText(body, 'plain'))

#     try:
#         server = smtplib.SMTP('smtp.gmail.com', 587)
#         server.starttls()
#         server.login(sender_email, sender_password)
#         text = msg.as_string()
#         server.sendmail(sender_email, recipient_email, text)
#         server.quit()
#         return True
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")

# @app.post("/lost-and-found")
# async def detect_lost_item(
#     description: str = Form(...),
#     recipient_email: str = Form(...),
#     video: UploadFile = File(...)
# ):
#     # Create temporary file
#     temp_video_path = os.path.join(tempfile.gettempdir(), video.filename)
    
#     try:
#         # Save uploaded video
#         with open(temp_video_path, "wb") as f:
#             f.write(video.file.read())
        
#         # Process video
#         cap = cv2.VideoCapture(temp_video_path)
#         if not cap.isOpened():
#             raise HTTPException(status_code=400, detail="Could not open video file")
        
#         item_found = False
#         matched_labels = []
        
#         while cap.isOpened():
#             ret, frame = cap.read()
#             if not ret:
#                 break
            
#             # Perform detection
#             results = yolo_model(frame)
#             detections = results.xywh[0]
            
#             for detection in detections:
#                 x_center, y_center, w, h, confidence, class_id = detection[:6]
#                 if confidence > 0.4:
#                     label = yolo_model.names[int(class_id)]
#                     if label.lower() in description.lower():
#                         matched_labels.append(label)
#                         item_found = True
        
#         cap.release()
        
#         # Send email if item found
#         if item_found:
#             unique_labels = list(set(matched_labels))
#             send_email(
#                 subject="Lost Item Found!",
#                 body=f"Your lost item ({', '.join(unique_labels)}) has been found in the CCTV footage.",
#                 recipient_email=recipient_email
#             )
        
#         return {
#             "found": item_found,
#             "matched_labels": list(set(matched_labels)) if item_found else []
#         }
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
#     finally:
#         if os.path.exists(temp_video_path):
#             os.remove(temp_video_path)

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)













import os
import google.generativeai as genai
import torch
import torch.nn as nn
import pandas as pd
import numpy as np
import re
import sqlite3
import cv2
import tempfile
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from fastapi import HTTPException


from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from typing import List
from ultralytics import YOLO
from dotenv import load_dotenv
load_dotenv()

# --------------- Pydantic Models ---------------
class ForecastRequest(BaseModel):
    query: str
    language: str = "English"

class ForecastResponse(BaseModel):
    explanation: str
    predicted_attendance: int

class NutritionRequest(BaseModel):
    query: str
    language: str = "English"

class NutritionResponse(BaseModel):
    suggestion: str

class Feedback(BaseModel):
    meal: str
    taste: str
    waste: str
    comment: Optional[str] = None

class ScholarshipRequest(BaseModel):
    country: str = "India"
    level: str = "Undergraduate"
    field: str = "STEM"
    count: int = 5

class ScholarshipItem(BaseModel):
    name: str
    provider: str
    amount: str
    deadline: str
    eligibility: str

class LostItemRequest(BaseModel):
    description: str
    recipient_email: EmailStr

class LostItemResponse(BaseModel):
    found: bool
    matched_labels: List[str]

# --------------- Shared Setup ---------------
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# --------------- Forecasting Model Setup ---------------
# --------------- Load and Prepare Data ---------------
df = pd.read_csv("mess_data_5000_days.csv")

df['date'] = pd.to_datetime(df['date'])
df['day_num'] = df['date'].dt.dayofweek
df['menu_encoded'] = df['menu'].astype('category').cat.codes
df['holiday_encoded'] = df['holiday'].map({'Yes': 1, 'No': 0})  # FIXED: use 'holiday', not 'rain'
menu_categories = df['menu'].astype('category').cat.categories

features = ['day_num', 'menu_encoded', 'temp_c', 'holiday_encoded']
target = ['attendees']

scaler = MinMaxScaler()
X = scaler.fit_transform(df[features])
y = df[target].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# --------------- Define Model ---------------
class ANNModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(len(features), 64)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(64, 32)
        self.out = nn.Linear(32, 1)

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        return self.out(x)

ann_model = ANNModel()
loss_fn = nn.MSELoss()
optimizer = torch.optim.Adam(ann_model.parameters(), lr=0.01)

X_tensor = torch.tensor(X_train, dtype=torch.float32)
y_tensor = torch.tensor(y_train, dtype=torch.float32)

for epoch in range(100):
    ann_model.train()
    optimizer.zero_grad()
    outputs = ann_model(X_tensor)
    loss = loss_fn(outputs, y_tensor)
    loss.backward()
    optimizer.step()

torch.save(ann_model.state_dict(), "ann_model.pth")
ann_model.load_state_dict(torch.load("ann_model.pth"))
ann_model.eval()

# --------------- Utility Functions ---------------
def extract_value(key: str, text: str):
    match = re.search(fr"{key}:\s*(.+)", text, re.IGNORECASE)
    return match.group(1).strip() if match else None

def extract_date(text):
    value = extract_value("Date", text)
    try:
        return pd.to_datetime(value).date()
    except:
        return datetime.now().date()

def extract_menu(text):
    return extract_value("Menu", text) or "Khichdi"

def extract_temp(text):
    try:
        return float(extract_value("Temperature", text))
    except:
        return 30.0

def extract_holiday(text):
    value = extract_value("Holiday", text)
    return 1 if value and value.lower() == "yes" else 0

def get_menu_code(menu_name: str):
    if menu_name in menu_categories:
        return df[df['menu'] == menu_name]['menu_encoded'].values[0]
    return 0

def translate_response(text, target_lang):
    if target_lang.lower() == "english":
        return text
    model = genai.GenerativeModel("models/gemini-1.5-flash")
    return model.generate_content(f"Translate to {target_lang} with emojis/markdown preserved:\n{text}").text

# --------------- Forecast System Prompt ---------------
FORECAST_SYSTEM_PROMPT = """
You are a mess forecasting assistant. Based on historical data, predict attendees.
Use context like date, menu, temperature, and holiday. Return short explanations with emojis and markdown.
"""

# --------------- Forecast Service Logic ---------------
async def get_forecast(request: ForecastRequest) -> ForecastResponse:
    model = genai.GenerativeModel("models/gemini-1.5-flash")

    # Step 1: Extract structured info from query
    context_prompt = f"""
    Extract this info from user input:
    - Date (YYYY-MM-DD)
    - Menu item
    - Temperature (°C)
    - Holiday: Yes/No

    Query: {request.query}
    """
    try:
        context_response = model.generate_content(context_prompt).text
        date = extract_date(context_response)
        menu = extract_menu(context_response)
        temp_value = extract_temp(context_response)
        is_holiday = extract_holiday(context_response)
        menu_code = get_menu_code(menu)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error in parsing input: {str(e)}")

    # Step 2: Build model input
    input_data = pd.DataFrame([{
        'day_num': date.weekday(),
        'menu_encoded': menu_code,
        'temp_c': temp_value,
        'holiday_encoded': is_holiday
    }])

    scaled_input = scaler.transform(input_data)
    input_tensor = torch.tensor(scaled_input, dtype=torch.float32)

    # Step 3: Predict attendance
    with torch.no_grad():
        predicted = max(0, int(ann_model(input_tensor).item()))

    # Step 4: Generate explanation
    explanation_prompt = f"""
    {FORECAST_SYSTEM_PROMPT}
    User asked: {request.query}
    Forecast: Around {predicted} students expected.
    Explain why using temperature, day, holiday, and menu. Use bullet points and emojis.
    """
    explanation = model.generate_content(explanation_prompt).text

    return ForecastResponse(
        explanation=translate_response(explanation, request.language),
        predicted_attendance=predicted
    )









# # df = pd.read_csv("mess_data_5000_days.csv")
# # df['date'] = pd.to_datetime(df['date'])
# # df['day'] = df['date'].dt.dayofweek
# # df['month'] = df['date'].dt.month
# # df['menu_encoded'] = df['menu'].astype('category').cat.codes

# # features = ['day', 'month', 'menu_encoded']
# # target = ['attendees']

# # scaler = MinMaxScaler()
# # X = scaler.fit_transform(df[features])
# # y = df[target].values

# # Load CSV
# df = pd.read_csv("mess_data_5000_days.csv")

# # Convert date column
# df['date'] = pd.to_datetime(df['date'])

# # Encode day of week (Monday → 0, ..., Sunday → 6)
# df['day_num'] = df['date'].dt.dayofweek

# # Encode categorical columns
# df['menu_encoded'] = df['menu'].astype('category').cat.codes
# df['rain_encoded'] = df['rain'].map({'Yes': 1, 'No': 0})

# # Features and target
# features = ['day_num', 'menu_encoded', 'temperature', 'rain_encoded']
# target = ['attendees']

# # Scaling
# scaler = MinMaxScaler()
# X = scaler.fit_transform(df[features])
# y = df[target].values

# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# class ANNModel(nn.Module):
#     def __init__(self):
#         super().__init__()
#         self.fc1 = nn.Linear(len(features), 64)
#         self.relu = nn.ReLU()
#         self.fc2 = nn.Linear(64, 32)
#         self.out = nn.Linear(32, 1)
    
#     def forward(self, x):
#         x = self.relu(self.fc1(x))
#         x = self.relu(self.fc2(x))
#         return self.out(x)

# ann_model = ANNModel()
# loss_fn = nn.MSELoss()
# optimizer = torch.optim.Adam(ann_model.parameters(), lr=0.01)
# X_tensor = torch.tensor(X_train, dtype=torch.float32)
# y_tensor = torch.tensor(y_train, dtype=torch.float32)

# for epoch in range(100):
#     ann_model.train()
#     optimizer.zero_grad()
#     outputs = ann_model(X_tensor)
#     loss = loss_fn(outputs, y_tensor)
#     loss.backward()
#     optimizer.step()

# torch.save(ann_model.state_dict(), "ann_model.pth")
# ann_model.load_state_dict(torch.load("ann_model.pth"))
# ann_model.eval()

# # --------------- Utility Functions ---------------
# def extract_date(text):
#     try:
#         for line in text.split('\n'):
#             if line.lower().startswith("date:"):
#                 return pd.to_datetime(line.split(":")[1].strip()).date()
#     except:
#         return datetime.now().date()

# def translate_response(text, target_lang):
#     if target_lang == "English":
#         return text
#     # model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
#     model = genai.GenerativeModel("models/gemini-1.5-flash")
#     return model.generate_content(f"Translate to {target_lang} preserving emojis/markdown:\n{text}").text

# # --------------- Forecast Service Logic ---------------
# FORECAST_SYSTEM_PROMPT = """
# You are a mess forecasting assistant. Based on historical data, predict attendees.
# Use context like date, day, menu. Return short explanations with emojis and markdown.
# """

# async def get_forecast(request: ForecastRequest) -> ForecastResponse:
#     # model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
#     model = genai.GenerativeModel("models/gemini-1.5-flash")

#     context_response = model.generate_content(
#         f"{FORECAST_SYSTEM_PROMPT}\nExtract date/menu from: {request.query}"
#     )
#     date = extract_date(context_response.text)

#     # input_data = pd.DataFrame([{
#     #     'day': date.weekday(),
#     #     'month': date.month,
#     #     'menu_encoded': 1
#     # }])

#     input_data = pd.DataFrame([{
#     'day_num': date.weekday(),
#     'menu_encoded': menu_code,        # This should come from menu string mapping
#     'temperature': temp_value,        # Extract or set a default
#     'holiday_encoded': is_holiday     # 1 if holiday, else 0
# }])
#     scaled_input = scaler.transform(input_data)
#     input_tensor = torch.tensor(scaled_input, dtype=torch.float32)

#     with torch.no_grad():
#         predicted = max(0, int(ann_model(input_tensor).item()))

#     explanation_prompt = f"""
#     {FORECAST_SYSTEM_PROMPT}
#     User asked: {request.query}
#     Forecast: Around {predicted} students expected.
#     Explain professionally with factors, emojis, and bullet points.
#     """
#     explanation = model.generate_content(explanation_prompt).text
#     return ForecastResponse(
#         explanation=translate_response(explanation, request.language),
#         predicted_attendance=predicted
#     )

# --------------- Nutrition Service Logic ---------------
NUTRITION_SYSTEM_PROMPT = """
Suggest healthy meal combos based on protein/fiber/calories. 
Use emojis and markdown. End with 🎉 You earned 10 Green Points!
"""

menu_items = {
    "Biryani": {"calories": 480, "protein": 12, "fiber": 3},
    "Rajma": {"calories": 220, "protein": 9, "fiber": 6},
    "Salad": {"calories": 70, "protein": 2, "fiber": 4},
    "Paneer": {"calories": 300, "protein": 18, "fiber": 1},
    "Fried Rice": {"calories": 420, "protein": 7, "fiber": 2},
    "Daal": {"calories": 150, "protein": 10, "fiber": 5},
    "Roti": {"calories": 100, "protein": 3, "fiber": 2},
}

async def get_nutrition_suggestion(request: NutritionRequest) -> NutritionResponse:
    # model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
    model = genai.GenerativeModel("models/gemini-1.5-flash")
    menu_summary = "\n".join(
        f"- {item}: {info['calories']} cal, {info['protein']}g protein, {info['fiber']}g fiber"
        for item, info in menu_items.items()
    )

    response = model.generate_content(
        f"{NUTRITION_SYSTEM_PROMPT}\nMenu:\n{menu_summary}\nUser: {request.query}"
    )
    return NutritionResponse(suggestion=translate_response(response.text, request.language))

# --------------- Feedback Logic ---------------
def init_db():
    conn = sqlite3.connect("mess_feedback.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS feedback
                (date TEXT, meal TEXT, taste TEXT, waste TEXT, comment TEXT)''')
    conn.commit()
    return conn

async def submit_feedback(feedback: Feedback):
    conn = init_db()
    c = conn.cursor()
    today = datetime.now().strftime("%Y-%m-%d")
    c.execute("INSERT INTO feedback VALUES (?, ?, ?, ?, ?)",
              (today, feedback.meal, feedback.taste, feedback.waste, feedback.comment))
    conn.commit()
    return {"message": "Feedback submitted successfully"}

async def get_feedback_report(timeframe: str = "today"):
    conn = init_db()
    df = pd.read_sql_query("SELECT * FROM feedback", conn)

    if timeframe == "today":
        today = datetime.now().strftime("%Y-%m-%d")
        return df[df['date'] == today].to_dict(orient='records')
    elif timeframe == "weekly":
        last_week = datetime.now() - timedelta(days=7)
        return df[pd.to_datetime(df['date']) >= last_week].to_dict(orient='records')
    return df.to_dict(orient='records')

# --------------- Scholarships Logic ---------------
SCHOLARSHIP_PROMPT = """
You are a scholarship assistant. Generate a list of scholarships based on the user's request.
Return ONLY a markdown table with the following columns:
Name | Provider | Amount | Deadline | Eligibility
**Do not include any explanation, JSON, or text outside the table. Just give the markdown table.**
"""

async def find_scholarships(request: ScholarshipRequest) -> List[ScholarshipItem]:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(
        f"{SCHOLARSHIP_PROMPT}\nGenerate {request.count} scholarships for {request.level} students "
        f"in {request.country} studying in the field of {request.field}."
    )

    table_data = []
    for line in response.text.strip().split('\n'):
        if '|' not in line:
            continue
        columns = [col.strip() for col in line.split('|')[1:-1]]
        if len(columns) == 5:
            table_data.append(ScholarshipItem(
                name=columns[0],
                provider=columns[1],
                amount=columns[2],
                deadline=columns[3],
                eligibility=columns[4]
            ))
    return table_data

# --------------- Lost & Found Logic ---------------
yolo_model = YOLO("yolov8n.pt")
# ----- Email Function -----
def send_email(subject, body, recipient_email):
    sender_email = os.getenv("SMTP_EMAIL")
    sender_password = os.getenv("SMTP_PASSWORD")

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        raise Exception(f"Email sending failed: {str(e)}")


# ----- Core Detection -----
async def detect_lost_item(request: LostItemRequest, video_file):
    temp_video_path = os.path.join(tempfile.gettempdir(), "input_video.mp4")
    output_video_path = os.path.join(tempfile.gettempdir(), "annotated_output.mp4")

    try:
        with open(temp_video_path, "wb") as f:
            f.write(video_file.read())

        cap = cv2.VideoCapture(temp_video_path)
        if not cap.isOpened():
            raise Exception("Could not open video file")

        # Setup VideoWriter
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        fps = int(cap.get(cv2.CAP_PROP_FPS)) or 24
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

        item_found = False
        matched_labels = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            results = yolo_model.predict(frame, verbose=False)

            if results and results[0].boxes:
                for box in results[0].boxes:
                    cls = int(box.cls[0].item())
                    conf = box.conf[0].item()
                    label = yolo_model.names[cls]

                    # Check match
                    if conf > 0.4 and label.lower() in request.description.lower():
                        item_found = True
                        matched_labels.append(label)

                        # Draw bounding box
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

            # Write the frame
            out.write(frame)

        cap.release()
        out.release()

        # Email if found
        if item_found:
            unique_labels = list(set(matched_labels))
            send_email(
                subject="Lost Item Found!",
                body=f"Your lost item ({', '.join(unique_labels)}) has been found in the CCTV footage.",
                recipient_email=request.recipient_email
            )

        return FileResponse(
            output_video_path,
            media_type="video/mp4",
            filename="annotated_output.mp4"
        )

    finally:
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)

















# yolo_model = YOLO("yolov8n.pt")

# def send_email(subject, body, recipient_email):
#     sender_email = os.getenv("SMTP_EMAIL")
#     sender_password = os.getenv("SMTP_PASSWORD")

#     msg = MIMEMultipart()
#     msg['From'] = sender_email
#     msg['To'] = recipient_email
#     msg['Subject'] = subject
#     msg.attach(MIMEText(body, 'plain'))

#     try:
#         server = smtplib.SMTP('smtp.gmail.com', 587)
#         server.starttls()
#         server.login(sender_email, sender_password)
#         server.sendmail(sender_email, recipient_email, msg.as_string())
#         server.quit()
#         return True
#     except Exception as e:
#         raise Exception(f"Email sending failed: {str(e)}")

# async def detect_lost_item(request: LostItemRequest, video_file):
#     temp_video_path = os.path.join(tempfile.gettempdir(), "temp_video.mp4")
#     try:
#         with open(temp_video_path, "wb") as f:
#             f.write(video_file.read())

#         cap = cv2.VideoCapture(temp_video_path)
#         if not cap.isOpened():
#             raise Exception("Could not open video file")

#         item_found = False
#         matched_labels = []

#         while cap.isOpened():
#             ret, frame = cap.read()
#             if not ret:
#                 break
#             results = yolo_model.predict(frame, verbose=False)
#             if results and results[0].boxes:
#                 for box in results[0].boxes:
#                     cls = int(box.cls[0].item())
#                     conf = box.conf[0].item()
#                     label = yolo_model.names[cls]
#                     if conf > 0.4 and label.lower() in request.description.lower():
#                         matched_labels.append(label)
#                         item_found = True
#         cap.release()

#         if item_found:
#             unique_labels = list(set(matched_labels))
#             send_email(
#                 subject="Lost Item Found!",
#                 body=f"Your lost item ({', '.join(unique_labels)}) has been found in the CCTV footage.",
#                 recipient_email=request.recipient_email
#             )

#         return LostItemResponse(found=item_found, matched_labels=list(set(matched_labels)))
#     finally:
#         if os.path.exists(temp_video_path):
#             os.remove(temp_video_path)
