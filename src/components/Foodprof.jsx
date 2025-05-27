import React, { useState, useContext } from "react";
import { HealthContext } from '../assets/context/HealthContext';

const FoodProfile = () => {
  const { setOrders } = useContext(HealthContext);
  const [food, setFood] = useState([]);
  const [mealType, setMealType] = useState("breakfast");
  const [active, setActive] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [chairNumber, setChairNumber] = useState("");
  const [addedItems, setAddedItems] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [itemSelections, setItemSelections] = useState({});

  const mealData = {
    breakfast: [
      { name: "One cup", details: ["African tea", "Green tea", "Black tea"] },
      { name: "Two cups", details: ["With sugar", "With milk", "Without sugar"] },
      { name: "Porridge", details: ["Millet", "Oats", "Cornmeal"] },
    ],
    lunch: [
      { name: "Matooke", details: ["Steamed bananas", "Mashed bananas", "Fried bananas"], quantityOptions: ["More of it", "Less of it"] },
      { name: "Posho", details: ["Cornmeal dish", "Sorghum dish", "Millet dish"], quantityOptions: ["More of it", "Less of it"] },
      { name: "Rice", details: ["With stew", "Plain rice", "Fried rice"], quantityOptions: ["More of it", "Less of it"] },
    ],
    dinner: [
      { name: "Chapati", details: ["Flatbread", "Stuffed chapati", "Cheese chapati"] },
      { name: "Beans", details: ["Spiced beans", "Plain beans", "Mixed beans"] },
      { name: "Vegetables", details: ["Stir-fried greens", "Boiled greens", "Grilled greens"] },
    ],
    snacks: [
      { name: "Samosas", details: ["Spicy pastry", "Cheese-filled", "Vegetable-filled"] },
      { name: "Mandazi", details: ["Sweet fried dough", "Plain fried dough", "Coconut-flavored"] },
    ],
    dessert: [
      { name: "Ice cream", details: ["Vanilla", "Chocolate", "Strawberry"] },
      { name: "Fruit salad", details: ["Seasonal fruits", "Tropical fruits", "Berries mix"] },
    ],
    drinks: [
      { name: "Pepsi", details: ["Carbonated drink", "Diet Pepsi", "Pepsi Zero"] },
      { name: "Juice", details: ["Mango juice", "Orange juice", "Pineapple juice"] },
      { name: "Water", details: ["Bottled water", "Sparkling water", "Flavored water"] },
    ],
  };

  const Meals = ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert", "Drinks"];

  const handleChange = (meal) => {
    if (!tableNumber.trim()) {
      alert("Please provide a table number first!");
      return;
    }
    setActive(meal);
    setMealType(meal.toLowerCase());
    setFood(mealData[meal.toLowerCase()] || []);
    setAddedItems([]);
    setItemSelections({});
  };

  const handleAddItem = (index) => {
    const updatedAddedItems = [...addedItems];
    updatedAddedItems[index] = !updatedAddedItems[index];
    setAddedItems(updatedAddedItems);
  };

  const handleSelectionChange = (index, type, value) => {
    setItemSelections((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: value,
      },
    }));
  };

  const handleOrderNow = () => {
    if (!tableNumber.trim()) {
      alert("Please provide a table number first!");
      return;
    }
    const hasAddedItems = addedItems.some((item) => item);
    if (!hasAddedItems) {
      alert("Please add at least one item to your order!");
      return;
    }
    // Prepare order for kitchen
    const orderItems = food
      .map((item, idx) => {
        if (!addedItems[idx]) return null;
        const selection = itemSelections[idx] || {};
        return {
          name: item.name,
          detail: selection.detail || item.details[0],
          quantity: selection.quantity || (item.quantityOptions ? item.quantityOptions[0] : 1),
        };
      })
      .filter(Boolean);
    setOrders((prev) => [
      ...prev,
      {
        tableNumber,
        chairNumber: chairNumber.trim() ? chairNumber : undefined,
        mealType: active,
        items: orderItems,
        timestamp: Date.now(),
      },
    ]);
    setShowReceipt(true);
  };

  const getReceiptContent = () => {
    const orderedItems = food
      .map((item, idx) => {
        if (!addedItems[idx]) return null;
        const selection = itemSelections[idx] || {};
        return (
          <div key={idx} className="flex flex-col mb-2">
            <p className="font-bold">{item.name}</p>
            <p>Details: {selection.detail || item.details[0]}</p>
            <p>Quantity: {selection.quantity || (item.quantityOptions ? item.quantityOptions[0] : 1)}</p>
          </div>
        );
      })
      .filter(Boolean);
    return (
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-2xl font-bold text-center mb-4 text-pink-600">Miami Restaurant Receipt</h2>
        <p className="mb-1"><strong>Table Number:</strong> {tableNumber}</p>
        <p className="mb-1"><strong>Chair Number:</strong> {chairNumber || 'N/A'}</p>
        <div className="mb-1"><strong>Meal Type:</strong> {active}</div>
        <hr className="my-2" />
        <h3 className="text-lg font-bold mb-2">Ordered Items:</h3>
        {orderedItems}
        <hr className="my-2" />
        <p className="mb-4"><strong>Total Items:</strong> {addedItems.filter((item) => item).length}</p>
        <button
          className="mt-2 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300 w-full shadow-md"
          onClick={() => {
            setShowReceipt(false);
            setAddedItems([]);
            setFood([]);
            setTableNumber("");
            setActive("");
            setMealType("");
            setItemSelections({});
            setChairNumber("");
            alert("Thank you for your order! Your receipt has been sent to the kitchen.");
          }}
        >
          Close Receipt
        </button>
      </div>
    );
  };

  return (
    <div className="mt-8 p-6 overflow-hidden bg-gradient-to-br from-pink-50 to-pink-200 rounded-2xl shadow-2xl flex flex-col items-center justify-center min-h-screen">
      {/* Table Number Input */}
      <div className="mb-6 w-full max-w-md">
        <label className="block text-gray-700 font-bold mb-2">Table Number:</label>
        <input
          type="text"
          placeholder="Enter Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="border border-pink-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
      </div>

      {/* Chair Number Input */}
      <div className="mb-4 w-full max-w-md">
        <label className="block text-gray-700 font-bold mb-2">Chair Number (optional):</label>
        <input
          type="text"
          placeholder="Enter Chair Number (optional)"
          value={chairNumber}
          onChange={(e) => setChairNumber(e.target.value)}
          className="border border-pink-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
      </div>

      {/* Meal Selection */}
      <div className="mb-6 w-full max-w-2xl">
        <p className="text-gray-700 font-sans text-2xl mb-4 text-center font-semibold">
          Please select your Meal
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Meals.map((m, index) => (
            <button
              key={index}
              className={`rounded-xl p-4 font-bold text-lg shadow-md transition-all duration-200 border-2 ${active === m ? "bg-pink-500 text-white border-pink-600 scale-105" : "bg-white text-pink-600 border-pink-200 hover:bg-pink-100"
                }`}
              onClick={() => handleChange(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Food Details */}
      <div className="flex w-full flex-col justify-center items-center max-w-2xl">
        <h2 className="text-2xl font-bold text-pink-500 mb-4">
          Please Pick the quantity and options you want
        </h2>
        {food.length > 0 ? (
          food.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row px-6 py-6 justify-between items-center w-full mb-4 rounded-xl shadow-md transition-all duration-200 ${addedItems[index] ? "bg-green-100 border-l-8 border-green-400" : "bg-white border-l-8 border-pink-200"
                }`}
            >
              <div className="flex-1 flex flex-col items-start mb-2 md:mb-0">
                <p className="text-gray-700 font-sans text-xl font-bold mb-2">{item.name}</p>
                <div className="flex flex-row gap-2 items-center w-full">
                  {/* Quantity options */}
                  {item.quantityOptions ? (
                    <select
                      className="border border-pink-300 rounded-md p-2 w-40 mr-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                      value={itemSelections[index]?.quantity || item.quantityOptions[0]}
                      onChange={(e) => handleSelectionChange(index, 'quantity', e.target.value)}
                    >
                      {item.quantityOptions.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      min="1"
                      className="border border-pink-300 rounded-md p-2 w-20 mr-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                      placeholder="Quantity"
                      value={itemSelections[index]?.quantity || 1}
                      onChange={(e) => handleSelectionChange(index, 'quantity', e.target.value)}
                    />
                  )}
                  {/* Details dropdown */}
                  <select
                    className="border border-pink-300 rounded-md p-2 w-48 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={itemSelections[index]?.detail || item.details[0]}
                    onChange={(e) => handleSelectionChange(index, 'detail', e.target.value)}
                  >
                    {item.details.map((detail, i) => (
                      <option key={i} value={detail}>{detail}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className={`ml-0 md:ml-4 mt-4 md:mt-0 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md ${addedItems[index] ? "bg-green-400 text-white hover:bg-green-500" : "bg-pink-500 text-white hover:bg-pink-600"
                  }`}
                onClick={() => handleAddItem(index)}
              >
                {addedItems[index] ? "Added" : "Add to Order"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 font-sans text-xl">No items available</p>
        )}
        <button
          className="mt-6 px-8 w-full py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition duration-300 text-xl font-bold shadow-lg"
          onClick={handleOrderNow}
        >
          Order Now
        </button>
      </div>
      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          {getReceiptContent()}
        </div>
      )}
    </div>
  );
};

export default FoodProfile;