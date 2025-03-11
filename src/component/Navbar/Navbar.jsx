import React, { useState, useEffect, useCallback } from "react";
import { Layout, Menu, message } from "antd";
import { MailOutlined, PhoneOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { BASE_URL } from "../../API/BaseURL";
import SearchModal from "./SearchModal";
import _ from "lodash"; // Import lodash for debouncing

const { Header } = Layout;

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const { cartItems } = useCart();
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch(`${BASE_URL}/api/category/get`)
            .then((response) => response.json())
            .then((data) => {
                if (data && Array.isArray(data)) {
                    setCategories(data.slice(0, 5));
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem("userToken");
            const storedUserName = localStorage.getItem("userName");
            setIsLoggedIn(!!token);
            if (storedUserName) {
                setUserName(storedUserName);
            }
        };

        handleStorageChange();
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        try {
            localStorage.removeItem("userToken");
            localStorage.removeItem("user");
            localStorage.removeItem("cart");
            message.success("Logged out successfully");
            setIsLoggedIn(false);
            setUserName("");
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const user = JSON.parse(localStorage.getItem("user"));
    const name = user ? `${user.firstName} ${user.lastName}` : "Guest";

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length >= 3) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        document.getElementById("search-input")?.focus(); // Return focus to the input
    };

    return (
        <Layout className="navbar">
            {/* Top Header */}
            <Header className="navbar-top">
                <div className="navbar-contact">
                    <span style={{ marginRight: "40px" }}>Welcome, {name}!</span>
                    <Link style={{ textDecoration: "none", marginBottom: "10px" }} to="/contact_form">
                        <span>Contact Us</span>
                    </Link>
                    <span> | </span>
                    {isLoggedIn ? (
                        <>
                            <Link style={{ textDecoration: "none" }} to="/account">
                                <UserOutlined style={{ marginRight: "5px" }} />
                                <span>Profile</span>
                            </Link>
                            <span> | </span>
                            <span style={{ cursor: "pointer" }} onClick={handleLogout}>
                                Logout
                            </span>
                        </>
                    ) : (
                        <Link style={{ textDecoration: "none" }} to="/login">
                            <span>Login</span>
                        </Link>
                    )}
                    <span> | </span>
                    <Link style={{ textDecoration: "none", position: "relative" }} to="/cart">
                        <span style={{ marginLeft: "5px" }}>My Cart</span>
                        <ShoppingCartOutlined style={{ fontSize: "22px" }} />
                        {cartItems.length > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "-32px",
                                    right: "-3px",
                                    color: "red",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                            >
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                </div>
            </Header>

            {/* Main Navbar */}
            <Header className="navbar-main" style={{ backgroundColor: "#f0f0f0", marginTop: "10px" }}>
                <Link to="/">
                    <img
                        style={{ width: "120px", cursor: "pointer", paddingTop: "18px", margin: "0px", marginRight: "20px" }}
                        src={logo}
                        alt="logo"
                    />
                </Link>

                <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        autoFocus
                        style={{ width: "300px", height: "30px", padding: "5px", borderRadius: "5px" }}
                    />
                </div>

                <div className="navbar-questions">
                    <PhoneOutlined /> <span>Questions? Call 123-456-7890 </span>
                    <a href="mailto:info@cleanroomworld.com" className="email-link">
                        <MailOutlined /> info@cleanroomcart.com
                    </a>
                </div>
            </Header>

            {/* Category Navigation */}
            <Menu mode="horizontal" className="navbar-links">
                <Menu.Item key="home">
                    <Link to="/">Home</Link>
                </Menu.Item>

                {categories.length > 0 ? (
                    categories.map((category) => (
                        <Menu.Item key={category._id}>
                            <Link to={`/category/${category._id}`} style={{ textDecoration: "none" }}>
                                {category.name}
                            </Link>
                        </Menu.Item>
                    ))
                ) : (
                    <Menu.Item key="no-category">No Categories Available</Menu.Item>
                )}
            </Menu>

            {/* Search Modal */}
            <SearchModal searchQuery={searchTerm} visible={showModal} onCancel={handleModalClose} />
        </Layout>
    );
};

export default Navbar;
