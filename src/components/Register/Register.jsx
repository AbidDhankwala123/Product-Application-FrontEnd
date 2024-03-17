import React, { useState } from 'react'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import styles from "./Register.module.css"

const Register = () => {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const handleEmail = e => setEmail(e.target.value);
    const handlePassword = e => setPassword(e.target.value);
    const handleAdmin = e => setRole("Admin");
    const handleUser = e => setRole("Team Member");

    const registerUserObject = {
        email,
        password,
        role
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
        // if (validateName() || validateEmail() || validatePassword()) {
        //     return;
        // }
        setLoading(true);

        axios.post(`${process.env.REACT_APP_BACKEND_URL_FOR_AUTH}/register`, registerUserObject, { headers: { "Content-Type": "application/json" } })
            .then(response => {
                toast.success(response.data.message, {
                    position: "top-center",
                    autoClose: 2000
                })
                setTimeout(() => {
                    navigate("/login");
                }, 1300);

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
    return (
        <div className={styles.register_container}>
            <div className={styles.inner_container}>
                <h1 className={styles.heading}>REGISTER</h1>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div>
                        <input type="email" name="email" placeholder='Email' value={email} onChange={handleEmail} className={styles.input} />
                    </div><br />
                    <div>
                        <input type="text" name="password" placeholder='Password' value={password} onChange={handlePassword} className={styles.input} />{/*later change type to password*/}
                    </div><br />
                    <div className={styles.select_radio}>
                        <div>
                            <input type="radio" name="role" value="Admin" onChange={handleAdmin} />
                            <span style={{marginLeft:"0.6rem",fontFamily: "var(--font-family-roboto)"}}>Admin</span>
                        </div>
                        <div>
                            <input type="radio" name="role" value="User" onChange={handleUser}/>
                            <span style={{marginLeft:"0.6rem",fontFamily: "var(--font-family-roboto)"}}>Team Member</span>
                        </div>
                    </div><br />
                    <div className={styles.button_container}>
                        <button className={styles.button}>{loading ? "Please Wait..." : "Register"}</button>
                    </div>
                </form><br />

                <div style={{ textAlign: "center",fontFamily: "var(--font-family-roboto)" }} >
                    <span className=''>Already have an account?</span> <Link to="/login" style={{ color: "black" }} >Sign In</Link>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Register
