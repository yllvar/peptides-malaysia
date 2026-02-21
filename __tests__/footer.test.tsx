import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Footer from '../components/Footer';
import { renderWithRouter } from './helpers';

describe('Footer Component', () => {
    it('renders the brand name', () => {
        renderWithRouter(<Footer />);
        expect(screen.getByText('EVO')).toBeInTheDocument();
        expect(screen.getByText('PEPTIDES')).toBeInTheDocument();
    });

    it('renders the legal disclaimer', () => {
        renderWithRouter(<Footer />);
        expect(screen.getByText('Legal Disclaimer')).toBeInTheDocument();
        expect(screen.getByText(/strictly for in-vitro laboratory research/i)).toBeInTheDocument();
    });

    it('renders shop links', () => {
        renderWithRouter(<Footer />);
        expect(screen.getByText('All Products')).toBeInTheDocument();
        expect(screen.getByText('Weight Management')).toBeInTheDocument();
        expect(screen.getByText('Recovery')).toBeInTheDocument();
    });

    it('renders support links', () => {
        renderWithRouter(<Footer />);
        expect(screen.getByText('Contact Us')).toBeInTheDocument();
        expect(screen.getByText('Lab Reports (COA)')).toBeInTheDocument();
        expect(screen.getByText('Research Protocols & Blog')).toBeInTheDocument();
    });

    it('renders privacy and terms links', () => {
        renderWithRouter(<Footer />);
        expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
        expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    it('renders the current year in copyright', () => {
        renderWithRouter(<Footer />);
        const currentYear = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
    });

    it('renders the location', () => {
        renderWithRouter(<Footer />);
        expect(screen.getByText('Kuala Lumpur, Malaysia')).toBeInTheDocument();
    });
});
