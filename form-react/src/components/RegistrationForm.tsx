import React, { useState } from 'react';
import { FormData } from '../types/form';  // Assuming your types are set correctly
import { Input } from './Input';
import { UserPlus } from 'lucide-react';

const initialFormData: FormData = {
  fname: '',
  lname: '',
  appAddress: '',
  email: '',
  phone: '',
  bdate: '',
  gender: ''
};

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map formData to match Flask's expected structure
      const mappedData = {
        first_name: formData.fname,
        last_name: formData.lname,
        dob: formData.bdate,
        email: formData.email,
        nationality: '', // You can add a nationality field to the form if needed
        occupation: '', // You can add an occupation field to the form if needed
        annual_income: '', // You can add an annual income field to the form if needed
        image: '' // Optional, you can modify to handle image uploads
      };

      // Make the API call to Flask backend
      const response = await fetch('http://localhost:5000/submit_kyc', {  // Make sure this matches your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappedData),
      });
      
      if (!response.ok) throw new Error('Submission failed');
      
      // Handle success (e.g., show success message, reset form)
      const result = await response.json();
      console.log('KYC Registration Success:', result);
      alert('Registration Successful!');
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error with the registration.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-blue-600 flex items-center justify-center bg-blue-100 rounded-full">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Registration Form
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="fname"
                type="text"
                required
                placeholder="First Name"
                value={formData.fname}
                onChange={handleChange}
                label="First Name"
              />
              <Input
                name="lname"
                type="text"
                required
                placeholder="Last Name"
                value={formData.lname}
                onChange={handleChange}
                label="Last Name"
              />
            </div>

            <Input
              name="appAddress"
              type="text"
              required
              placeholder="Street Address"
              value={formData.appAddress}
              onChange={handleChange}
              label="Address"
            />

            <Input
              name="email"
              type="email"
              required
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              label="Email Address"
            />

            <Input
              name="phone"
              type="tel"
              required
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              label="Phone Number"
            />

            <Input
              name="bdate"
              type="date"
              required
              value={formData.bdate}
              onChange={handleChange}
              label="Date of Birth"
            />

            <Input
              name="gender"
              type="text"
              required
              placeholder="Gender"
              value={formData.gender}
              onChange={handleChange}
              label="Gender"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};
