from fastapi import FastAPI, Depends, HTTPException
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


@app.put("/expenses/{expense_id}")
def update_expense(expense_id: int, data: schemas.ExpenseIn, db=Depends(get_db)):
    expense = db.get(models.Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    expense.title = data.title
    expense.amount = data.amount
    expense.category = data.category
    expense.date = data.date
    db.commit()
    return {"updated": expense_id}


@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db=Depends(get_db)):
    expense = db.get(models.Expense, expense_id)
    if expense:
        db.delete(expense)
        db.commit()
    return {"deleted": expense_id}