import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const STORAGE_KEY_REMEMBER = 'vkcommerce_remembered_login';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  // Load remembered credentials on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REMEMBER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email) {
          setEmail(parsed.email);
          setRememberMe(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showError('Please enter your email address and password.');
      return;
    }

    setIsLoading(true);

    // Save or clear Remember Me
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY_REMEMBER, JSON.stringify({ email: email.trim() }));
    } else {
      localStorage.removeItem(STORAGE_KEY_REMEMBER);
    }

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);

      if (res.role === 'vendor') {
        navigate('/admin');
      } else {
        navigate(from === '/admin' ? '/' : from);
      }
    }, 400);
  };

  return (
    <div style={{ padding: '50px 20px 80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '36px 32px' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 8px 18px rgba(5, 150, 105, 0.25)'
            }}
          >
            <ShoppingBag size={26} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            VKCommerce Portal Sign In
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
            Enter your credentials to access your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                Password
              </label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 38px 10px 38px', borderRadius: '10px', fontSize: '0.9rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label
              onClick={() => setRememberMe(!rememberMe)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: '#475569',
                cursor: 'pointer',
                userSelect: 'none',
                fontWeight: 600
              }}
            >
              {rememberMe ? (
                <CheckSquare size={18} color="#10b981" />
              ) : (
                <Square size={18} color="#94a3b8" />
              )}
              <span>Remember Me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              height: '44px',
              marginTop: '4px',
              fontWeight: 800,
              fontSize: '0.95rem'
            }}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Account'}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#64748b' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#10b981', fontWeight: 700 }}>
            Sign Up Free
          </Link>
        </div>
      </div>
    </div>
  );
};
