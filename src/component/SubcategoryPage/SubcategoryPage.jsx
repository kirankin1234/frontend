import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spin, Row, Col, message, Select } from "antd";
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";
import DOMPurify from "dompurify"; // Import DOMPurify

const { Option } = Select;

const SubcategoryPage = () => {
  const { id } = useParams(); // Get subcategory ID from URL
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOption, setSortOption] = useState("price_asc");
  const navigate = useNavigate();
  const { Meta } = Card;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subcategory details
        const subcategoryResponse = await axios.get(`${BASE_URL}/api/subcategory/${id}`);
        setSubcategory(subcategoryResponse.data.subcategory);

        // Fetch products under this subcategory
        const productsResponse = await axios.get(`${BASE_URL}/api/product/get/${id}`);
        setProducts(productsResponse.data.products || []);
      } catch (error) {
        message.error("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const sortProducts = () => {
      if (!products.length) return;

      switch (sortOption) {
        case "price_asc":
          setSortedProducts([...products].sort((a, b) => a.price - b.price));
          break;
        case "price_desc":
          setSortedProducts([...products].sort((a, b) => b.price - a.price));
          break;
        case "name_asc":
          setSortedProducts([...products].sort((a, b) => a.productName.localeCompare(b.productName)));
          break;
        case "name_desc":
          setSortedProducts([...products].sort((a, b) => b.productName.localeCompare(a.productName)));
          break;
        default:
          setSortedProducts(products);
      }
    };

    sortProducts();
  }, [products, sortOption]);

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const trimDescription = (desc) => {
    return desc ? desc.split(" ").slice(0, 2).join(" ") + "..." : "No description available";
  };

  if (loading)
    return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;

  if (!subcategory)
    return <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>Subcategory not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* Subcategory Title & Description */}
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        {subcategory?.name || "No Name Available"}
      </h2>
      <p style={{ fontSize: "18px", textAlign: "center" }}>
        {subcategory?.shortDescription || "No Short Description Available"}
      </p>

      {/* Sorting Options */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <Select
          defaultValue="price_asc"
          style={{ width: 200 }}
          onChange={handleSortChange}
        >
          <Option value="price_asc">Price: Low to High</Option>
          <Option value="price_desc">Price: High to Low</Option>
          <Option value="name_asc">Name: A-Z</Option>
          <Option value="name_desc">Name: Z-A</Option>
        </Select>
      </div>

      {/* Product List */}
      {sortedProducts.length > 0 ? (
        <Row gutter={[16, 16]}>
          {sortedProducts.map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6} style={{ paddingTop: "20px" }}>
              <Card
                hoverable
                style={{
                  width: "100%",
                  maxWidth: "250px",
                  margin: "auto",
                  borderRadius: "0px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                cover={
                  <img
                    alt={product.productName}
                    src={`${BASE_URL}/uploads/${product.image.replace("/uploads/", "")}`}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "contain",
                      borderRadius: "0px",
                      backgroundColor: "white",
                    }}
                  />
                }
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <Meta
                  title={product.productName}
                  description={
                    <div style={{ padding: "-3px", minHeight: "5px" }}>
                      <p style={{ margin: "1px 0", fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                        ₹ {product.price}
                      </p>
                      <p style={{ margin: "1px 0", fontSize: "15px", color: "gray" }}>
                        {trimDescription(product.description)}
                      </p>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p style={{ textAlign: "center", fontSize: "18px", marginTop: "20px", color: "gray" }}>
          No Products Available
        </p>
      )}

      {/* Detailed Description (Rendered Safely with DOMPurify) */}
      <h2 style={{ paddingTop: "20px", marginBottom: "5px" }}>Details</h2>
      <div
        style={{ fontSize: "18px" }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(subcategory?.detailedDescription || "No Detailed Description Available"),
        }}
      ></div>
    </div>
  );
};

export default SubcategoryPage;
