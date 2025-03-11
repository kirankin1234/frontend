import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Button,
  Radio,
  InputNumber,
  Image,
  Spin,
  Tooltip,
  Modal,
  message,
} from "antd";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { BASE_URL } from "../../API/BaseURL";

import "./Product.css";

const { Title, Text } = Typography;

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [subProducts, setSubProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(null);
  const [filterError, setFilterError] = useState(false);
  const { addToCart } = useCart();
  const [hasOnlyPrice, setHasOnlyPrice] = useState(false);

  // Fields to exclude from filters
  const EXCLUDED_FIELDS = [
    "_id",
    "productId",
    "createdAt",
    "updatedAt",
    "__v",
    "name",
  ];

  useEffect(() => {
    if (!id) {
      message.error("Product ID is missing!");
      return;
    }

    const fetchData = async () => {
      try {
        const [productRes, subProductsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/product/get-by/${id}`),
          axios.get(`${BASE_URL}/api/subproduct/product/${id}`),
        ]);

        setProduct(productRes.data.product);
        setSubProducts(subProductsRes.data);

        // Check if subproducts only have a price
        if (subProductsRes.data.length > 0) {
          const firstSubproductKeys = Object.keys(subProductsRes.data[0]);
          const onlyPrice =
            firstSubproductKeys.length === 4 &&
            firstSubproductKeys.includes("price");
          setHasOnlyPrice(onlyPrice);
        } else {
          setHasOnlyPrice(false); // No subproducts, so definitely not only price
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const findMatchingSubproduct = () => {
      if (Object.keys(selectedFilters).length === 0) {
        setPrice(null);
        setFilterError(false);
        return;
      }

      const matchingSub = subProducts.find((sub) => {
        return Object.keys(selectedFilters).every(
          (key) => sub[key] === selectedFilters[key]
        );
      });

      if (matchingSub) {
        setPrice(matchingSub.price);
        setFilterError(false);
      } else {
        setPrice(null);
        setFilterError(Object.keys(selectedFilters).length > 0);
      }
    };

    findMatchingSubproduct();
  }, [selectedFilters, subProducts]);

  const getAvailableFilters = () => {
    const filters = {};
    subProducts.forEach((sub) => {
      Object.keys(sub).forEach((key) => {
        if (!EXCLUDED_FIELDS.includes(key) && sub[key]) {
          filters[key] = filters[key] || new Set();
          filters[key].add(sub[key]);
        }
      });
    });
    return filters;
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...selectedFilters };
    if (value) {
      newFilters[filterKey] = value;
    } else {
      delete newFilters[filterKey];
    }
    setSelectedFilters(newFilters);
  };

  const buildProductCode = () => {
    if (!product) return "";

    const filterOrder = ["size", "color", "height", "width"]; // Define the desired order
    const filterParts = filterOrder
      .map((key) => selectedFilters[key] || "") // Get the value or an empty string if not selected
      .filter((value) => value !== "") // Filter out empty strings
      .join("-");

    return `${product.productCode}${
      filterParts ? `-${filterParts}` : ""
    }`;
  };

  const handleCartClick = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      Modal.confirm({
        title: "Login Required",
        content: "Please log in to continue.",
        okText: "Login",
        cancelText: "Cancel",
        onOk: () => navigate("/login"),
      });
      return;
    }

    try {
      let finalPrice = product.price;

      if (price) {
        finalPrice = price * quantity;
      }

      const cartItem = {
        key: `${product._id}-${buildProductCode()}`,
        name: product.productName,
        price: finalPrice,
        filters: selectedFilters,
        quantity,
        userId: user._id,
      };

      await Promise.all([
        axios.post(`${BASE_URL}/api/admin/add/interested-users`, {
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`.trim() ||
            "unknown User",
          email: user.email,
          phone: user.phone || "Not Provided",
          productId: product._id,
          product: product.productName,
        }),
        axios.post(`${BASE_URL}/api/cart/add`, {
          userId: user._id,
          productId: product._id,
          name: product.productName,
          image: product.image,
          price: finalPrice,
          quantity,
          filters: selectedFilters,
        }),
      ]);
      addToCart(cartItem);
      message.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  if (!product)
    return (
      <h2 style={{ color: "red", textAlign: "center" }}>
        ⚠ Product Not Found
      </h2>
    );

  const availableFilters = getAvailableFilters();
  const hasFilters = Object.keys(availableFilters).length > 0;

  const showFilterMessage = hasOnlyPrice;

  return (
    <div>
      <div
        style={{ padding: "20px", backgroundColor: "white", marginRight: "20px" }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Image
              src={`${BASE_URL}/uploads/${product.image.replace(
                "/uploads/",
                ""
              )}`}
              alt={product.productName}
              style={{ maxWidth: "100%", borderRadius: "8px" }}
              onError={(e) => {
                e.target.src = "/placeholder-image.png";
              }}
            />
          </Col>
          <Col span={12}>
            <Title level={3}>{product.productName}</Title>
            {price ? (
              <Title level={4}>₹{price}</Title>
            ) : filterError ? (
              <Text type="danger">Selected combination not available</Text>
            ) : showFilterMessage ? (
              <Text>This product has only one option available</Text>
            ) : (
              <Title level={4}>₹{product.price}</Title>
            )}

            <Text>
              Product Code: <strong>{buildProductCode()}</strong>
            </Text>
            <br />
            <br />

            {hasFilters &&
              !hasOnlyPrice &&
              Object.keys(availableFilters).map((filterKey) => (
                <div key={filterKey}>
                  <Text>
                    {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}:
                  </Text>
                  <div>
                    <Radio.Group
                      onChange={(e) =>
                        handleFilterChange(filterKey, e.target.value)
                      }
                      value={selectedFilters[filterKey]}
                    >
                      {Array.from(availableFilters[filterKey]).map((value) => (
                        <Radio.Button
                          key={value}
                          value={value}
                          style={
                            filterKey === "color"
                              ? {
                                  backgroundColor: value,
                                  color: "white",
                                  borderRadius: "50%",
                                  marginRight: "4px",
                                }
                              : { marginRight: "4px" }
                          }
                        >
                          {filterKey === "color" ? "" : value}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  </div>
                  <br />
                </div>
              ))}

            <Text>Quantity:</Text>
            <div>
              <InputNumber min={1} value={quantity} onChange={setQuantity} />
            </div>
            <br />

            <Tooltip
              title={
                hasOnlyPrice
                  ? ""
                  : price
                    ? ""
                    : "Please select valid filter combinations"
              }
            >
              <Button
                className="button"
                style={{
                  backgroundColor: "#40476D",
                  width: "200px",
                  marginLeft: "30%",
                }}
                type="primary"
                onClick={handleCartClick}
                disabled={filterError}
              >
                I'm Interested
              </Button>
            </Tooltip>
          </Col>
        </Row>
      </div>

      <h2>Details</h2>
      <p style={{ fontSize: "18px" }}>
        {product?.description || "No Detailed Description Available"}
      </p>
    </div>
  );
};

export default Product;
