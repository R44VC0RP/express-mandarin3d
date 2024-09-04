import React, { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { useAlerts } from '../../context/AlertContext'; // Add this import

const ConfigSection = ({ title, fields, values, onChange, protected: isProtected }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
      {fields.map((field) => (
        <div key={field.name} className="mb-2">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
          </label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={isProtected ? '••••••' : values[field.name] || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100"
            disabled={isProtected}
            placeholder=""
          />
        </div>
      ))}
    </div>
  );
};

const ShippingOptionItem = ({ option, onChange, onRemove }) => {
  return (
    <div className="mb-4 p-4 border rounded-md dark:border-gray-700">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Stripe ID"
          value={option.stripe_id || ''}
          onChange={(e) => onChange('stripe_id', e.target.value)}
          className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600 p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Name"
          value={option.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600 p-2 rounded-md"
        />
        <input
          type="number"
          placeholder="Price"
          value={option.price || ''}
          onChange={(e) => onChange('price', e.target.value)}
          className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600 p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Delivery Estimate"
          value={option.delivery_estimate || ''}
          onChange={(e) => onChange('delivery_estimate', e.target.value)}
          className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600 p-2 rounded-md"
        />
      </div>
      <textarea
        placeholder="Notes"
        value={option.notes || ''}
        onChange={(e) => onChange('notes', e.target.value)}
        className="input-field mt-2 w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 p-2 rounded-md"
      />
      <button onClick={onRemove} className="github-secondary mt-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
        <FaTrash className="mr-2 inline-block" /> Remove
      </button>
    </div>
  );
};

const Settings = () => {
  const { addAlert } = useAlerts(); // Add this line

  const [configs, setConfigs] = useState({
    dimensionConfig: {},
    priceConfig: {},
    stripeConfig: {
      shippingOptions: []
    },
  });

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage after login
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/configs`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          }
        });
        if (response.ok) {
          const data = await response.json();
          setConfigs(data);
        } else {
          console.error('Failed to fetch configs:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching configs:', error);
      }
    };

    fetchConfigs();
  }, []);

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
        shippingOptions: [...prevConfigs.stripeConfig.shippingOptions, {}]
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

  const showAlert = (type, title, message) => {
    addAlert(type, title, message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Get the token
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/configs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify(configs),
      });
      if (response.ok) {
        showAlert('success', 'Success', 'Configs updated successfully');
      } else {
        showAlert('error', 'Error', 'Failed to update configs');
      }
    } catch (error) {
      console.error('Error updating configs:', error);
      showAlert('error', 'Error', 'Error updating configs');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-2">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <form onSubmit={handleSubmit}>
        <ConfigSection
          title="Dimension Config"
          fields={[
            { name: 'x', label: 'X (INT)', type: 'number' },
            { name: 'y', label: 'Y (INT)', type: 'number' },
            { name: 'z', label: 'Z (INT)', type: 'number' },
          ]}
          values={configs.dimensionConfig || ""}
          onChange={(field, value) => handleConfigChange('dimensionConfig', field, value)}
        />
        <ConfigSection
          title="Price Config"
          fields={[
            { name: 'profitMargin', label: 'Profit Margin (%)', type: 'number' },
          ]}
          values={configs.priceConfig || ""}
          onChange={(field, value) => handleConfigChange('priceConfig', field, value)}
        />
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Stripe Shipping Options</h3>
          {configs.stripeConfig.shippingOptions.map((option, index) => (
            <ShippingOptionItem
              key={index}
              option={option}
              onChange={(field, value) => handleShippingOptionChange(index, field, value)}
              onRemove={() => removeShippingOption(index)}
            />
          ))}
          <button type="button" onClick={addShippingOption} className="github-secondary mt-2">
            <FaPlus className="mr-2 inline-block" /> Add Shipping Option
          </button>
        </div>
        <button type="submit" className="github-primary flex items-center justify-center">
          <FaSave className="mr-2 inline-block" />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;
