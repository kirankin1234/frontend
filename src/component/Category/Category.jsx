import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Row, Col } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify'; // For sanitizing HTML content

import { BASE_URL } from "../../API/BaseURL";

const Category = () => {
  const { id } = useParams(); // Get category ID from the URL
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const { Meta } = Card;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/category/${id}`);
        const data = await response.json();
        console.log("Fetched Category Data:", data); 

        if (data.category) {  
          setCategory(data.category);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const subcategoriesResponse = await axios.get(`${BASE_URL}/api/subcategory/get/${id}`);
        console.log("Fetched Subcategories Data:", subcategoriesResponse.data);
        setSubcategories(subcategoriesResponse.data.subcategories || []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchCategoryDetails();
    fetchSubcategories();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!category) return <p>Category not found</p>;

  return (
    <div style={{ padding: "0px 20px 20px 20px" }}>
      <h2 style={{ paddingLeft: '25%' }}>{category?.name || "No Name Available"}</h2>
      <p style={{ fontSize: '18px' }}>{category?.shortDescription || "No Description"}</p>

      {/* ✅ Subcategories Section */}
      <Row gutter={[16, 16]}>
        {subcategories.length > 0 ? (
          subcategories.map((subcategory) => (
            <Col style={{ paddingTop: '30px' }} xs={24} sm={12} md={8} lg={6} key={subcategory._id}>
              <Card
                hoverable
                style={{ padding: '7px', width: '230px', height: '250px', textAlign: "center" }}
                cover={
                  <img
                    alt={subcategory.name}
                    src={subcategory.image ? `${BASE_URL}/${subcategory.image.replace(/\\/g, "/")}` : "/default.jpg"}
                    onError={(e) => { e.target.src = "/default.jpg"; }} // ✅ Handles broken images
                    style={{
                      width: "100%",          // Ensures full width
                      height: "150px",        // Fixed height
                      objectFit: "contain",   // ✅ Ensures full visibility without cropping
                      display: "block",       // Fixes spacing issues
                      borderRadius: "12px",
                      backgroundColor: "white",
                    }}
                  />
                }
                onClick={() => navigate(`/subcategory/${subcategory._id}`)}
              >
                <Meta title={subcategory.name} style={{ textAlign: "center", fontSize: "12px", fontWeight: "bold" }} />
              </Card>
            </Col>
          ))
        ) : (
          <p>No Subcategories Available</p>
        )}
      </Row>

      <h2 style={{ paddingTop: '20px', margin: '0' }}>Details</h2>
      <div
        style={{ fontSize: '18px' }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(category?.detailedDescription || "No Detailed Description"),
        }}
      />
    </div>
  );
};

export default Category;
