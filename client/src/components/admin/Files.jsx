import React, { useState, useEffect, useRef, Suspense } from 'react';
import { FaPlus, FaTimes, FaTrash, FaEdit, FaSpinner, FaCheck, FaSync, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { UploadButton } from "../../utils/uploadthing";
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { StlViewer } from "react-stl-viewer";
import { Badge } from "@/components/ui/badge"

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
} from "@/components/ui/dialog";
import ShowcaseProduct from '../ShowcaseProduct';

// Add this function at the top of your component or in a separate utility file
const LazyModelViewer = ({ url, style }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} style={style}>
            {isVisible ? (
                <Suspense fallback={<div>Loading...</div>}>
                    <StlViewer
                        style={style}
                        orbitControls
                        shadows
                        url={url}
                        showAxes={true}
                        modelProps={{ scale: 1.2, color: '#F9FAFB' }}
                    />
                </Suspense>
            ) : (
                <div style={style}>Loading...</div>
            )}
        </div>
    );
};

function FileManagement() {
    const [newFile, setNewFile] = useState({ filename: '', priceOverride: '' });
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [fileDetails, setFileDetails] = useState({
        fileid: 'N/A',
        filename: 'N/A',
        file_status: 'N/A',
        dateCreated: 'N/A',
        price_override: 'N/A',
        dimensions: {
            x: 'N/A',
            y: 'N/A',
            z: 'N/A'
        },
        productName: 'N/A'
    });
    const [fileDetailsOpen, setFileDetailsOpen] = useState(false);
    const [productDetailsOpen, setProductDetailsOpen] = useState(false);
    const [productDetails, setProductDetails] = useState({
        product_id: 'N/A',
        product_title: 'N/A',
        product_description: 'N/A',
        product_features: 'N/A',
        product_image_url: 'N/A',
        product_fileid: 'N/A',
        product_author: 'N/A',
        product_author_url: 'N/A',
        product_license: 'N/A',
        product_filament_id: 'N/A'
    });
    const [newProduct, setNewProduct] = useState({
        product_title: '',
        product_description: '',
        product_features: '',
        product_image_url: '',
        product_fileid: '',
        product_author: '',
        product_author_url: '',
        product_license: ''
    });
    const [fileProduct, setFileProduct] = useState(null);

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
                toast.success('Price updated successfully');
                setSelectedFile({ ...selectedFile, price_override: priceOverride });
                fetchFiles();
            } else {
                toast.error('Failed to update price');
            }
        } catch (error) {
            console.error('Error updating price:', error);
            toast.error('Failed to update price');
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
                toast.error('Failed to fetch files');
            }
        } catch (error) {
            console.error('Error fetching files:', error);
            toast.error('Failed to fetch files');
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
                toast.error('Failed to fetch file statuses');
            }
        } catch (error) {
            console.error('Error fetching file statuses:', error);
            toast.error('Failed to fetch file statuses');
        }
    };

    const handleProductAdd = async (fileid) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/product`, {
                action: 'create',
                ...newProduct,
                product_fileid: fileid
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                toast.success('Product created successfully');
                setNewProduct({
                    product_title: '',
                    product_description: '',
                    product_features: '',
                    product_image_url: '',
                    product_fileid: '',
                    product_author: '',
                    product_author_url: '',
                    product_license: ''
                });
            } else {
                toast.error('Failed to create product');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Failed to create product');
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
                toast.success('File deleted successfully');
            } else {
                toast.error('Failed to delete file');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            toast.error('Failed to delete file');
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
                toast.success('File sliced successfully');
                fetchFiles();
            } else {
                toast.error('Failed to slice file');
            }
        } catch (error) {
            console.error('Error slicing file:', error);
            toast.error('Failed to slice file');
        }
    };

    const checkFileProduct = async (fileid) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/product`, {
                action: 'checkIfFileIsInProduct',
                product_fileid: fileid
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                setFileProduct(response.data.result);
            } else {
                setFileProduct(null);
            }
        } catch (error) {
            console.error('Error checking file product:', error);
            setFileProduct(null);
        }
    };

    const getProductName = async (fileid) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/product`, {
                action: 'get',
                fileid: fileid
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                return response.data.result.product_title;
            } else {
                return "No Product";
            }
        } catch (error) {
            console.error('Error fetching product name:', error);
            return "No Product";
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
                console.log("Response: ", response.data.result);
                setFileDetails(response.data.result);
                setFileDetailsOpen(true);
                await checkFileProduct(row.fileid);
            } else {
                toast.error('Failed to fetch file details');
            }
        } catch (error) {
            console.error('Error fetching file details:', error);
            toast.error('Failed to fetch file details');
        }
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
                toast.success('File added successfully');
                setNewFile({ filename: '', priceOverride: '' });
                fetchFiles();
            } else {
                toast.error('Failed to add file');
            }
        } catch (error) {
            console.error('Error adding file:', error);
            toast.error('Failed to add file');
        }
    };

    const filteredItems = files.filter(
        item => Object.values(item).some(
            val => val && val.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    // Add this function to sort files by date
    const sortFilesByDate = (files) => {
        return [...files].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    };

    const subHeaderComponent = (
        <div className="flex items-center mb-4">
            <FaSearch className="text-gray-400 mr-2" />
            <Input
                type="text"
                placeholder="Search files..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="max-w-sm"
            />
        </div>
    );

    

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">File Management</h2>
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="github-primary">
                            <FaPlus className="mr-2 inline" />
                            Add File
                        </button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add New File</SheetTitle>
                            <SheetDescription>Upload a new file and set its details.</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="file" className="text-sm font-medium leading-none">Upload File</label>
                                <UploadButton
                                    endpoint="modelUploader"
                                    onClientUploadComplete={(res) => {
                                        console.log("Files: ", res);
                                        setNewFile({ ...newFile, utfile_id: res[0].key, utfile_url: res[0].url });
                                        toast.success("Upload Completed");
                                    }}
                                    onUploadError={(error) => {
                                        toast.error(`Upload Error: ${error.message}`);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="github-primary" onClick={handleAddFile}>Add File</button>
                        </div>
                    </SheetContent>


                </Sheet>
                <Sheet open={fileDetailsOpen} onOpenChange={setFileDetailsOpen}>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>File Details</SheetTitle>
                            <SheetDescription>View and edit file details.</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <p><strong>Filename:</strong> {fileDetails.filename || 'N/A'}</p>
                            <p><strong>File ID:</strong> <code className='text-blue-500 text-sm'>{fileDetails.fileid || 'N/A'}</code></p>
                            <hr></hr>
                            <p><strong>File Status:</strong>
                                {fileDetails.file_status === 'unsliced' && <FaSpinner className="animate-spin inline mr-2 ml-2" />}
                                {fileDetails.file_status === 'success' && <FaCheck className="text-green-500 inline mr-2 ml-2" />}
                                {fileDetails.file_status === 'error' && <FaTimes className="text-red-500 inline mr-2 ml-2" />}
                                {fileDetails.file_status}
                            </p>
                            <p><strong>Date Created:</strong> {new Date(fileDetails.dateCreated).toLocaleString() || 'N/A'}</p>
                            {fileDetails.file_status === 'success' && (
                                <>
                                    <p><strong>File Dimensions:</strong> {fileDetails.dimensions.x}<strong>x</strong> {fileDetails.dimensions.y}<strong>y</strong> {fileDetails.dimensions.z}<strong>z</strong></p>
                                    <p><strong>File Mass:</strong> {fileDetails.mass_in_grams}g</p>
                                </>
                            )}
                            {fileDetails.file_status === 'error' && (
                                <p><strong>Error Message:</strong> {fileDetails.file_error}</p>
                            )}
                            <a href={fileDetails.utfile_url} download className='github-primary'>Download File</a>
                            <hr></hr>
                            <div className='flex justify-center'>
                                {fileDetailsOpen && fileDetails.utfile_url && (
                                    <div className="w-full h-64 rounded-md overflow-hidden border border-gray-300">
                                        <p className='text-center'>Model Preview</p>
                                        <LazyModelViewer
                                            url={fileDetails.utfile_url}
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='flex justify-center'>
                                <button className='github-primary mr-2' onClick={() => handleSlice(fileDetails.fileid)}>Reslice Model</button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className='github-primary'>Create a Product</button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle>Create New Product</DialogTitle>
                                            <DialogDescription>
                                                Enter the details for the new product and see a live preview.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex gap-8">
                                            <div className="flex-1">
                                                <div className="grid gap-4 py-4">
                                                    <Input
                                                        placeholder="Product Title"
                                                        value={newProduct.product_title}
                                                        onChange={(e) => setNewProduct({...newProduct, product_title: e.target.value})}
                                                    />
                                                    <Input
                                                        placeholder="Product Description"
                                                        value={newProduct.product_description}
                                                        onChange={(e) => setNewProduct({...newProduct, product_description: e.target.value})}
                                                    />
                                                    <Input
                                                        placeholder="Product Features (comma-separated)"
                                                        value={newProduct.product_features}
                                                        onChange={(e) => setNewProduct({...newProduct, product_features: e.target.value})}
                                                    />
                                                    <label htmlFor="image" className="block mb-1">Product Image</label>
                                                    {newProduct.product_image_url ? (
                                                        <div className="relative w-full p-2 mb-2 bg-gray-700 rounded flex justify-center items-center">
                                                            <img src={newProduct.product_image_url} alt="Uploaded Product" className="w-1/2 h-auto rounded" />
                                                            <button
                                                                className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                                                                onClick={() => setNewProduct({ ...newProduct, product_image_url: '' })}
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
                                                                setNewProduct({ ...newProduct, product_image_url: res[0].url });
                                                                toast.success("Image uploaded successfully.");
                                                            }}
                                                            onUploadError={(error) => {
                                                                toast.error(`Upload Error: ${error.message}`);
                                                            }}
                                                        />
                                                    )}
                                                    <Input
                                                        placeholder="Product Author"
                                                        value={newProduct.product_author}
                                                        onChange={(e) => setNewProduct({...newProduct, product_author: e.target.value})}
                                                    />
                                                    <Input
                                                        placeholder="Product Author URL"
                                                        value={newProduct.product_author_url}
                                                        onChange={(e) => setNewProduct({...newProduct, product_author_url: e.target.value})}
                                                    />
                                                    <Input
                                                        placeholder="Product License"
                                                        value={newProduct.product_license}
                                                        onChange={(e) => setNewProduct({...newProduct, product_license: e.target.value})}
                                                    />
                                                </div>
                                                <div className="flex justify-end mt-4">
                                                    <button className="github-primary" onClick={() => handleProductAdd(fileDetails.fileid)}>
                                                        Create Product
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <ShowcaseProduct
                                                    title={newProduct.product_title || "Product Title"}
                                                    description={newProduct.product_description || "Product Description"}
                                                    image={newProduct.product_image_url || "https://via.placeholder.com/300"}
                                                    price={fileDetails.price_override ? (fileDetails.price_override / 100).toFixed(2) : "0.00"}
                                                    features={newProduct.product_features ? newProduct.product_features.split(',').map(f => f.trim()) : []}
                                                    fileid={fileDetails.fileid}
                                                    author={newProduct.product_author || "Mandarin 3D"}
                                                    author_url={newProduct.product_author_url || "https://mandarin3d.com"}
                                                    license={newProduct.product_license || "Public Domain"}
                                                />
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <hr></hr>
                            <div className="space-y-2">
                                <label htmlFor="priceOverride" className="text-sm font-medium leading-none">Price Override</label>
                                <Input
                                    id="priceOverride"
                                    value={fileDetails.price_override ? (fileDetails.price_override / 100).toFixed(2) : ''}
                                    onChange={(e) => setFileDetails({ ...fileDetails, price_override: e.target.value ? parseFloat(e.target.value) * 100 : null })}
                                    placeholder="Optional"
                                />
                                
                            </div>
                            <hr />
                            <p><strong>Product:</strong> {fileProduct ? fileProduct.product_title : "No associated product"}</p>
                            
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="github-primary"
                                onClick={() => handleUpdatePrice(fileDetails.fileid || 'N/A', fileDetails.price_override || 'N/A')}
                            >
                                Update Price
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold mb-4">Loading Files</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D939B]"></div>
                </div>
            ) : (
                <>
                    {subHeaderComponent}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead>File Status</TableHead>
                                <TableHead>File ID</TableHead>
                                <TableHead>Price Override</TableHead>
                                <TableHead>Date Created</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortFilesByDate(filteredItems).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((file) => (
                                <TableRow key={file.fileid} >
                                    <TableCell className="font-medium" onClick={() => handleRowClick(file)}>{file.filename}</TableCell>
                                    <TableCell onClick={() => handleRowClick(file)}>
                                        {file.file_status === 'unsliced' && <FaSpinner className="animate-spin inline mr-2" />}
                                        {file.file_status === 'success' && <FaCheck className="text-green-500 inline mr-2" />}
                                        {file.file_status === 'error' && <FaTimes className="text-red-500 inline mr-2" />}
                                        {file.file_status}
                                    </TableCell>
                                    <TableCell onClick={() => handleRowClick(file)}>{file.fileid}</TableCell>
                                    <TableCell onClick={() => handleRowClick(file)}>{file.price_override ? `$${(file.price_override / 100).toFixed(2)}` : 'N/A'}</TableCell>
                                    <TableCell onClick={() => handleRowClick(file)}>{new Date(file.dateCreated).toLocaleString()}</TableCell>
                                    <TableCell onClick={() => handleRowClick(file)}>
                                        {file.productName ? (
                                            <Badge>{file.productName}</Badge>
                                        ) : (
                                            <Badge variant="outline">No Product</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <button onClick={() => handleSlice(file.fileid)} className="github-secondary text-blue-500 hover:text-blue-700 mr-2 mb-2">
                                            <FaSync />
                                        </button>
                                        <button onClick={() => handleDelete(file.fileid)} className="github-secondary text-red-500 hover:text-red-700 mb-2">
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
                            {Array.from({ length: Math.ceil(files.length / itemsPerPage) }, (_, i) => (
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
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(files.length / itemsPerPage)))}
                                    className={currentPage === Math.ceil(files.length / itemsPerPage) ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}
        </div>
    );
}

export default FileManagement;