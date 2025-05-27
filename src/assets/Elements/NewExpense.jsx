"use client";
import React, { useState, useEffect } from "react";

function Expenses() {
  const { data: user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("expenses");
  const [upload, { loading: uploadLoading }] = useUpload();
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "2025-01-15",
      category: "Office Supplies",
      amount: 249.99,
      description: "Printer and accessories",
      taxDeductible: true,
      receipt: null,
    },
    {
      id: 2,
      date: "2025-01-14",
      category: "Travel",
      amount: 385.5,
      description: "Business trip to client",
      taxDeductible: true,
      receipt: null,
    },
  ]);
  const [newExpense, setNewExpense] = useState({
    date: "",
    category: "",
    amount: "",
    description: "",
    taxDeductible: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate total expenses and tax-deductible amounts
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const taxDeductible = expenses
    .filter((expense) => expense.taxDeductible)
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Simulate fetching expenses from the backend
  const fetchExpenses = async () => {
    try {
      // Simulate a delay to mimic network latency
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Use the existing dummy data
      setExpenses(expenses);
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Simulate adding an expense
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    let receiptUrl = null;

    if (selectedFile) {
      try {
        // Simulate file upload
        await new Promise((resolve) => setTimeout(resolve, 1000));
        receiptUrl = URL.createObjectURL(selectedFile); // Create a dummy URL for the file
      } catch (err) {
        setError("Failed to upload receipt");
        console.error(err);
        return;
      }
    }

    try {
      // Simulate adding the expense
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newExpenseWithId = {
        ...newExpense,
        id: Date.now(), // Generate a unique ID
        amount: parseFloat(newExpense.amount),
        receipt: receiptUrl,
      };
      setExpenses([newExpenseWithId, ...expenses]); // Add the new expense to the list

      // Reset the form
      setNewExpense({
        date: new Date().toISOString().split("T")[0],
        category: "",
        amount: "",
        description: "",
        taxDeductible: false,
      });
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add expense");
    }
  };

  // Simulate deleting an expense
  const handleDeleteExpense = async (expenseId) => {
    try {
      // Simulate deletion
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setExpenses(expenses.filter((expense) => expense.id !== expenseId)); // Remove the expense from the list
    } catch (err) {
      console.error(err);
      setError("Failed to delete expense");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-xl text-gray-600">Loading expense tracker...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/account/signin?callbackUrl=/expenses";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Expense Tracker
            </h1>
            <p className="text-gray-600">Track expenses and tax deductions</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-2 text-sm text-gray-500">Total Expenses</div>
            <div className="text-2xl font-bold text-gray-800">
              ${totalExpenses.toFixed(2)}
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-2 text-sm text-gray-500">Tax Deductible</div>
            <div className="text-2xl font-bold text-green-600">
              ${taxDeductible.toFixed(2)}
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-2 text-sm text-gray-500">
              Potential Tax Savings
            </div>
            <div className="text-2xl font-bold text-[#357AFF]">
              ${(taxDeductible * 0.3).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Add Expense
            </h2>
            <form onSubmit={handleExpenseSubmit}>
              <div className="space-y-4">
                <div>
                  <input
                    type="date"
                    name="date"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 p-2"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 p-2"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 p-2"
                    required
                    step="0.01"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 p-2"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="taxDeductible"
                    checked={newExpense.taxDeductible}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        taxDeductible: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label className="text-gray-700">Tax Deductible</label>
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && setSelectedFile(e.target.files[0])
                    }
                    className="w-full rounded-lg border border-gray-200 p-2"
                  />
                </div>
                {error && <div className="text-red-500">{error}</div>}
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="w-full rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                >
                  {uploadLoading ? "Uploading..." : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Recent Expenses
            </h2>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">
                        {expense.category}
                      </div>
                      <div className="text-sm text-gray-500">
                        {expense.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-gray-800">
                        ${expense.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {expense.date}
                      </div>
                    </div>
                  </div>
                  {expense.receipt && (
                    <div className="mt-2">
                      <a
                        href={expense.receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#357AFF] hover:text-[#2E69DE]"
                      >
                        <i className="fas fa-receipt mr-1"></i>
                        View Receipt
                      </a>
                    </div>
                  )}
                  {expense.taxDeductible && (
                    <div className="mt-2">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                        Tax Deductible
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expenses;

// Mocked hooks for demonstration purposes

function useUser() {
  return {
    data: { id: 1, name: "John Doe", email: "john.doe@example.com" },
    loading: false,
  };
}

function useUpload() {
  return [
    async ({ file }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { url: URL.createObjectURL(file), error: null };
    },
    { loading: false },
  ];
}