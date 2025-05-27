"use client";
import React from "react";
import {useState} from 'react'
import { Trash, Pencil } from "lucide-react";

function Inventory() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Shirt",
      sku: "SHT001",
      department: "Apparel",
      price: 59.99,
      currentStock: 45,
      minimumStock: 20,
      batchNumber: "B2025011",
      expiryDate: "2025-12-31",
    },
    {
      id: 2,
      name: "Designer Jeans",
      sku: "DNM002",
      department: "Apparel",
      price: 89.99,
      currentStock: 12,
      minimumStock: 15,
      batchNumber: "B2025012",
      expiryDate: "2025-12-31",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adjustmentHistory] = useState([
    {
      id: 1,
      productId: 1,
      type: "received",
      quantity: 50,
      date: "2025-01-20",
      note: "Initial stock receipt",
    },
    {
      id: 2,
      productId: 1,
      type: "adjustment",
      quantity: -5,
      date: "2025-01-21",
      note: "Damaged inventory removal",
    },
  ]);

  const departments = ["Apparel", "Electronics", "Home", "Food"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" || product.department === selectedDepartment;
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && product.currentStock <= product.minimumStock);
    return matchesSearch && matchesDepartment && matchesStock;
  });

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { id: products.length + 1, ...newProduct }]);
    setShowAddModal(false);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((p) => p.id !== productId));
  };




  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Inventory Management
          </h1>

          
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
          >
            <i className="fas fa-plus mr-2"></i>Add Product
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none"
          >
            <option value="all">All Stock Levels</option>
            <option value="low">Low Stock</option>
          </select>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Batch</th>
                  <th className="pb-3">Expiry</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-4">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sku}</div>
                    </td>
                    <td className="py-4">{product.department}</td>
                    <td className="py-4">
                      <div
                        className={`inline-flex rounded-full px-2 py-1 text-xs ${
                          product.currentStock <= product.minimumStock
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.currentStock} units
                      </div>
                    </td>
                    <td className="py-4">{product.batchNumber}</td>
                    <td className="py-4">{product.expiryDate}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                                          <button

                         onClick={() => {
                            setEditingProduct(product);
                            setShowAddModal(true);
                         }}
                         className="rounded p-2 text-blue-600 hover:bg-gray-100"
                         title="Edit Employee Details"
                       >
                         <Pencil size={18} />
                       </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                        >

                          <Trash className="w-5 h-5 text-red-500 cursor-pointer" />

                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Stock Adjustment History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {adjustmentHistory.map((adjustment) => (
                  <tr key={adjustment.id} className="border-b">
                    <td className="py-4">{adjustment.date}</td>
                    <td className="py-4">
                      {
                        products.find((p) => p.id === adjustment.productId)
                          ?.name
                      }
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          adjustment.type === "received"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {adjustment.type}
                      </span>
                    </td>
                    <td className="py-4">{adjustment.quantity}</td>
                    <td className="py-4">{adjustment.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const productData = {
                  name: formData.get("name"),
                  sku: formData.get("sku"),
                  department: formData.get("department"),
                  price: parseFloat(formData.get("price")),
                  currentStock: parseInt(formData.get("currentStock")),
                  minimumStock: parseInt(formData.get("minimumStock")),
                  batchNumber: formData.get("batchNumber"),
                  expiryDate: formData.get("expiryDate"),
                };
                if (editingProduct) {
                  handleEditProduct({ ...productData, id: editingProduct.id });
                } else {
                  handleAddProduct(productData);
                }
              }}
              className="space-y-4"
            >
              <input
                name="name"
                defaultValue={editingProduct?.name}
                placeholder="Product Name"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2"
              />
              <input
                name="sku"
                defaultValue={editingProduct?.sku}
                placeholder="SKU"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2"
              />
              <select
                name="department"
                defaultValue={editingProduct?.department}
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price}
                placeholder="Price"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2"
              />
              <input
                name="currentStock"
                type="number"
                defaultValue={editingProduct?.currentStock}
                placeholder="Current Stock"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2"
              />
              <input
                name="minimumStock"
                type="number"
                defaultValue={editingProduct?.minimumStock}
                placeholder="Minimum Stock"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2"
              />
              <input
                name="batchNumber"
                defaultValue={editingProduct?.batchNumber}
                placeholder="Batch Number"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2"
              />
              <input
                name="expiryDate"
                type="date"
                defaultValue={editingProduct?.expiryDate}
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                >
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
// Backend Endpoint (Node.js/Express example)
/*async function handler({ action, data }) {
    if (!action) {
      return { error: "Action is required" };
    }
  
    switch (action) {
      case "add_product":
        if (
          !data?.name ||
          !data?.sku ||
          !data?.department ||
          !data?.price ||
          !data?.minimumStock
        ) {
          return { error: "Missing required product information" };
        }
  
        const [newProduct] = await sql`
          INSERT INTO products (
            name, sku, department, unit_price, current_stock, 
            minimum_stock, batch_number, expiry_date
          )
          VALUES (
            ${data.name}, ${data.sku}, ${data.department}, ${data.price},
            ${data.initialStock || 0}, ${data.minimumStock},
            ${data.batchNumber || null}, ${data.expiryDate || null}
          )
          RETURNING *
        `;
        return { product: newProduct };
  
      case "update_product":
        if (!data?.id) {
          return { error: "Product ID is required" };
        }
  
        const setClauses = [];
        const values = [];
        let paramCount = 1;
  
        if (data.name) {
          setClauses.push(`name = $${paramCount}`);
          values.push(data.name);
          paramCount++;
        }
        if (data.sku) {
          setClauses.push(`sku = $${paramCount}`);
          values.push(data.sku);
          paramCount++;
        }
        if (data.department) {
          setClauses.push(`department = $${paramCount}`);
          values.push(data.department);
          paramCount++;
        }
        if (data.price) {
          setClauses.push(`unit_price = $${paramCount}`);
          values.push(data.price);
          paramCount++;
        }
        if (data.minimumStock) {
          setClauses.push(`minimum_stock = $${paramCount}`);
          values.push(data.minimumStock);
          paramCount++;
        }
  
        values.push(data.id);
        const [updatedProduct] = await sql(
          `UPDATE products SET ${setClauses.join(
            ", "
          )} WHERE id = $${paramCount} RETURNING *`,
          values
        );
        return { product: updatedProduct };
  
      case "delete_product":
        if (!data?.id) {
          return { error: "Product ID is required" };
        }
  
        await sql`DELETE FROM products WHERE id = ${data.id}`;
        return { success: true };
  
      case "adjust_stock":
        if (!data?.productId || data?.quantity === undefined) {
          return { error: "Product ID and quantity are required" };
        }
  
        return await sql.transaction(async (sql) => {
          const [product] = await sql`
            SELECT current_stock FROM products WHERE id = ${data.productId}
          `;
  
          if (!product) {
            return { error: "Product not found" };
          }
  
          const newStock = product.current_stock + data.quantity;
          if (newStock < 0) {
            return { error: "Insufficient stock" };
          }
  
          const [updatedProduct] = await sql`
            UPDATE products 
            SET current_stock = ${newStock}
            WHERE id = ${data.productId}
            RETURNING *
          `;
  
          await sql`
            INSERT INTO stock_adjustments (
              product_id, quantity, adjustment_type, note
            )
            VALUES (
              ${data.productId}, ${data.quantity},
              ${data.quantity > 0 ? "received" : "adjustment"},
              ${data.note || null}
            )
          `;
  
          return { product: updatedProduct };
        });
  
      default:
        return { error: "Invalid action" };
    }
  } */