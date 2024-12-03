from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .db.main import init_db
from .db.models import Doctor
from .db.auth.routes import auth_router
from .db.patient.routers import patient_router
from .db.doctor.routers import doctor_router

@asynccontextmanager
async def life_span(app:FastAPI):
    print(f"Server is starting...")
    await init_db()

    yield
    print(f"Server has been stopped")


version = "v1"
app = FastAPI(
    title="Hospital",
    version=version,
    lifespan=life_span
)
origins = [
    "http://localhost:8000",  
    "https://frontenddomain.com", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# include router 
app.include_router(auth_router,prefix=f"/api/{version}/auth",tags=['account'])
app.include_router(patient_router,prefix=f"/api/{version}/patient",tags=['patient'])
app.include_router(doctor_router,prefix=f"/api/{version}/doctor",tags=['doctor'])

