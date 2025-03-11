import React, { useState, useEffect } from "react";
import { Modal, Input, Row, Col, Spin, Empty, Card, List } from "antd";
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";
import { useNavigate } from "react-router-dom";
import _ from "lodash"; // For debouncing

const SearchModal = ({ searchQuery, visible, onCancel, style }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState({});
    const navigate = useNavigate();

    // Fetch Products & Category Names
    const fetchResults = async () => {
        if (searchQuery.length >= 3) {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/api/product/searchbar`, {
                    params: { name: searchQuery },
                });

                if (response.data && response.data.products) {
                    setResults(response.data.products);

                    // Extract unique category IDs
                    const uniqueCategoryIds = [
                        ...new Set(response.data.products.map((product) => product.category)),
                    ];

                    // Fetch category names
                    const categoryResponses = await Promise.all(
                        uniqueCategoryIds.map((id) =>
                            axios.get(`${BASE_URL}/api/category/${id}`).catch(() => null)
                        )
                    );

                    // Map category ID to category name
                    const categoryMap = {};
                    categoryResponses.forEach((res, index) => {
                        if (res && res.data.category) {
                            categoryMap[uniqueCategoryIds[index]] = res.data.category.name;
                        }
                    });

                    setCategories(categoryMap);
                } else {
                    setResults([]);
                    setCategories({});
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setResults([]);
            setCategories({});
        }
    };

    const debouncedFetchResults = _.debounce(fetchResults, 500);

    useEffect(() => {
        debouncedFetchResults();
        return () => debouncedFetchResults.cancel();
    }, [searchQuery]);

    // Navigate to category page
    const handleCategoryClick = (categoryId) => {
        onCancel();
        navigate(`/category/${categoryId}`);
    };

    // Navigate to product page
    const handleProductClick = (productId) => {
        onCancel();
        navigate(`/product/${productId}`);
    };

    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={900}
            centered
            style={{ ...style, padding: "20px" }}
        >
            <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={() => {}} // Parent should handle this
                style={{ marginBottom: "20px", width: "100%" }}
                autoFocus
            />

            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
            ) : results.length === 0 ? (
                <Empty description="No products found" />
            ) : (
                <Row gutter={[16, 16]} style={{ height: "400px", overflowY: "auto" }}>
                    {/* Left Section - Categories (25%) */}
                    <Col xs={6} style={{ borderRight: "1px solid #ddd", paddingRight: "10px" }}>
                        <h4 style={{ marginBottom: "10px" }}>Categories</h4>
                        <List
                            size="small"
                            bordered
                            dataSource={Object.keys(categories)}
                            renderItem={(categoryId) => (
                                <List.Item
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: "#f9f9f9",
                                        transition: "all 0.3s",
                                    }}
                                    onClick={() => handleCategoryClick(categoryId)}
                                    onMouseEnter={(e) => (e.target.style.background = "#e0e0e0")}
                                    onMouseLeave={(e) => (e.target.style.background = "#f9f9f9")}
                                >
                                    {categories[categoryId] || "Unknown Category"}
                                </List.Item>
                            )}
                        />
                    </Col>

                    {/* Right Section - Products (75%) */}
                    <Col xs={18}>
                        <Row gutter={[8, 8]}>
                            {results.map((product) => (
                                <Col key={product._id} xs={24} sm={12} md={8}>
                                    <Card
    hoverable
    onClick={() => handleProductClick(product._id)}
    size="small"
    style={{
        height: "200px",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        padding: "5px",
        borderRadius: "8px",
    }}
>
    <div
        style={{
            flex: "7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: "6px",
            backgroundColor: "#f8f8f8",
        }}
    >
        <img
            alt={product.productName}
            src={product.image ? `${BASE_URL}${product.image}` : "/uploads/default-image.png"}
            style={{
                width: "100%",
                maxHeight: "100%",
                objectFit: "contain", // Ensures the image scales properly inside the box
                borderRadius: "6px",
            }}
        />
    </div>
    <div style={{ flex: "3", padding: "8px" }}>
        <h4 style={{ fontSize: "11px", marginBottom: "2px" }}>{product.productName}</h4>
        <p style={{ fontSize: "9px", color: "gray", marginBottom: "2px" }}>
            <strong>Code:</strong> {product.productCode}
        </p>
        <p style={{ fontSize: "11px", fontWeight: "bold", color: "black" }}>
            <strong>Price:</strong> {product.price !== undefined ? `$${product.price.toFixed(2)}` : "N/A"}
        </p>
    </div>
</Card>

                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            )}
        </Modal>
    );
};

export default SearchModal;
