import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  

import axios from 'axios';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function ShippingManagement() {
    const [newShipping, setNewShipping] = useState({ name: '', price: '', delivery_estimate: '', notes: '' });
    const [shippingOptions, setShippingOptions] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [addons, setAddons] = useState([]);
    const [newAddon, setNewAddon] = useState({ addon_name: '', addon_description: '', addon_price: 0 });
    const [selectedAddon, setSelectedAddon] = useState(null);

    useEffect(() => {
        fetchShippingOptions();
        fetchAddons();
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
                toast.error('Failed to fetch shipping options');
            }
        } catch (error) {
            console.error('Error fetching shipping options:', error);
            toast.error('Failed to fetch shipping options');
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
                toast.success('Shipping option deleted successfully');
            } else {
                toast.error('Failed to delete shipping option');
            }
        } catch (error) {
            console.error('Error deleting shipping option:', error);
            toast.error('Failed to delete shipping option');
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
                toast.success('Shipping option added successfully');
                setNewShipping({ name: '', price: '', delivery_estimate: '', notes: '' });
                fetchShippingOptions();
            } else {
                toast.error('Failed to add shipping option');
            }
        } catch (error) {
            console.error('Error adding shipping option:', error);
            toast.error('Failed to add shipping option');
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const subHeaderComponent = (
        <div className="flex items-center mb-4">
            <FaSearch className="text-gray-400 mr-2" />
            <Input
                type="text"
                placeholder="Search..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="max-w-sm"
            />
        </div>
    );

    const fetchAddons = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/addon`, {
                action: 'list'
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                setAddons(response.data.result);
            } else {
                toast.error('Failed to fetch addons');
            }
        } catch (error) {
            console.error('Error fetching addons:', error);
            toast.error('Failed to fetch addons');
        }
    };

    const handleAddAddon = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/addon`, {
                action: 'create',
                addon_name: newAddon.addon_name,
                addon_description: newAddon.addon_description,
                addon_price: parseFloat(newAddon.addon_price).toFixed(2)
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                toast.success('Addon added successfully');
                setNewAddon({ addon_name: '', addon_description: '', addon_price: 0 });
                fetchAddons();
            } else {
                toast.error('Failed to add addon');
            }
        } catch (error) {
            console.error('Error adding addon:', error);
            toast.error('Failed to add addon');
        }
    };

    const handleUpdateAddon = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/addon`, {
                action: 'update',
                addon_id: selectedAddon.addon_id,
                addon_name: selectedAddon.addon_name,
                addon_description: selectedAddon.addon_description,
                addon_price: parseFloat(selectedAddon.addon_price)
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                toast.success('Addon updated successfully');
                setSelectedAddon(null);
                fetchAddons();
            } else {
                toast.error('Failed to update addon');
            }
        } catch (error) {
            console.error('Error updating addon:', error);
            toast.error('Failed to update addon');
        }
    };

    const handleDeleteAddon = async (addon_id) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/addon`, {
                action: 'delete',
                addon_id
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                toast.success('Addon deleted successfully');
                fetchAddons();
            } else {
                toast.error('Failed to delete addon');
            }
        } catch (error) {
            console.error('Error deleting addon:', error);
            toast.error('Failed to delete addon');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Shipping Management</h2>
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="github-primary">
                            <FaPlus className="mr-2 inline" />
                            Add Shipping Option
                        </button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add New Shipping Option</SheetTitle>
                            <SheetDescription>Enter the details for the new shipping option.</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium leading-none">Name</label>
                                <Input
                                    id="name"
                                    value={newShipping.name}
                                    onChange={e => setNewShipping({ ...newShipping, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="price" className="text-sm font-medium leading-none">Price</label>
                                <Input
                                    id="price"
                                    value={newShipping.price}
                                    onChange={e => setNewShipping({ ...newShipping, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="delivery_estimate" className="text-sm font-medium leading-none">Delivery Estimate</label>
                                <Input
                                    id="delivery_estimate"
                                    value={newShipping.delivery_estimate}
                                    onChange={e => setNewShipping({ ...newShipping, delivery_estimate: e.target.value })}
                                    placeholder="Min-Max business days"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="notes" className="text-sm font-medium leading-none">Notes</label>
                                <Input
                                    id="notes"
                                    value={newShipping.notes}
                                    onChange={e => setNewShipping({ ...newShipping, notes: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="github-primary" onClick={handleAddShipping}>Add Shipping Option</button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold mb-4">Loading Shipping Options</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#466F80]"></div>
                </div>
            ) : (
                <>
                    {subHeaderComponent}
                    <Table>
                        <TableCaption>List of Shipping Options</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Delivery Estimate</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="font-medium">{row.display_name}</TableCell>
                                    <TableCell>${(row.fixed_amount.amount).toFixed(2)}</TableCell>
                                    <TableCell>
                                        {`${row.delivery_estimate.minimum.value}-${row.delivery_estimate.maximum.value} ${row.delivery_estimate.minimum.unit}${row.delivery_estimate.maximum.value > 1 ? 's' : ''}`}
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => handleDelete(row.id)}
                                            className="github-secondary text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash className="mr-2 inline" />
                                            Delete
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
                                    onClick={() => paginate(currentPage - 1)}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                            {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink 
                                        onClick={() => paginate(i + 1)}
                                        isActive={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext 
                                    onClick={() => paginate(currentPage + 1)}
                                    className={currentPage === Math.ceil(filteredItems.length / itemsPerPage) ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}

            <div className="flex justify-between items-center mt-8 mb-6">
                <h2 className="text-2xl font-bold">Checkout Addons</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="github-primary">
                            <FaPlus className="mr-2 inline" />
                            Add Addon
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Addon</DialogTitle>
                            <DialogDescription>Enter the details for the new addon.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="addon-name" className="text-sm font-medium leading-none">Name</label>
                                <Input
                                    id="addon-name"
                                    value={newAddon.addon_name}
                                    onChange={e => setNewAddon({ ...newAddon, addon_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="addon-description" className="text-sm font-medium leading-none">Description</label>
                                <Textarea
                                    id="addon-description"
                                    value={newAddon.addon_description}
                                    onChange={e => setNewAddon({ ...newAddon, addon_description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="addon-price" className="text-sm font-medium leading-none">Price (in dollars)</label>
                                <div className="flex items-center">
                                    <span className="mr-1">$</span>
                                    <Input
                                        id="addon-price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newAddon.addon_price}
                                        onChange={e => setNewAddon({ ...newAddon, addon_price: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddAddon} className="github-primary">Add Addon</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableCaption>List of Checkout Addons</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {addons.map((addon) => (
                        <TableRow key={addon.addon_id}>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="link" onClick={() => setSelectedAddon(addon)}>{addon.addon_name}</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Addon</DialogTitle>
                                            <DialogDescription>Update the details for this addon.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <label htmlFor="edit-addon-name" className="text-sm font-medium leading-none">Name</label>
                                                <Input
                                                    id="edit-addon-name"
                                                    value={selectedAddon?.addon_name || ''}
                                                    onChange={e => setSelectedAddon({ ...selectedAddon, addon_name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="edit-addon-description" className="text-sm font-medium leading-none">Description</label>
                                                <Textarea
                                                    id="edit-addon-description"
                                                    value={selectedAddon?.addon_description || ''}
                                                    onChange={e => setSelectedAddon({ ...selectedAddon, addon_description: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="edit-addon-price" className="text-sm font-medium leading-none">Price</label>
                                                <Input
                                                    id="edit-addon-price"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={selectedAddon?.addon_price || ''}
                                                    onChange={e => setSelectedAddon({ ...selectedAddon, addon_price: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleUpdateAddon} className="github-primary">Update Addon</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            <TableCell>{addon.addon_description}</TableCell>
                            <TableCell>${(addon.addon_price).toFixed(2)}</TableCell>
                            <TableCell>
                                <button
                                    onClick={() => handleDeleteAddon(addon.addon_id)}
                                    className="github-secondary text-red-500 hover:text-red-700"
                                >
                                    <FaTrash className="mr-2 inline" />
                                    Delete
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default ShippingManagement;