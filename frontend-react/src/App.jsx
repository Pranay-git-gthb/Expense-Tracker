import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import Summary from "./Summary";
import ExpenseList from "./ExpenseList";

const API = "http://127.0.0.1:8000";

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    const response = await fetch(API + "/expenses");
    const data = await response.json();
    setExpenses(data);
  }

  async function addExpense(data) {
    await fetch(API + "/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    loadExpenses();
  }

  async function deleteExpense(id) {
    await fetch(API + "/expenses/" + id, { method: "DELETE" });
    loadExpenses();
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <h1>Expense Tracker</h1>
      <ExpenseForm onAdd={addExpense} />
      <Summary total={total} />
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
    </div>
  );
}

export default App;