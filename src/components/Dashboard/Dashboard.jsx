import React, { useEffect, useState } from 'react'
import styles from "./Dashboard.module.css"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import Loader from "../Loader/Loader";

const Dashboard = ({ setLogoutMessage, displaySuccess, setDisplaySuccess }) => {
  let navigate = useNavigate();
  const [productData, setProductData] = useState("");

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL_FOR_PRODUCTS, { headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("jwtToken") } })
      .then(response => {
        setProductData(response.data.savedProducts);
      })
      .catch(error => {
        console.error(error);
        if (error.response.status === 401) {
          toast.error("Invalid Session or Session expired. Please Log In again", {
            position: "top-center",
            autoClose: 2000
          })
          localStorage.clear();
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          return;
        }
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 2000
        });
      })
  }, []);

  useEffect(() => {
    displaySuccess && toast.success(displaySuccess, {
      position: "top-center",
      autoClose: 1000
    })
    setDisplaySuccess("");
  }, []);

  const handleLogout = () => {
    setLogoutMessage("You are Logged Out Successfully");
    localStorage.clear();
    navigate("/login");
  };

  const handleViewProductDetails = productId => navigate(`/view_product/${productId}`);

  if (!productData) {
    return <Loader />
  }
  return (
    <div className={styles.dahboard_container}>
      <nav className={styles.navbar}>
        <div>
          <p className={styles.product}>Product</p>
          <p className={styles.application}>Application</p>
        </div>
        <div>
          <span className={styles.profile}>PROFILE</span>
          <span className={styles.reviews}>REVIEWS</span>
          <span className={styles.logout} onClick={handleLogout}>LOGOUT</span>
        </div>
      </nav>

      <div>
        {productData && productData.length > 0 && productData.map((product, index) => {
          return (
            <div className={styles.product_card} key={product.id}>
              <div>
                <img src={product.image} alt="product image" className={styles.product_image} />
              </div>
              <div className={styles.product_name_price}>
                <p>{product.productName}</p>
                <p>₹{product.price}</p>
              </div>
              <div>
                <button className={styles.button} onClick={() => handleViewProductDetails(product._id)}>View Details</button>
              </div>
            </div>
          )
        })}
      </div>
      <ToastContainer />
    </div>
  )
}

export default Dashboard
