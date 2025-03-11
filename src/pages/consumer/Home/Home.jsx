import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Carousel } from "antd";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { BASE_URL } from "../../../API/BaseURL";

// Import images for carousel
import one from "../../../assets/1st.jpg";
import two from "../../../assets/2nd.jpg";
import three from "../../../assets/3rd.jpg";
import four from "../../../assets/4th.jpg";
import five from "../../../assets/5th.jpg";

const images = [one, two, three, four, five];

const { Meta } = Card;

const Home = () => {
  const [categories, setCategories] = useState([]);
  const BASE_URL2 = `${BASE_URL}/uploads/`; // API Base URL
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/category/get`)
      .then((response) => {
        console.log("API Response:", response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category._id}`);
  };

  return (
    <div>
      {/* Carousel Section */}
      <div className="home-container">
        <Carousel autoplay autoplaySpeed={1000} dots infinite effect="scrollx">
          {images.map((img, index) => (
            <div key={index} className="carousel-slide">
              <img src={img} alt={`Slide ${index + 1}`} className="carousel-image" />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Paragraph Below Carousel */}
      <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#dbeafe", borderRadius: "8px", margin: "15px" }}>
        <p style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>
          We have thousands of products for cleanrooms, labs, and manufacturing facilities. 
          Our products are used in all types of controlled environments, across a variety of industries, such as: 
          aerospace, medical device, semiconductor, sterile compounding pharmacies, USP 797, USP 800, and more! 
          We’re a GSA schedule holder.
        </p>
      </div>

      {/* Categories Section */}
      <div style={{ padding: "15px" }}>
        <Row gutter={[16, 16]}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <Col xs={24} sm={12} md={8} lg={6} key={category._id}>
                <Card
                  hoverable
                  style={{ padding: "7px", width: "250px", height: "250px", textAlign: "center" }}
                  cover={
                    <img
                      alt={category.name}
                      src={category.image ? `${BASE_URL2}${category.image}` : "/default.jpg"}
                      onError={(e) => { e.target.src = "/default.jpg"; }} // Fallback for broken images
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "contain", // Ensures full visibility of the image
                        display: "block",
                        borderRadius: "12px",
                        backgroundColor: "white",
                      }}
                    />
                  }
                  onClick={() => handleCategoryClick(category)}
                >
                  <Meta
                    title={category.name}
                    style={{ textAlign: "center", fontSize: "12px", fontWeight: "bold" }}
                  />
                </Card>
              </Col>
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%" }}>No categories found.</p>
          )}
        </Row>
      </div>
    </div>
  );
};

export default Home;
