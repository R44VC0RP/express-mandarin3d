import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import { UploadButton } from "../utils/uploadthing";
import { useAlerts } from '../context/AlertContext';
import axios from 'axios';

function UserManagement() {
    const { addAlert } = useAlerts();

    const showAlert = (type, title, message) => {
        addAlert(type, title, message);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', fullName: '', password: '', profilePic: '' });
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                setUsers(response.data.users);
            } else {
                showAlert('error', 'Error', 'Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            showAlert('error', 'Error', 'Failed to fetch users');
        }
    };

    const handleDelete = async (userId) => {
        try {
            console.log("Deleting user: ", userId);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
                action: 'delete',
                userId: userId,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                setUsers(users.filter(u => u._id !== userId));
                showAlert('success', 'Success', 'User deleted successfully');
            } else {
                showAlert('error', 'Error', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showAlert('error', 'Error', error.response.data.message);
        }
    };

    const columns = [
        { 
            name: 'Profile Picture', 
            selector: row => <img src={row.profilePicture} alt={row.username} className="w-16 h-16 object-cover rounded-full" />
        },
        { name: 'Username', selector: row => row.username, sortable: true },
        { name: 'Full Name', selector: row => row.fullName, sortable: true },
        { name: 'Role', selector: row => row.role, sortable: true },
        {
            name: 'Actions',
            cell: (row) => (
                <div>
                    <button
                        onClick={() => handleEdit(row)}
                        className="github-secondary text-blue-500 hover:text-blue-700 mr-2"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="github-secondary text-red-500 hover:text-red-700"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    const handleInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
                action: 'add',
                username: newUser.username,
                name: newUser.fullName,
                password: newUser.password,
                profilePic: newUser.profilePic
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                showAlert('success', 'Success', 'User added successfully');
                setNewUser({ username: '', fullName: '', password: '', profilePic: '' });
                setIsModalOpen(false);
                fetchUsers();
            } else {
                showAlert('error', 'Error', 'Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            showAlert('error', 'Error', 'Failed to add user');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setNewUser({
            username: user.username,
            fullName: user.fullName,
            password: '',
            profilePic: user.profilePicture
        });
        setIsModalOpen(true);
    };

    const handleUpdateUser = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
                action: 'edit',
                userId: editingUser._id,
                username: newUser.username,
                name: newUser.fullName,
                password: newUser.password,
                profilePic: newUser.profilePic
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                showAlert('success', 'Success', 'User updated successfully');
                setNewUser({ username: '', fullName: '', password: '', profilePic: '' });
                setIsModalOpen(false);
                setEditingUser(null);
                fetchUsers();
            } else {
                showAlert('error', 'Error', 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            showAlert('error', 'Error', 'Failed to update user');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <button className="github-primary" onClick={() => setIsModalOpen(true)}>
                    <FaPlus className="mr-2 inline" />
                    Add User
                </button>
            </div>

            <DataTable
                columns={columns}
                data={users}
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
                        <h3 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                        <label htmlFor="username">Username <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="username"
                            value={newUser.username}
                            onChange={handleInputChange}
                            placeholder="johndoe"
                            className="w-full p-2 mb-2 bg-gray-700 rounded"
                        />
                        <label htmlFor="fullName">Full Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="fullName"
                            value={newUser.fullName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full p-2 mb-2 bg-gray-700 rounded"
                        />
                        <label htmlFor="password">Password {!editingUser && <span className="text-red-500">*</span>}</label>
                        <input
                            type="password"
                            name="password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            placeholder={editingUser ? "Leave blank to keep current password" : "Password"}
                            className="w-full p-2 mb-2 bg-gray-700 rounded"
                            autoComplete="off"
                        />
                        <label htmlFor="profilePic" className="block mb-1">Profile Picture</label>
                        {newUser.profilePic ? (
                            <div className="relative w-full p-2 mb-2 bg-gray-700 rounded flex justify-center items-center">
                                <img src={newUser.profilePic} alt="Profile" className="w-1/2 h-auto rounded" />
                                <button
                                    className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                                    onClick={() => setNewUser({ ...newUser, profilePic: '' })}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ) : (
                            <UploadButton
                                className='w-full p-2 mb-2 bg-gray-700 rounded'
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    console.log("Files: ", res);
                                    setNewUser({ ...newUser, profilePic: res[0].url });
                                    showAlert("success", "Upload Completed", "Image uploaded successfully.");
                                }}
                                onUploadError={(error) => {
                                    showAlert("error", "Upload Error", `ERROR! ${error.message}`);
                                }}
                            />
                        )}
                        <div className="flex justify-end mt-4">
                            <button className="github-secondary mr-2" onClick={() => { setIsModalOpen(false); setEditingUser(null); }}>Cancel</button>
                            <button className="github-primary" onClick={editingUser ? handleUpdateUser : handleAddUser}>
                                {editingUser ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;