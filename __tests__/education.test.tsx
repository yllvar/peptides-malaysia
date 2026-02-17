import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Education from '../pages/Education';
import { renderWithRouter } from './helpers';
import { BLOG_POSTS } from '../src/constants';

vi.mock('../src/hooks/useBlogPosts', () => ({
    useBlogPosts: vi.fn(() => ({
        data: BLOG_POSTS,
        isLoading: false
    }))
}));

describe('Education Page', () => {
    const renderEducation = () => renderWithRouter(<Education />);

    it('renders the page heading', () => {
        renderEducation();
        expect(screen.getAllByText(/TECHNICAL/i)[0]).toBeDefined();
        expect(screen.getAllByText(/PRÄZISION/i)[0]).toBeDefined();
    });

    it('renders all blog posts', () => {
        renderEducation();
        BLOG_POSTS.forEach(post => {
            expect(screen.getByText(post.title)).toBeInTheDocument();
        });
    });

    it('renders the Peptide Calculator', () => {
        renderEducation();
        expect(screen.getByRole('heading', { name: /PRÄZISIONS CALCULATOR/i })).toBeDefined();
    });

    describe('Peptide Calculator', () => {
        it('shows default desired dose result', () => {
            renderEducation();
            // Default: 0.25mg dose, 5mg vial, 2ml water
            // Units = (0.25 / 2.5) * 100 = 10.0
            expect(screen.getByText('10.0')).toBeDefined();
        });

        it('updates units when vial quantity changes', async () => {
            renderEducation();
            const user = userEvent.setup();

            // Find the vial quantity input (first number input)
            const vialInput = screen.getAllByRole('spinbutton')[0];
            await user.clear(vialInput);
            await user.type(vialInput, '10');

            // 10mg / 2ml = 5.00 mg/ml
            // Dose 0.25mg -> (0.25 / 5) * 100 = 5.0 IU
            expect(screen.getByText('5.0')).toBeDefined();
        });

        it('updates units when BAC water changes', async () => {
            renderEducation();
            const user = userEvent.setup();

            // Find the BAC water input (second number input)
            const bacInput = screen.getAllByRole('spinbutton')[1];
            await user.clear(bacInput);
            await user.type(bacInput, '5');

            // 5mg / 5ml = 1.00 mg/ml
            // Dose 0.25mg -> (0.25 / 1) * 100 = 25.0 IU
            expect(screen.getByText('25.0')).toBeDefined();
        });
    });

    it('renders entry links for each blog post', () => {
        renderEducation();
        const readLinks = screen.getAllByText(/ENTER LOG/i);
        expect(readLinks.length).toBe(BLOG_POSTS.length);
    });
});
