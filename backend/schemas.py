from pydantic import BaseModel


class ExpenseIn(BaseModel):
    title: str
    amount: float
    category: str
    date: str

class ExpenseOut(ExpenseIn):
    id: int
    model_config = {"from_attributes": True}   