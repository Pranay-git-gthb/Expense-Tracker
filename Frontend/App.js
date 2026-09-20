const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const list = document.getElementById("list");
const total = document.getElementById("total");
const filter = document.getElementById("filter");
const error = document.getElementById("error");


const API = "http://127.0.0.1:8000";   // address of the backend
let expenses = [];                     // starts empty, the backend fills it

// ----- 3. Get all expenses from the backend -----
// "await" means: wait for the answer before going to the next line
async function loadExpenses() {
    try {
        const response = await fetch(API + "/expenses");
        expenses = await response.json();
        showExpenses();
    } catch (e) {
        error.textContent = "Cannot reach the backend. Is it running?";
    }
}

// ----- 4. Show the expenses on the page -----
function showExpenses() {
    let html = "";
    let sum = 0;

    expenses.forEach(expense => {
        // If a category is chosen and this one is different, skip it
        if (filter.value != "All" && expense.category != filter.value) return;

        sum += expense.amount;

        html += `
            <li>
                <span>
                    <b>${expense.title}</b><br>
                    <small>${expense.category} | ${expense.date}</small>
                </span>
                ₹${expense.amount.toFixed(2)}
                <button onclick="deleteExpense(${expense.id})">Delete</button>
            </li>
        `;
    });

    if (html == "") html = "<li>No expenses yet.</li>";

    list.innerHTML = html;
    total.textContent = "₹" + sum.toFixed(2);
}

// ----- 5. Add a new expense -----
async function addExpense() {
    if (!title.value || amount.value <= 0 || !date.value) {
        error.textContent = "Please enter all details.";
        return;
    }
    error.textContent = "";

    // Send the new expense to the backend
    await fetch(API + "/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title.value,
            amount: Number(amount.value),
            category: category.value,
            date: date.value
        })
    });

    title.value = "";
    amount.value = "";
    filter.value = "All";   // so the new expense isn't hidden by a filter
    loadExpenses();         // get the fresh list
}

// ----- 6. Delete an expense -----
async function deleteExpense(id) {
    await fetch(API + "/expenses/" + id, { method: "DELETE" });
    loadExpenses();
}

// ----- 7. Start the app -----
date.value = new Date().toLocaleDateString("en-CA");  
document.getElementById("add-btn").addEventListener("click", addExpense);
filter.addEventListener("change", showExpenses);
loadExpenses();