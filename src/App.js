import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import ViewProduct from "./components/ViewProduct/ViewProduct";
import { useState } from "react";
import EditProduct from "./components/EditProduct/EditProduct";
import NotFound from "./components/NotFound/NotFound";

function App() {
  const [logoutMessage, setLogoutMessage] = useState("");
  const [displaySuccess, setDisplaySuccess] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role"));

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login setRole={setRole} logoutMessage={logoutMessage} setLogoutMessage={setLogoutMessage} />} />
          <Route path={role && role === "Admin" ? "/dashboard/admin" : "/dashboard/team_member"} element={<Dashboard setLogoutMessage={setLogoutMessage} displaySuccess={displaySuccess} setDisplaySuccess={setDisplaySuccess} />} />
          <Route path="/view_product/:productId" element={<ViewProduct />} />
          <Route path="/edit_product/:productId" element={<EditProduct role={role} setDisplaySuccess={setDisplaySuccess} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
