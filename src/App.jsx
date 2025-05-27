import './App.css'
import Inventory from './assets/Elements/inventoryManagement'
import NewDashboard from './assets/Elements/NewDashboard'
import Employment from './assets/Elements/NewEmployment'
import Expenses from './assets/Elements/NewExpense'
import StockManagement from './assets/Elements/StockManagement'
import Banner from './components/Banner'
// import Cal from './components/Cal'
// import FoodProfile from './components/Foodprof'
import Header from './components/Header'
import FoodProfile from './components/Foodprof'
import KitchenDashboard from './components/KitchenDashboard'
import HealthProvider from './assets/context/HealthContext'
import React, { useState } from 'react';
// import Food from './components/foodUseComponent'

function App() {
  // const [view, setView] = useState('order');

  return (
    <>
      {/* <HealthProvider> */}
      <Header />
      <Banner />
      {/* 
      <div className="flex justify-center gap-4 my-6">
        <button
          className={`px-6 py-2 rounded-lg font-bold transition text-lg shadow-md ${view === 'order' ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border border-pink-300 hover:bg-pink-100'}`}
          onClick={() => setView('order')}
        >
          Order Food
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-bold transition text-lg shadow-md ${view === 'kitchen' ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border border-pink-300 hover:bg-pink-100'}`}
          onClick={() => setView('kitchen')}
        >
          Kitchen Dashboard
        </button>
      </div>
      {view === 'order' ? <FoodProfile /> : <KitchenDashboard />}
      */}
      {/* </HealthProvider> */}

      <Inventory />
      <Expenses />
      <Employment />
      <NewDashboard />
      <StockManagement />
    </>
  );
}

export default App;
