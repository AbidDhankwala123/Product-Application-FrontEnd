import React, { useEffect, useState } from 'react'
import styles from "./ViewProduct.module.css"
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader/Loader";

const ViewProduct = () => {
  const { productId } = useParams();
  const [productData, setProductData] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL_FOR_PRODUCTS}/${productId}`, { headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("jwtToken") } })
      .then(response => {
        setProductData(response.data.product);
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
  }, [])

  const handleEditProduct = () => navigate(`/edit_product/${productId}`);

  if(!productData){
    return <Loader/>
  }
  return (

    <div className={styles.view_product_container}>
      <div>
        <div>
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontFamily: "var(--font-family-roboto)", marginBottom: "10px" }}>Product Name</h3>
            <p style={{ fontFamily: "var(--font-family-roboto)", color: "#595959", lineHeight: "164.5%" }}>{productData.productName}</p>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontFamily: "var(--font-family-roboto)", marginBottom: "10px" }}>Product Price</h3>
            <p style={{ fontFamily: "var(--font-family-roboto)", color: "#595959", lineHeight: "164.5%" }}>₹{productData.price}</p>
          </div>
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontFamily: "var(--font-family-roboto)", marginBottom: "10px" }}>Department</h3>
            <p style={{ fontFamily: "var(--font-family-roboto)", color: "#595959", lineHeight: "164.5%" }}>{productData.department}</p>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontFamily: "var(--font-family-roboto)", marginBottom: "10px" }}>Product Description</h3>
            <p style={{ fontFamily: "var(--font-family-roboto)", color: "#595959", lineHeight: "164.5%" }}>{productData.productDescription}
            </p>
          </div>
        </div>

        <div>
          <img src={productData.image} alt="product image" className={styles.image} />
        </div>
      </div>

      <div className={styles.button_div}>
        <button className={styles.button} onClick={handleEditProduct}>Edit Product</button>
      </div>
      <ToastContainer/>
    </div>


  )
}

export default ViewProduct
