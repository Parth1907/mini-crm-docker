import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaPlus } from 'react-icons/fa';
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaTrash } from 'react-icons/fa';
import { api } from '../config/api';
import ContactForm from '../components/ContactForm';

export default function CustomerDetail({ customer, onNavigate }) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showContactForm, setShowContactForm] = useState(false);
    const [editingContact, setEditingContact] = useState(null);

    useEffect(() => {
        loadContacts();
    }, [customer.id]);

    const loadContacts = async () => {
        try {
            setLoading(true);
            const data = await api.getContactsByCustomerId(customer.id);
            setContacts(data);
        } catch (err) {
            console.error('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContact = async (id) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        try {
            await api.deleteContact(id);
            setContacts(contacts.filter(c => c.id !== id));
        } catch (err) {
            alert('Failed to delete contact');
        }
    };

    const handleEditContact = (contact) => {
        setEditingContact(contact);
        setShowContactForm(true);
    };

    const handleAddNewContact = () => {
        setEditingContact(null);
        setShowContactForm(true);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => onNavigate('list')}
                            className="text-gray-600 hover:text-gray-800 mr-4 transition"
                        >
                            <FaArrowLeft size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
                    </div>
                    <button
                        onClick={() => onNavigate('form', customer)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        <FaEdit />
                        Edit Customer
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                        <FaUser className="text-blue-600 mt-1" size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <FaEnvelope className="text-blue-600 mt-1" size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{customer.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <FaPhone className="text-blue-600 mt-1" size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{customer.phone || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Contacts</h3>
                    <button
                        onClick={handleAddNewContact}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        <FaPlus />
                        Add Contact
                    </button>
                </div>

                {showContactForm && (
                    <ContactForm
                        contact={editingContact}
                        customerId={customer.id}
                        onSave={() => {
                            setShowContactForm(false);
                            setEditingContact(null);
                            loadContacts();
                        }}
                        onCancel={() => {
                            setShowContactForm(false);
                            setEditingContact(null);
                        }}
                    />
                )}

                {loading ? (
                    <div className="text-center py-8 text-gray-600">Loading contacts...</div>
                ) : contacts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No contacts yet. Add the first contact!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{contact.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{contact.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            <div className="flex items-center">
                                                <FaBriefcase className="text-gray-400 mr-2" />
                                                {contact.role || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleEditContact(contact)}
                                                className="text-green-600 hover:text-green-800 mr-3 transition"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteContact(contact.id)}
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
                )}
            </div>
        </div>
    );
}
