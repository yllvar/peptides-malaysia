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
// Mock window.confirm for Phase 3 backward-status tests
global.confirm = vi.fn();


const paginatedResponse = (orders: any[], hasMore = false, nextCursor: string | null = null) => ({
    ok: true,
    json: async () => ({ orders, nextCursor, hasMore })
});

describe('Admin Orders Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers(); // Ensure real timers
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
            orderNumber: 'EVO-A1B2C3D4',
            status: 'pending',
            total: 150,
            createdAt: '2026-02-19T00:00:00.000Z',
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
            orderNumber: 'EVO-E5F6G7H8',
            status: 'paid',
            total: 300,
            createdAt: '2026-02-19T00:00:00.000Z',
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

    it('renders loading state initially', async () => {
        // Even with a resolved promise, the debounce (300ms) means 
        // the component stays in loading state initially
        fetchMock.mockResolvedValue(paginatedResponse(mockOrders));
        renderWithRouter(<AdminOrders />);
        expect(screen.getByTestId('orders-loading')).toBeInTheDocument();

        // Wait for it to finish so we don't leave pending state
        await waitFor(() => {
            expect(screen.queryByTestId('orders-loading')).not.toBeInTheDocument();
        }, { timeout: 2000 });
    });

    it('renders orders list correctly', async () => {
        fetchMock.mockResolvedValue(paginatedResponse(mockOrders));
        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByText('EVO-A1B2C3D4')).toBeInTheDocument();
        }, { timeout: 2000 });

        expect(screen.getByText('EVO-E5F6G7H8')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('RM 150.00')).toBeInTheDocument();
    });

    it('sends search term as server-side query param', async () => {
        fetchMock.mockResolvedValue(paginatedResponse(mockOrders));
        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByText('EVO-A1B2C3D4')).toBeInTheDocument();
        });

        // Test search interaction
        fetchMock.mockResolvedValue(paginatedResponse([mockOrders[1]]));
        const searchInput = screen.getByPlaceholderText(/Search order number/i);
        fireEvent.change(searchInput, { target: { value: 'EVO-E5F6' } });

        await waitFor(() => {
            // Check the most recent call
            const calls = fetchMock.mock.calls;
            const lastCallArgs = calls[calls.length - 1];
            expect(lastCallArgs[0]).toContain('search=EVO-E5F6');
        }, { timeout: 2000 });
    });

    it('sends status filter as server-side query param', async () => {
        fetchMock.mockResolvedValue(paginatedResponse(mockOrders));
        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByText('EVO-A1B2C3D4')).toBeInTheDocument();
        });

        fetchMock.mockResolvedValue(paginatedResponse([mockOrders[1]]));
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'paid' } });

        await waitFor(() => {
            const calls = fetchMock.mock.calls;
            const lastCallArgs = calls[calls.length - 1];
            expect(lastCallArgs[0]).toContain('status=paid');
        }, { timeout: 2000 });
    });

    it('shows order details when clicked', async () => {
        fetchMock.mockResolvedValue(paginatedResponse(mockOrders));
        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByTestId('order-item-EVO-A1B2C3D4')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('order-item-EVO-A1B2C3D4'));

        await waitFor(() => {
            expect(screen.getByTestId('order-details-panel')).toBeInTheDocument();
        });

        expect(screen.getByText('Order Details')).toBeInTheDocument();
        expect(screen.getByText('123 St, KL, 50000')).toBeInTheDocument();
        expect(screen.getByText('Peptide A')).toBeInTheDocument();
    });

    it('shows Load More button when hasMore is true', async () => {
        fetchMock.mockResolvedValue(paginatedResponse(mockOrders, true, 'ord-456'));
        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByTestId('load-more-btn')).toBeInTheDocument();
        });
        expect(screen.getByText('Load More Orders')).toBeInTheDocument();
    });

    it('hides Load More button when hasMore is false', async () => {
        fetchMock.mockResolvedValue(paginatedResponse(mockOrders, false));
        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByText('EVO-A1B2C3D4')).toBeInTheDocument();
        });

        expect(screen.queryByTestId('load-more-btn')).not.toBeInTheDocument();
    });

    it('handles error state', async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({ error: 'Server Error' })
        });
        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByTestId('orders-error')).toBeInTheDocument();
        }, { timeout: 2000 });

        expect(screen.getByText('Server Error')).toBeInTheDocument();
    });


    it('enforces fulfillment details before marking as shipped — button is disabled when inputs empty', async () => {
        fetchMock.mockResolvedValue(paginatedResponse(mockOrders));
        renderWithRouter(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByTestId('order-item-EVO-A1B2C3D4')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId('order-item-EVO-A1B2C3D4'));

        await waitFor(() => {
            expect(screen.getByText('Mark as Shipped')).toBeInTheDocument();
        });

        // Button must be disabled when courier/tracking are empty
        const shipBtn = screen.getByText('Mark as Shipped');
        expect(shipBtn).toBeDisabled();

        // Fill details — button should become enabled
        const courierInput = screen.getByPlaceholderText(/Courier/i);
        const trackingInput = screen.getByPlaceholderText(/Tracking Number/i);

        fireEvent.change(courierInput, { target: { value: 'J&T' } });
        fireEvent.change(trackingInput, { target: { value: 'TRACK123' } });

        await waitFor(() => expect(shipBtn).not.toBeDisabled());

        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'ord-123', status: 'shipped' }) });
        fireEvent.click(shipBtn);

        await waitFor(() => {
            const patchCall = fetchMock.mock.calls.find(c => c[1]?.method === 'PATCH');
            expect(patchCall).toBeTruthy();
            if (patchCall) {
                const body = JSON.parse(patchCall[1].body as string);
                expect(body).toMatchObject({
                    orderId: 'ord-123',
                    status: 'shipped',
                    trackingNumber: 'TRACK123',
                    courier: 'J&T'
                });
            }
        });
    });

    it('shows confirmation dialog before backward status change and proceeds if confirmed', async () => {
        const deliveredOrder = { ...mockOrders[0], status: 'delivered' };
        fetchMock.mockResolvedValue(paginatedResponse([deliveredOrder]));
        renderWithRouter(<AdminOrders />);

        await waitFor(() => screen.getByTestId('order-item-EVO-A1B2C3D4'));
        fireEvent.click(screen.getByTestId('order-item-EVO-A1B2C3D4'));

        await waitFor(() => screen.getByText('Update Tracking Info'));

        // Admin confirms the backward-status dialog
        (global.confirm as any).mockReturnValue(true);
        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'ord-123', status: 'paid' }) });

        fireEvent.click(screen.getByRole('button', { name: /^paid$/i }));

        expect(global.confirm).toHaveBeenCalledWith(expect.stringContaining('DELIVERED'));
        await waitFor(() => {
            const patchCall = fetchMock.mock.calls.find(c => c[1]?.method === 'PATCH');
            expect(patchCall).toBeTruthy();
            expect(JSON.parse(patchCall![1].body)).toMatchObject({ status: 'paid' });
        });
    });

    it('cancels backward status change if admin dismisses the confirmation', async () => {
        const deliveredOrder = { ...mockOrders[0], status: 'delivered' };
        fetchMock.mockResolvedValue(paginatedResponse([deliveredOrder]));
        renderWithRouter(<AdminOrders />);

        await waitFor(() => screen.getByTestId('order-item-EVO-A1B2C3D4'));
        fireEvent.click(screen.getByTestId('order-item-EVO-A1B2C3D4'));

        await waitFor(() => screen.getByText('Update Tracking Info'));

        // Admin dismisses the dialog
        (global.confirm as any).mockReturnValue(false);
        const callCountBefore = fetchMock.mock.calls.filter(c => c[1]?.method === 'PATCH').length;

        fireEvent.click(screen.getByRole('button', { name: /^paid$/i }));

        expect(global.confirm).toHaveBeenCalledWith(expect.stringContaining('DELIVERED'));
        // No PATCH should have been fired
        const callCountAfter = fetchMock.mock.calls.filter(c => c[1]?.method === 'PATCH').length;
        expect(callCountAfter).toBe(callCountBefore);
    });
});
