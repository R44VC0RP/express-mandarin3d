import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaPlus, FaTimes, FaSpinner, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/Cart';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function CartManagement() {
    const { cart } = useCart();
    const [carts, setCarts] = useState([]);
    const [selectedCart, setSelectedCart] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [cartDetailsOpen, setCartDetailsOpen] = useState(false);
    const [fileDetailsOpen, setFileDetailsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newFile, setNewFile] = useState({ fileid: '', quantity: 1, quality: '0.25mm', color: '' });
    const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false);

    useEffect(() => {
        fetchCarts();
    }, []);

    const fetchCarts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/mgmt/cart`,
                { action: 'list' },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.status === 'success') {
                setCarts(response.data.result);
            } else {
                toast.error('Failed to fetch carts');
            }
        } catch (error) {
            console.error('Error fetching carts:', error);
            toast.error('Failed to fetch carts');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCartClick = async (cart) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/mgmt/cart`,
                { action: 'get', cart_id: cart.cart_id },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.status === 'success') {
                setSelectedCart(response.data.result);
                setCartDetailsOpen(true);
            } else {
                toast.error('Failed to fetch cart details');
            }
        } catch (error) {
            console.error('Error fetching cart details:', error);
            toast.error('Failed to fetch cart details');
        }
    };

    const handleAddFile = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/mgmt/cart`,
                {
                    action: 'addFile',
                    cart_id: selectedCart.cart_id,
                    ...newFile
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.status === 'success') {
                toast.success('File added to cart successfully');
                setSelectedCart(response.data.result);
                setNewFile({ fileid: '', quantity: 1, quality: 'standard', color: '' });
                setIsAddFileDialogOpen(false);
            } else {
                toast.error('Failed to add file to cart');
            }
        } catch (error) {
            console.error('Error adding file to cart:', error);
            toast.error('Failed to add file to cart');
        }
    };

    const handleRemoveFile = async (fileid) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/mgmt/cart`,
                {
                    action: 'removeFile',
                    cart_id: selectedCart.cart_id,
                    fileid
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.status === 'success') {
                toast.success('File removed from cart successfully');
                setSelectedCart(response.data.result);
            } else {
                toast.error('Failed to remove file from cart');
            }
        } catch (error) {
            console.error('Error removing file from cart:', error);
            toast.error('Failed to remove file from cart');
        }
    };

    const filteredItems = carts.filter(
        item => Object.values(item).some(
            val => val && val.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const sortCartsByDate = (carts) => {
        return [...carts].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    };

    const subHeaderComponent = (
        <div className="flex items-center mb-4">
            <FaSearch className="text-gray-400 mr-2" />
            <Input
                type="text"
                placeholder="Search carts..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="max-w-sm"
            />
        </div>
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Cart Management</h2>
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold mb-4">Loading Carts</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D939B]"></div>
                </div>
            ) : (
                <>
                    {subHeaderComponent}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cart ID</TableHead>
                                <TableHead>User ID or Email</TableHead>
                                <TableHead>Date Created</TableHead>
                                <TableHead>Total Files</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortCartsByDate(filteredItems).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((cartItems) => (
                                <TableRow 
                                    key={cartItems.cart_id} 
                                    onClick={() => handleCartClick(cartItems)} 
                                    className={`cursor-pointer ${cartItems.cart_id === cart?.cart_id ? 'bg-blue-900' : ''}`}
                                >
                                    <TableCell>{cartItems.cart_id}</TableCell>
                                    <TableCell>{cartItems.user_id}</TableCell>
                                    <TableCell>
                                        {(() => {
                                            console.log('dateCreated:', cartItems.dateCreated);
                                            return cartItems.dateCreated ? new Date(cartItems.dateCreated).toLocaleString() : 'Invalid Date';
                                        })()}
                                    </TableCell>
                                    <TableCell>{cartItems.files.length}</TableCell>
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
                            {Array.from({ length: Math.ceil(carts.length / itemsPerPage) }, (_, i) => (
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
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(carts.length / itemsPerPage)))}
                                    className={currentPage === Math.ceil(carts.length / itemsPerPage) ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}

            <Sheet open={cartDetailsOpen} onOpenChange={setCartDetailsOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Cart Details</SheetTitle>
                        <SheetDescription>View and edit cart contents.</SheetDescription>
                    </SheetHeader>
                    {selectedCart && (
                        <div className="grid gap-4 py-4">
                            <p><strong>Cart ID:</strong> {selectedCart.cart_id}</p>
                            <p><strong>User ID:</strong> {selectedCart.user_id}</p>
                            <p><strong>Date Created:</strong> {new Date(selectedCart.dateCreated).toLocaleString()}</p>
                            <hr />
                            <h3 className="text-lg font-semibold">Files in Cart</h3>
                            {selectedCart.files.map((file) => (
                                <div key={file.fileid} className="flex justify-between items-center">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="text-blue-500 hover:underline">{file.fileid}</button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>File Details</DialogTitle>
                                                <DialogDescription>
                                                    Details for file {file.filename}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <p><strong>File ID:</strong> {file.fileid}</p>
                                                <p><strong>Quantity:</strong> {file.quantity}</p>
                                                <p><strong>Quality:</strong> {file.quality}</p>
                                                <p><strong>Color:</strong> {file.color}</p>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <button onClick={() => handleRemoveFile(file.fileid)} className="text-red-500 hover:text-red-700">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <hr />
                            <Dialog open={isAddFileDialogOpen} onOpenChange={setIsAddFileDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="github-primary">Add File to Cart</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add File to Cart</DialogTitle>
                                        <DialogDescription>
                                            Enter the details of the file you want to add to the cart.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <Input
                                            placeholder="File ID"
                                            value={newFile.fileid}
                                            onChange={(e) => setNewFile({...newFile, fileid: e.target.value})}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Quantity"
                                            value={newFile.quantity}
                                            onChange={(e) => setNewFile({...newFile, quantity: parseInt(e.target.value)})}
                                        />
                                        <Input
                                            placeholder="Quality"
                                            value={newFile.quality}
                                            onChange={(e) => setNewFile({...newFile, quality: e.target.value})}
                                        />
                                        <Input
                                            placeholder="Color"
                                            value={newFile.color}
                                            onChange={(e) => setNewFile({...newFile, color: e.target.value})}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddFile} className="github-primary">
                                            Add File
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default CartManagement;