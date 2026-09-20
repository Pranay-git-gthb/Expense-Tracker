from pydantic import BaseModel


# What the frontend sends us (no id yet, the database makes it)
class ExpenseIn(BaseModel):
    title: str
    amount: float
    category: str
    date: str


# What we send back (same fields + id)
class ExpenseOut(ExpenseIn):
    id: int
    model_config = {"from_attributes": True}   # lets it read database rows