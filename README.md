![CI Pipeline](https://github.com/YASH-VYAS711/insurance-premium-prediction/actions/workflows/ci.yml/badge.svg)
# Insurance Premium Prediction System

An end-to-end Machine Learning web application that predicts insurance premiums based on user demographic and health inputs.

---

## 🚀 Tech Stack

- **Frontend:** React (Vite)
- **Backend:** FastAPI, Pydantic
- **Machine Learning:** Random Forest (scikit-learn)
- **Containerization:** Docker
- **Cloud Deployment:** AWS EC2 (Linux)

---

## 🧠 Architecture

User → React Frontend → FastAPI Backend → Trained ML Model → Prediction Response

---

## 📦 Features

- Input validation using Pydantic models
- City-tier computation logic for feature engineering
- Model serialization using Pickle
- REST API for real-time predictions
- Dockerized backend for reproducible deployment
- Deployed on AWS EC2

---

## 🛠 Run Locally (Without Docker)

### Backend

```bash
cd Backend
pip install -r ../requirements.txt
uvicorn main:app --reload
```

Backend runs at:  
http://127.0.0.1:8000

---

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## 🐳 Run Using Docker

```bash
docker build -t insurance-api .
docker run -p 8000:8000 insurance-api
```

---

## ☁ Deployment

The application was containerized using Docker and deployed on an AWS EC2 instance running Linux. The Docker container was built and executed on the EC2 host, with appropriate security group configuration to allow external API access.

---

## 📌 Future Improvements

- CI/CD pipeline integration
- Kubernetes-based deployment
- Model monitoring and versioning
