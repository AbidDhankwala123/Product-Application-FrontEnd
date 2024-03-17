import styles from "./EditProduct.module.css"
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const EditProduct = ({ setDisplaySuccess, role }) => {
    const { productId } = useParams();
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const [productName, setProductName] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [department, setDepartment] = useState("");

    const productDetailsObject = {
        productName,
        image,
        price,
        department,
        productDescription,
    };

    useEffect(() => {
        if (productId) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL_FOR_PRODUCTS}/${productId}`, {
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwtToken")
                }
            })
                .then(response => {
                    console.log(response);
                    setProductName(response.data.product.productName);
                    setImage(response.data.product.image);
                    setPrice(response.data.product.price);
                    setDepartment(response.data.product.department);
                    setProductDescription(response.data.product.productDescription);
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
        }
    }, []);

    const updateProduct = e => {
        e.preventDefault();
        if (loading) {
            return
        }
        setLoading(true);
        axios.put(`${process.env.REACT_APP_BACKEND_URL_FOR_PRODUCTS}/${productId}`, productDetailsObject, {
            headers:
            {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwtToken")
            }
        })
            .then(response => {
                console.log(response);
                setDisplaySuccess(response.data.message);
                role === "Admin" ? navigate("/dashboard/admin") : navigate("/dashboard/team_member");
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
    };

    return (
        <div className={styles.edit_product_container}>
            <h2 className={styles.heading}>Edit Product</h2>
            <form className={styles.form} onSubmit={updateProduct}>
                <div className={styles.form_div}>
                    <p>Product Name</p>
                    <input type="text" name="productName" value={productName} onChange={e => setProductName(e.target.value)} className={styles.product_input} />
                </div>
                <div className={styles.form_div}>
                    <p>Product Image</p>
                    <input type="text" name="image" value={image} onChange={e => setImage(e.target.value)} className={styles.product_input} />
                </div>
                <div className={styles.form_div}>
                    <p>Price</p>
                    <input type="text" name="price" value={price} onChange={e => setPrice(e.target.value)} className={styles.product_input} />
                </div>
                <div className={styles.form_div}>
                    <p>Department</p>
                    <input type="text" name="department" value={department} onChange={e => setDepartment(e.target.value)} className={styles.product_input} />
                </div>

                <div className={styles.form_div}>
                    <p>Product Description</p>
                    <textarea name="productDescription" value={productDescription} onChange={e => setProductDescription(e.target.value)} className={styles.product_description} />
                </div>
                <div className={styles.btns_container}>
                    <button className={`${styles.btns} ${styles.cancel_btn}`} onClick={() => role === "Admin" ? navigate("/dashboard/admin") : navigate("/dashboard/team_member")}>Cancel</button>
                    <button className={`${styles.btns} ${styles.updateProduct_btn}`}>{loading ? "Please Wait..." : "Update Product"}</button>
                </div>
            </form>
        </div>
    )
}

export default EditProduct
