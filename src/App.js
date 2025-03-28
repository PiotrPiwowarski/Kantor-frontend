import { Dashboard } from "./components/mains/Dashboard";
import { Home } from "./components/mains/Home";
import { CurrencyDeposit } from "./components/subpages/CurrencyDeposit";
import { MyTransactions } from "./components/subpages/MyTransactions";
import { MyWallet } from "./components/subpages/MyWallet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-wallet" element={<MyWallet />} />
        <Route path="/currency-deposit" element={<CurrencyDeposit />} />
        <Route path="/my-transactions" element={<MyTransactions />} />
      </Routes>
    </Router>
  );
}

export default App;
