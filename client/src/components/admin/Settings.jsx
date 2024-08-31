import React, { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
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

const Settings = () => {
  const { addAlert } = useAlerts(); // Add this line

  const [configs, setConfigs] = useState({
    dimensionConfig: {},
    // Add more config sections here
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
        {/* Add more ConfigSection components here for other config types */}
        <button type="submit" className="github-primary flex items-center justify-center">
          <FaSave className="mr-2 inline-block" />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;
