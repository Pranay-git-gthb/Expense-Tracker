from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

import models
import schemas
from database import Base, engine, get_db

Base.metadata.create_all(bind=engine)   # creates the table if it doesn't exist

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/expenses", response_model=list[schemas.ExpenseOut])
def get_expenses(db=Depends(get_db)):
    return db.query(models.Expense).order_by(models.Expense.date.desc()).all()


@app.post("/expenses", response_model=schemas.ExpenseOut)
def add_expense(data: schemas.ExpenseIn, db=Depends(get_db)):
    expense = models.Expense(**data.model_dump())   # copies title, amount, category, date
    db.add(expense)
    db.commit()          # commit = really save it
    db.refresh(expense)  # reload it so it has its new id
    return expense


@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db=Depends(get_db)):
    expense = db.get(models.Expense, expense_id)
    if expense:
        db.delete(expense)
        db.commit()
    return {"deleted": expense_id}