import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import NotFound from '../pages/NotFound';
import LabTesting from '../pages/LabTesting';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import { renderWithRouter } from './helpers';
import { COA_DATA, WHATSAPP_NUMBER } from '../src/constants';

describe('Static Pages', () => {

    describe('NotFound (404)', () => {
        it('renders the 404 heading', () => {
            renderWithRouter(<NotFound />);
            expect(screen.getByText('404')).toBeInTheDocument();
        });

        it('renders helpful messaging', () => {
            renderWithRouter(<NotFound />);
            expect(screen.getByText('Protocol Path Missing')).toBeInTheDocument();
        });

        it('has a link back to home', () => {
            renderWithRouter(<NotFound />);
            expect(screen.getByText('RETURN TO BASE')).toBeInTheDocument();
        });
    });

    describe('Lab Testing Page', () => {
        it('renders the page heading', () => {
            renderWithRouter(<LabTesting />);
            expect(screen.getByText(/Evo.*Grade Purity/i)).toBeInTheDocument();
        });

        it('renders all COA entries', () => {
            renderWithRouter(<LabTesting />);
            COA_DATA.forEach(coa => {
                expect(screen.getByText(coa.productName)).toBeInTheDocument();
            });
        });

        it('shows Request PDF buttons for each entry', () => {
            renderWithRouter(<LabTesting />);
            const requestButtons = screen.getAllByText('Request PDF');
            expect(requestButtons.length).toBe(COA_DATA.length);
        });
    });

    describe('Privacy Page', () => {
        it('renders the privacy policy heading', () => {
            renderWithRouter(<Privacy />);
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('PRIVACY POLICY');
        });

        it('renders data collection section', () => {
            renderWithRouter(<Privacy />);
            expect(screen.getByText(/1\. Data Collection/)).toBeInTheDocument();
        });
    });

    describe('Terms Page', () => {
        it('renders the terms heading', () => {
            renderWithRouter(<Terms />);
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('TERMS OF SERVICE');
        });

        it('renders the critical warning', () => {
            renderWithRouter(<Terms />);
            expect(screen.getByText('Critical Warning')).toBeInTheDocument();
        });

        it('renders the research-only warning', () => {
            renderWithRouter(<Terms />);
            expect(screen.getByText(/LABORATORY RESEARCH USE ONLY/)).toBeInTheDocument();
        });
    });
});
