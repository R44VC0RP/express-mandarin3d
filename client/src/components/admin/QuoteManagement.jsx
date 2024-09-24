import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
    Table,
    TableBody,
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

function QuoteManagement() {
    const [newQuote, setNewQuote] = useState({ quote_comments: '', quote_files: [] });
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filterText, setFilterText] = useState('');
    const [editingQuote, setEditingQuote] = useState(null);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/quote/mgmt`, 
                { action: 'list' },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.status === 'success') {
                setQuotes(response.data.quotes);
            } else {
                toast.error('Failed to fetch quotes');
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
            toast.error('Failed to fetch quotes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (quote_id) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/quote/mgmt`, {
                action: 'delete',
                quote_id: quote_id,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                setQuotes(quotes.filter(q => q.quote_id !== quote_id));
                toast.success('Quote deleted successfully');
            } else {
                toast.error('Failed to delete quote');
            }
        } catch (error) {
            console.error('Error deleting quote:', error);
            toast.error('Failed to delete quote');
        }
    };

    const handleInputChange = (e) => {
        setNewQuote({ ...newQuote, [e.target.name]: e.target.value });
    };

    const handleAddQuote = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/quote/mgmt`, {
                action: 'create',
                quote_comments: newQuote.quote_comments,
                quote_files: newQuote.quote_files,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                toast.success('Quote added successfully');
                setNewQuote({ quote_comments: '', quote_files: [] });
                fetchQuotes();
            } else {
                toast.error('Failed to add quote');
            }
        } catch (error) {
            console.error('Error adding quote:', error);
            toast.error('Failed to add quote');
        }
    };

    const handleEditQuote = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/quote/mgmt`, {
                action: 'update',
                quote_id: editingQuote.quote_id,
                quote_comments: editingQuote.quote_comments,
                quote_files: editingQuote.quote_files,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.status === 'success') {
                toast.success('Quote updated successfully');
                setEditingQuote(null);
                fetchQuotes();
            } else {
                toast.error('Failed to update quote');
            }
        } catch (error) {
            console.error('Error updating quote:', error);
            toast.error('Failed to update quote');
        }
    };

    const filteredItems = quotes.filter(
        item => Object.values(item).some(
            val => val && val.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const subHeaderComponent = (
        <div className="flex items-center mb-4">
            <Input
                type="text"
                placeholder="Search quotes..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="max-w-sm"
            />
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quotes</h2>
                
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-bold mb-4">Loading Quotes</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D939B]"></div>
                </div>
            ) : (
                <>
                    {subHeaderComponent}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Comments</TableHead>
                                <TableHead>Files</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((quote) => (
                                <TableRow key={quote.quote_id}>
                                    <TableCell>{quote.quote_id}</TableCell>
                                    <TableCell>{quote.quote_comments}</TableCell>
                                    <TableCell>{quote.quote_files.length}</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/quote/${quote.quote_id}`)}
                                            className="github-secondary text-blue-500 hover:text-blue-700 mr-2"
                                            title="Copy quote link"
                                        >
                                            <FaPlus />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(quote.quote_id)}
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
                            {Array.from({ length: Math.ceil(quotes.length / itemsPerPage) }, (_, i) => (
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
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(quotes.length / itemsPerPage)))}
                                    className={currentPage === Math.ceil(quotes.length / itemsPerPage) ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}

            {editingQuote && (
                <Sheet open={!!editingQuote} onOpenChange={() => setEditingQuote(null)}>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Edit Quote</SheetTitle>
                            <SheetDescription>Edit the details for this quote.</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <Textarea
                                name="quote_comments"
                                value={editingQuote.quote_comments}
                                onChange={(e) => setEditingQuote({...editingQuote, quote_comments: e.target.value})}
                                placeholder="Comments"
                            />
                            {/* Add file edit functionality here */}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="github-primary" onClick={handleEditQuote}>Update Quote</button>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
}

export default QuoteManagement;