import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash, FaEdit, FaUser, FaSearch, FaShieldAlt, FaUserCog } from 'react-icons/fa';
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
    SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0.5 flex items-center pl-3 pointer-events-none">
                        <FaSearch className="text-gray-400 text-sm" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search users..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="pl-10 bg-[#1e2229] border-neutral-700 text-white w-full sm:w-60 focus:border-cyan-500"
                        autoComplete="off"
                    />
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button 
                            className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
                            onClick={() => {
                                setEditingUser(null);
                                setNewUser({ username: '', fullName: '', password: '', profilePic: '', role: 'user' });
                            }}
                        >
                            <FaPlus className="mr-2" />
                            Add User
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-[#1a1b1e] border-neutral-800 text-white">
                        <SheetHeader>
                            <SheetTitle className="text-cyan-400">{editingUser ? 'Edit User' : 'Add New User'}</SheetTitle>
                            <SheetDescription className="text-gray-400">
                                {editingUser ? 'Update user information.' : 'Create a new user account.'}
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-5 py-6">
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={newUser.username}
                                    onChange={handleInputChange}
                                    placeholder="Username"
                                    autoComplete="off"
                                    className="bg-[#2A2A2A] border-neutral-700 text-white focus:border-cyan-500"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-sm font-medium text-gray-300">Full Name</label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={newUser.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    autoComplete="off"
                                    className="bg-[#2A2A2A] border-neutral-700 text-white focus:border-cyan-500"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    placeholder={editingUser ? "Leave blank to keep current password" : "Password"}
                                    autoComplete="off"
                                    className="bg-[#2A2A2A] border-neutral-700 text-white focus:border-cyan-500"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="role" className="text-sm font-medium text-gray-300">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={newUser.role}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 bg-[#2A2A2A] border border-neutral-700 rounded-md text-white focus:border-cyan-500 focus:outline-none"
                                    autoComplete="off"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="profilePic" className="text-sm font-medium text-gray-300">Profile Picture URL</label>
                                <Input
                                    id="profilePic"
                                    name="profilePic"
                                    value={newUser.profilePic}
                                    onChange={handleInputChange}
                                    placeholder="Profile Picture URL"
                                    autoComplete="off"
                                    className="bg-[#2A2A2A] border-neutral-700 text-white focus:border-cyan-500"
                                />
                            </div>
                        </div>
                        <SheetFooter>
                            <Button 
                                type="button" 
                                onClick={editingUser ? handleUpdateUser : handleAddUser}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                            >
                                {editingUser ? 'Update User' : 'Add User'}
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            ) : (
                <>
                    <div className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-[#1e2229] border-b border-neutral-800">
                                <TableRow>
                                    <TableHead className="text-white font-medium">User</TableHead>
                                    <TableHead className="text-white font-medium">Full Name</TableHead>
                                    <TableHead className="text-white font-medium">Role</TableHead>
                                    <TableHead className="text-white font-medium text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredItems.map((user) => (
                                        <TableRow key={user._id} className="border-b border-neutral-800/50 hover:bg-[#2A2A2A]/30">
                                            <TableCell className="font-medium flex items-center gap-3">
                                                <div className="relative">
                                                    {user.profilePicture ? (
                                                        <img 
                                                            src={user.profilePicture} 
                                                            alt={user.username} 
                                                            className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-cyan-800/30 flex items-center justify-center border border-cyan-700/20">
                                                            <FaUser className="text-cyan-500/70 text-sm" />
                                                        </div>
                                                    )}
                                                </div>
                                                {user.username}
                                            </TableCell>
                                            <TableCell className="text-gray-300">{user.fullName}</TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === 'admin' ? 'default' : 'outline'} className={user.role === 'admin' ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border-cyan-500/30' : 'border-neutral-600 text-neutral-400'}>
                                                    {user.role === 'admin' ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <FaShieldAlt className="text-xs" />
                                                            Admin
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5">
                                                            <FaUserCog className="text-xs" />
                                                            User
                                                        </div>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(user)}
                                                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 mr-1"
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(user._id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </>
            )}
        </div>
    );
}

export default UserManagement;