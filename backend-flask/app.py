from flask import Flask, request, jsonify
from flask_cors import CORS

from database import Base, engine, SessionLocal
from models import Expense

Base.metadata.create_all(bind=engine) 

app = Flask(__name__)
CORS(app) 


def to_dict(expense):
    return {
        "id": expense.id,
        "title": expense.title,
        "amount": expense.amount,
        "category": expense.category,
        "date": expense.date,
    }


@app.get("/expenses")
def get_expenses():
    db = SessionLocal()
    expenses = db.query(Expense).order_by(Expense.date.desc()).all()
    db.close()
    return jsonify([to_dict(e) for e in expenses])


@app.post("/expenses")
def add_expense():
    data = request.get_json()   # reads the JSON body the frontend sent

    # Basic validation, since Flask doesn't do this automatically like FastAPI does
    if not data.get("title") or not data.get("date") or data.get("amount", 0) <= 0:
        return jsonify({"error": "Please provide title, amount, and date"}), 422

    db = SessionLocal()
    expense = Expense(
        title=data["title"],
        amount=data["amount"],
        category=data["category"],
        date=data["date"],
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    result = to_dict(expense)
    db.close()
    return jsonify(result), 201


@app.put("/expenses/<int:expense_id>")
def update_expense(expense_id):
    data = request.get_json()

    db = SessionLocal()
    expense = db.get(Expense, expense_id)
    if not expense:
        db.close()
        return jsonify({"error": "Expense not found"}), 404

    expense.title = data["title"]
    expense.amount = data["amount"]
    expense.category = data["category"]
    expense.date = data["date"]
    db.commit()
    db.close()
    return jsonify({"updated": expense_id})


@app.delete("/expenses/<int:expense_id>")
def delete_expense(expense_id):
    db = SessionLocal()
    expense = db.get(Expense, expense_id)
    if not expense:
        db.close()
        return jsonify({"error": "Expense not found"}), 404

    db.delete(expense)
    db.commit()
    db.close()
    return jsonify({"deleted": expense_id})


if __name__ == "__main__":
    app.run(debug=True, port=8001)