import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Magnet from '../components/Magnet';

// Mock fetch
global.fetch = vi.fn();

describe('Magnet Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('is initially hidden', () => {
        render(<Magnet />);
        expect(screen.queryByText(/EVO™ RESEARCH PROTOCOL/i)).not.toBeInTheDocument();
    });

    it('becomes visible after 5 seconds', () => {
        render(<Magnet />);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.getByText(/EVO™ RESEARCH PROTOCOL/i)).toBeInTheDocument();
    });

    it('stays hidden if evo_magnet_seen is set in localStorage', () => {
        localStorage.setItem('evo_magnet_seen', 'true');
        render(<Magnet />);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.queryByText(/EVO™ RESEARCH PROTOCOL/i)).not.toBeInTheDocument();
    });

    it('can be dismissed and sets localStorage', () => {
        render(<Magnet />);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        const closeButton = screen.getByRole('button', { name: '' }); // The X button doesn't have an aria-label in current implementation, but it's the first button
        fireEvent.click(closeButton);

        expect(screen.queryByText(/EVO™ RESEARCH PROTOCOL/i)).not.toBeInTheDocument();
        expect(localStorage.getItem('evo_magnet_seen')).toBe('true');
    });

    it('handles successful subscription', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Success' }),
        });

        render(<Magnet />);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        // Switch to real timers for the fetch part to avoid waitFor/timer conflicts
        vi.useRealTimers();

        const emailInput = screen.getByPlaceholderText(/Enter Research Email/i);
        const submitButton = screen.getByText(/DOWNLOAD PROTOCOL/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);

        expect(screen.getByText(/TRANSMITTING.../i)).toBeInTheDocument();

        expect(await screen.findByText(/PROTOCOL TRANSMITTED/i)).toBeInTheDocument();
        expect(localStorage.getItem('evo_magnet_seen')).toBe('true');
    });

    it('handles subscription error', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        render(<Magnet />);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        // Switch to real timers for the fetch part
        vi.useRealTimers();

        const emailInput = screen.getByPlaceholderText(/Enter Research Email/i);
        const submitButton = screen.getByText(/DOWNLOAD PROTOCOL/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/Connection failed/i)).toBeInTheDocument();
    });
});
