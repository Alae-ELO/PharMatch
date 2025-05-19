import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Pill } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import useStore from '../store';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Pill className="h-12 w-12 text-cyan-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to PharMatch</h2>
          <p className="mt-2 text-gray-600">
            Or <Link to="/register" className="font-medium text-cyan-600 hover:text-cyan-500">create a new account</Link>
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                icon={<Mail className="h-5 w-5" />}
                required
              />
              
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={<Lock className="h-5 w-5" />}
                required
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-cyan-600 hover:text-cyan-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  For demo purposes, you can sign in with:
                </p>
                <div className="mt-2 space-y-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      setEmail('john@example.com');
                      setPassword('password'); // In a real app, this would be secure
                    }}
                  >
                    User Account
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      setEmail('admin@medicare.com');
                      setPassword('password'); // In a real app, this would be secure
                    }}
                  >
                    Pharmacy Account
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      setEmail('admin@pharmatch.com');
                      setPassword('password'); // In a real app, this would be secure
                    }}
                  >
                    Admin Account
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;