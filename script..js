let transactions = JSON.parse(localStorage.getItem("finance")) || [];

const form = document.getElementById("financeForm");
const table = document.getElementById("tableBody");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const balance = document.getElementById("balance");
const alertBox = document.getElementById("budgetAlert");

const budget = 10000;

// Save Data
function saveData() {
    localStorage.setItem("finance", JSON.stringify(transactions));
}

// Update Dashboard
function updateDashboard() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(item => {
        if (item.type === "Income") {
            totalIncome += Number(item.amount);
        } else {
            totalExpense += Number(item.amount);
        }
    });

    income.innerHTML = "₹" + totalIncome;
    expense.innerHTML = "₹" + totalExpense;
    balance.innerHTML = "₹" + (totalIncome - totalExpense);

    let remaining = budget - totalExpense;

    if (remaining <= 1000) {
        alertBox.innerHTML = "⚠ Budget Alert! Only ₹" + remaining + " left";
    } else {
        alertBox.innerHTML = "";
    }

    drawCharts(totalIncome, totalExpense);
}

// Display Transactions
function displayTransactions() {

    table.innerHTML = "";

    transactions.forEach((item, index) => {

        table.innerHTML += `
        <tr>
            <td>${item.date}</td>
            <td>${item.type}</td>
            <td>${item.category}</td>
            <td>${item.description}</td>
            <td>₹${item.amount}</td>
            <td>
                <button class="delete" onclick="deleteTransaction(${index})">
                    Delete
                </button>
            </td>
        </tr>
        `;

    });

}

// Delete Transaction
function deleteTransaction(index) {

    transactions.splice(index, 1);

    saveData();

    displayTransactions();

    updateDashboard();

}

// Add Transaction
form.addEventListener("submit", function (e) {

    e.preventDefault();

    let transaction = {

        amount: document.getElementById("amount").value,
        type: document.getElementById("type").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value

    };

    transactions.push(transaction);

    saveData();

    displayTransactions();

    updateDashboard();

    form.reset();

});

// Charts
let pieChart;
let barChart;

function drawCharts(totalIncome, totalExpense) {

    const pieCtx = document.getElementById("pieChart").getContext("2d");
    const barCtx = document.getElementById("barChart").getContext("2d");

    if (pieChart) {
        pieChart.destroy();
    }

    if (barChart) {
        barChart.destroy();
    }

    pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [totalIncome, totalExpense],
                backgroundColor: [
                    "#2ecc71",
                    "#e74c3c"
                ]
            }]
        },
        options: {
            responsive: true
        }
    });

    barChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                label: "Amount (₹)",
                data: [totalIncome, totalExpense],
                backgroundColor: [
                    "#3498db",
                    "#f39c12"
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}

// Monthly Report
function monthlyReport() {

    let month = new Date().getMonth() + 1;

    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach(item => {

        let itemMonth = new Date(item.date).getMonth() + 1;

        if (itemMonth === month) {

            if (item.type === "Income") {
                incomeTotal += Number(item.amount);
            } else {
                expenseTotal += Number(item.amount);
            }

        }

    });

    console.log("Monthly Income:", incomeTotal);
    console.log("Monthly Expense:", expenseTotal);

}

// Load Saved Data
displayTransactions();
updateDashboard();
monthlyReport();