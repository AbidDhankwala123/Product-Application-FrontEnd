import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import styles from "./Login.module.css"

const Login = ({ logoutMessage, setLogoutMessage,setRole }) => {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmail = e => setEmail(e.target.value);
    const handlePassword = e => setPassword(e.target.value);

    const loginUserObject = {
        email,
        password
    }

    // const validateEmail = () => {
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(email)) {
    //         setErrorEmail("Please enter a valid email address");
    //         return true;
    //     }
    //     setErrorEmail("");
    //     return false;
    // };

    // const validatePassword = () => {
    //     let regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
    //     if (regex.test(password) === false) {
    //         setErrorPassword("Password must contain atleast 1 uppercase,1 lowercase,1 special symbol and 1 numeric and minimum 8 characters long");
    //         return true;
    //     }
    //     setErrorPassword("");
    //     return false;

    // }
    const handleSubmit = e => {
        e.preventDefault();
        if (loading) {
            return
        }
        // if (validateEmail() || validatePassword()) {
        //     return;
        // }
        setLoading(true);

        axios.post(`${process.env.REACT_APP_BACKEND_URL_FOR_AUTH}/login`, loginUserObject, { headers: { "Content-Type": "application/json" } })
            .then(response => {
                toast.success(response.data.message, {
                    position: "top-center",
                    autoClose: 2000
                })
                setTimeout(() => {
                    // Redirect based on role
                    if (response.data.role === "Admin") {
                        navigate("/dashboard/admin");
                    } else if (response.data.role === "Team Member") {
                        navigate("/dashboard/team_member");
                    }
                }, 1300);
                setRole(response.data.role);
                localStorage.setItem("jwtToken", response.data.jwtToken);
                localStorage.setItem("role", response.data.role);

            })
            .catch(error => {
                console.log(error);
                toast.error(error.response.data.message, {
                    position: "top-center",
                    autoClose: 2000
                });
                setLoading(false);
            })

    }

    useEffect(() => {
        logoutMessage && toast.success(logoutMessage, {
            position: "top-center",
            autoClose: 1000
        });
        setLogoutMessage("");
    }, [])

    return (
        <div className={styles.register_container}>
            <div className={styles.inner_container}>
                <h1 className={styles.heading}>LOGIN</h1>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div>
                        <input type="email" name="email" placeholder='Email' value={email} onChange={handleEmail} className={styles.input} />
                    </div><br />
                    <div>
                        <input type="text" name="password" placeholder='Password' value={password} onChange={handlePassword} className={styles.input} />{/*later change type to password*/}
                    </div><br />
                    <div className={styles.button_container}>
                        <button className={styles.button}>{loading ? "Please Wait..." : "Login"}</button>
                    </div>
                </form><br />

                <div style={{ textAlign: "center", fontFamily: "var(--font-family-roboto)" }} >
                    <span>Don't have an account?</span> <Link to="/" style={{ color: "black" }} >Sign Up</Link>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login
