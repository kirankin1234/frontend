import React, { useEffect, useState } from 'react';
import { Table, Card } from 'antd';
import axios from 'axios';
import { BASE_URL } from "../../API/BaseURL";


const Inquiry = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/contact/get`); // Update with correct API route
      setInquiries(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
    },
  ];

  return (
    <>
      <h2>User Inquiries</h2>
      <Card >
        <Table columns={columns} dataSource={inquiries} rowKey="_id" />
      </Card>
    </>
  );
};

export default Inquiry;