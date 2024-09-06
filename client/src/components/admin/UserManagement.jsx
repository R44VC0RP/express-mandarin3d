import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import { UploadButton } from "../../utils/uploadthing";
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

function UserManagement() {
    const [newUser, setNewUser] = useState({ username: '', fullName: '', password: '', profilePic: '', role: 'user' });
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filterText, setFilterText] = useState('');
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                setUsers(response.data.users);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        try {
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
                toast.success('User deleted successfully');
            } else {
                toast.error(response.data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
                action: 'add',
                username: newUser.username,
                fullName: newUser.fullName,
                password: newUser.password,
                profilePic: newUser.profilePic,
                role: newUser.role
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                toast.success('User added successfully');
                setNewUser({ username: '', fullName: '', password: '', profilePic: '', role: 'user' });
                setIsSheetOpen(false);
                fetchUsers();
            } else {
                toast.error(response.data.message || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error(error.response?.data?.message || 'Failed to add user');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setNewUser({
            username: user.username,
            fullName: user.fullName,
            password: '',
            profilePic: user.profilePicture,
            role: user.role
        });
        setIsSheetOpen(true);
    };

    const handleUpdateUser = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
                action: 'edit',
                userId: editingUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                password: newUser.password,
                profilePic: newUser.profilePic,
                role: newUser.role
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                toast.success('User updated successfully');
                setNewUser({ username: '', fullName: '', password: '', profilePic: '', role: 'user' });
                setIsSheetOpen(false);
                setEditingUser(null);
                fetchUsers();
            } else {
                toast.error(response.data.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };

    const filteredItems = users.filter(
        item => Object.values(item).some(
            val => val && val.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const subHeaderComponent = (
        <div className="flex items-center mb-4">
            <Input
                type="text"
                placeholder="Search users..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="max-w-sm"
                autoComplete="off"
            />
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <button className="github-primary" onClick={() => {
                            setEditingUser(null);
                            setNewUser({ username: '', fullName: '', password: '', profilePic: '', role: 'user' });
                        }}>
                            <FaPlus className="mr-2 inline" />
                            Add User
                        </button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>{editingUser ? 'Edit User' : 'Add New User'}</SheetTitle>
                            <SheetDescription>Enter the details for the user.</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <Input
                                name="username"
                                value={newUser.username}
                                onChange={handleInputChange}
                                placeholder="Username"
                                autoComplete="off"
                            />
                            <Input
                                name="fullName"
                                value={newUser.fullName}
                                onChange={handleInputChange}
                                placeholder="Full Name"
                                autoComplete="off"
                            />
                            <Input
                                type="password"
                                name="password"
                                value={newUser.password}
                                onChange={handleInputChange}
                                placeholder={editingUser ? "Leave blank to keep current password" : "Password"}
                                autoComplete="off"
                            />
                            <select
                                name="role"
                                value={newUser.role}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 bg-gray-700 rounded"
                                autoComplete="off"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
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
                                        toast.success("Image uploaded successfully.");
                                    }}
                                    onUploadError={(error) => {
                                        toast.error(`Upload Error: ${error.message}`);
                                    }}
                                />
                            )}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="github-primary" onClick={editingUser ? handleUpdateUser : handleAddUser}>
                                {editingUser ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold mb-4">Loading Users</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D939B]"></div>
                </div>
            ) : (
                <>
                    {subHeaderComponent}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Profile Picture</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <img src={user.profilePicture} alt={user.username} className="w-16 h-16 object-cover rounded-full" />
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="github-secondary text-blue-500 hover:text-blue-700 mr-2"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="github-secondary text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                            {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(i + 1)}
                                        isActive={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(users.length / itemsPerPage)))}
                                    className={currentPage === Math.ceil(users.length / itemsPerPage) ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}
        </div>
    );
}

export default UserManagement;