import React, { useContext, useState } from 'react';
import { HealthContext } from '../assets/context/HealthContext';

const KitchenDashboard = () => {
    const { orders } = useContext(HealthContext);
    const [statusMap, setStatusMap] = useState({});

    const handleStatusChange = (index, status) => {
        setStatusMap((prev) => ({ ...prev, [index]: status }));
    };

    // Show newest orders first
    const displayedOrders = [...orders].reverse();

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 p-8">
            <h1 className="text-3xl font-bold text-pink-700 mb-8 text-center">Kitchen Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedOrders.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 text-xl">No orders yet.</div>
                ) : (
                    displayedOrders.map((order, idx) => (
                        <div key={displayedOrders.length - 1 - idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-pink-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg text-pink-600">Table #{order.tableNumber}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMap[idx] === 'completed' ? 'bg-green-200 text-green-700' : statusMap[idx] === 'inprogress' ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-200 text-gray-700'}`}>{statusMap[idx] ? statusMap[idx].toUpperCase() : 'PENDING'}</span>
                            </div>
                            {order.chairNumber && (
                                <div className="mb-1 text-sm text-pink-500 font-semibold">Chair Number: {order.chairNumber}</div>
                            )}
                            {!order.chairNumber && (
                                <div className="mb-1 text-sm text-gray-400 font-semibold">Chair Number: N/A</div>
                            )}
                            <div className="text-gray-700 mb-1"><strong>Meal:</strong> {order.mealType}</div>
                            <div className="mb-2">
                                <strong>Items:</strong>
                                <div className="flex flex-col gap-2 mt-2">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between bg-pink-50 border border-pink-100 rounded-lg px-4 py-2 shadow-sm">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-pink-700 text-base">{item.name}</span>
                                                <span className="text-gray-500 text-sm">{item.detail}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="ml-4 px-3 py-1 bg-pink-200 text-pink-800 rounded-full font-bold text-lg shadow">{item.quantity}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button
                                    className={`px-4 py-2 rounded-lg font-semibold transition ${statusMap[idx] === 'inprogress' ? 'bg-yellow-400 text-white' : 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'}`}
                                    onClick={() => handleStatusChange(idx, 'inprogress')}
                                    disabled={statusMap[idx] === 'completed'}
                                >
                                    In Progress
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-lg font-semibold transition ${statusMap[idx] === 'completed' ? 'bg-green-400 text-white' : 'bg-green-200 text-green-800 hover:bg-green-300'}`}
                                    onClick={() => handleStatusChange(idx, 'completed')}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default KitchenDashboard; 