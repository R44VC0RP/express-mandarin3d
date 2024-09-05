import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash, FaEdit, FaSpinner, FaCheck, FaSync, FaCalendarAlt, FaSearch } from 'react-icons/fa';
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
    const [selectedFile, setSelectedFile] = useState(null);
    const [priceOverride, setPriceOverride] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const handleUpdatePrice = async (fileid, priceOverride) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/file`, {
                action: 'update',
                fileid,
                price_override: priceOverride
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                showAlert('success', 'Success', 'Price updated successfully');
                setSelectedFile({ ...selectedFile, price_override: priceOverride });
                setPriceOverride(null);
                fetchFiles();
            } else {
                showAlert('error', 'Error', 'Failed to update price');
            }
        } catch (error) {
            console.error('Error updating price:', error);
            showAlert('error', 'Error', 'Failed to update price');
        }
    };

    useEffect(() => {
        fetchFiles();
        const interval = setInterval(fetchFileStatuses, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchFiles = async () => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFileStatuses = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/file-status`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                setFiles(response.data.files);
            } else {
                showAlert('error', 'Error', 'Failed to fetch file statuses');
            }
        } catch (error) {
            console.error('Error fetching file statuses:', error);
            showAlert('error', 'Error', 'Failed to fetch file statuses');
        }
    };

    const handleProductAdd = async (fileid) => {

    }

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
        {
            name: 'File Name', selector: row => row.filename, sortable: true, cell: (row) => (
                <button
                    onClick={() => handleRowClick(row)}
                    className="text-blue-500 hover:text-blue-700"
                >
                    {row.filename}
                </button>
            )
        },
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
        { name: 'Price Override', selector: row => row.price_override ? `$${(row.price_override).toFixed(2)}` : 'N/A', sortable: true },
        {
            name: 'Date Created',
            selector: row => row.dateCreated,
            sortable: true,
            format: row => new Date(row.dateCreated).toLocaleString(),
            sortFunction: (a, b) => {
                // Custom sort function to compare dates
                return new Date(b.dateCreated) - new Date(a.dateCreated);
            }
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex justify-center">
                    <button onClick={() => handleProductAdd(row)} className="github-secondary text-blue-500 hover:text-blue-700 mr-2">
                        <FaPlus />
                    </button>
                    <button onClick={() => handleDelete(row.fileid)} className="github-secondary text-red-500 hover:text-red-700 mr-2">
                        <FaTrash />
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

    const filteredItems = files.filter(
        item => Object.values(item).some(
            val => val && val.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const subHeaderComponent = (
        <div className="flex items-center mb-4">
            <FaSearch className="text-gray-400 mr-2" />
            <input
                type="text"
                placeholder="Search..."
                className="p-2 bg-gray-700 rounded text-white"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
            />
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">File Management</h2>
                <button className="github-primary" onClick={() => setIsModalOpen(true)}>
                    <FaPlus className="mr-2 inline" />
                    Add File
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold mb-4">Loading Files</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D939B]"></div>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    highlightOnHover
                    responsive
                    onRowClicked={handleRowClick}
                    subHeader
                    subHeaderComponent={subHeaderComponent}
                    defaultSortField="dateCreated"
                    defaultSortAsc={false}
                    sortFunction={(rows, field, direction) => {
                        return rows.sort((a, b) => {
                            const aField = a[field];
                            const bField = b[field];
                            if (field === 'dateCreated') {
                                return direction === 'asc' 
                                    ? new Date(aField) - new Date(bField)
                                    : new Date(bField) - new Date(aField);
                            }
                            return (aField > bField ? 1 : -1) * (direction === 'asc' ? 1 : -1);
                        });
                    }}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
                    <div className="card-special bg-gray-800 p-6 rounded-lg w-96 w-[50vw]">
                        <h3 className="text-xl font-bold mb-4">{selectedFile ? 'File Details' : 'Add New File'}</h3>
                        {selectedFile ? (
                            <div>
                                <p><strong>File ID:</strong> <code>{selectedFile.fileid}</code></p>
                                <p><strong>Filename:</strong> {selectedFile.filename}</p>
                                <p><strong>File Status:</strong>
                                    {selectedFile.file_status === 'success' && (
                                        <span className="bg-green-500 text-white px-2 py-1 rounded-full ml-2">
                                            {selectedFile.file_status}
                                        </span>
                                    )}
                                    {selectedFile.file_status === 'unsliced' && (
                                        <span className="bg-yellow-500 text-black px-2 py-1 rounded-full ml-2">
                                            {selectedFile.file_status}
                                        </span>
                                    )}
                                    {selectedFile.file_status === 'error' && (
                                        <span className="bg-red-500 text-white px-2 py-1 rounded-full ml-2">
                                            {selectedFile.file_status}
                                        </span>
                                    )}
                                    {!['success', 'unsliced', 'error'].includes(selectedFile.file_status) && selectedFile.file_status}
                                </p>
                                <p><strong>Price Override:</strong> {selectedFile.price_override}</p>
                                <div className="flex items-center mt-2 mb-2">
                                    <input 
                                        type="text" 
                                        value={selectedFile.price_override} 
                                        placeholder='Price Override'
                                        onChange={(e) => setSelectedFile({ ...selectedFile, price_override: e.target.value })} 
                                        className="w-[150px] p-2 mr-2 bg-gray-700 rounded"
                                    />
                                    <button 
                                        className="github-secondary mr-2 text-xs h-10" 
                                        onClick={() => { handleUpdatePrice(selectedFile.fileid, null); }}
                                    >
                                        Clear
                                    </button>
                                    <button 
                                        className="github-primary text-xs h-10" 
                                        onClick={() => { handleUpdatePrice(selectedFile.fileid, selectedFile.price_override); }}
                                    >
                                        Update
                                    </button>
                                </div>
                                <p><strong>Date Created:</strong> <FaCalendarAlt className="inline-block mr-1" /> {new Date(selectedFile.dateCreated).toLocaleString()}</p>
                                <p><strong>Dimensions:</strong> {selectedFile.dimensions ? `${selectedFile.dimensions.x.toFixed(2)}X x ${selectedFile.dimensions.y.toFixed(2)}Y x ${selectedFile.dimensions.z.toFixed(2)}Z` : 'N/A'}</p>
                                <p><strong>Mass in Grams:</strong> {selectedFile.mass_in_grams ? `${selectedFile.mass_in_grams.toFixed(2)}` : 'N/A'}</p>
                                <p><strong>Stripe Product ID:</strong> <a href={`https://dashboard.stripe.com/products/${selectedFile.stripe_product_id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{selectedFile.stripe_product_id}</a></p>
                                <p><strong>UploadThing File ID:</strong> <code className="text-xs">{selectedFile.utfile_id}</code></p>
                                <p><strong>UploadThing File URL:</strong> <a href={selectedFile.utfile_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View File</a></p>

                                <div className="flex justify-end mt-4">
                                                <button
                                        onClick={() => handleSlice(selectedFile.fileid)}
                                        className="github-secondary text-red-500 hover:text-red-700 mr-2"
                                        title="Try to reslice file"
                                    >
                                        <div className="flex items-center">
                                            <FaSync className="text-red-500 hover:text-red-700 mr-1" />
                                            <span>Reslice File</span>
                                        </div>
                                    </button>
                                    <button className="github-secondary mr-2" onClick={() => { setIsModalOpen(false); setSelectedFile(null); }}>Close</button>
                                </div>
                            </div>
                        ) : (
                            <div>

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