import Navbar from "./user layout/components/Navbar"
import { Routes, Route } from "react-router-dom"
import Login from "./user layout/user-page/Login"
import Signup from "./user layout/user-page/Signup"
import Home from "./user layout/user-page/Home"
import Products from'./user layout/user-page/Products'
import Cart from "./user layout/user-page/Cart"
import Buy from "./user layout/user-page/Buy"
import Profile from "./user layout/user-page/Profile"
import OrdersPage from "./user layout/user-page/OrdersPage"
import AdminDashboard from "./admin layout/AdminDashboad"


const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/products" element={<Products/>}></Route>
        <Route path="/search" element={<Products />} />
        <Route path="/cart" element={<Cart/>}></Route>
        <Route path="/buy" element={<Buy/>}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path= "/order" element={<OrdersPage/>}/>
         <Route path= "/admin-dashboard" element={<AdminDashboard/>}/>


      
      </Routes>
    </div>
    
  )
}

export default App