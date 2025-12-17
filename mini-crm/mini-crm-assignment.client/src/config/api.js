export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Replace with your actual API URL

export const api = {
    // Customer endpoints
    getCustomers: async () => {
        const response = await fetch(`${API_BASE_URL}/customers`);
        if (!response.ok) throw new Error('Failed to fetch customers');
        return await response.json();
    },

    getCustomer: async (id) => {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`);
        if (!response.ok) throw new Error('Failed to fetch customer');
        return await response.json();
    },

    createCustomer: async (data) => {
        const response = await fetch(`${API_BASE_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create customer');
        return await response.json();
    },

    updateCustomer: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update customer');
        if (response.status !== 204) return await response.json();
    },

    deleteCustomer: async (id) => {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete customer');
        return true;
    },

    // Contact endpoints - FIXED: Properly filter by customerId
    getContactsByCustomerId: async (customerId) => {
        const response = await fetch(`${API_BASE_URL}/contacts?customerId=${customerId}`);
        if (!response.ok) throw new Error('Failed to fetch contacts');
        return await response.json();
    },

    createContact: async (data) => {
        const response = await fetch(`${API_BASE_URL}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create contact');
        return await response.json();
    },

    updateContact: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update contact');
        if (response.status !== 204) return await response.json();
    },

    deleteContact: async (id) => {
        const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete contact');
        return true;
    }
};
