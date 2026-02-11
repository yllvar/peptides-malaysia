import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Education from '../pages/Education';
import { renderWithRouter } from './helpers';
import { BLOG_POSTS } from '../constants';

describe('Education Page', () => {
    const renderEducation = () => renderWithRouter(<Education />);

    it('renders the page heading', () => {
        renderEducation();
        expect(screen.getByText('EDUCATION HUB')).toBeInTheDocument();
    });

    it('renders all blog posts', () => {
        renderEducation();
        BLOG_POSTS.forEach(post => {
            expect(screen.getByText(post.title)).toBeInTheDocument();
            expect(screen.getByText(post.excerpt)).toBeInTheDocument();
        });
    });

    it('renders the Peptide Calculator', () => {
        renderEducation();
        expect(screen.getByText('Peptide Calculator')).toBeInTheDocument();
    });

    describe('Peptide Calculator', () => {
        it('shows default concentration (5mg / 2ml = 2.50 mg/ml)', () => {
            renderEducation();
            expect(screen.getByText('2.50')).toBeInTheDocument();
        });

        it('shows default desired dose result', () => {
            renderEducation();
            // Default: 0.25mg dose, 2.50 mg/ml concentration
            // Units = (0.25 / 2.5) * 100 = 10.0
            expect(screen.getByText('10.0')).toBeInTheDocument();
        });

        it('updates concentration when vial quantity changes', async () => {
            renderEducation();
            const user = userEvent.setup();

            // Find the vial quantity input (first number input)
            const vialInput = screen.getAllByRole('spinbutton')[0];
            await user.clear(vialInput);
            await user.type(vialInput, '10');

            // 10mg / 2ml = 5.00 mg/ml
            expect(screen.getByText('5.00')).toBeInTheDocument();
        });

        it('updates units when BAC water changes', async () => {
            renderEducation();
            const user = userEvent.setup();

            // Find the BAC water input (second number input)
            const bacInput = screen.getAllByRole('spinbutton')[1];
            await user.clear(bacInput);
            await user.type(bacInput, '5');

            // 5mg / 5ml = 1.00 mg/ml
            expect(screen.getByText('1.00')).toBeInTheDocument();
        });
    });

    it('renders "Read Protocol" links for each blog post', () => {
        renderEducation();
        const readLinks = screen.getAllByText('Read Protocol');
        expect(readLinks.length).toBe(BLOG_POSTS.length);
    });
});
