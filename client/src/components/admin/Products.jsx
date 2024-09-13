import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaTimes, FaTags, FaLayerGroup } from 'react-icons/fa';
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
import { UploadButton } from "../../utils/uploadthing";
import ShowcaseProduct from '@/components/ShowcaseProduct';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [collections, setCollections] = useState([]);
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
    const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [newCollectionName, setNewCollectionName] = useState('');
    const [newCollectionDescription, setNewCollectionDescription] = useState('');
    const [newCollectionImageUrl, setNewCollectionImageUrl] = useState('');
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [isEditCollectionDialogOpen, setIsEditCollectionDialogOpen] = useState(false);
    const [isNewCollectionDialogOpen, setIsNewCollectionDialogOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCollections();
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

    const fetchCollections = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/collection`, {
                action: 'list'
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.status === 'success') {
                setCollections(response.data.result);
            } else {
                toast.error('Failed to fetch collections');
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
            toast.error('Failed to fetch collections');
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

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setIsViewDialogOpen(true);
    };

    const handleTagsEdit = (product) => {
        setSelectedProduct(product);
        setIsTagDialogOpen(true);
    };

    const handleCollectionEdit = (product) => {
        setSelectedProduct(product);
        setIsCollectionDialogOpen(true);
    };

    const handleTagsUpdate = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/product`, {
                action: 'update',
                product_id: selectedProduct.product_id,
                product_tags: selectedProduct.product_tags
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                toast.success('Tags updated successfully');
                setIsTagDialogOpen(false);
                fetchProducts();
            } else {
                toast.error('Failed to update tags');
            }
        } catch (error) {
            console.error('Error updating tags:', error);
            toast.error('Failed to update tags');
        }
    };

    const handleAddTag = () => {
        if (tagInput && !selectedProduct.product_tags.includes(tagInput)) {
            setSelectedProduct({
                ...selectedProduct,
                product_tags: [...selectedProduct.product_tags, tagInput]
            });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag) => {
        setSelectedProduct({
            ...selectedProduct,
            product_tags: selectedProduct.product_tags.filter(t => t !== tag)
        });
    };

    const handleCollectionUpdate = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/product`, {
                action: 'update',
                product_id: selectedProduct.product_id,
                product_collection: selectedProduct.product_collection
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                toast.success('Collection updated successfully');
                setIsCollectionDialogOpen(false);
                fetchProducts();
            } else {
                toast.error('Failed to update collection');
            }
        } catch (error) {
            console.error('Error updating collection:', error);
            toast.error('Failed to update collection');
        }
    };

    const getCollectionName = (collection_id) => {
        const collection = collections.find(c => c.collection_id === collection_id);
        return collection ? collection.collection_name : 'No collection';
    }

    const handleCreateCollection = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/collection`, {
                action: 'create',
                collection_name: newCollectionName,
                collection_description: newCollectionDescription,
                collection_image_url: newCollectionImageUrl
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                toast.success('Collection created successfully');
                fetchCollections();
                setNewCollectionName('');
                setNewCollectionDescription('');
                setNewCollectionImageUrl('');
                setIsNewCollectionDialogOpen(false);
            } else {
                toast.error('Failed to create collection');
            }
        } catch (error) {
            console.error('Error creating collection:', error);
            toast.error('Failed to create collection');
        }
    };

    const handleEditCollection = (collection) => {
        setSelectedCollection(collection);
        setIsEditCollectionDialogOpen(true);
    };

    const handleUpdateCollection = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/collection`, {
                action: 'update',
                collection_id: selectedCollection.collection_id,
                collection_name: selectedCollection.collection_name,
                collection_description: selectedCollection.collection_description,
                collection_image_url: selectedCollection.collection_image_url
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                toast.success('Collection updated successfully');
                setIsEditCollectionDialogOpen(false);
                fetchCollections();
            } else {
                toast.error('Failed to update collection');
            }
        } catch (error) {
            console.error('Error updating collection:', error);
            toast.error('Failed to update collection');
        }
    };

    const handleDeleteCollection = async (collectionId) => {
        if (window.confirm('Are you sure you want to delete this collection?')) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/collection`, {
                    action: 'delete',
                    collection_id: collectionId
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.data.status === 'success') {
                    toast.success('Collection deleted successfully');
                    fetchCollections();
                } else {
                    toast.error('Failed to delete collection');
                }
            } catch (error) {
                console.error('Error deleting collection:', error);
                toast.error('Failed to delete collection');
            }
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
    console.log(products);
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
                                <TableHead>Tags</TableHead>
                                <TableHead>Collection</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortProductsByDate(filteredItems).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                                <TableRow key={product.product_id}>
                                    <TableCell className="font-medium cursor-pointer hover:text-[#0D939B]" onClick={() => handleViewProduct(product)}>
                                        {product.product_title}
                                    </TableCell>
                                    <TableCell>{product.product_description.substring(0, 50)}...</TableCell>
                                    <TableCell>{product.product_fileid}</TableCell>
                                    <TableCell>{product.product_author}</TableCell>
                                    <TableCell>{product.product_license}</TableCell>
                                    <TableCell>{product.product_tags?.join(', ') || 'No tags'}</TableCell>
                                    <TableCell>
                                        {product.product_collection ? (
                                            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                                                {getCollectionName(product.product_collection)}
                                            </Badge>
                                        ) : (
                                            'No collection'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <button onClick={() => handleEdit(product)} className="github-secondary text-blue-500 hover:text-blue-700 mr-2">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(product.product_id)} className="github-secondary text-red-500 hover:text-red-700 mr-2">
                                            <FaTrash />
                                        </button>
                                        <button onClick={() => handleTagsEdit(product)} className="github-secondary text-green-500 hover:text-green-700 mr-2">
                                            <FaTags />
                                        </button>
                                        <button onClick={() => handleCollectionEdit(product)} className="github-secondary text-purple-500 hover:text-purple-700">
                                            <FaLayerGroup />
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

            <h2 className="text-2xl font-bold my-6">Collection Management</h2>
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold mb-4">Loading Collections</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D939B]"></div>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <Button onClick={() => setIsNewCollectionDialogOpen(true)} className="github-primary">
                            Add New Collection
                        </Button>
                    </div>
                    <Table>
                        <TableCaption>A list of your collections</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {collections.map((collection) => (
                                <TableRow key={collection.collection_id}>
                                    <TableCell className="font-medium">{collection.collection_name}</TableCell>
                                    <TableCell>{collection.collection_description.substring(0, 50)}...</TableCell>
                                    <TableCell>
                                        {collection.collection_image_url ? (
                                            <img src={collection.collection_image_url} alt={collection.collection_name} className="w-16 h-16 object-cover rounded" />
                                        ) : (
                                            <span className="text-gray-400">No image</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <button onClick={() => handleEditCollection(collection)} className="github-secondary text-blue-500 hover:text-blue-700 mr-2">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDeleteCollection(collection.collection_id)} className="github-secondary text-red-500 hover:text-red-700">
                                            <FaTrash />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="url" className="text-right">URL</label>
                                <Input id="url" value={selectedProduct.product_url} onChange={(e) => setSelectedProduct({...selectedProduct, product_url: e.target.value})} className="col-span-3" />
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end mt-4">
                        <button className="github-primary" onClick={handleUpdate}>Save changes</button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>View Product</DialogTitle>
                        <DialogDescription>
                            Product details and preview.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="flex gap-8">
                            <div className="flex-1">
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label className="text-right">Title</label>
                                        <div className="col-span-3">{selectedProduct.product_title}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label className="text-right">Description</label>
                                        <div className="col-span-3">{selectedProduct.product_description}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label className="text-right">Features</label>
                                        <div className="col-span-3">{selectedProduct.product_features}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label className="text-right">Image</label>
                                        <div className="col-span-3">
                                            {selectedProduct.product_image_url && (
                                                <img src={selectedProduct.product_image_url} alt="Product" className="w-1/2 h-auto rounded" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label className="text-right">Author</label>
                                        <div className="col-span-3">{selectedProduct.product_author}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label className="text-right">Author URL</label>
                                        <div className="col-span-3">{selectedProduct.product_author_url}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label className="text-right">License</label>
                                        <div className="col-span-3">{selectedProduct.product_license}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label className="text-right">URL</label>
                                        <div className="col-span-3">{selectedProduct.product_url}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <ShowcaseProduct
                                    product_title={selectedProduct.product_title}
                                    product_description={selectedProduct.product_description}
                                    product_image_url={selectedProduct.product_image_url || "https://via.placeholder.com/300"}
                                    product_fileid={selectedProduct.product_fileid}
                                    product_author={selectedProduct.product_author}
                                    product_author_url={selectedProduct.product_author_url}
                                    product_license={selectedProduct.product_license}
                                />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Tags</DialogTitle>
                        <DialogDescription>
                            Add or remove tags for this product.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedProduct?.product_tags.map((tag, index) => (
                            <Badge key={index} className=" px-2 py-1 rounded-full flex items-center">
                                <span>{tag}</span>
                                <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-red-500">
                                    <FaTimes />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Enter a new tag"
                        />
                        <button onClick={handleAddTag} className="github-primary">
                            Add Tag
                        </button>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="github-primary" onClick={handleTagsUpdate}>Save Tags</button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Collection</DialogTitle>
                        <DialogDescription>
                            Assign this product to a collection or create a new one.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mb-4">
                        <label htmlFor="collection" className="block text-sm font-medium text-foreground mb-2">Select Collection</label>
                        <Select
                            value={selectedProduct?.product_collection || null}
                            onValueChange={(value) => setSelectedProduct({...selectedProduct, product_collection: value})}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a collection" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no_collection">No Collection</SelectItem>
                                {collections.map((collection) => (
                                    <SelectItem key={collection.collection_id} value={collection.collection_id}>
                                        {collection.collection_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-lg font-medium">Create New Collection</h4>
                        <Input
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            placeholder="Collection Name"
                            className="mt-2"
                        />
                        <Input
                            value={newCollectionDescription}
                            onChange={(e) => setNewCollectionDescription(e.target.value)}
                            placeholder="Collection Description"
                            className="mt-2"
                        />
                        <Input
                            value={newCollectionImageUrl}
                            onChange={(e) => setNewCollectionImageUrl(e.target.value)}
                            placeholder="Collection Image URL"
                            className="mt-2"
                        />
                        <button onClick={handleCreateCollection} className="github-primary mt-2">
                            Create Collection
                        </button>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="github-primary" onClick={handleCollectionUpdate}>Save Collection</button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditCollectionDialogOpen} onOpenChange={setIsEditCollectionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Collection</DialogTitle>
                        <DialogDescription>
                            Make changes to your collection here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCollection && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="collectionName" className="text-right">Name</label>
                                <Input
                                    id="collectionName"
                                    value={selectedCollection.collection_name}
                                    onChange={(e) => setSelectedCollection({...selectedCollection, collection_name: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="collectionDescription" className="text-right">Description</label>
                                <Input
                                    id="collectionDescription"
                                    value={selectedCollection.collection_description}
                                    onChange={(e) => setSelectedCollection({...selectedCollection, collection_description: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right">Image</label>
                                <div className="col-span-3">
                                    {selectedCollection.collection_image_url && (
                                        <img src={selectedCollection.collection_image_url} alt="Collection" className="w-32 h-32 object-cover rounded mb-2" />
                                    )}
                                    <UploadButton
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            if (res && res[0]) {
                                                setSelectedCollection({...selectedCollection, collection_image_url: res[0].url});
                                                toast.success('Image uploaded successfully');
                                            }
                                        }}
                                        onUploadError={(error) => {
                                            toast.error(`ERROR! ${error.message}`);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end mt-4">
                        <button className="github-primary" onClick={handleUpdateCollection}>Save changes</button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isNewCollectionDialogOpen} onOpenChange={setIsNewCollectionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Collection</DialogTitle>
                        <DialogDescription>
                            Add a new collection to your store.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="newCollectionName" className="text-right">Name</label>
                            <Input
                                id="newCollectionName"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="newCollectionDescription" className="text-right">Description</label>
                            <Input
                                id="newCollectionDescription"
                                value={newCollectionDescription}
                                onChange={(e) => setNewCollectionDescription(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Image</label>
                            <div className="col-span-3">
                                {newCollectionImageUrl && (
                                    <img src={newCollectionImageUrl} alt="New Collection" className="w-32 h-32 object-cover rounded mb-2" />
                                )}
                                <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        if (res && res[0]) {
                                            setNewCollectionImageUrl(res[0].url);
                                            toast.success('Image uploaded successfully');
                                        }
                                    }}
                                    onUploadError={(error) => {
                                        toast.error(`ERROR! ${error.message}`);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="github-primary" onClick={handleCreateCollection}>Create Collection</button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

export default ProductManagement;