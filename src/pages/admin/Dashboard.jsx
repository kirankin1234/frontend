import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../API/BaseURL";

const { Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [queryCount, setQueryCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [newQueries, setNewQueries] = useState(0);
  const [newUsers, setNewUsers] = useState(0);

  useEffect(() => {
    // Fetch stored counts from localStorage (to track new ones)
    const prevQueryCount = parseInt(localStorage.getItem("queryCount") || "0", 10);
    const prevUserCount = parseInt(localStorage.getItem("userCount") || "0", 10);

    // Fetch Customer Queries Count
    const fetchQueryCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/contact/get`);
        const data = await response.json();
        setQueryCount(data.length);

        // Calculate new queries
        if (data.length > prevQueryCount) {
          setNewQueries(data.length - prevQueryCount);
        }
      } catch (error) {
        console.error("Error fetching query count:", error);
      }
    };

    // Fetch Users Count
    const fetchUserCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/consumer/list`);
        const data = await response.json();
        setUserCount(data.length);

        // Calculate new users
        if (data.length > prevUserCount) {
          setNewUsers(data.length - prevUserCount);
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchQueryCount();
    fetchUserCount();
  }, []);

  // Function to navigate and reset new count
  const handleNavigate = (route, type) => {
    navigate(route);

    if (type === "query") {
      setNewQueries(0);
      localStorage.setItem("queryCount", queryCount);
    } else if (type === "user") {
      setNewUsers(0);
      localStorage.setItem("userCount", userCount);
    }
  };

  return (
    <div className="dashboard-container">
      <Row gutter={16}>
        {/* ✅ Total Customer Queries with Notification Badge */}
        <Col span={12}>
          <Badge count={newQueries} offset={[10, 0]} style={{ backgroundColor: "#f5222d" }}>
            <Card className="query-card" onClick={() => handleNavigate("/admin/inquiries", "query")} hoverable>
              <Title level={4} className="card-title">Total Customer Queries</Title>
              <Title level={2} className="query-count">{queryCount}</Title>
            </Card>
          </Badge>
        </Col>

        {/* ✅ Total Users Count with Notification Badge */}
        <Col span={12}>
          <Badge count={newUsers} offset={[10, 0]} style={{ backgroundColor: "#52c41a" }}>
            <Card className="user-card" onClick={() => handleNavigate("/admin/users", "user")} hoverable>
              <Title level={4} className="card-title">Total Registered Users</Title>
              <Title level={2} className="user-count">{userCount}</Title>
            </Card>
          </Badge>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
