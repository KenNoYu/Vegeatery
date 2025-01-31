import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RoleGuard = (requiredRole) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); 
    if (token) {
      const decodedToken = jwtDecode(token); 
      const userRole = decodedToken.role; // Access the 'role' claim from the token

      if (userRole !== requiredRole) {
        navigate('/unauthorized'); // Redirect to an unauthorized page
      }
    } else {
        navigate('/login'); // Redirect to login if no token is found
    }
  }, []); 

  return null; // No need to return anything
};

export default RoleGuard;