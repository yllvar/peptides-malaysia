/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../../../pages/admin/Dashboard';
import { renderWithRouter } from '../../helpers';
import { useAuthStore } from '../../../src/stores/authStore';

// Mock dependencies
vi.mock('../../../src/stores/authStore', () => ({
    useAuthStore: vi.fn()
}));

vi.mock('../../../components/admin/AdminLayout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('Admin Dashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default auth store mock
        (useAuthStore as any).mockReturnValue({
            user: { role: 'admin' },
            accessToken: 'mock-token',
            logout: vi.fn(),
            isAuthenticated: true
        });
    });

    it('renders loading state initially', () => {
        fetchMock.mockImplementationOnce(() => new Promise(() => { })); // Never resolves
        renderWithRouter(<AdminDashboard />);
        // Should find spinner or loading indicator
        // Since we mocked AdminLayout to just render children, verify spinner presence
        // However, spinner uses 'lucide-react' which renders SVGs. 
        // Best approach: verify loading structure or specific class
        // The component has: <div className="min-h-screen pt-32 flex items-center justify-center">
        const spinnerContainer = document.querySelector('.animate-spin');
        expect(spinnerContainer).toBeInTheDocument();
    });

    it('renders populated data correctly (Fix for "RM undefined")', async () => {
        const mockData = {
            stats: {
                totalRevenue: 580.00,
                activeOrders: 1,
                totalOrders: 5,
                lowStock: 0
            },
            recentOrders: [
                {
                    id: 'order-1',
                    orderNumber: 'EVO-123',
                    shippingName: 'Test User',
                    status: 'paid',
                    total: 580.00,
                    createdAt: new Date().toISOString()
                }
            ],
            lowStockProducts: []
        };

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        renderWithRouter(<AdminDashboard />);

        // Use findByTestId for async wait - this is robust
        expect(await screen.findByTestId('stat-revenue')).toHaveTextContent(/RM\s*580\.00/);
        expect(await screen.findByTestId('stat-active-orders')).toHaveTextContent('1');
        expect(await screen.findByTestId('stat-total-orders')).toHaveTextContent('5');

        expect(await screen.findByText('Test User')).toBeInTheDocument();
    });

    it('handles empty/null data safely (Regression Test)', async () => {
        // Simulate API returning null/undefined stats (this caused the bug earlier)
        const emptyData = {
            stats: null, // Critical: stats is null
            recentOrders: [],
            lowStockProducts: []
        };

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => emptyData
        });

        renderWithRouter(<AdminDashboard />);

        // Should render "RM 0.00" instead of crashing
        expect(await screen.findByText(/RM\s*0\.00/i)).toBeInTheDocument();
    });

    it('displays error message on API failure', async () => {
        fetchMock.mockRejectedValueOnce(new Error('Network Error'));

        renderWithRouter(<AdminDashboard />);

        await waitFor(() => {
            expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
        });
    });
});
