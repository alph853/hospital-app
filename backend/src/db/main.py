from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from ..config import Config
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
# Set up the asynchronous engine
engine = create_async_engine(
    url = Config.DATABASE_URL,
    echo = True
)


# Function to initialize the database
async def init_db():
    async with engine.begin() as conn:
        # await conn.run_sync(SQLModel.metadata.create_all)
        print("connect success")

# Function to get a session
async def get_session() -> AsyncSession:
    Session = sessionmaker(
        bind=engine,  # Use the created `engine`, not `create_async_engine`
        class_=AsyncSession,
        expire_on_commit=False
    )

    async with Session() as session:
        yield session

