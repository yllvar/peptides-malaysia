/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminOrders from '../../../pages/admin/Orders';
import { renderWithRouter } from '../../helpers';
import { useAuthStore } from '../../../src/stores/authStore';

// Mock auth
vi.mock('../../../src/stores/authStore', () => ({
    useAuthStore: vi.fn()
}));

// Mock layout
vi.mock('../../../components/admin/AdminLayout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('Admin Orders Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuthStore as any).mockReturnValue({
            user: { role: 'admin' },
            accessToken: 'token',
            logout: vi.fn(),
            isAuthenticated: true
        });
    });

    const mockOrders = [
        {
            id: 'ord-123',
            orderNumber: 'EVO-123',
            status: 'pending',
            total: 150,
            createdAt: new Date().toISOString(),
            shippingName: 'John Doe',
            shippingPhone: '1234567890',
            shippingAddress: '123 St',
            shippingCity: 'KL',
            shippingPostcode: '50000',
            trackingNumber: null,
            courier: null,
            user: { fullName: 'John Doe', email: 'john@example.com' },
            items: [
                { id: 'item-1', productName: 'Peptide A', productPrice: 150, quantity: 1, lineTotal: 150 }
            ]
        },
        {
            id: 'ord-456',
            orderNumber: 'EVO-456',
            status: 'paid',
            total: 300,
            createdAt: new Date().toISOString(),
            shippingName: 'Jane Smith',
            shippingPhone: '0987654321',
            shippingAddress: '456 Ave',
            shippingCity: 'JB',
            shippingPostcode: '80000',
            trackingNumber: 'TRK123',
            courier: 'J&T',
            user: { fullName: 'Jane Smith', email: 'jane@example.com' },
            items: [
                { id: 'item-2', productName: 'Peptide B', productPrice: 300, quantity: 1, lineTotal: 300 }
            ]
        }
    ];

    it('renders loading state initially', () => {
        fetchMock.mockImplementationOnce(() => new Promise(() => { })); // Never resolves
        renderWithRouter(<AdminOrders />);
        expect(screen.getByTestId('orders-loading')).toBeInTheDocument();
    });

    it('renders orders list correctly', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => mockOrders
        });

        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByText('EVO-123')).toBeInTheDocument();
            expect(screen.getByText('EVO-456')).toBeInTheDocument();
        });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('RM 150.00')).toBeInTheDocument();
    });

    it('filters orders by search term', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => mockOrders
        });

        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByText('EVO-123')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/Search order number/i);
        fireEvent.change(searchInput, { target: { value: 'EVO-456' } });

        await waitFor(() => {
            expect(screen.queryByText('EVO-123')).not.toBeInTheDocument();
            expect(screen.getByText('EVO-456')).toBeInTheDocument();
        });
    });

    it('filters orders by status', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => mockOrders
        });

        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByText('EVO-123')).toBeInTheDocument(); // pending
            expect(screen.getByText('EVO-456')).toBeInTheDocument(); // paid
        });

        // Use regex for select or display value? Select by display text "All Status" probably works for option, 
        // but finding the select element is better via combobox role or query selector if simpler.
        // Let's assume finding by display value of default option might be tricky if it's rendered as select.
        // Use container query or label logic if accessible. Here we don't have label, just select.
        // Using role 'combobox' might work if only one select.
        // Or find specifically by the options.

        // Actually, just finding by value (fireEvent.change) is easier if we target the element.
        // The select has "All Status" option.
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'paid' } });

        await waitFor(() => {
            expect(screen.queryByText('EVO-123')).not.toBeInTheDocument();
            expect(screen.getByText('EVO-456')).toBeInTheDocument();
        });
    });

    it('shows order details when clicked', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => mockOrders
        });

        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByTestId('order-item-EVO-123')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('order-item-EVO-123'));

        await waitFor(() => {
            expect(screen.getByTestId('order-details-panel')).toBeInTheDocument();
            expect(screen.getByText('Order Details')).toBeInTheDocument();
            expect(screen.getByText('123 St, KL, 50000')).toBeInTheDocument(); // Check address rendering
            expect(screen.getByText('Peptide A')).toBeInTheDocument(); // Check items rendering
        });
    });

    it('handles error state', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => ({ error: 'Server Error' })
        });

        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByTestId('orders-error')).toBeInTheDocument();
            expect(screen.getByText('Server Error')).toBeInTheDocument();
        });
    });
});
