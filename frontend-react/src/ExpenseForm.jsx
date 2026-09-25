import { useState } from "react";

function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();  

    if (!title || amount <= 0 || !date) {
      setError("Please enter all details.");
      return;
    }
    setError("");

    onAdd({ title, amount: Number(amount), category, date });

    // Clear the form after adding
    setTitle("");
    setAmount("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Expense"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Food</option>
        <option>Transport</option>
        <option>Shopping</option>
        <option>Bills</option>
        <option>Other</option>
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button type="submit">Add</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default ExpenseForm;