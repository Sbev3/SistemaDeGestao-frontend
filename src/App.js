import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages & Components
import Login from "./pages/login";
import CreateProduct from "./pages/CreateProduct";
import CreateClient from "./pages/CreateClient";
import CreateSale from "./pages/CreateSale";
import Orders from "./pages/orders";
import Dashboard from "./components/Dashboard";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import EditSale from "./pages/EditSale"; // Renamed to PascalCase

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/create-client" element={<CreateClient />} />
            <Route path="/create-sale" element={<CreateSale />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/products" element={<Products />} />
            <Route path="/edit-sale/:saleId" element={<EditSale />} /> {/* Use PascalCase here too */}
            {/* Adicione outras rotas aqui */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
  