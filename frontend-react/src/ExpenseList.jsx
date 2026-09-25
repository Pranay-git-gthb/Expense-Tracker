function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p>No expenses yet.</p>;
  }

  return (
    <ul>
      {expenses.map((e) => (
        <li key={e.id}>
          <b>{e.title}</b> ({e.category}, {e.date}) — ₹{e.amount.toFixed(2)}
          <button onClick={() => onDelete(e.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;