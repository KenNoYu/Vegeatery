import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../http';

const RoleGuard = (requiredRole) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Make a request to your backend to fetch the user's role from the server
    http
      .get('/auth/role', { withCredentials: true })  // withCredentials ensures cookies are sent with the request
      .then((res) => {
        const userRole = res.data.roleName; // Assuming the server returns the role in response
        console.log(userRole);
        setRole(userRole);
        console.log(res);

        console.log(userRole);
        console.log(requiredRole);

        if (userRole != requiredRole) {
          navigate('/unauthorized'); // Redirect if the user doesn't have the required role
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user data', err);
        setError('Failed to fetch user data');
        navigate('/login'); // Redirect to login if there's an error
      });
  }, [navigate, requiredRole]);

  // Handle errors or loading state if needed
  if (error) {
    return {error}; // Simple error message, you can customize as needed
  }

  return null; // No UI is rendered by the guard itself
};

export default RoleGuard;