import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Contact from '../pages/Contact';
import { renderWithRouter } from './helpers';
import { WHATSAPP_NUMBER } from '../constants';

describe('Contact Page', () => {
    const renderContact = () => renderWithRouter(<Contact />);

    it('renders the page heading', () => {
        renderContact();
        expect(screen.getByText('GET IN TOUCH')).toBeInTheDocument();
    });

    it('renders WhatsApp support channel', () => {
        renderContact();
        expect(screen.getByText('WhatsApp (Fastest)')).toBeInTheDocument();
    });

    it('renders the contact form', () => {
        renderContact();
        expect(screen.getByText('Send a Message')).toBeInTheDocument();
        expect(screen.getByText('SEND MESSAGE')).toBeInTheDocument();
    });

    it('renders all form fields', () => {
        renderContact();
        expect(screen.getByText('First Name')).toBeInTheDocument();
        expect(screen.getByText('Last Name')).toBeInTheDocument();
        expect(screen.getByText('Email Address')).toBeInTheDocument();
        expect(screen.getByText('Inquiry Type')).toBeInTheDocument();
        expect(screen.getByText('Message')).toBeInTheDocument();
    });

    it('renders inquiry type dropdown options', () => {
        renderContact();
        expect(screen.getByText('Product Question')).toBeInTheDocument();
        expect(screen.getByText('Order Status')).toBeInTheDocument();
        expect(screen.getByText('Bulk/Wholesale')).toBeInTheDocument();
    });

    it('opens WhatsApp when form is submitted', async () => {
        renderContact();
        const user = userEvent.setup();

        // Fill the form using direct DOM queries for reliability
        const firstNameInput = document.querySelector('input[name="firstName"]') as HTMLInputElement;
        const lastNameInput = document.querySelector('input[name="lastName"]') as HTMLInputElement;
        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
        const messageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;

        await user.type(firstNameInput, 'John');
        await user.type(lastNameInput, 'Doe');
        await user.type(emailInput, 'john@test.com');
        await user.type(messageTextarea, 'Test message content');

        const submitBtn = screen.getByText('SEND MESSAGE');
        await user.click(submitBtn);

        expect(window.open).toHaveBeenCalled();
        const calledUrl = (window.open as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
        expect(calledUrl).toContain(`https://wa.me/${WHATSAPP_NUMBER}`);
        expect(calledUrl).toContain('John');
        expect(calledUrl).toContain('Doe');
    });

    it('displays email and location info', () => {
        renderContact();
        expect(screen.getByText('support@peptidesmalaysia.com')).toBeInTheDocument();
        const locationElements = screen.getAllByText('Kuala Lumpur, Malaysia');
        expect(locationElements.length).toBeGreaterThanOrEqual(1);
    });
});
