import './App.css'
import Inventory from './assets/Elements/inventoryManagement'
import NewDashboard from './assets/Elements/NewDashboard'
import Employment from './assets/Elements/NewEmployment'
import Expenses from './assets/Elements/NewExpense'
import StockManagement from './assets/Elements/StockManagement'
import Banner from './components/Banner'


function App() {
  // const [view, setView] = useState('order');

  return (
    <>
     
      <Inventory />
      <Expenses />
      <Employment />
      <NewDashboard />
      <StockManagement />
    </>
  );
}

export default App;
