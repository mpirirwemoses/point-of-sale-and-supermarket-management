"use client";
import React from "react";

function MainComponent() {
  const [cart, setCart] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const [products] = useState([
    { id: 1, name: "Premium Shirt", price: 59.99, barcode: "123456789" },
    { id: 2, name: "Designer Jeans", price: 89.99, barcode: "987654321" },
    { id: 3, name: "Running Shoes", price: 129.99, barcode: "456789123" },
  ]);

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const product = products.find((p) => p.barcode === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput("");
    } else {
      setError("Product not found");
      setTimeout(() => setError(null), 3000);
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCart([]);
      setShowPayment(false);
      setLoading(false);
    } catch (err) {
      setError("Payment processing failed");
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 md:text-3xl">
          Sales Checkout
        </h1>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <form onSubmit={handleBarcodeSubmit} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Scan barcode or enter manually"
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                  >
                    <i className="fas fa-barcode"></i>
                  </button>
                </div>
              </form>

              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="rounded-lg border border-gray-200 p-4 text-left hover:border-[#357AFF]"
                  >
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">
                      ${product.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Shopping Cart</h2>
              {cart.length === 0 ? (
                <div className="text-center text-gray-500">Cart is empty</div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          ${item.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="rounded-full bg-gray-100 p-1 hover:bg-gray-200"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="rounded-full bg-gray-100 p-1 hover:bg-gray-200"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPayment(true)}
                    className="mt-4 w-full rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {showPayment && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold">Payment</h2>
              <div className="mb-4 space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span>Credit Card</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />
                  <span>Cash</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE] disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Complete Payment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 rounded-lg bg-red-50 p-4 text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;

// Backend
async function handler({ items, customerId, paymentMethod, employeeId }) {
    const TAX_RATE = 0.08;
  
    if (!items?.length) {
      return { error: "No items in cart" };
    }
  
    return await sql.transaction(async (sql) => {
      const productIds = items.map((item) => item.productId);
      const products = await sql`
        SELECT id, name, unit_price, current_stock 
        FROM products 
        WHERE id = ANY(${productIds})
      `;
  
      if (products.length !== items.length) {
        return { error: "Some products not found" };
      }
  
      let subtotal = 0;
      const stockUpdates = [];
      const saleItems = [];
  
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
  
        if (product.current_stock < item.quantity) {
          return { error: `Insufficient stock for ${product.name}` };
        }
  
        const itemTotal = product.unit_price * item.quantity;
        subtotal += itemTotal;
  
        stockUpdates.push(sql`
          UPDATE products 
          SET current_stock = current_stock - ${item.quantity}
          WHERE id = ${product.id}
        `);
  
        saleItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.unit_price,
          subtotal: itemTotal,
        });
      }
  
      const taxAmount = subtotal * TAX_RATE;
      const discountAmount = 0;
      const totalAmount = subtotal + taxAmount - discountAmount;
  
      const [sale] = await sql`
        INSERT INTO sales (
          customer_id, 
          employee_id,
          total_amount,
          tax_amount,
          discount_amount,
          payment_method
        )
        VALUES (
          ${customerId},
          ${employeeId},
          ${totalAmount},
          ${taxAmount},
          ${discountAmount},
          ${paymentMethod}
        )
        RETURNING id
      `;
  
      for (const item of saleItems) {
        await sql`
          INSERT INTO sale_items (
            sale_id,
            product_id,
            quantity,
            unit_price,
            subtotal
          )
          VALUES (
            ${sale.id},
            ${item.productId},
            ${item.quantity},
            ${item.unitPrice},
            ${item.subtotal}
          )
        `;
      }
  
      for (const update of stockUpdates) {
        await update;
      }
  
      return {
        saleId: sale.id,
        items: saleItems,
        subtotal,
        tax: taxAmount,
        discount: discountAmount,
        total: totalAmount,
        paymentMethod,
        timestamp: new Date().toISOString(),
      };
    });
  }