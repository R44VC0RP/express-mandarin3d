import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import { Input } from '@/components/ui/input'
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

function ShippingManagement() {
    const [newShipping, setNewShipping] = useState({ name: '', price: '', delivery_estimate: '', notes: '' });
    const [shippingOptions, setShippingOptions] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D939B]"></div>
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
                                    <TableCell>${(row.fixed_amount.amount / 100).toFixed(2)}</TableCell>
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
        </div>
    );
}

export default ShippingManagement;