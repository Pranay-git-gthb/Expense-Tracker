const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const list = document.getElementById("list");
const total = document.getElementById("total");
const filter = document.getElementById("filter");
const error = document.getElementById("error");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function showExpenses() {
    list.innerHTML = "";
    let sum = 0;

    expenses.forEach(expense => {
        if (filter.value != "All" && expense.category != filter.value) return;

        sum += expense.amount;

        list.innerHTML += `
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

    total.textContent = "₹" + sum.toFixed(2);

    if (list.innerHTML == "")
        list.innerHTML = "<li>No expenses yet.</li>";
}

function addExpense() {
    if (!title.value || amount.value <= 0 || !date.value) {
        error.textContent = "Please enter all details.";
        return;
    }

    expenses.push({
        id: Date.now(),
        title: title.value,
        amount: Number(amount.value),
        category: category.value,
        date: date.value
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    title.value = "";
    amount.value = "";
    error.textContent = "";

    showExpenses();
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id != id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    showExpenses();
}

date.value = new Date().toISOString().split("T")[0];

document.getElementById("add-btn").addEventListener("click", addExpense);
filter.addEventListener("change", showExpenses);

showExpenses();
