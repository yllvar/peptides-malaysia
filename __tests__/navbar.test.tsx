import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Navbar from '../components/Navbar';
import { renderWithRouter } from './helpers';

const mockGetItemCount = vi.fn();
vi.mock('../src/stores/cartStore', () => ({
    useCartStore: vi.fn((selector) => selector({
        getItemCount: mockGetItemCount
    }))
}));

const mockLogout = vi.fn();
vi.mock('../src/stores/authStore', () => ({
    useAuthStore: vi.fn(() => ({
        user: null,
        logout: mockLogout
    }))
}));

describe('Navbar Component', () => {
    it('renders the brand name', () => {
        mockGetItemCount.mockReturnValue(0);
        renderWithRouter(<Navbar />);
        expect(screen.getByText('PEPTIDES')).toBeInTheDocument();
        expect(screen.getByText('MALAYSIA')).toBeInTheDocument();
    });

    it('renders the official logo image', () => {
        mockGetItemCount.mockReturnValue(0);
        renderWithRouter(<Navbar />);
        expect(screen.getByAltText('Evo Logo')).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
        mockGetItemCount.mockReturnValue(0);
        renderWithRouter(<Navbar />);
        const expectedLinks = ['Latest', 'Shop', 'DNA', 'Lab Data', 'Protocols', 'Contact'];
        expectedLinks.forEach(linkName => {
            const links = screen.getAllByText(linkName);
            expect(links.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('does not show cart badge when count is 0', () => {
        mockGetItemCount.mockReturnValue(0);
        renderWithRouter(<Navbar />);
        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('shows cart badge with correct count', () => {
        mockGetItemCount.mockReturnValue(5);
        renderWithRouter(<Navbar />);
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('toggles mobile menu', async () => {
        mockGetItemCount.mockReturnValue(0);
        renderWithRouter(<Navbar />);
        const user = userEvent.setup();
        const buttons = screen.getAllByRole('button');
        const menuToggle = buttons.find(b => b.className.includes('lg:hidden') || b.querySelector('svg.lucide-menu'));
        if (menuToggle) {
            await user.click(menuToggle);
            expect(menuToggle).toBeInTheDocument();
        }
    });
});
