import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUser, FaUsers } from 'react-icons/fa';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { api } from '../config/api';

const ITEMS_PER_PAGE = 5;

export default function CustomerList({ onNavigate }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [contactCounts, setContactCounts] = useState({});

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const data = await api.getCustomers();
            setCustomers(data);
            setError(null);

            // Load contact counts for each customer
            const counts = {};
            for (const customer of data) {
                try {
                    const contacts = await api.getContactsByCustomerId(customer.id);
                    counts[customer.id] = contacts.length;
                } catch (err) {
                    counts[customer.id] = 0;
                }
            }
            setContactCounts(counts);
        } catch (err) {
            setError('Failed to load customers. Please check your API URL and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        try {
            await api.deleteCustomer(id);
            setCustomers(customers.filter(c => c.id !== id));
            const newCounts = { ...contactCounts };
            delete newCounts[id];
            setContactCounts(newCounts);
        } catch (err) {
            alert('Failed to delete customer');
        }
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        setCurrentPage(1);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className="inline ml-1 opacity-50" />;
        return sortConfig.direction === 'asc'
            ? <FaSortUp className="inline ml-1" />
            : <FaSortDown className="inline ml-1" />;
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedCustomers.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedCustomers = sortedCustomers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    if (loading) {
        return <div className="text-center py-12 text-gray-600">Loading customers...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
                <button
                    onClick={() => onNavigate('form', null)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <FaPlus />
                    Add Customer
                </button>
            </div>

            <div className="mb-4 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by customer name..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {paginatedCustomers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No customers found matching your search.' : 'No customers yet. Add your first customer!'}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('name')}
                                    >
                                        Name {getSortIcon('name')}
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('email')}
                                    >
                                        Email {getSortIcon('email')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FaUsers className="inline mr-1" />
                                        Contacts
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaUser className="text-gray-400 mr-2" />
                                                <span className="font-medium text-gray-900">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.phone || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {contactCounts[customer.id] || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => onNavigate('detail', customer)}
                                                className="text-blue-600 hover:text-blue-800 mr-3 transition"
                                                title="View"
                                            >
                                                <FaUser />
                                            </button>
                                            <button
                                                onClick={() => onNavigate('form', customer)}
                                                className="text-green-600 hover:text-green-800 mr-3 transition"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(customer.id)}
                                                className="text-red-600 hover:text-red-800 transition"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-6">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 rounded-lg transition ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
