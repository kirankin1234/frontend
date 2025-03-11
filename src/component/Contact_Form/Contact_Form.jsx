import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import "./Contact_Form.css";
import { BASE_URL } from "../../API/BaseURL";

const { Title, Paragraph } = Typography;

const ContactForm = () => {
  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/contact/submit`, values);
      message.success(response.data.message);
    } catch (error) {
      message.error("Failed to submit query. Please try again.");
    }
  };

  return (
    <div className="container1" style={{ maxWidth: 600, margin: "0 auto", padding: "40px" }}>
      <Title style={{ paddingLeft: "85px", paddingRight: "50px" }} level={2}>
        Contact Us
      </Title>
      <Paragraph style={{fontSize:'17px'}}>
        We're happy to answer questions or help you with returns. <br />
        Please fill out the form below if you need assistance.
      </Paragraph>
      <Form style={{padding:'10px', height:'650px'}} layout="vertical" onFinish={onFinish}>
        <Form.Item style={{height: '55px'}} name="fullName" label="Full Name" rules={[{ required: true, message: "Please enter your full name!" }]}>
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item style={{height: '55px'}} name="phone" label="Phone Number" rules={[{ required: true, message: "Please enter your phone number" }]}>
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item style={{height: '55px'}} name="email" label="Email Address" rules={[{ required: true, message: "Email is required!", type: "email" }]}>
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item style={{height: '55px'}} name="orderNumber" label="Order Number" rules={[{ required: true, message: "Please enter order number!" }]}>
          <Input placeholder="Enter your order number" />
        </Form.Item>

        <Form.Item style={{height: '55px'}} name="companyName" label="Company Name" rules={[{ required: true, message: "Please enter company name!" }]}>
          <Input placeholder="Enter your company name" />
        </Form.Item>

        <Form.Item style={{height: '140px'}} name="comments" label="Comments/Questions" rules={[{ required: true, message: "Please enter your comments or questions!" }]}>
          <Input.TextArea rows={4} placeholder="Enter your comments or questions here" />
        </Form.Item>

        <Form.Item>
          <Button  className='button' style={{padding:'0px 0px 0px 0px', margin:'0px 0px 0px 57px', width:'70%', backgroundColor:'#40476D'}} type="primary" htmlType="submit" block>
            Submit Form
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ContactForm;
