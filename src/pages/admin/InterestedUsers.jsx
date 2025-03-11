import React, { useEffect, useState } from "react";
import { Table, Card, Spin } from 'antd';
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";


const InterestedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // const userId = "67b6ffcadd55f21e9666ac95"; 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/get/interested-users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching interested users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    // {
    //   title: 'Product',
    //   dataIndex: 'productName',
    //   key: 'productName',
    // },
    {
      title: "Product",
      dataIndex: ["productId", "productName"], // Access nested product name
      key: "productName",
    },
    {
      title: "Product ID",
      dataIndex: ["productId", "_id"], // Show product ID
      key: "productId",
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    // {
    //   title: 'Phone',
    //   dataIndex: 'phone',
    //   key: 'phone',
    // },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    }
  ];

  const data = []; // Will be populated from API

  return (
    <>
    <h2>Interested Users</h2>
      <Card style={{}} title="">
        {/* {loading ? <Spin size="large" /> :  */}
        {loading ? <Spin size="large" /> : <Table columns={columns} dataSource={users} rowKey="_id" />}
      </Card>
    </>
  );
};

export default InterestedUsers; 
