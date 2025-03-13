import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash, FaSpinner, FaCheck, FaSync, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { Input } from "../../shacdn/input.js"

import DataTable from 'react-data-table-component';
import { useAlerts } from '../../context/AlertContext';
import axios from 'axios';

function ShippingManagement() {
    const { addAlert } = useAlerts();

    const showAlert = (type, title, message) => {
        addAlert(type, title, message);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newShipping, setNewShipping] = useState({ name: '', price: '', delivery_estimate: '', notes: '' });
    const [shippingOptions, setShippingOptions] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchShippingOptions();
    }, []);

    const fetchShippingOptions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/shipping`, {
                params: { action: 'list' },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                setShippingOptions(response.data.result);
            } else {
                showAlert('error', 'Error', 'Failed to fetch shipping options');
            }
        } catch (error) {
            console.error('Error fetching shipping options:', error);
            showAlert('error', 'Error', 'Failed to fetch shipping options');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (shipping_option_id) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/shipping`, {
                action: 'delete',
                shipping_option_id
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                setShippingOptions(shippingOptions.filter(option => option.id !== shipping_option_id));
                showAlert('success', 'Success', 'Shipping option deleted successfully');
            } else {
                showAlert('error', 'Error', 'Failed to delete shipping option');
            }
        } catch (error) {
            console.error('Error deleting shipping option:', error);
            showAlert('error', 'Error', 'Failed to delete shipping option');
        }
    };

    const handleAddShipping = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/shipping`, {
                action: 'create',
                name: newShipping.name,
                price: newShipping.price,
                delivery_estimate: newShipping.delivery_estimate,
                notes: newShipping.notes
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                showAlert('success', 'Success', 'Shipping option added successfully');
                setNewShipping({ name: '', price: '', delivery_estimate: '', notes: '' });
                setIsModalOpen(false);
                fetchShippingOptions();
            } else {
                showAlert('error', 'Error', 'Failed to add shipping option');
            }
        } catch (error) {
            console.error('Error adding shipping option:', error);
            showAlert('error', 'Error', 'Failed to add shipping option');
        }
    };

    const columns = [
        { name: 'Name', selector: row => row.display_name, sortable: true },
        { 
            name: 'Price', 
            selector: row => `$${(row.fixed_amount.amount / 100).toFixed(2)}`, 
            sortable: true 
        },
        { 
            name: 'Delivery Estimate', 
            selector: row => {
                const min = row.delivery_estimate.minimum;
                const max = row.delivery_estimate.maximum;
                return `${min.value}-${max.value} ${min.unit}${max.value > 1 ? 's' : ''}`;
            }, 
            sortable: true 
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex justify-center">
                    <button onClick={() => handleDelete(row.id)} className="github-secondary text-red-500 hover:text-red-700 mr-2">
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    const filteredItems = shippingOptions.filter(
        item => Object.values(item).some(
            val => val && val.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const subHeaderComponent = (
        <div className="flex items-center mb-4">
            <FaSearch className="text-gray-400 mr-2" />
            <Input
                type="text"
                placeholder="Search..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
            />
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Shipping Management</h2>
                <button className="github-primary" onClick={() => setIsModalOpen(true)}>
                    <FaPlus className="mr-2 inline" />
                    Add Shipping Option
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold mb-4">Loading Shipping Options</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#466F80]"></div>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    highlightOnHover
                    responsive
                    subHeader
                    subHeaderComponent={subHeaderComponent}
                    customStyles={{
                        headCells: {
                            style: {
                                backgroundColor: '#282828',
                                color: 'white',
                            },
                        },
                        cells: {
                            style: {
                                backgroundColor: '#383838',
                                color: 'white',
                            },
                        },
                        rows: {
                            style: {
                                '&:nth-of-type(odd)': {
                                    backgroundColor: '#303030',
                                },
                                '&:nth-of-type(even)': {
                                    backgroundColor: '#383838',
                                },
                            },
                        },
                        pagination: {
                            style: {
                                backgroundColor: '#282828',
                                color: 'white',
                                border: 'none',
                                borderBottomLeftRadius: '0.5rem',
                                borderBottomRightRadius: '0.5rem',
                            },
                        },
                        noData: {
                            style: {
                                backgroundColor: '#282828',
                                color: 'white',
                                textAlign: 'center',
                                padding: '20px',
                            },
                        },
                        subHeader: {
                            style: {
                                backgroundColor: '#282828',
                                color: 'white',
                                padding: '10px',
                            },
                        },
                    }}
                />
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="card-special bg-gray-800 p-6 rounded-lg w-96 w-[50vw]">
                        <h3 className="text-xl font-bold mb-4">Add New Shipping Option</h3>
                        <div>
                            <label htmlFor="name" className="block mb-1">Name</label>
                            <Input
                                type="text"
                                name="name"
                                value={newShipping.name}
                                onChange={e => setNewShipping({ ...newShipping, name: e.target.value })}
                            />
                            <label htmlFor="price" className="block mb-1">Price</label>
                            <Input
                                type="text"
                                name="price"
                                value={newShipping.price}
                                onChange={e => setNewShipping({ ...newShipping, price: e.target.value })}
                            />
                            <label htmlFor="delivery_estimate" className="block mb-1">Delivery Estimate (e.g., 1-3)</label>
                            <Input
                                type="text"
                                name="delivery_estimate"
                                value={newShipping.delivery_estimate}
                                onChange={e => setNewShipping({ ...newShipping, delivery_estimate: e.target.value })}
                                placeholder="Min-Max business days"
                            />
                            <label htmlFor="notes" className="block mb-1">Notes</label>
                            <input
                                type="text"
                                name="notes"
                                value={newShipping.notes}
                                onChange={e => setNewShipping({ ...newShipping, notes: e.target.value })}
                                className="w-full p-2 mb-2 bg-gray-700 rounded"
                            />
                            <div className="flex justify-end mt-4">
                                <button className="github-secondary mr-2" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button className="github-primary" onClick={handleAddShipping}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShippingManagement;