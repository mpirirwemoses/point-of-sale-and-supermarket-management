import React, { useState, useEffect } from 'react';
import { Trash, Pencil, Eye, Lock, AlertTriangle, History, UserCheck, BarChart2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Inventory() {
  // Load data from localStorage or initialize with default values
  const [products, setProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('inventory-products');
      return saved ? JSON.parse(saved) : [
        {
          id: uuidv4(),
          name: "Premium Shirt",
          sku: "SHT001",
          department: "Apparel",
          price: 59.99,
          currentStock: 45,
          minimumStock: 20,
          batchNumber: "B2025011",
          expiryDate: "2025-12-31",
          costPrice: 29.99,
          lastUpdated: new Date().toISOString(),
          updatedBy: "admin@company.com"
        },
        {
          id: uuidv4(),
          name: "Designer Jeans",
          sku: "DNM002",
          department: "Apparel",
          price: 89.99,
          currentStock: 12,
          minimumStock: 15,
          batchNumber: "B2025012",
          expiryDate: "2025-12-31",
          costPrice: 44.99,
          lastUpdated: new Date().toISOString(),
          updatedBy: "admin@company.com"
        },
      ];
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adjustmentHistory, setAdjustmentHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('inventory-history');
      return saved ? JSON.parse(saved) : [
        {
          id: uuidv4(),
          productId: products[0]?.id || '',
          type: "received",
          quantity: 50,
          date: new Date().toISOString(),
          note: "Initial stock receipt",
          changedBy: "admin@company.com",
          previousValue: 0,
          newValue: 50
        },
        {
          id: uuidv4(),
          productId: products[0]?.id || '',
          type: "adjustment",
          quantity: -5,
          date: new Date().toISOString(),
          note: "Damaged inventory removal",
          changedBy: "manager@company.com",
          previousValue: 50,
          newValue: 45
        },
      ];
    }
    return [];
  });

  const [suspiciousActivities, setSuspiciousActivities] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    email: "admin@company.com",
    role: "admin",
    name: "Admin User"
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProductHistory, setSelectedProductHistory] = useState([]);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showSuspiciousActivity, setShowSuspiciousActivity] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const departments = ["Apparel", "Electronics", "Home", "Food"];

  // Save to localStorage whenever products or history changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('inventory-products', JSON.stringify(products));
      localStorage.setItem('inventory-history', JSON.stringify(adjustmentHistory));
    }
  }, [products, adjustmentHistory]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || product.department === selectedDepartment;
    const matchesStock = stockFilter === "all" ||
      (stockFilter === "low" && product.currentStock <= product.minimumStock);
    return matchesSearch && matchesDepartment && matchesStock;
  });

  const handleAddProduct = (newProduct) => {
    const productWithMetadata = {
      ...newProduct,
      id: uuidv4(),
      lastUpdated: new Date().toISOString(),
      updatedBy: currentUser.email
    };
    
    setProducts([...products, productWithMetadata]);
    
    // Log this addition to history
    const historyEntry = {
      id: uuidv4(),
      productId: productWithMetadata.id,
      type: "added",
      quantity: newProduct.currentStock,
      date: new Date().toISOString(),
      note: "New product added to inventory",
      changedBy: currentUser.email,
      previousValue: 0,
      newValue: newProduct.currentStock
    };
    
    setAdjustmentHistory([...adjustmentHistory, historyEntry]);
    setShowAddModal(false);
    toast.success("Product added successfully!");
    
    // Check for suspicious activity (e.g., very low price)
    if (newProduct.price < newProduct.costPrice) {
      const suspiciousEntry = {
        id: uuidv4(),
        type: "price_manipulation",
        description: `Product ${newProduct.name} added with price ($${newProduct.price}) below cost ($${newProduct.costPrice})`,
        date: new Date().toISOString(),
        user: currentUser.email,
        severity: "high"
      };
      setSuspiciousActivities([...suspiciousActivities, suspiciousEntry]);
      toast.warning("Warning: Product added with price below cost!");
    }
  };

  const handleEditProduct = (updatedProduct) => {
    const originalProduct = products.find(p => p.id === updatedProduct.id);
    
    // Check for suspicious changes
    if (originalProduct.price !== updatedProduct.price && currentUser.role !== 'admin') {
      const suspiciousEntry = {
        id: uuidv4(),
        type: "price_change",
        description: `Product ${updatedProduct.name} price changed from $${originalProduct.price} to $${updatedProduct.price}`,
        date: new Date().toISOString(),
        user: currentUser.email,
        severity: "medium"
      };
      setSuspiciousActivities([...suspiciousActivities, suspiciousEntry]);
      toast.warning("Price change requires admin approval!");
    }
    
    if (originalProduct.currentStock !== updatedProduct.currentStock) {
      const quantityChange = updatedProduct.currentStock - originalProduct.currentStock;
      const historyEntry = {
        id: uuidv4(),
        productId: updatedProduct.id,
        type: quantityChange > 0 ? "received" : "sold",
        quantity: quantityChange,
        date: new Date().toISOString(),
        note: "Stock level adjusted",
        changedBy: currentUser.email,
        previousValue: originalProduct.currentStock,
        newValue: updatedProduct.currentStock
      };
      setAdjustmentHistory([...adjustmentHistory, historyEntry]);
      
      // Check for suspicious stock changes
      if (Math.abs(quantityChange) > 50 && currentUser.role !== 'admin') {
        const suspiciousEntry = {
          id: uuidv4(),
          type: "large_stock_change",
          description: `Large stock adjustment (${quantityChange} units) for ${updatedProduct.name}`,
          date: new Date().toISOString(),
          user: currentUser.email,
          severity: "medium"
        };
        setSuspiciousActivities([...suspiciousActivities, suspiciousEntry]);
      }
    }
    
    const productWithMetadata = {
      ...updatedProduct,
      lastUpdated: new Date().toISOString(),
      updatedBy: currentUser.email
    };
    
    setProducts(products.map(p => p.id === updatedProduct.id ? productWithMetadata : p));
    setEditingProduct(null);
    toast.success("Product updated successfully!");
  };

  const handleDeleteProduct = (productId) => {
    const productToDelete = products.find(p => p.id === productId);
    
    if (currentUser.role !== 'admin') {
      const suspiciousEntry = {
        id: uuidv4(),
        type: "delete_attempt",
        description: `Attempt to delete product ${productToDelete.name}`,
        date: new Date().toISOString(),
        user: currentUser.email,
        severity: "high"
      };
      setSuspiciousActivities([...suspiciousActivities, suspiciousEntry]);
      toast.error("Only admins can delete products!");
      return;
    }
    
    setProducts(products.filter(p => p.id !== productId));
    
    // Log this deletion to history
    const historyEntry = {
      id: uuidv4(),
      productId: productId,
      type: "deleted",
      quantity: -productToDelete.currentStock,
      date: new Date().toISOString(),
      note: "Product removed from inventory",
      changedBy: currentUser.email,
      previousValue: productToDelete.currentStock,
      newValue: 0
    };
    
    setAdjustmentHistory([...adjustmentHistory, historyEntry]);
    toast.success("Product deleted successfully!");
  };

  const viewProductHistory = (productId) => {
    const productHistory = adjustmentHistory.filter(h => h.productId === productId);
    setSelectedProductHistory(productHistory);
    setShowHistoryModal(true);
  };

  const calculateInventoryValue = () => {
    return products.reduce((total, product) => {
      return total + (product.currentStock * product.price);
    }, 0).toFixed(2);
  };

  const calculateCostValue = () => {
    return products.reduce((total, product) => {
      return total + (product.currentStock * product.costPrice);
    }, 0).toFixed(2);
  };

  const lowStockItems = products.filter(p => p.currentStock <= p.minimumStock).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header with user info */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Inventory Management
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserCheck size={16} />
              <span>Logged in as: {currentUser.name} ({currentUser.role})</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowAuditLog(true)}
              className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
              <History size={16} /> Audit Log
            </button>
            <button
              onClick={() => setShowSuspiciousActivity(true)}
              className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-red-800 hover:bg-red-200"
            >
              <AlertTriangle size={16} /> Alerts
              {suspiciousActivities.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                  {suspiciousActivities.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 text-blue-800 hover:bg-blue-200"
            >
              <BarChart2 size={16} /> Analytics
            </button>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
              >
                <i className="fas fa-plus"></i> Add Product
              </button>
            )}
          </div>
        </div>

        {/* Inventory Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <p className="text-2xl font-semibold">{products.length}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
            <p className="text-2xl font-semibold">${calculateInventoryValue()}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Cost Value</h3>
            <p className="text-2xl font-semibold">${calculateCostValue()}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
            <p className="text-2xl font-semibold">{lowStockItems}</p>
          </div>
        </div>

        {/* Filters */}
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

        {/* Products Table */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Price/Cost</th>
                  <th className="pb-3">Batch/Expiry</th>
                  <th className="pb-3">Last Updated</th>
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
                    <td className="py-4">
                      <div className="font-medium">${product.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">Cost: ${product.costPrice?.toFixed(2) || 'N/A'}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm">{product.batchNumber}</div>
                      <div className="text-sm text-gray-500">{product.expiryDate}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm">{new Date(product.lastUpdated).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{product.updatedBy}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewProductHistory(product.id)}
                          className="rounded p-2 text-gray-600 hover:bg-gray-100"
                          title="View History"
                        >
                          <Eye size={18} />
                        </button>
                        {currentUser.role === 'admin' && (
                          <>
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setShowAddModal(true);
                              }}
                              className="rounded p-2 text-blue-600 hover:bg-blue-100"
                              title="Edit Product"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="rounded p-2 text-red-600 hover:bg-red-100"
                              title="Delete Product"
                            >
                              <Trash size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
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
                  costPrice: parseFloat(formData.get("costPrice")),
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
              <div>
                <label className="mb-1 block text-sm text-gray-600">Product Name</label>
                <input
                  name="name"
                  defaultValue={editingProduct?.name}
                  placeholder="Product Name"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm text-gray-600">SKU</label>
                <input
                  name="sku"
                  defaultValue={editingProduct?.sku}
                  placeholder="SKU"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm text-gray-600">Department</label>
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-600">Price ($)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    defaultValue={editingProduct?.price}
                    placeholder="Price"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600">Cost ($)</label>
                  <input
                    name="costPrice"
                    type="number"
                    step="0.01"
                    min="0.01"
                    defaultValue={editingProduct?.costPrice}
                    placeholder="Cost"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-600">Current Stock</label>
                  <input
                    name="currentStock"
                    type="number"
                    min="0"
                    defaultValue={editingProduct?.currentStock}
                    placeholder="Current Stock"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600">Minimum Stock</label>
                  <input
                    name="minimumStock"
                    type="number"
                    min="0"
                    defaultValue={editingProduct?.minimumStock}
                    placeholder="Minimum Stock"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-600">Batch Number</label>
                  <input
                    name="batchNumber"
                    defaultValue={editingProduct?.batchNumber}
                    placeholder="Batch Number"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600">Expiry Date</label>
                  <input
                    name="expiryDate"
                    type="date"
                    defaultValue={editingProduct?.expiryDate}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
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

      {/* Product History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Product History</h2>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Quantity</th>
                    <th className="pb-3">Changed By</th>
                    <th className="pb-3">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProductHistory.map((history) => (
                    <tr key={history.id} className="border-b">
                      <td className="py-3">{new Date(history.date).toLocaleString()}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            history.type === "received" || history.type === "added"
                              ? "bg-green-100 text-green-800"
                              : history.type === "sold" || history.type === "deleted"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {history.type}
                        </span>
                      </td>
                      <td className="py-3">
                        {history.type === 'added' ? (
                          <span className="text-green-600">+{history.quantity}</span>
                        ) : history.type === 'deleted' ? (
                          <span className="text-red-600">-{Math.abs(history.quantity)}</span>
                        ) : history.quantity > 0 ? (
                          <span className="text-green-600">+{history.quantity}</span>
                        ) : (
                          <span className="text-red-600">{history.quantity}</span>
                        )}
                      </td>
                      <td className="py-3 text-sm">{history.changedBy}</td>
                      <td className="py-3 text-sm">{history.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {showAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-4xl rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Audit Log</h2>
              <button
                onClick={() => setShowAuditLog(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Action</th>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustmentHistory.map((log) => (
                    <tr key={log.id} className="border-b">
                      <td className="py-3">{new Date(log.date).toLocaleString()}</td>
                      <td className="py-3 capitalize">{log.type}</td>
                      <td className="py-3 text-sm">{log.changedBy}</td>
                      <td className="py-3 text-sm">
                        {log.type === 'added' && `Added ${log.quantity} units of ${products.find(p => p.id === log.productId)?.name || 'product'}`}
                        {log.type === 'deleted' && `Deleted ${products.find(p => p.id === log.productId)?.name || 'product'}`}
                        {log.type === 'received' && `Received ${log.quantity} units of ${products.find(p => p.id === log.productId)?.name || 'product'}`}
                        {log.type === 'sold' && `Sold ${Math.abs(log.quantity)} units of ${products.find(p => p.id === log.productId)?.name || 'product'}`}
                        {log.type === 'adjustment' && `Adjusted stock by ${log.quantity} units for ${products.find(p => p.id === log.productId)?.name || 'product'}`}
                        {log.note && ` (${log.note})`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Suspicious Activity Modal */}
      {showSuspiciousActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-4xl rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Suspicious Activity Alerts</h2>
              <button
                onClick={() => setShowSuspiciousActivity(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {suspiciousActivities.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No suspicious activities detected
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Severity</th>
                      <th className="pb-3">User</th>
                      <th className="pb-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suspiciousActivities.map((activity) => (
                      <tr key={activity.id} className="border-b">
                        <td className="py-3">{new Date(activity.date).toLocaleString()}</td>
                        <td className="py-3 capitalize">{activity.type.replace('_', ' ')}</td>
                        <td className="py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              activity.severity === "high"
                                ? "bg-red-100 text-red-800"
                                : activity.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {activity.severity}
                          </span>
                        </td>
                        <td className="py-3 text-sm">{activity.user}</td>
                        <td className="py-3 text-sm">{activity.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
{/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-4xl rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Inventory Analytics</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 text-lg font-medium">Stock Levels by Department</h3>
                <div className="space-y-2">
                  {departments.map(dept => {
                    const deptProducts = products.filter(p => p.department === dept);
                    const totalStock = deptProducts.reduce((sum, p) => sum + p.currentStock, 0);
                    return (
                      <div key={dept} className="mb-2">
                        <div className="mb-1 flex justify-between text-sm">
                          <span>{dept}</span>
                          <span>{totalStock} units</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div 
                            className="h-2 rounded-full bg-blue-500" 
                            style={{ width: `${(totalStock / Math.max(1, products.reduce((sum, p) => sum + p.currentStock, 0))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 text-lg font-medium">Inventory Value by Department</h3>
                <div className="space-y-2">
                  {departments.map(dept => {
                    const deptProducts = products.filter(p => p.department === dept);
                    const totalValue = deptProducts.reduce((sum, p) => sum + (p.currentStock * p.price), 0);
                    return (
                      <div key={dept} className="mb-2">
                        <div className="mb-1 flex justify-between text-sm">
                          <span>{dept}</span>
                          <span>${totalValue.toFixed(2)}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${(totalValue / Math.max(1, products.reduce((sum, p) => sum + (p.currentStock * p.price), 0))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="rounded-lg border border-gray-200 p-4 md:col-span-2">
                <h3 className="mb-2 text-lg font-medium">Recent Stock Movements</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-gray-500">
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Product</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Quantity</th>
                        <th className="pb-2">User</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...adjustmentHistory]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 5)
                        .map(log => (
                          <tr key={log.id} className="border-b">
                            <td className="py-2 text-sm">{new Date(log.date).toLocaleDateString()}</td>
                            <td className="py-2 text-sm">{products.find(p => p.id === log.productId)?.name || 'Unknown'}</td>
                            <td className="py-2 text-sm capitalize">{log.type}</td>
                            <td className="py-2 text-sm">
                              {log.quantity > 0 ? (
                                <span className="text-green-600">+{log.quantity}</span>
                              ) : (
                                <span className="text-red-600">{log.quantity}</span>
                              )}
                            </td>
                            <td className="py-2 text-sm">{log.changedBy}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;