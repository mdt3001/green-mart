import { inngest } from "./client";
import axios from "axios";

// Base URL for your Laravel backend API
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';

export const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-create' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        try {
            const response = await axios.post(`${BACKEND_API_URL}/api/v1/users`, {
                id: event.data.id,
                email_addresses: event.data.email_addresses,
                first_name: event.data.first_name,
                last_name: event.data.last_name,
                image_url: event.data.image_url,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('User created successfully:', response.data);

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creating user:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to create user: ${error.response?.statusText || error.message}`);
            }
            throw error;
        }
    }
);

export const syncUserUpdate = inngest.createFunction(
    { id: 'sync-user-update' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        try {
            const response = await axios.put(`${BACKEND_API_URL}/api/v1/users/${event.data.id}`, {
                email_addresses: event.data.email_addresses,
                first_name: event.data.first_name,
                last_name: event.data.last_name,
                image_url: event.data.image_url,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('User updated successfully:', response.data);

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error updating user:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to update user: ${error.response?.statusText || error.message}`);
            }
            throw error;
        }
    }
);

export const syncUserDeletion = inngest.createFunction(
    { id: 'sync-user-delete' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        try {
            const response = await axios.delete(`${BACKEND_API_URL}/api/v1/users/${event.data.id}`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            console.log('User deleted successfully:', response.data);

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error deleting user:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to delete user: ${error.response?.statusText || error.message}`);
            }
            throw error;
        }
    }
);