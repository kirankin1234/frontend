import React, { useState } from "react";
import {
  Table,
  Typography,
  Button,
  InputNumber,
  Row,
  Col,
  Empty,
} from "antd";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const { Title, Text } = Typography;

const CartPage = () => {
  const { cartItems, handleQuantityChange, handleRemoveItem, loading } = useCart();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Track selected items

  if (loading) return <div>Loading...</div>;

  // Calculate total price for selected items
  const calculateSubtotal = () => {
    return cartItems
      .filter((item) => selectedRowKeys.includes(item.id || item._id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Handle selection changes
  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => handleQuantityChange(value, record)}
        />
      ),
    },
    {
      title: "Total",
      render: (_, record) => `₹${record.price * record.quantity}`,
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => {
            if (window.confirm("Do you want to remove this product from cart?")) {
              handleRemoveItem(record);
            }
          }}
          style={{ border: "none", color: "red" }}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {cartItems.length === 0 ? (
        <Empty description={<Title level={4}>Your cart is empty</Title>} />
      ) : (
        <>
          <Title level={2}>
            Your Cart ({cartItems.length} items)
          </Title>
          <Table
            dataSource={cartItems.map((item) => ({
              ...item,
              key: item.id || item._id,
            }))}
            columns={columns}
            rowSelection={{
              selectedRowKeys,
              onChange: onSelectChange,
            }}
          />
          <Row justify="end" style={{ marginTop: 30, justifyContent: "left" }}>
            <Col>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "129px",
                  height: "20px",
                }}
              >
                <h4 style={{ color: "#525558" }}>Subtotal:</h4>
                <span> ₹{calculateSubtotal()}</span>
              </div>

              <hr style={{ width: "350px" }} />

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "129px",
                  height: "20px",
                }}
              >
                <h4 style={{ color: "#525558" }}>Coupon Code:</h4>
                <span>
                  <a href="#">Add Coupon</a>
                </span>
              </div>

              <hr style={{ width: "350px" }} />

              <Title style={{ paddingLeft: "20px" }} level={3}>
                Total: ₹{calculateSubtotal()}
              </Title>
              <Button
                style={{
                  backgroundColor: "#40476D",
                  color: "white",
                  width: "150px",
                  borderRadius: "3px",
                }}
                type="primary"
                size="large"
              >
                Checkout
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default CartPage;
