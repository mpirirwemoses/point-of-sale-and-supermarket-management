"use client";
import React, { useState } from "react";

function StockManagement() {
  // Dummy data for products in the database
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Shirt",
      price: 49.99,
      stock: 50,
      barcode: "SHIRT12345",
    },
    {
      id: 2,
      name: "Designer Jeans",
      price: 89.99,
      stock: 20,
      barcode: "JEANS67890",
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 129.99,
      stock: 10,
      barcode: "SHOES54321",
    },
  ]);

  const [scanInput, setScanInput] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // State to track scanned items and their quantities
  const [scannedItems, setScannedItems] = useState([]);

  // Simulate scanning a product by barcode or name
  const handleScan = () => {
    setError(null);
    setSuccessMessage(null);

    // Find the product by barcode or name
    const product = products.find(
      (p) =>
        p.barcode === scanInput || p.name.toLowerCase() === scanInput.toLowerCase()
    );

    if (!product) {
      setError("Product not found. Please check the barcode or name.");
      return;
    }

    if (product.stock <= 0) {
      setError(`Insufficient stock for "${product.name}".`);
      return;
    }

    // Deduct stock and update scanned items
    const updatedProducts = products.map((p) =>
      p.id === product.id ? { ...p, stock: p.stock - 1 } : p
    );

    // Update scanned items list
    const existingItem = scannedItems.find((item) => item.id === product.id);
    if (existingItem) {
      // Increment quantity if the item is already scanned
      const updatedScannedItems = scannedItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setScannedItems(updatedScannedItems);
    } else {
      // Add the new item to the scanned list
      setScannedItems([...scannedItems, { ...product, quantity: 1 }]);
    }

    setProducts(updatedProducts);
    setSuccessMessage(`"${product.name}" scanned successfully. Remaining stock: ${product.stock - 1}`);
    setScanInput(""); // Clear the input field after scanning
  };

  // Calculate the total price of scanned items
  const calculateTotalPrice = () => {
    return scannedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Refresh scanned items
  const refreshScannedItems = () => {
    setScannedItems([]); // Clear the scanned items list
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Stock Management</h1>
        <p className="text-gray-600">Scan products to manage stock levels.</p>
      </div>

      {/* Scan Input Section */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Scan Product
        </h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter barcode or product name"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2"
          />
          <button
            onClick={handleScan}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Scan
          </button>
        </div>
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-500">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-500">
            {successMessage}
          </div>
        )}
      </div>

      {/* Scanned Items Section */}
      {scannedItems.length > 0 && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Scanned Items
            </h2>
            <button
              onClick={refreshScannedItems}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
            >
              Refresh Scanned Products
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Quantity</th>
                  <th className="pb-4">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {scannedItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4">{item.name}</td>
                    <td className="py-4">${item.price.toFixed(2)}</td>
                    <td className="py-4">{item.quantity}</td>
                    <td className="py-4">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="text-lg font-bold text-gray-800">
              Total: ${calculateTotalPrice().toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Product List Section */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Current Stock Levels
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-4">Name</th>
                <th className="pb-4">Price</th>
                <th className="pb-4">Barcode</th>
                <th className="pb-4">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-4">{product.name}</td>
                  <td className="py-4">${product.price.toFixed(2)}</td>
                  <td className="py-4">{product.barcode}</td>
                  <td className="py-4">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StockManagement;