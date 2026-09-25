const form = document.getElementById("form");
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const list = document.getElementById("list");
const total = document.getElementById("total");
const error = document.getElementById("error");
const addBtn = document.getElementById("add-btn");
const cancelBtn = document.getElementById("cancel-btn");


const API = "http://127.0.0.1:8000";   
let expenses = [];                     
let editingId = null;                 

async function loadExpenses() {
  try {
    const response = await fetch(API + "/expenses");
    expenses = await response.json();
    error.textContent = "";
    showExpenses();
  } catch (e) {
    error.textContent = "Cannot reach the backend. Is it running?";
  }
}

function showExpenses() {
  let html = "";
  let sum = 0;

  expenses.forEach((expense) => {
    sum += expense.amount;

    html += `
      <li>
        <b>${expense.title}</b> (${expense.category}, ${expense.date}) —
        ₹${expense.amount.toFixed(2)}
        <button type="button" onclick="startEdit(${expense.id})">Edit</button>
        <button type="button" onclick="deleteExpense(${expense.id})">Delete</button>
      </li>
    `;
  });

  if (html === "") html = "<li>No expenses yet.</li>";

  list.innerHTML = html;
  total.textContent = sum.toFixed(2);
}

async function saveExpense(event) {
  event.preventDefault();  

  if (!title.value || amount.value <= 0 || !date.value) {
    error.textContent = "Please enter all details.";
    return;
  }
  error.textContent = "";

  const data = {
    title: title.value,
    amount: Number(amount.value),
    category: category.value,
    date: date.value,
  };

  if (editingId === null) {
    // No id yet -> this is a new expense
    await fetch(API + "/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } else {
    // We have an id -> update that existing expense
    await fetch(API + "/expenses/" + editingId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  resetForm();
  loadExpenses();
}

function startEdit(id) {
  const expense = expenses.find((e) => e.id === id);
  if (!expense) return;

  title.value = expense.title;
  amount.value = expense.amount;
  category.value = expense.category;
  date.value = expense.date;

  editingId = id;
  addBtn.textContent = "Save changes";
  cancelBtn.style.display = "inline-block";
}

function resetForm() {
  form.reset();
  date.value = new Date().toLocaleDateString("en-CA");

  editingId = null;
  addBtn.textContent = "Add";
  cancelBtn.style.display = "none";
}

async function deleteExpense(id) {
  await fetch(API + "/expenses/" + id, { method: "DELETE" });
  if (editingId === id) resetForm();   
  loadExpenses();
}

form.addEventListener("submit", saveExpense);
cancelBtn.addEventListener("click", resetForm);

date.value = new Date().toLocaleDateString("en-CA");
loadExpenses();