import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../API/BaseURL';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/register`, {  // Note: using register instead of signup
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        message.success('Signup successful! Please login.');
        navigate('/admin/login');
      } else {
        message.error(data.message || 'Signup failed!');
      }
    } catch (error) {
      console.error('Signup error:', error);
      message.error('Signup failed! Please try again.');
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
      background: '#f0f2f5',
      marginTop: '61px',
    }}>
      <Card title={
          <>
            <KeyOutlined style={{ marginRight: 9, marginTop:9, color: 'black', fontSize:'25px' }} /> 
            <span style={{ fontSize:'20px'}}>Admin Signup</span>
          </>
        } 
      style={{ width: 450, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', paddingTop:'20px', }}>
        <Form
          name="signup"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
          style={{height:'70px',  padding:'15px 15px 0px 15px'}}
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" size="large" />
          </Form.Item>
          <Form.Item
          style={{height:'70px', padding:'15px 15px 0px 15px'}}
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
          style={{height:'70px',padding:'15px 15px 0px 15px'}}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item
          style={{height:'70px',padding:'15px 15px 0px 15px'}}
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Passwords do not match!');
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
          </Form.Item>
          <Form.Item
           style={{ height:'70px'}}>
            <Button 
            style={{marginLeft:'15%', width:'70%'}}
             type="primary" htmlType="submit" block size="large" loading={loading}>
              Sign up
            </Button>
          </Form.Item>
          <Button
          style={{marginLeft:'15%', width:'70%', marginBottom:'10px', border:'none', height:'10px'}}
           type="link" onClick={() => navigate('/admin/login')} block>
            Already have an account? Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AdminSignup;