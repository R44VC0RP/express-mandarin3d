import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash, FaEdit, FaSpinner, FaCheck, FaSync } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import { UploadButton } from "../../utils/uploadthing";
import { useAlerts } from '../../context/AlertContext';
import axios from 'axios';

function FileManagement() {
    const { addAlert } = useAlerts();

    const showAlert = (type, title, message) => {
        addAlert(type, title, message);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFile, setNewFile] = useState({ filename: '', priceOverride: '' });
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); // State to manage selected file

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/file`, 
                { action: 'list' },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.status === 'success') {
                setFiles(response.data.result);
            } else {
                showAlert('error', 'Error', 'Failed to fetch files');
            }
        } catch (error) {
            console.error('Error fetching files:', error);
            showAlert('error', 'Error', 'Failed to fetch files');
        }
    };

    const handleDelete = async (fileid) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/file`, {
                data: { fileid },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                setFiles(files.filter(f => f.fileid !== fileid));
                showAlert('success', 'Success', 'File deleted successfully');
            } else {
                showAlert('error', 'Error', 'Failed to delete file');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            showAlert('error', 'Error', 'Failed to delete file');
        }
    };

    const handleSlice = async (fileid) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/file`, {
                action: 'slice',
                fileid
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                showAlert('success', 'Success', 'File sliced successfully');
                fetchFiles();
            } else {
                showAlert('error', 'Error', 'Failed to slice file');
            }
        } catch (error) {
            console.error('Error slicing file:', error);
            showAlert('error', 'Error', 'Failed to slice file');
        }
    };
    

    const handleRowClick = async (row) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/file`, {
                action: 'get',
                fileid: row.fileid
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                setSelectedFile(response.data.result);
                setIsModalOpen(true);
            } else {
                showAlert('error', 'Error', 'Failed to fetch file details');
            }
        } catch (error) {
            console.error('Error fetching file details:', error);
            showAlert('error', 'Error', 'Failed to fetch file details');
        }
    };

    const columns = [
        { name: 'File Name', selector: row => row.filename, sortable: true, cell: (row) => (
            <button
                onClick={() => handleRowClick(row)}
                className="text-blue-500 hover:text-blue-700"
            >
                {row.filename}
            </button>
        )},
        { 
            name: 'File Status', 
            selector: row => {
                if (row.file_status === 'unsliced') {
                    return <div><FaSpinner className="animate-spin inline" /> Processing</div>;
                } else if (row.file_status === 'success') {
                    return <div><FaCheck className="text-green-500 inline" /> Sliced</div>;
                } else if (row.file_status === 'error') {
                    return <div><FaTimes className="text-red-500 inline" /> Error</div>;
                }
                return row.file_status;
            }, 
            sortable: true 
        },
        { name: 'File ID', selector: row => row.fileid, sortable: true },
        { name: 'Price Override', selector: row => row.price_override ? `$${(row.price_override / 100).toFixed(2)}` : 'N/A', sortable: true },
        { name: 'Date Created', selector: row => new Date(row.dateCreated).toLocaleString(), sortable: true },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex justify-center">
                    <button onClick={() => handleDelete(row.fileid)} className="github-secondary text-red-500 hover:text-red-700 mr-2">
                        <FaTrash />
                    </button>
                    <button 
                        onClick={() => handleSlice(row.fileid)} 
                        className="github-secondary text-red-500 hover:text-red-700" 
                        title="Try to reslice file"
                    >
                        <FaSync className="text-red-500 hover:text-red-700" />
                    </button>
                </div>
            ),
        },
    ];

    const handleInputChange = (e) => {
        setNewFile({ ...newFile, [e.target.name]: e.target.value });
    };

    const handleAddFile = async () => {
        try {
            const priceInCents = newFile.priceOverride ? Math.round(parseFloat(newFile.priceOverride) * 100) : null;
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/file`, {
                action: 'create',
                filename: newFile.filename,
                utfile_id: newFile.utfile_id,
                utfile_url: newFile.utfile_url,
                price_override: priceInCents
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                showAlert('success', 'Success', 'File added successfully');
                setNewFile({ filename: '', priceOverride: '' });
                setIsModalOpen(false);
                fetchFiles();
            } else {
                showAlert('error', 'Error', 'Failed to add file');
            }
        } catch (error) {
            console.error('Error adding file:', error);
            showAlert('error', 'Error', 'Failed to add file');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">File Management</h2>
                <button className="github-primary" onClick={() => setIsModalOpen(true)}>
                    <FaPlus className="mr-2 inline" />
                    Add File
                </button>
            </div>

            <DataTable
                columns={columns}
                data={files}
                pagination
                highlightOnHover
                responsive
                onRowClicked={handleRowClick} // Add this line to handle row clicks
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
                }}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="card-special bg-gray-800 p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4">{selectedFile ? 'File Details' : 'Add New File'}</h3>
                        {selectedFile ? (
                            <div>
                                <p><strong>File ID:</strong> {selectedFile.fileid}</p>
                                <p><strong>Filename:</strong> {selectedFile.filename}</p>
                                <p><strong>File Status:</strong> {selectedFile.file_status}</p>
                                <p><strong>Price Override:</strong> {selectedFile.price_override ? `$${(selectedFile.price_override / 100).toFixed(2)}` : 'N/A'}</p>
                                <p><strong>Date Created:</strong> {new Date(selectedFile.dateCreated).toLocaleString()}</p>
                                <p><strong>Dimensions:</strong> {selectedFile.dimensions ? `${selectedFile.dimensions.x} x ${selectedFile.dimensions.y} x ${selectedFile.dimensions.z}` : 'N/A'}</p>
                                <p><strong>Mass in Grams:</strong> {selectedFile.mass_in_grams || 'N/A'}</p>
                                <p><strong>Stripe Product ID:</strong> {selectedFile.stripe_product_id}</p>
                                <p><strong>UploadThing File ID:</strong><code>{selectedFile.utfile_id}</code></p>
                                <p><strong>UploadThing File URL:</strong> <a href={selectedFile.utfile_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View File</a></p>
                                <div className="flex justify-end mt-4">
                                    <button className="github-secondary mr-2" onClick={() => { setIsModalOpen(false); setSelectedFile(null); }}>Close</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="filename">File Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="filename"
                                    value={newFile.filename}
                                    onChange={handleInputChange}
                                    placeholder="example.stl"
                                    className="w-full p-2 mb-2 bg-gray-700 rounded"
                                />
                                <label htmlFor="priceOverride">Price Override (Optional)</label>
                                <div className="flex items-center mb-2">
                                    <span className="text-white mr-2">$</span>
                                    <input
                                        type="number"
                                        name="priceOverride"
                                        value={newFile.priceOverride}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="flex-grow p-2 bg-gray-700 rounded"
                                    />
                                </div>
                                <label htmlFor="file" className="block mb-1">Upload File</label>
                                <UploadButton
                                    className='w-full p-2 mb-2 bg-gray-700 rounded'
                                    endpoint="modelUploader"
                                    onClientUploadComplete={(res) => {
                                        console.log("Files: ", res);
                                        setNewFile({ ...newFile, utfile_id: res[0].key, utfile_url: res[0].url });
                                        showAlert("success", "Upload Completed", "File uploaded successfully.");
                                    }}
                                    onUploadError={(error) => {
                                        showAlert("error", "Upload Error", `ERROR! ${error.message}`);
                                    }}
                                />
                                <div className="flex justify-end mt-4">
                                    <button className="github-secondary mr-2" onClick={() => { setIsModalOpen(false) }}>Cancel</button>
                                    <button className="github-primary" onClick={handleAddFile}>Add</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FileManagement;