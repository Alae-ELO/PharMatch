import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Pill, ChevronsRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'user',
    // Pharmacy specific data
    pharmacyName: '',
    address: '',
    city: '',
    phone: '',
    hours: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    if (formData.accountType === 'user') return true;
    
    const newErrors = {};
    
    if (!formData.pharmacyName.trim()) {
      newErrors.pharmacyName = 'Pharmacy name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.hours.trim()) {
      newErrors.hours = 'Business hours are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };
  
  const prevStep = () => {
    setStep(1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      nextStep();
      return;
    }
    
    if (validateStep2()) {
      setIsLoading(true);
      
      // Simulate registration process
      setTimeout(() => {
        setIsLoading(false);
        alert(`Account registered successfully! In a real application, this would create a ${formData.accountType} account and redirect to login.`);
        navigate('/login');
      }, 1500);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Pill className="h-12 w-12 text-cyan-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">
            Or <Link to="/login" className="font-medium text-cyan-600 hover:text-cyan-500">sign in to your existing account</Link>
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white">
              1
            </div>
            <div className="flex-grow mx-2 h-1 bg-gray-200">
              <div className={`h-full ${step >= 2 ? 'bg-cyan-600' : 'bg-gray-200'} transition-all duration-300`} style={{ width: step === 1 ? '0%' : '100%' }}></div>
            </div>
            <div className={`w-10 h-10 rounded-full ${step >= 2 ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center transition-all duration-300`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-center w-10">Account</span>
            <span className="text-xs text-center w-10">Details</span>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    icon={<User className="h-5 w-5" />}
                    error={errors.name}
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    icon={<Mail className="h-5 w-5" />}
                    error={errors.email}
                    required
                  />
                  
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    icon={<Lock className="h-5 w-5" />}
                    error={errors.password}
                    required
                  />
                  
                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    icon={<Lock className="h-5 w-5" />}
                    error={errors.confirmPassword}
                    required
                  />
                  
                  <div>
                    <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <select
                      id="accountType"
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="user">Regular User</option>
                      <option value="pharmacy">Pharmacy Owner</option>
                    </select>
                    {errors.accountType && <p className="text-sm text-red-600 mt-1">{errors.accountType}</p>}
                  </div>
                  
                  <Button
                    type="button"
                    fullWidth
                    onClick={nextStep}
                    icon={<ChevronsRight className="h-5 w-5" />}
                  >
                    Continue
                  </Button>
                </>
              )}
              
              {step === 2 && (
                <>
                  {formData.accountType === 'pharmacy' ? (
                    <>
                      <Input
                        label="Pharmacy Name"
                        name="pharmacyName"
                        value={formData.pharmacyName}
                        onChange={handleChange}
                        placeholder="Enter pharmacy name"
                        error={errors.pharmacyName}
                      />
                      
                      <Input
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter street address"
                        error={errors.address}
                      />
                      
                      <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        error={errors.city}
                      />
                      
                      <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        error={errors.phone}
                      />
                      
                      <Input
                        label="Business Hours"
                        name="hours"
                        value={formData.hours}
                        onChange={handleChange}
                        placeholder="e.g., Mon-Fri: 9am-7pm, Sat: 10am-5pm"
                        error={errors.hours}
                      />
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Create Your Account!</h3>
                      <p className="text-gray-600">Click the button below to complete registration.</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      isLoading={isLoading}
                    >
                      Create Account
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;