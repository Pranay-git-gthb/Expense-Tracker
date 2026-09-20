from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Our database is one file: expenses.db
engine = create_engine("sqlite:///expenses.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()