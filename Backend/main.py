from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from Backend.user_input_pydantic import UserInput
from Backend.Model.predict import predict_output, model, MODEL_VERSION
from Backend.config.prediction_response import PredictionResponse
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite
        "http://localhost:3000"   # CRA (optional)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():
    return {'message':'Insurance Premium Prediction API'}

@app.get("/health")
def health_check():
    return {
        'status': 'OK',
        'version': MODEL_VERSION,
        'model_loaded': model is not None}

@app.post("/predict", response_model=PredictionResponse)
def predict_premium(data: UserInput):
    user_input = {
        "age": data.age,
        "bmi": data.bmi,
        "children": data.children,
        "family_size": data.family_size,
        "bmi_category": data.bmi_category,
        "age_group": data.age_group,
        "lifestyle_risk": data.lifestyle_risk,
        "high_risk_smoker_obese": data.high_risk_smoker_obese,
        "sex": data.sex,
        "city_tier": data.city_tier,
        "smoker": data.smoker_str
    }
    try:
        prediction = predict_output(user_input)
        return JSONResponse(status_code=200,content={"predicted_premium_category": prediction})
    
    except Exception as e:
        return JSONResponse(status_code=500,content=str(e))




