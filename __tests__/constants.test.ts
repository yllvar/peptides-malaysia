import { describe, it, expect } from 'vitest';
import { PRODUCTS, BLOG_POSTS, COA_DATA, WHATSAPP_NUMBER, CURRENCY } from '../src/constants';

describe('Constants & Data Integrity', () => {

    describe('WHATSAPP_NUMBER', () => {
        it('is a non-empty string', () => {
            expect(WHATSAPP_NUMBER).toBeTruthy();
            expect(typeof WHATSAPP_NUMBER).toBe('string');
        });

        it('starts with Malaysia country code 60', () => {
            expect(WHATSAPP_NUMBER).toMatch(/^60/);
        });

        it('has a valid Malaysian phone length (11-13 digits)', () => {
            expect(WHATSAPP_NUMBER.length).toBeGreaterThanOrEqual(11);
            expect(WHATSAPP_NUMBER.length).toBeLessThanOrEqual(13);
        });

        it('contains only digits', () => {
            expect(WHATSAPP_NUMBER).toMatch(/^\d+$/);
        });
    });

    describe('CURRENCY', () => {
        it('is set to MYR (RM)', () => {
            expect(CURRENCY).toBe('RM');
        });
    });

    describe('PRODUCTS', () => {
        it('has at least 6 products', () => {
            expect(PRODUCTS.length).toBeGreaterThanOrEqual(6);
        });

        it('every product has required fields', () => {
            PRODUCTS.forEach(product => {
                expect(product.id).toBeTruthy();
                expect(product.name).toBeTruthy();
                expect(product.price).toBeGreaterThan(0);
                expect(product.category).toBeTruthy();
                expect(product.description).toBeTruthy();
                expect(product.image).toBeTruthy();
                expect(typeof product.inStock).toBe('boolean');
                expect(Array.isArray(product.features)).toBe(true);
                expect(product.features.length).toBeGreaterThan(0);
            });
        });

        it('has unique product IDs', () => {
            const ids = PRODUCTS.map(p => p.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });

        it('has valid categories', () => {
            const validCategories = ['Weight Management', 'Recovery', 'Performance', 'Essentials', 'Anti-Aging', 'Bundles'];
            PRODUCTS.forEach(product => {
                expect(validCategories).toContain(product.category);
            });
        });

        it('uses local images (not external URLs)', () => {
            PRODUCTS.forEach(product => {
                expect(product.image).toMatch(/^\/images\//);
            });
        });

        it('has at least one product per important category', () => {
            const categories = new Set(PRODUCTS.map(p => p.category));
            expect(categories.has('Weight Management')).toBe(true);
            expect(categories.has('Recovery')).toBe(true);
            expect(categories.has('Essentials')).toBe(true);
        });

        it('has products marked as isNew', () => {
            const newProducts = PRODUCTS.filter(p => p.isNew);
            expect(newProducts.length).toBeGreaterThan(0);
        });

        it('has at least one product with a badge', () => {
            const badgeProducts = PRODUCTS.filter(p => p.badge);
            expect(badgeProducts.length).toBeGreaterThan(0);
        });
    });

    describe('BLOG_POSTS', () => {
        it('has at least 3 blog posts', () => {
            expect(BLOG_POSTS.length).toBeGreaterThanOrEqual(3);
        });

        it('every blog post has required fields', () => {
            BLOG_POSTS.forEach(post => {
                expect(post.id).toBeTruthy();
                expect(post.title).toBeTruthy();
                expect(post.excerpt).toBeTruthy();
                expect(post.content).toBeTruthy();
                expect(post.date).toBeTruthy();
                expect(post.category).toBeTruthy();
                expect(post.readTime).toBeTruthy();
            });
        });

        it('has unique blog post IDs', () => {
            const ids = BLOG_POSTS.map(p => p.id);
            expect(new Set(ids).size).toBe(ids.length);
        });
    });

    describe('COA_DATA', () => {
        it('has at least 3 COA entries', () => {
            expect(COA_DATA.length).toBeGreaterThanOrEqual(3);
        });

        it('every COA entry has required fields', () => {
            COA_DATA.forEach(coa => {
                expect(coa.id).toBeTruthy();
                expect(coa.productName).toBeTruthy();
                expect(coa.batchNumber).toBeTruthy();
                expect(coa.purity).toBeTruthy();
                expect(coa.date).toBeTruthy();
            });
        });

        it('batch numbers follow EVO-XX-XXXX pattern', () => {
            COA_DATA.forEach(coa => {
                expect(coa.batchNumber).toMatch(/^EVO-[A-Z]{2}-\d{4}$/);
            });
        });

        it('purity values are above 99%', () => {
            COA_DATA.forEach(coa => {
                const purityNum = parseFloat(coa.purity);
                expect(purityNum).toBeGreaterThanOrEqual(99);
            });
        });
    });
});
