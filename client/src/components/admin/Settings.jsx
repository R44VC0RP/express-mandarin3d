import React, { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const ConfigSection = ({ title, description, fields, values, onChange }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {fields.map((field) => (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="block text-sm font-medium text-white dark:text-gray-300 mb-1">
              {field.label}
            </label>
            <Input
              type={field.type}
              id={field.name}
              name={field.name}
              value={values[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder || ""}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const Settings = () => {
  const [configs, setConfigs] = useState({
    dimensionConfig: { x: 0, y: 0, z: 0 },
    priceConfig: { profitMargin: 0, freeShippingThreshold: 0 }, // Add freeShippingThreshold here
    stripeConfig: { shippingOptions: [] }
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/configs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data) {
        setConfigs(response.data);
      } else {
        toast.error('Failed to fetch configs');
      }
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast.error('Error fetching configs');
    }
  };

  const handleConfigChange = (section, field, value) => {
    setConfigs((prevConfigs) => ({
      ...prevConfigs,
      [section]: {
        ...prevConfigs[section],
        [field]: value,
      },
    }));
  };

  const handleShippingOptionChange = (index, field, value) => {
    setConfigs((prevConfigs) => {
      const newShippingOptions = [...prevConfigs.stripeConfig.shippingOptions];
      newShippingOptions[index] = { ...newShippingOptions[index], [field]: value };
      return {
        ...prevConfigs,
        stripeConfig: {
          ...prevConfigs.stripeConfig,
          shippingOptions: newShippingOptions
        }
      };
    });
  };

  const addShippingOption = () => {
    setConfigs((prevConfigs) => ({
      ...prevConfigs,
      stripeConfig: {
        ...prevConfigs.stripeConfig,
        shippingOptions: [...prevConfigs.stripeConfig.shippingOptions, { 
          stripe_id: '', 
          name: '', 
          price: 0, 
          delivery_estimate: '',
          notes: ''
        }]
      }
    }));
  };

  const removeShippingOption = (index) => {
    setConfigs((prevConfigs) => ({
      ...prevConfigs,
      stripeConfig: {
        ...prevConfigs.stripeConfig,
        shippingOptions: prevConfigs.stripeConfig.shippingOptions.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/configs`, configs, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.status === 'success') {
        toast.success('Configs updated successfully');
      } else {
        toast.error('Failed to update configs');
      }
    } catch (error) {
      console.error('Error updating configs:', error);
      toast.error('Error updating configs');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>
      <form onSubmit={handleSubmit}>
        <ConfigSection
          title="Dimension Config"
          description="Set the maximum dimensions for 3D prints"
          fields={[
            { name: 'x', label: 'X (mm)', type: 'number', placeholder: 'Enter X dimension' },
            { name: 'y', label: 'Y (mm)', type: 'number', placeholder: 'Enter Y dimension' },
            { name: 'z', label: 'Z (mm)', type: 'number', placeholder: 'Enter Z dimension' },
          ]}
          values={configs.dimensionConfig}
          onChange={(field, value) => handleConfigChange('dimensionConfig', field, value)}
        />
        <ConfigSection
          title="Price Config"
          description="Set the profit margin and free shipping threshold"
          fields={[
            { name: 'profitMargin', label: 'Profit Margin (%)', type: 'number', placeholder: 'Enter profit margin' },
            { name: 'freeShippingThreshold', label: 'Free Shipping Threshold ($)', type: 'number', step: '0.01', placeholder: 'Enter free shipping threshold' },
          ]}
          values={configs.priceConfig}
          onChange={(field, value) => handleConfigChange('priceConfig', field, value)}
        />
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Shipping Options</CardTitle>
            <CardDescription>Configure shipping options for orders</CardDescription>
          </CardHeader>
          <CardContent>
            {configs.stripeConfig.shippingOptions.map((option, index) => (
              <div key={index} className="flex flex-col mb-4 p-4 border rounded">
                <Input
                  className="mb-2"
                  placeholder="Stripe ID"
                  value={option.stripe_id}
                  onChange={(e) => handleShippingOptionChange(index, 'stripe_id', e.target.value)}
                />
                <Input
                  className="mb-2"
                  placeholder="Shipping option name"
                  value={option.name}
                  onChange={(e) => handleShippingOptionChange(index, 'name', e.target.value)}
                />
                <Input
                  className="mb-2"
                  type="number"
                  placeholder="Price"
                  value={option.price}
                  onChange={(e) => handleShippingOptionChange(index, 'price', parseFloat(e.target.value))}
                />
                <Input
                  className="mb-2"
                  placeholder="Delivery estimate"
                  value={option.delivery_estimate}
                  onChange={(e) => handleShippingOptionChange(index, 'delivery_estimate', e.target.value)}
                />
                <Input
                  className="mb-2"
                  placeholder="Notes"
                  value={option.notes}
                  onChange={(e) => handleShippingOptionChange(index, 'notes', e.target.value)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeShippingOption(index)}
                  className="mt-2"
                >
                  <FaTrash className="mr-2" /> Remove Option
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <button type="button" onClick={addShippingOption} className="w-full github-primary">
              <FaPlus className="mr-2 inline" /> Add Shipping Option
            </button>
          </CardFooter>
        </Card>
        <button type="submit" className="w-full github-primary">
          <FaSave className="mr-2 inline" /> Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;
