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

function FilamentInventory() {
    const [newFilament, setNewFilament] = useState({ brand: '', name: '', color: '', weight: '', price: '', image_url: '', description: '' });
    const [filaments, setFilaments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        fetchFilaments();
    }, []);

    const fetchFilaments = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/filament`, 
                { action: 'list' },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.status === 'success') {
                setFilaments(response.data.result);
            } else {
                toast.error('Failed to fetch filaments');
            }
        } catch (error) {
            console.error('Error fetching filaments:', error);
            toast.error('Failed to fetch filaments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (filament_id) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/filament`, {
                action: 'delete',
                filament_id: filament_id,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                setFilaments(filaments.filter(f => f.filament_id !== filament_id));
                toast.success('Filament deleted successfully');
            } else {
                toast.error('Failed to delete filament');
            }
        } catch (error) {
            console.error('Error deleting filament:', error);
            toast.error('Failed to delete filament');
        }
    };

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
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                toast.success('Filament added successfully');
                setNewFilament({ brand: '', name: '', color: '', weight: '', price: '', image_url: '', description: '' });
                fetchFilaments();
            } else {
                toast.error('Failed to add filament');
            }
        } catch (error) {
            console.error('Error adding filament:', error);
            toast.error('Failed to add filament');
        }
    };

    const filteredItems = filaments.filter(
        item => Object.values(item).some(
            val => val && val.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const subHeaderComponent = (
        <div className="flex items-center mb-4">
            <Input
                type="text"
                placeholder="Search filaments..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="max-w-sm"
            />
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Filaments</h2>
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="github-primary">
                            <FaPlus className="mr-2 inline" />
                            Add Filament
                        </button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add New Filament</SheetTitle>
                            <SheetDescription>Enter the details for the new filament.</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <Input
                                name="brand"
                                value={newFilament.brand}
                                onChange={handleInputChange}
                                placeholder="Brand"
                            />
                            <Input
                                name="name"
                                value={newFilament.name}
                                onChange={handleInputChange}
                                placeholder="Name"
                            />
                            <div className="flex items-center">
                                <Input
                                    name="color"
                                    value={newFilament.color}
                                    onChange={handleInputChange}
                                    placeholder="Color"
                                    className="flex-grow mr-2"
                                />
                                <input
                                    type="color"
                                    name="colorPicker"
                                    value={newFilament.color}
                                    onChange={(e) => setNewFilament({ ...newFilament, color: e.target.value })}
                                    className="w-10 h-10 p-1 rounded cursor-pointer"
                                />
                            </div>
                            <Input
                                name="weight"
                                value={newFilament.weight}
                                onChange={handleInputChange}
                                placeholder="Weight (in grams)"
                            />
                            <Input
                                name="price"
                                value={newFilament.price}
                                onChange={handleInputChange}
                                placeholder="Price"
                            />
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
                                    className='w-full p-2 mb-2 bg-gray-700 rounded'
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        console.log("Files: ", res);
                                        setNewFilament({ ...newFilament, image_url: res[0].url });
                                        toast.success("Image uploaded successfully.");
                                    }}
                                    onUploadError={(error) => {
                                        toast.error(`Upload Error: ${error.message}`);
                                    }}
                                />
                            )}
                            <Input
                                name="description"
                                value={newFilament.description}
                                onChange={handleInputChange}
                                placeholder="Internal Link (Optional)"
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="github-primary" onClick={handleAddFilament}>Add Filament</button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold mb-4">Loading Filaments</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#466F80]"></div>
                </div>
            ) : (
                <>
                    {subHeaderComponent}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Weight</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((filament) => (
                                <TableRow key={filament.filament_id}>
                                    <TableCell>
                                        <img src={filament.filament_image_url} alt={filament.filament_name} className="w-16 h-16 object-cover rounded-md" />
                                    </TableCell>
                                    <TableCell>{filament.filament_brand}</TableCell>
                                    <TableCell>{filament.filament_name}</TableCell>
                                    <TableCell>{filament.filament_color}</TableCell>
                                    <TableCell>{filament.filament_mass_in_grams}g</TableCell>
                                    <TableCell>${filament.filament_unit_price.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => handleDelete(filament.filament_id)}
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
                            {Array.from({ length: Math.ceil(filaments.length / itemsPerPage) }, (_, i) => (
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
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filaments.length / itemsPerPage)))}
                                    className={currentPage === Math.ceil(filaments.length / itemsPerPage) ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}
        </div>
    );
}

export default FilamentInventory;