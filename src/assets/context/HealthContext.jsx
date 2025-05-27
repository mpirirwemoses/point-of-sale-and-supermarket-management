import React, { createContext, useState } from 'react';

export const HealthContext = createContext();

const HealthProvider = ({ children }) => {
    const [health, setHealth] = useState(100);
    const [orders, setOrders] = useState([]); // Shared orders state

    return (
        <HealthContext.Provider value={{ health, setHealth, orders, setOrders }}>
            {children}
        </HealthContext.Provider>
    );
};

export default HealthProvider;