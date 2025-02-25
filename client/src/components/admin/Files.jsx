import React, { useState, useEffect, useRef, Suspense } from 'react';
import { FaPlus, FaTimes, FaTrash, FaEdit, FaSpinner, FaCheck, FaSync, FaCalendarAlt, FaSearch, FaCopy, FaClipboard, FaCheckCircle, FaFileUpload, FaDatabase, FaSadTear, FaFilter, FaFileDownload, FaUserFriends } from 'react-icons/fa';
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
import { Textarea } from "@/components/ui/textarea"

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
import { useCart } from '@/context/Cart';

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
    const { addFile } = useCart();
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
    const [newProduct, setNewProduct] = useState({
        product_title: '',
        product_description: '',
        product_features: '',
        product_image_url: '',
        product_fileid: '',
        product_author: '',
        product_author_url: '',
        product_license: '',
        product_url: ''
    });
    const [fileProduct, setFileProduct] = useState(null);
    const [copiedFileId, setCopiedFileId] = useState(null);

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

    const handleAddToCart = async (fileid) => {
        try {
            addFile(fileid);
            toast.success('File added to cart');
        } catch (error) {
            console.error('Error adding file to cart:', error);
            toast.error('Failed to add file to cart');
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

    const renderPaginationItems = () => {
        const totalPages = Math.ceil(files.length / itemsPerPage);
        const maxPageLinks = 5; // Number of page links to show before and after the current page
        const pageLinks = [];

        if (totalPages <= maxPageLinks * 2) {
            for (let i = 1; i <= totalPages; i++) {
                pageLinks.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => setCurrentPage(i)}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            let startPage = Math.max(currentPage - maxPageLinks, 1);
            let endPage = Math.min(currentPage + maxPageLinks, totalPages);

            if (startPage > 1) {
                pageLinks.push(
                    <PaginationItem key={1}>
                        <PaginationLink
                            onClick={() => setCurrentPage(1)}
                            isActive={currentPage === 1}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>
                );
                if (startPage > 2) {
                    pageLinks.push(<PaginationItem key="start-ellipsis">...</PaginationItem>);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageLinks.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => setCurrentPage(i)}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageLinks.push(<PaginationItem key="end-ellipsis">...</PaginationItem>);
                }
                pageLinks.push(
                    <PaginationItem key={totalPages}>
                        <PaginationLink
                            onClick={() => setCurrentPage(totalPages)}
                            isActive={currentPage === totalPages}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return pageLinks;
    };

    // Function to truncate file ID for display
    const truncateFileId = (fileId) => {
        if (!fileId) return '';
        return fileId.substring(0, 8) + '...';
    };

    // Add copy to clipboard function
    const copyToClipboard = (text, fileId) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedFileId(fileId);
                toast.success('File ID copied to clipboard');
                
                // Reset the copied state after 2 seconds
                setTimeout(() => {
                    setCopiedFileId(null);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                toast.error('Failed to copy to clipboard');
            });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">File Management <span className="text-sm text-gray-500 font-normal">({files.length} files | {files.filter(file => file.file_status === 'success').length} sliced)</span></h2>
                <div className="flex items-center">
                    <span className="mr-2">Drag and Drop files to add them</span>
                </div>
                <Sheet open={fileDetailsOpen} onOpenChange={setFileDetailsOpen}>
                    <SheetContent className="w-[95%] sm:w-[800px] max-w-[95vw] lg:max-w-[1000px]">
                        <SheetHeader>
                            <SheetTitle>File Details</SheetTitle>
                            <SheetDescription>View and edit file details.</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-6 py-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - File Info */}
                                <div className="space-y-6">
                                    <div className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg p-4 space-y-3">
                                        <h3 className="text-md font-medium border-b border-neutral-800/50 pb-2 mb-1">Basic Information</h3>
                                        
                                        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                                            <span className="text-gray-400 text-sm">Filename:</span>
                                            <span className="text-white font-medium">{fileDetails.filename || 'N/A'}</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                                            <span className="text-gray-400 text-sm">File ID:</span>
                                            <div className="flex items-center gap-2">
                                                <code className="text-blue-400 text-sm font-mono bg-[#1e2229] px-2 py-0.5 rounded border border-neutral-800">{fileDetails.fileid || 'N/A'}</code>
                                                <button 
                                                    className="text-gray-400 hover:text-white" 
                                                    onClick={() => copyToClipboard(fileDetails.fileid, 'details')}
                                                    title="Copy file ID"
                                                >
                                                    {copiedFileId === 'details' ? (
                                                        <FaCheckCircle className="text-green-500 text-sm" />
                                                    ) : (
                                                        <FaCopy className="text-sm" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                                            <span className="text-gray-400 text-sm">File Status:</span>
                                            <div className="flex items-center gap-2">
                                                {fileDetails.file_status === 'unsliced' && <FaSpinner className="animate-spin text-yellow-400" />}
                                                {fileDetails.file_status === 'success' && <FaCheck className="text-green-500" />}
                                                {fileDetails.file_status === 'error' && <FaTimes className="text-red-500" />}
                                                <span className="capitalize">{fileDetails.file_status}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                                            <span className="text-gray-400 text-sm">Date Created:</span>
                                            <span>{new Date(fileDetails.dateCreated).toLocaleString() || 'N/A'}</span>
                                        </div>
                                        
                                        {fileDetails.ref_fileid && (
                                            <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                                                <span className="text-gray-400 text-sm">Referral Partner:</span>
                                                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                    {fileDetails.ref_fileid}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {fileDetails.file_status === 'success' && (
                                        <div className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg p-4 space-y-3">
                                            <h3 className="text-md font-medium border-b border-neutral-800/50 pb-2 mb-1">Dimensions & Properties</h3>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-[#1e2229]/70 p-3 rounded-lg border border-neutral-800/50">
                                                    <span className="text-xs text-gray-400 block">Width (X)</span>
                                                    <span className="text-xl text-white font-medium">{fileDetails.dimensions.x}<span className="text-sm text-gray-400 ml-1">mm</span></span>
                                                </div>
                                                <div className="bg-[#1e2229]/70 p-3 rounded-lg border border-neutral-800/50">
                                                    <span className="text-xs text-gray-400 block">Depth (Y)</span>
                                                    <span className="text-xl text-white font-medium">{fileDetails.dimensions.y}<span className="text-sm text-gray-400 ml-1">mm</span></span>
                                                </div>
                                                <div className="bg-[#1e2229]/70 p-3 rounded-lg border border-neutral-800/50">
                                                    <span className="text-xs text-gray-400 block">Height (Z)</span>
                                                    <span className="text-xl text-white font-medium">{fileDetails.dimensions.z}<span className="text-sm text-gray-400 ml-1">mm</span></span>
                                                </div>
                                                <div className="bg-[#1e2229]/70 p-3 rounded-lg border border-neutral-800/50">
                                                    <span className="text-xs text-gray-400 block">Mass</span>
                                                    <span className="text-xl text-white font-medium">{fileDetails.mass_in_grams}<span className="text-sm text-gray-400 ml-1">g</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {fileDetails.file_status === 'error' && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                            <h3 className="text-md font-medium text-red-400 border-b border-red-500/30 pb-2 mb-1">Error Information</h3>
                                            <p className="text-red-300">{fileDetails.file_error || 'Unknown error occurred during processing'}</p>
                                        </div>
                                    )}
                                    
                                    <div className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg p-4 space-y-3">
                                        <h3 className="text-md font-medium border-b border-neutral-800/50 pb-2 mb-1">Price & Product Information</h3>
                                        
                                        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                                            <span className="text-gray-400 text-sm">Price Override:</span>
                                            <div className="flex items-center">
                                                <span className="mr-2 text-gray-400">$</span>
                                                <Input
                                                    id="priceOverride"
                                                    value={fileDetails.price_override}
                                                    onChange={(e) => setFileDetails({ ...fileDetails, price_override: e.target.value })}
                                                    placeholder="Optional"
                                                    className="bg-[#1e2229] border-neutral-700 text-white"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                                            <span className="text-gray-400 text-sm">Product:</span>
                                            {fileProduct ? (
                                                <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                    {fileProduct.product_title}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">No Product</Badge>
                                            )}
                                        </div>
                                        
                                        <div className="flex justify-end">
                                            <button
                                                className="bg-gradient-to-r from-cyan-600/90 to-cyan-700/80 hover:from-cyan-700 hover:to-cyan-800 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
                                                onClick={() => handleUpdatePrice(fileDetails.fileid || 'N/A', fileDetails.price_override || 'N/A')}
                                            >
                                                <FaEdit className="mr-1.5" />
                                                Update Price
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right Column - Preview & Product Creation */}
                                <div className="space-y-4">
                                    <div className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg p-4 space-y-3">
                                        <h3 className="text-md font-medium border-b border-neutral-800/50 pb-2">Model Preview</h3>
                                        
                                        {fileDetailsOpen && fileDetails.utfile_url && (
                                            <div className="w-full h-[280px] rounded-md overflow-hidden border border-neutral-800 bg-[#1e2229]/70">
                                                <LazyModelViewer
                                                    url={fileDetails.utfile_url || "https://cdn.mandarin3d.com/files/default.glb"}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg p-4">
                                        <h3 className="text-md font-medium border-b border-neutral-800/50 pb-2 mb-3">Actions</h3>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <a 
                                                href={fileDetails.utfile_url} 
                                                download 
                                                className="bg-[#1e2229] hover:bg-[#2A2A2A] border border-neutral-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center justify-center"
                                            >
                                                <FaFileDownload className="mr-1.5" />
                                                Download File
                                            </a>
                                            <button 
                                                className="bg-[#1e2229] hover:bg-[#2A2A2A] border border-neutral-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center justify-center"
                                                onClick={() => handleAddToCart(fileDetails.fileid)}
                                            >
                                                <FaPlus className="mr-1.5" />
                                                Add to Cart
                                            </button>
                                            <button 
                                                className="bg-[#1e2229] hover:bg-[#2A2A2A] border border-neutral-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center justify-center"
                                                onClick={() => handleSlice(fileDetails.fileid)}
                                            >
                                                <FaSync className="mr-1.5" />
                                                Reslice Model
                                            </button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className='bg-gradient-to-r from-purple-600/90 to-purple-700/80 hover:from-purple-700 hover:to-purple-800 text-white px-3 py-1.5 rounded-md text-sm flex items-center justify-center'>
                                                        <FaPlus className="mr-1.5" />
                                                        Create Product
                                                    </button>
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
                                                                <Textarea
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
                                                                        className='w-full p-2 mb-2 rounded border border-gray-300'
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
                                                                <Input
                                                                    placeholder="Product URL"
                                                                    value={newProduct.product_url}
                                                                    onChange={(e) => setNewProduct({...newProduct, product_url: e.target.value})}
                                                                />
                                                            </div>
                                                            <div className="flex justify-end mt-4">
                                                                <button 
                                                                    className="bg-gradient-to-r from-purple-600/90 to-purple-700/80 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                                                                    onClick={() => handleProductAdd(fileDetails.fileid)}
                                                                >
                                                                    <FaPlus className="mr-2" />
                                                                    Create Product
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <ShowcaseProduct
                                                                product_title={newProduct.product_title || "Product Title"}
                                                                product_description={newProduct.product_description || "Product Description"}
                                                                product_image_url={newProduct.product_image_url || "https://via.placeholder.com/300"}
                                                                product_features={newProduct.product_features ? newProduct.product_features.split(',').map(f => f.trim()) : []}
                                                                product_fileid={fileDetails.fileid}
                                                                product_author={newProduct.product_author || "Mandarin 3D"}
                                                                product_author_url={newProduct.product_author_url || "https://mandarin3d.com"}
                                                                product_license={newProduct.product_license || "Public Domain"}
                                                                file_obj={fileDetails}
                                                            />
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                <TableHead>Referral Partner</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center p-8">
                                            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                                                <FaDatabase className="text-3xl text-cyan-400/70" />
                                            </div>
                                            <h3 className="text-lg font-medium text-white mb-2">No Files Found</h3>
                                            <p className="text-gray-400 mb-4 max-w-md">
                                                {filterText 
                                                    ? "No files match your search criteria. Try adjusting your filters." 
                                                    : "Upload files to get started with your 3D print management."}
                                            </p>
                                            <div className="flex gap-3">
                                                {filterText && (
                                                    <button 
                                                        className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-600/80 to-amber-700/60 rounded-md text-white text-sm"
                                                        onClick={() => setFilterText('')}
                                                    >
                                                        <FaFilter className="mr-2" />
                                                        Clear Filters
                                                    </button>
                                                )}
                                                <UploadButton
                                                    className="ut-button:bg-gradient-to-r ut-button:from-cyan-600/90 ut-button:to-cyan-700/70 ut-button:rounded-md ut-button:text-white ut-button:px-4 ut-button:py-2 ut-button:text-sm ut-button:flex ut-button:items-center ut-allowed-content:hidden"
                                                    endpoint="modelUploader"
                                                    content={{
                                                        button({ ready }) {
                                                            return (
                                                                <div className="flex items-center">
                                                                    <FaFileUpload className="mr-2" />
                                                                    <span>Upload a File</span>
                                                                </div>
                                                            );
                                                        }
                                                    }}
                                                    onClientUploadComplete={(res) => {
                                                        toast.success("Files uploaded successfully!");
                                                        fetchFiles();
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortFilesByDate(filteredItems).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((file) => (
                                    <TableRow key={file.fileid} >
                                        <TableCell className="font-medium" onClick={() => handleRowClick(file)}>{file.filename}</TableCell>
                                        <TableCell onClick={() => handleRowClick(file)}>
                                            {file.file_status === 'unsliced' && <FaSpinner className="animate-spin inline mr-2" />}
                                            {file.file_status === 'success' && <FaCheck className="text-green-500 inline mr-2" />}
                                            {file.file_status === 'error' && <FaTimes className="text-red-500 inline mr-2" />}
                                            {file.file_status}
                                        </TableCell>
                                        <TableCell>
                                            <div 
                                                className="flex items-center gap-1 cursor-pointer group"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(file.fileid, file.fileid);
                                                }}
                                            >
                                                <span className="text-gray-300 font-mono text-sm">
                                                    {truncateFileId(file.fileid)}
                                                </span>
                                                {copiedFileId === file.fileid ? (
                                                    <FaCheckCircle className="text-green-500 text-xs group-hover:opacity-100" />
                                                ) : (
                                                    <FaCopy className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                                                )}
                                                <span className="sr-only">Click to copy</span>
                                            </div>
                                        </TableCell>
                                        <TableCell onClick={() => handleRowClick(file)}>{file.price_override ? `$${(file.price_override).toFixed(2)}` : 'N/A'}</TableCell>
                                        <TableCell onClick={() => handleRowClick(file)}>{new Date(file.dateCreated).toLocaleString()}</TableCell>
                                        <TableCell onClick={() => handleRowClick(file)}>
                                            {file.productName ? (
                                                <Badge>{file.productName}</Badge>
                                            ) : (
                                                <Badge variant="outline">No Product</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell onClick={() => handleRowClick(file)}>
                                            {file.ref_fileid ? (
                                                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                                    <FaUserFriends className="text-xs" />
                                                    {file.ref_fileid}
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSlice(file.fileid);
                                                }} 
                                                className="github-secondary text-blue-500 hover:text-blue-700 mr-2 mb-2"
                                                title="Reslice model"
                                            >
                                                <FaSync />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(file.fileid);
                                                }} 
                                                className="github-secondary text-red-500 hover:text-red-700 mb-2"
                                                title="Delete file"
                                            >
                                                <FaTrash />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {filteredItems.length > 0 && (
                        <Pagination className="mt-4">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                {renderPaginationItems()}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(files.length / itemsPerPage)))}
                                        className={currentPage === Math.ceil(files.length / itemsPerPage) ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            )}
        </div>
    );
}

export default FileManagement;