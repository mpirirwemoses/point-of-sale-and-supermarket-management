"use client";
import React from "react";

function MainComponent() {
  const [error, setError] = useState(null);
  const { data: user, loading } = useUser();
  const [metrics, setMetrics] = useState({
    totalSales: 45892,
    inventoryValue: 124500,
    employeeCount: 23,
    pendingOrders: 12,
  });

  const [recentTransactions] = useState([
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
  ]);

  const [lowStockItems] = useState([
    { id: 1, name: "Premium Shirt", stock: 5, threshold: 10 },
    { id: 2, name: "Designer Jeans", stock: 3, threshold: 8 },
    { id: 3, name: "Running Shoes", stock: 4, threshold: 10 },
  ]);

  if (loading) {
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Dashboard
        </h1>
        <p className="text-gray-600">Welcome back, {user.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500">Total Sales</div>
          <div className="text-2xl font-bold text-gray-800">
            ${metrics.totalSales.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500">Inventory Value</div>
          <div className="text-2xl font-bold text-gray-800">
            ${metrics.inventoryValue.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500">Employees</div>
          <div className="text-2xl font-bold text-gray-800">
            {metrics.employeeCount}
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500">Pending Orders</div>
          <div className="text-2xl font-bold text-gray-800">
            {metrics.pendingOrders}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                  <tr key={transaction.id} className="border-b text-sm">
                    <td className="py-3">{transaction.date}</td>
                    <td className="py-3">{transaction.customer}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          transaction.type === "Sale"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3">${transaction.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Low Stock Alerts
          </h2>
          <div className="space-y-4">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-red-50 p-4"
              >
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
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <a
              href="#sales"
              className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-gray-700 hover:bg-gray-100"
            >
              <i className="fas fa-chart-line mb-2 text-2xl text-[#357AFF]"></i>
              <span className="text-sm font-medium">Sales</span>
            </a>
            <a
              href="#inventory"
              className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-gray-700 hover:bg-gray-100"
            >
              <i className="fas fa-box mb-2 text-2xl text-[#357AFF]"></i>
              <span className="text-sm font-medium">Inventory</span>
            </a>
            <a
              href="#employees"
              className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-gray-700 hover:bg-gray-100"
            >
              <i className="fas fa-users mb-2 text-2xl text-[#357AFF]"></i>
              <span className="text-sm font-medium">Employees</span>
            </a>
            <a
              href="#reports"
              className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-gray-700 hover:bg-gray-100"
            >
              <i className="fas fa-file-alt mb-2 text-2xl text-[#357AFF]"></i>
              <span className="text-sm font-medium">Reports</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
//Backend
async function handler({ period = "daily" }) {
    const today = new Date();
    const startDate = new Date();
  
    switch (period) {
      case "weekly":
        startDate.setDate(today.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(today.getMonth() - 1);
        break;
      default: // daily
        startDate.setHours(0, 0, 0, 0);
        break;
    }
  
    const [
      salesData,
      inventoryValue,
      employeeCount,
      pendingOrders,
      lowStockItems,
      recentTransactions,
    ] = await sql.transaction([
      sql`
        SELECT COALESCE(SUM(total_amount), 0) as total_sales 
        FROM sales 
        WHERE transaction_date >= ${startDate}
      `,
  
      sql`
        SELECT COALESCE(SUM(p.unit_price * p.current_stock), 0) as total_value 
        FROM products p
      `,
  
      sql`SELECT COUNT(*) as count FROM employees`,
  
      sql`
        SELECT COUNT(*) as count 
        FROM sales 
        WHERE status = 'pending'
      `,
  
      sql`
        SELECT id, name, current_stock, minimum_stock 
        FROM products 
        WHERE current_stock <= minimum_stock 
        ORDER BY current_stock ASC 
        LIMIT 5
      `,
  
      sql`
        SELECT s.id, s.transaction_date, s.total_amount, s.status,
               c.name as customer_name
        FROM sales s
        LEFT JOIN customers c ON s.customer_id = c.id
        ORDER BY s.transaction_date DESC
        LIMIT 5
      `,
    ]);
  
    return {
      metrics: {
        totalSales: parseFloat(salesData[0].total_sales),
        inventoryValue: parseFloat(inventoryValue[0].total_value),
        employeeCount: parseInt(employeeCount[0].count),
        pendingOrders: parseInt(pendingOrders[0].count),
      },
      lowStockItems: lowStockItems,
      recentTransactions: recentTransactions,
    };
  }