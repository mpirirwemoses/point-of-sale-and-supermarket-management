"use client";
import React from "react";
import {Link } from "react-router-dom"; // Adjust the import based on your routing library
import { BarChart, PieChart, LineChart } from "./ChartComponents"; // Assume these are custom chart components

const Dashboard = () => {
  // Sample data for charts
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [5000, 8000, 6500, 9000, 7500, 11000],
        backgroundColor: '#4f46e5',
      },
    ],
  };

  const inventoryData = {
    labels: ['Food', 'Drinks', 'Household', 'Personal Care'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'],
      },
    ],
  };

  const revenueData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 22000],
        borderColor: '#4f46e5',
        tension: 0.1,
      },
    ],
  };

  const metrics = [
    { title: "Today's Sales", value: "$2,450", change: "+12%", trend: "up" },
    { title: "Total Inventory", value: "1,245 items", change: "+5%", trend: "up" },
    { title: "New Orders", value: "24", change: "-3%", trend: "down" },
    { title: "Customer Visits", value: "356", change: "+18%", trend: "up" },
  ];

  const recentTransactions = [
    { id: 1, product: "Milk 1L", amount: "$3.50", time: "10:30 AM", status: "completed" },
    { id: 2, product: "Bread", amount: "$2.00", time: "10:32 AM", status: "completed" },
    { id: 3, product: "Eggs (12)", amount: "$4.50", time: "10:35 AM", status: "pending" },
    { id: 4, product: "Rice 5kg", amount: "$12.00", time: "10:40 AM", status: "completed" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Static Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">MiniMarket Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center p-2 text-white bg-indigo-600 rounded">
                <i className="fas fa-tachometer-alt mr-3"></i>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/employees" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                <i className="fas fa-users mr-3"></i>
                Employees
              </Link>
            </li>
            <li>
              <Link href="/expenses" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                <i className="fas fa-receipt mr-3"></i>
                Expenses
              </Link>
            </li>
            <li>
              <Link href="/inventory" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                <i className="fas fa-boxes mr-3"></i>
                Inventory
              </Link>
            </li>
            <li>
              <Link href="/stats" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                <i className="fas fa-chart-bar mr-3"></i>
                Statistics
              </Link>
            </li>
            <li>
              <Link href="/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                <i className="fas fa-cog mr-3"></i>
                Settings
              </Link>
            </li>
            <li className="border-t mt-4 pt-4">
              <Link href="/logout" className="flex items-center p-2 text-red-600 hover:bg-red-50 rounded">
                <i className="fas fa-sign-out-alt mr-3"></i>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-500">{metric.title}</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</div>
              <div className={`flex items-center mt-2 text-sm ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {metric.change}
                <i className={`fas fa-arrow-${metric.trend} ml-1`}></i>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales</h2>
            <div className="h-64">
              <BarChart data={salesData} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventory Distribution</h2>
            <div className="h-64">
              <PieChart data={inventoryData} />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h2>
            <div className="h-64">
              <LineChart data={revenueData} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="font-medium text-gray-800">{transaction.product}</div>
                    <div className="text-sm text-gray-500">{transaction.time}</div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-3">{transaction.amount}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transaction.status === "completed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
              <button className="w-full mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View all transactions →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;