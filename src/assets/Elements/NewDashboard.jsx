"use client";
import React, { useState, useEffect } from "react";

function NewDashboard() {
  const [error, setError] = useState(null);
  const { data: user, loading: userLoading } = useUser();
  const [metrics, setMetrics] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching metrics from the backend
  const fetchMetrics = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      const dummyMetrics = {
        totalSales: 45892,
        inventoryValue: 124500,
        employeeCount: 23,
        pendingOrders: 12,
      };
      setMetrics(dummyMetrics);
    } catch (err) {
      setError("Failed to load metrics");
      console.error(err);
    }
  };

  // Simulate fetching recent transactions from the backend
  const fetchRecentTransactions = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      const dummyTransactions = [
        {
          id: 1,
          date: "2025-01-20",
          amount: 299.99,
          type: "Sale",
          customer: "John Doe",
        },
        {
          id: 2,
          date: "2025-01-20",
          amount: 159.5,
          type: "Sale",
          customer: "Jane Smith",
        },
        {
          id: 3,
          date: "2025-01-19",
          amount: 499.99,
          type: "Return",
          customer: "Mike Johnson",
        },
        {
          id: 4,
          date: "2025-01-19",
          amount: 89.99,
          type: "Sale",
          customer: "Sarah Williams",
        },
      ];
      setRecentTransactions(dummyTransactions);
    } catch (err) {
      setError("Failed to load recent transactions");
      console.error(err);
    }
  };

  // Simulate fetching low stock items from the backend
  const fetchLowStockItems = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      const dummyLowStockItems = [
        { id: 1, name: "Premium Shirt", stock: 5, threshold: 10 },
        { id: 2, name: "Designer Jeans", stock: 3, threshold: 8 },
        { id: 3, name: "Running Shoes", stock: 4, threshold: 10 },
      ];
      setLowStockItems(dummyLowStockItems);
    } catch (err) {
      setError("Failed to load low stock items");
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchMetrics(), fetchRecentTransactions(), fetchLowStockItems()])
        .catch((err) => {
          setError("Failed to load dashboard data");
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  if (userLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl text-gray-600">
            Please sign in to access the dashboard
          </div>
          <a
            href="/account/signin"
            className="rounded-lg bg-[#357AFF] px-6 py-3 text-white hover:bg-[#2E69DE]"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Dashboard
        </h1>
        <p className="text-gray-600">Welcome back, {user.email}</p>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Sales" value={`$${metrics.totalSales?.toLocaleString()}`} />
        <MetricCard title="Inventory Value" value={`$${metrics.inventoryValue?.toLocaleString()}`} />
        <MetricCard title="Employees" value={metrics.employeeCount} />
        <MetricCard title="Pending Orders" value={metrics.pendingOrders} />
      </div>

      {/* Recent Transactions and Low Stock Alerts */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Recent Transactions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Low Stock Alerts
          </h2>
          <div className="space-y-4">
            {lowStockItems.map((item) => (
              <LowStockAlert key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <QuickAccessButton icon="fas fa-chart-line" label="Sales" href="#sales" />
            <QuickAccessButton icon="fas fa-box" label="Inventory" href="#inventory" />
            <QuickAccessButton icon="fas fa-users" label="Employees" href="#employees" />
            <QuickAccessButton icon="fas fa-file-alt" label="Reports" href="#reports" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
const MetricCard = ({ title, value }) => (
  <div className="rounded-xl bg-white p-6 shadow-sm">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
  </div>
);

// Transaction Row Component
const TransactionRow = ({ transaction }) => (
  <tr className="border-b text-sm">
    <td className="py-3">{transaction.date}</td>
    <td className="py-3">{transaction.customer}</td>
    <td className="py-3">
      <span
        className={`rounded-full px-2 py-1 text-xs ${transaction.type === "Sale" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
      >
        {transaction.type}
      </span>
    </td>
    <td className="py-3">${transaction.amount}</td>
  </tr>
);

// Low Stock Alert Component
const LowStockAlert = ({ item }) => (
  <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
    <div>
      <div className="font-medium text-gray-800">{item.name}</div>
      <div className="text-sm text-red-600">
        Only {item.stock} units left
      </div>
    </div>
    <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
      Restock
    </button>
  </div>
);

// Quick Access Button Component
const QuickAccessButton = ({ icon, label, href }) => (
  <a
    href={href}
    className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-gray-700 hover:bg-gray-100"
  >
    <i className={`${icon} mb-2 text-2xl text-[#357AFF]`}></i>
    <span className="text-sm font-medium">{label}</span>
  </a>
);

export default NewDashboard;

// Mocked hooks for demonstration purposes
function useUser() {
  return {
    data: { email: "admin@example.com" },
    loading: false,
  };
}