import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BlogPost from '../pages/BlogPost';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
});

const mockPosts = [
    {
        id: 'test-post',
        title: "Test Scientific Article",
        excerpt: "The hook and excerpt.",
        content: "<p>The scientific meat.</p>",
        date: "Feb 21, 2026",
        category: "Comparison",
        readTime: "5 min",
        purityBatch: "EVO-TEST-001",
        relatedProductId: "test-product-id",
        references: [
            { label: "High-Authority Journal", url: "https://example.com/journal" }
        ],
        faqs: [
            { question: "Test Question?", answer: "Test Answer." }
        ]
    }
];

vi.mock('../src/hooks/useBlogPosts', () => ({
    useBlogPosts: vi.fn(() => ({
        data: mockPosts,
        isLoading: false,
        error: null
    }))
}));

// Mock useProducts for the CTA box
vi.mock('../src/hooks/useProducts', () => ({
    useProducts: vi.fn(() => ({
        data: [
            { id: 'test-product-id', name: 'Test Product', image: '/test.jpg', description: 'Test desc' }
        ],
        isLoading: false,
        error: null
    }))
}));

function renderBlogPost(postId: string) {
    return render(
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/blog/${postId}`]}>
                    <Routes>
                        <Route path="/blog/:id" element={<BlogPost />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        </HelmetProvider>
    );
}

describe('BlogPost Framework rendering', () => {
    it('renders the 5-step framework elements', () => {
        renderBlogPost('test-post');

        // 1. Hook/Meat
        expect(screen.getByText(/The scientific meat/)).toBeInTheDocument();

        // 2. Trust Factor (Batch & Purity)
        expect(screen.getByText('Batch #EVO-TEST-001')).toBeInTheDocument();
        expect(screen.getByText(/HPLC Verified/)).toBeInTheDocument();

        // 3. The Kit (CTA Box)
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText(/Research Protocol Essential/i)).toBeInTheDocument();

        // 4. FAQ Section
        expect(screen.getByText('Test Question?')).toBeInTheDocument();
        expect(screen.getByText('Test Answer.')).toBeInTheDocument();

        // 5. References
        const refLink = screen.getByText('High-Authority Journal');
        expect(refLink).toBeInTheDocument();
        expect(refLink.closest('a')).toHaveAttribute('href', 'https://example.com/journal');
    });
});
