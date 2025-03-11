export const loginApi = async (values) => {
      const response = await fetch('http://localhost:5001/api/consumer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
  
    if (!response.ok) {
      throw new Error('Failed to login');
    }
  
    return response.json();
  };

  export const signupApi = async (userData) => {
    try {
      const response = await fetch('http://localhost:5001/api/consumer/signup', { // Corrected path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };
  