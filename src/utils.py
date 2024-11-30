from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.exc import IntegrityError, DataError
from fastapi.exceptions import HTTPException
from fastapi import status

async def handle_database_exception(session: AsyncSession,err:str, exception: Exception):
    await session.rollback()
    if isinstance(exception, IntegrityError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Integrity error: {str(exception.orig).splitlines()[0]}"
        )
    elif isinstance(exception, DataError):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Data error: {str(exception.orig).splitlines()[0]}"
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unexpected error: {str}"
        )