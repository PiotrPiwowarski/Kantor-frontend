import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/mains/Home";
import { Dashboard } from "./components/mains/Dashboard";
import { MyWallet } from "./components/subpages/MyWallet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-wallet" element={<MyWallet />} />
      </Routes>
    </Router>
  );
}

export default App;
