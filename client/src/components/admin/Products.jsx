import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/product?action=list`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                setProducts(response.data.result);
            } else {
                toast.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/product`, {
                action: 'delete',
                product_id: productId
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                setProducts(products.filter(p => p.product_id !== productId));
                toast.success('Product deleted successfully');
            } else {
                toast.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/product`, {
                action: 'update',
                ...selectedProduct
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                toast.success('Product updated successfully');
                setIsEditDialogOpen(false);
                fetchProducts();
            } else {
                toast.error('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        }
    };

    const filteredItems = products.filter(
        item => Object.values(item).some(
            val => val && val.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const sortProductsByDate = (products) => {
        return [...products].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    };

    const subHeaderComponent = (
        <div className="flex items-center mb-4">
            <FaSearch className="text-gray-400 mr-2" />
            <Input
                type="text"
                placeholder="Search products..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="max-w-sm"
            />
        </div>
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Product Management</h2>
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold mb-4">Loading Products</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D939B]"></div>
                </div>
            ) : (
                <>
                    {subHeaderComponent}
                    <Table>
                        <TableCaption>A list of your products</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>File ID</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>License</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortProductsByDate(filteredItems).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                                <TableRow key={product.product_id}>
                                    <TableCell className="font-medium">{product.product_title}</TableCell>
                                    <TableCell>{product.product_description.substring(0, 50)}...</TableCell>
                                    <TableCell>{product.product_fileid}</TableCell>
                                    <TableCell>{product.product_author}</TableCell>
                                    <TableCell>{product.product_license}</TableCell>
                                    <TableCell>
                                        <button onClick={() => handleEdit(product)} className="github-secondary text-blue-500 hover:text-blue-700 mr-2">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(product.product_id)} className="github-secondary text-red-500 hover:text-red-700">
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
                            {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => (
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
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(products.length / itemsPerPage)))}
                                    className={currentPage === Math.ceil(products.length / itemsPerPage) ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Make changes to your product here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="title" className="text-right">Title</label>
                                <Input id="title" value={selectedProduct.product_title} onChange={(e) => setSelectedProduct({...selectedProduct, product_title: e.target.value})} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="description" className="text-right">Description</label>
                                <Input id="description" value={selectedProduct.product_description} onChange={(e) => setSelectedProduct({...selectedProduct, product_description: e.target.value})} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="author" className="text-right">Author</label>
                                <Input id="author" value={selectedProduct.product_author} onChange={(e) => setSelectedProduct({...selectedProduct, product_author: e.target.value})} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="license" className="text-right">License</label>
                                <Input id="license" value={selectedProduct.product_license} onChange={(e) => setSelectedProduct({...selectedProduct, product_license: e.target.value})} className="col-span-3" />
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end mt-4">
                        <button className="github-primary" onClick={handleUpdate}>Save changes</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ProductManagement;