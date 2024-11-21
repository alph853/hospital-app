alembic init -t async migrations     

alembic revision --autogenerate -m "init"

alembic upgrade head

uvicorn src:app --port 8001