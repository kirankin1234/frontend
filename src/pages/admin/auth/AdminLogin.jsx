import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, KeyOutlined   } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../API/BaseURL';  

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${ BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminName', data.name);
        message.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        message.error(data.message || 'Login failed!');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card 
       title={
          <>
            <KeyOutlined style={{ marginRight: 9, marginTop:9, color: 'black', fontSize:'20px' }} /> 
            <span style={{ fontSize:'20px'}}>Admin Login</span>
          </>
        } 
        style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding:'10px 0px 0px 10px ' }}>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
          style={{padding:'10px 5px 5px 5px', height:'70px'}}
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
          style={{padding:'10px 5px 5px 5px', height:'70px'}}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item style={{height:'60px'}}>
            <Button style={{marginLeft:'15%', width:'70%'}} type="primary" htmlType="submit" block size="large" loading={loading}>
              Log in
            </Button>
          </Form.Item>
          <Button style={{marginLeft:'15%', width:'70%', border:'none', paddingBottom:'20px', height:'10px'}} type="link" onClick={() => navigate('/admin/signup')} block>
            Don't have an account? Create account
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;