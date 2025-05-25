import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Pill, ChevronsRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'user' as 'user' | 'pharmacy',
    // Pharmacy specific data
    pharmacyName: '',
    address: '',
    city: '',
    phone: '',
    hours: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('register.step1.errors.nameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('register.step1.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email =t('register.step1.errors.emailInvalid');
    }
    
    if (!formData.password) {
      newErrors.password = t('register.step1.errors.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('register.step1.errors.passwordLength');
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.step1.errors.passwordsMismatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    if (formData.accountType === 'user') return true;
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.pharmacyName.trim()) {
      newErrors.pharmacyName = t('register.step2.errors.pharmacyNameRequired');
    }
    
    if (!formData.address.trim()) {
      newErrors.address = t('register.step2.errors.addressRequired');
    }
    
    if (!formData.city.trim()) {
      newErrors.city = t('register.step2.errors.cityRequired');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('register.step2.errors.phoneRequired');
    }
    
    if (!formData.hours.trim()) {
      newErrors.hours = t('register.step2.errors.hoursRequired');
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      nextStep();
      return;
    }
    
    if (validateStep2()) {
      setIsLoading(true);
try{      
      // Prepare the data based on account type
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.accountType
      };
      
      // Add pharmacy data if account type is pharmacy
      if (formData.accountType === 'pharmacy') {
        Object.assign(userData, {
          pharmacyName: formData.pharmacyName,
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
          hours: formData.hours
        });
      }
      
      // Send registration request to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Registration successful
      alert(t('register.successMessage', { accountType: formData.accountType }));
      navigate('/login');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setErrors(prev => ({ ...prev, submit: errorMessage }));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
};

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Pill className="h-12 w-12 text-cyan-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{t('register.header.title')}</h2>
          <p className="mt-2 text-gray-600">
             {t('register.header.signIn')}{' '} <Link to="/login" className="font-medium text-cyan-600 hover:text-cyan-500">{t('register.header.signIn')}</Link>
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white">
              1
            </div>
            <div className="flex-grow mx-2 h-1 bg-gray-200">
              <div
                className={`h-full transition-all duration-300 ${step >= 2 ? 'bg-cyan-600' : 'bg-gray-200'}`}
                style={{ width: step >= 2 ? '100%' : '0%' }}
              />
            </div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= 2 ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-center w-10">{t('register.steps.account')}</span>
            <span className="text-xs text-center w-10">{t('register.steps.details')}</span>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                  {errors.submit}
                </div>
              )}
              
              {step === 1 && (
                <>
                  <Input
                    label={t('register.step1.fullName')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('register.step1.fullNamePlaceholder')}
                    icon={<User className="h-5 w-5" />}
                    error={errors.name}
                    required
                  />
                  
                  <Input
                    label={t('register.step1.email')}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('register.step1.emailPlaceholder')}
                    icon={<Mail className="h-5 w-5" />}
                    error={errors.email}
                    required
                  />
                  
                  <Input
                    label={t('register.step1.password')}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('register.step1.passwordPlaceholder')}
                    icon={<Lock className="h-5 w-5" />}
                    error={errors.password}
                    required
                  />
                  
                  <Input
                    label={t('register.step1.confirmPassword')}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('register.step1.confirmPasswordPlaceholder')}
                    icon={<Lock className="h-5 w-5" />}
                    error={errors.confirmPassword}
                    required
                  />
                  
                  <div>
                    <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('register.step1.accountType')}
                    </label>
                    <select
                      id="accountType"
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="user">{t('register.step1.accountType.user')}</option>
                      <option value="pharmacy">{t('register.step1.accountType.pharmacy')}</option>
                    </select>
                    {errors.accountType && <p className="text-sm text-red-600 mt-1">{errors.accountType}</p>}
                  </div>
                  
                  <Button
                    type="button"
                    fullWidth
                    onClick={nextStep}
                    icon={<ChevronsRight className="h-5 w-5" />}
                  >
                   {t('register.step1.continue')}
                  </Button>
                </>
              )}
              
              {step === 2 && (
                <>
                  {formData.accountType === 'pharmacy' ? (
                    <>
                      <Input
                        label={t('register.step2.pharmacyName')}
                        name="pharmacyName"
                        value={formData.pharmacyName}
                        onChange={handleChange}
                        placeholder={t('register.step2.pharmacyNamePlaceholder')}
                        error={errors.pharmacyName}
                      />
                      
                      <Input
                        label={t('register.step2.address')}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder={t('register.step2.addressPlaceholder')}
                        error={errors.address}
                      />
                      
                      <Input
                        label={t('register.step2.city')}
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder={t('register.step2.cityPlaceholder')}
                        error={errors.city}
                      />
                      
                      <Input
                        label={t('register.step2.phone')}
                        name="phone" // Adding the missing name attribute
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('register.step2.phonePlaceholder')}
                        error={errors.phone}
                      />
                      
                      <Input
                        label={t('register.step2.hours')}
                        name="hours"
                        value={formData.hours}
                        onChange={handleChange}
                        placeholder={t('register.step2.hoursPlaceholder')}
                        error={errors.hours}
                      />
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('register.step2.readyTitle')}</h3>
                      <p className="text-gray-600">{t('register.step2.readyDescription')}</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                    >
                      {t('register.step2.back')}
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      isLoading={isLoading}
                    >
                      {t('register.step2.createAccount')}
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