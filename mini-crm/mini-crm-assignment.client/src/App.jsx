import React, { useState } from 'react';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import CustomerForm from './pages/CustomerForm';

export default function App() {
    const [currentView, setCurrentView] = useState('list');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const navigateTo = (view, customer = null) => {
        setCurrentView(view);
        setSelectedCustomer(customer);
        setEditingCustomer(customer);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Customer Management System</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {currentView === 'list' && <CustomerList onNavigate={navigateTo} />}
                {currentView === 'detail' && <CustomerDetail customer={selectedCustomer} onNavigate={navigateTo} />}
                {currentView === 'form' && <CustomerForm customer={editingCustomer} onNavigate={navigateTo} />}
            </main>
        </div>
    );
}
