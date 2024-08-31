import React from 'react';
import { FaUsers, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="card-special p-6 shadow-md">
      <div className="flex items-center mb-4">
        <Icon className="text-2xl mr-2 text-[#0D939B]" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={FaUsers} title="Total Users" value="1,234" />
        <StatCard icon={FaShoppingCart} title="Orders" value="56" />
        <StatCard icon={FaMoneyBillWave} title="Revenue" value="$12,345" />
      </div>
    </div>
  );
}

export default Dashboard;