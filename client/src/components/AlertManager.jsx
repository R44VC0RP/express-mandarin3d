import React from 'react';
import Alert from './Alert';
import { AlertContext } from '../context/AlertContext'; // Update this import

const AlertManager = () => {
  const { alerts, removeAlert } = React.useContext(AlertContext); // Use useContext here

  return (
    <>
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </>
  );
};

export default AlertManager;