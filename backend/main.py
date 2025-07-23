from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from schemas import *
from services import *

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/forecast", response_model=ForecastResponse)
async def forecast(request: ForecastRequest):
    return await get_forecast(request)

@app.post("/nutrition", response_model=NutritionResponse)
async def nutrition_suggestion(request: NutritionRequest):
    return await get_nutrition_suggestion(request)

@app.post("/feedback")
async def submit_feedback_endpoint(feedback: Feedback):
    return await submit_feedback(feedback)

@app.get("/feedback")
async def get_feedback(timeframe: str = "today"):
    return await get_feedback_report(timeframe)

@app.post("/scholarships", response_model=list[ScholarshipItem])
async def find_scholarships_endpoint(request: ScholarshipRequest):
    return await find_scholarships(request)

# @app.post("/lost-and-found")
# async def detect_lost_item_endpoint(
#     description: str = Form(...),
#     recipient_email: str = Form(...),
#     video: UploadFile = File(...)
# ):
#     return await detect_lost_item(
#         LostItemRequest(description=description, recipient_email=recipient_email),
#         video.file
#     )

@app.post("/lost-and-found", response_class=FileResponse)
async def detect_lost_item_endpoint(
    description: str = Form(...),
    recipient_email: str = Form(...),
    video: UploadFile = File(...)
):
    return await detect_lost_item(
        LostItemRequest(description=description, recipient_email=recipient_email),
        video.file
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



















# from fastapi import FastAPI, UploadFile, File, Form
# from fastapi.middleware.cors import CORSMiddleware
# from schemas import *
# from services import *

# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/forecast", response_model=ForecastResponse)
# async def forecast(request: ForecastRequest):
#     return get_forecast(request)

# @app.post("/nutrition", response_model=NutritionResponse)
# async def nutrition_suggestion(request: NutritionRequest):
#     return get_nutrition_suggestion(request)

# @app.post("/feedback")
# async def submit_feedback_endpoint(feedback: Feedback):
#     return submit_feedback(feedback)

# @app.get("/feedback")
# async def get_feedback(timeframe: str = "today"):
#     return get_feedback_report(timeframe)

# @app.post("/scholarships", response_model=list[ScholarshipItem])
# async def find_scholarships_endpoint(request: ScholarshipRequest):
#     return find_scholarships(request)

# @app.post("/lost-and-found")
# async def detect_lost_item_endpoint(
#     description: str = Form(...),
#     recipient_email: str = Form(...),
#     video: UploadFile = File(...)
# ):
#     return detect_lost_item(
#         LostItemRequest(description=description, recipient_email=recipient_email),
#         video.file
#     )

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)