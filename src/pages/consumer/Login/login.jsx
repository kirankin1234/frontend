import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { loginApi } from '../../../utils/api'; // Ensure this function is correctly implemented
import './login.css';
import { UserOutlined,LockOutlined, LoginOutlined } from "@ant-design/icons";
import { responsiveArray } from 'antd/es/_util/responsiveObserver';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate(); // Navigation after login

  const handleSubmit = async (values) => {
    try {
      const data = await loginApi(values);

      if (data.token) {
        localStorage.setItem("userToken", data.token);// Store JWT token
        
        message.success('Login successfully ');
        //  // ✅ Fetch user details from API using token
        //  const userResponse = await axios.get("http://localhost:5001/api/consumer/me", {
        //   headers: { Authorization: `Bearer ${data.token}` },
        // });
        
        
        const user = data.user;
        // console.log(user);
        console.log("Fetched User:", user); 
        localStorage.setItem("user", JSON.stringify(user));// Store user details
        // setUser(user); // Update AuthContext
        navigate("/"); // Redirect to consumer dashboard
      } else {
        message.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error("An error occurred");
    }
  };

  return (
    <div style={{}} className="container" >
      <Form onFinish={handleSubmit}> {/* Ensure this is present */}
      <h2>
        <LoginOutlined style={{ marginRight: "8px", fontSize: "22px" }} />
        Login
      </h2>
        <Form.Item name="email" style={{paddingLeft:'10px', paddingRight:'10px'}} rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input prefix={<UserOutlined />} style={{color:'black'}} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" style={{paddingLeft:'10px', paddingRight:'10px', height:'30px'}} rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <p style={{display:'flex', justifyContent:'right', marginRight:'20px', marginBottom:'30px', height:'10px'}}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <Button className='button' style={{backgroundColor:'#40476D'}} type="primary" htmlType="submit">Login</Button>
        <p style={{paddingLeft:'70px'}}>Don't have an account? <Link to="/signup">Create account</Link></p>
        
      </Form>
    </div>
  );
};

export default Login;
