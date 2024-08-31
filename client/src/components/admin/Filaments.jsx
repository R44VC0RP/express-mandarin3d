import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import { UploadButton } from "../../utils/uploadthing";
import { useAlerts } from '../../context/AlertContext'; // Make sure this path is correct
import axios from 'axios';

function FilamentInventory() {
    const { addAlert } = useAlerts();

    const showAlert = (type, title, message) => {
        addAlert(type, title, message);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFilament, setNewFilament] = useState({ brand: '', name: '', color: '', weight: '', price: '', image_url: '', description: '' });
    const [filaments, setFilaments] = useState([]);

    useEffect(() => {
        fetchFilaments();
    }, []);

    const fetchFilaments = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/filament`, { action: 'list' });
            if (response.data.status === 'success') {
                setFilaments(response.data.result);
            } else {
                showAlert('error', 'Error', 'Failed to fetch filaments');
            }
        } catch (error) {
            console.error('Error fetching filaments:', error);
            showAlert('error', 'Error', 'Failed to fetch filaments');
        }
    };

    const handleDelete = async (filament_id) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/filament`, {
                action: 'delete',
                filament_id: filament_id,
            });

            if (response.data.status === 'success') {
                // Remove the deleted filament from the state
                setFilaments(filaments.filter(f => f.filament_id !== filament_id));
            } else {
                console.error('Failed to delete filament');
            }
        } catch (error) {
            console.error('Error deleting filament:', error);
        }
    };

    const columns = [
        { 
            name: 'Image', 
            selector: row => <img src={row.filament_image_url} alt={row.filament_name} className="w-16 h-16 object-cover rounded-md" />
        },
        { name: 'Brand', selector: row => row.filament_brand, sortable: true },
        { name: 'Name', selector: row => row.filament_name, sortable: true },
        { name: 'Color', selector: row => row.filament_color, sortable: true },
        { name: 'Weight', selector: row => `${row.filament_mass_in_grams}g`, sortable: true },
        { name: 'Price', selector: row => `$${row.filament_unit_price.toFixed(2)}`, sortable: true },
        {
            name: 'Actions',
            cell: (row) => (
                <button
                    onClick={() => handleDelete(row.filament_id)}
                    className="github-secondary text-red-500 hover:text-red-700"
                >
                    <FaTrash />
                </button>
            ),
        },
    ];

    const handleInputChange = (e) => {
        setNewFilament({ ...newFilament, [e.target.name]: e.target.value });
    };

    const handleAddFilament = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/filament`, {
                action: 'add',
                filament_brand: newFilament.brand,
                filament_name: newFilament.name,
                filament_color: newFilament.color,
                filament_unit_price: parseFloat(newFilament.price),
                filament_image_url: newFilament.image_url,
                filament_mass_in_grams: parseInt(newFilament.weight),
                filament_link: newFilament.description
            });

            if (response.data.status === 'success') {
                showAlert('success', 'Success', 'Filament added successfully');
                setNewFilament({ name: '', color: '', weight: '', price: '', image_url: '', description: '' });
                setIsModalOpen(false);
                fetchFilaments(); // Refresh the filament list
            } else {
                showAlert('error', 'Error', 'Failed to add filament');
            }
        } catch (error) {
            console.error('Error adding filament:', error);
            showAlert('error', 'Error', 'Failed to add filament');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Filaments</h2>
                <button className="github-primary" onClick={() => setIsModalOpen(true)}>
                    <FaPlus className="mr-2 inline" />
                    Add Filament
                </button>
            </div>


            <DataTable
                columns={columns}
                data={filaments}
                pagination
                highlightOnHover
                responsive
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
                            marginTop: '5px', 
                            marginBottom: '5px',
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
                }}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="card-special bg-gray-800 p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Add New Filament</h3>
                        <label htmlFor="brand">Brand <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="brand"
                            value={newFilament.brand}
                            onChange={handleInputChange}
                            placeholder="SUNLU"
                            className="w-full p-2 mb-2 bg-gray-700 rounded"
                        />
                        <label htmlFor="name">Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={newFilament.name}
                            onChange={handleInputChange}
                            placeholder="White PLA"
                            className="w-full p-2 mb-2 bg-gray-700 rounded"
                        />
                        <label htmlFor="color" className="block mb-1">Color <span className="text-red-500">*</span></label>
                        <div className="flex items-center mb-2">
                            <input
                                type="text"
                                name="color"
                                value={newFilament.color}
                                onChange={handleInputChange}
                                placeholder="Color"
                                className="flex-grow p-2 mr-2 bg-gray-700 rounded"
                            />
                            <input
                                type="color"
                                name="colorPicker"
                                value={newFilament.color}
                                onChange={(e) => setNewFilament({ ...newFilament, color: e.target.value })}
                                className="w-10 h-10 p-1 bg-gray-700 rounded cursor-pointer"
                            />
                        </div>
                        <label htmlFor="weight" className="block mb-1">Weight (in grams)<span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="weight"
                            value={newFilament.weight}
                            onChange={handleInputChange}
                            placeholder="1000"
                            className="w-full p-2 mb-2 bg-gray-700 rounded"
                        />
                        <label htmlFor="price" className="block mb-1">Unit Price <span className="text-red-500">*</span></label>
                        <div className="flex items-center mb-2">
                            <span className="text-white mr-2">$</span>
                            <input
                                type="number"
                                name="price"
                                value={newFilament.price}
                                onChange={handleInputChange}
                                placeholder="24.50"
                                className="flex-grow p-2 bg-gray-700 rounded"
                            />
                        </div>
                        <label htmlFor="image" className="block mb-1">Image of Filament</label>
                        {newFilament.image_url ? (
                            <div className="relative w-full p-2 mb-2 bg-gray-700 rounded flex justify-center items-center">
                                <img src={newFilament.image_url} alt="Uploaded Filament" className="w-1/2 h-auto rounded" />
                                <button
                                    className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                                    onClick={() => setNewFilament({ ...newFilament, image_url: '' })}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ) : (
                            <UploadButton
                                // appearance={{
                                //     container: {
                                //         width: '100%',
                                //         height: '100%',
                                //     },
                                //     button: {
                                //         backgroundColor: '#000',
                                //         color: '#fff',
                                //         width: '100%',
                                //         height: '100%',
                                //     },
                                // }}
                                className='w-full p-2 mb-2 bg-gray-700 rounded'
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    console.log("Files: ", res);
                                    setNewFilament({ ...newFilament, image_url: res[0].url });
                                    showAlert("success", "Upload Completed", "Image uploaded successfully.");
                                }}
                                onUploadError={(error) => {
                                    showAlert("error", "Upload Error", `ERROR! ${error.message}`);
                                }}
                            />
                        )}
                        <label htmlFor="description" className="block mb-1">Internal Link (Optional)</label>
                        <input
                            type="text"
                            name="description"
                            value={newFilament.description}
                            onChange={handleInputChange}
                            placeholder="https://amazon.com/thisrandomfilament"
                            className="w-full p-2 mb-2 bg-gray-700 rounded"
                        />
                        <div className="flex justify-end mt-4">
                            <button className="github-secondary mr-2" onClick={() => { setIsModalOpen(false) }}>Cancel</button>
                            <button className="github-primary" onClick={handleAddFilament}>Add</button>
                            
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}

export default FilamentInventory;