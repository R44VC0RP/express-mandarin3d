import React from 'react';

const Hex = () => {
  const cssVars = [
    '--background', '--foreground', '--muted', '--muted-foreground',
    '--accent', '--accent-foreground', '--popover', '--popover-foreground',
    '--border', '--input', '--card', '--card-foreground',
    '--primary', '--primary-foreground', '--secondary', '--secondary-foreground',
    '--destructive', '--destructive-foreground', '--ring'
  ];

  return (
    <div className="p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">CSS Variables</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cssVars.map((varName, index) => (
          <div key={index} className="card-special p-4">
            <h2 className="text-lg font-semibold mb-2">{varName}</h2>
            <div 
              className="w-full h-20 rounded"
              style={{ backgroundColor: `hsl(var(${varName}))` }}
            ></div>
            <p className="mt-2">{getComputedStyle(document.documentElement).getPropertyValue(varName)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hex;

