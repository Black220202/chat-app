import React from 'react';
import './Login.css';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const handleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Failed to login", error);
      setError(error.message || "Failed to log in");
    }
  };

  return (
    <div className="login-container flex-center">
      <div className="login-box">
        <div className="login-header">
          <div className="logo-placeholder flex-center">
            <span role="img" aria-label="chat bubble">💬</span>
          </div>
          <h2>Welcome Back</h2>
          <p>We're so excited to see you again!</p>
        </div>
        
        <button className="btn-primary" onClick={handleLogin}>
          <LogIn size={20} style={{ marginRight: '8px' }} />
          Log In with Google
        </button>
        {error && (
          <div style={{ color: 'var(--danger)', marginTop: '16px', fontSize: '14px', backgroundColor: 'rgba(218,55,60,0.1)', padding: '8px', borderRadius: '4px'}}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
