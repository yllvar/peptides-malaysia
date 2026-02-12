import { describe, it, expect } from 'vitest';
import { getShippingZone, calculateShippingCost } from '../../src/lib/utils/shipping';

describe('Shipping Utilities', () => {
    describe('getShippingZone', () => {
        const testCases = [
            { postcode: '40000', expected: 'A' }, // KL/Selangor start
            { postcode: '68100', expected: 'A' }, // KL/Selangor end
            { postcode: '39999', expected: 'B' }, // Below Zone A
            { postcode: '68101', expected: 'B' }, // Above Zone A
            { postcode: '70000', expected: 'B' }, // Peninsular Malaysia
            { postcode: '88000', expected: 'C' }, // Sabah start
            { postcode: '91999', expected: 'C' }, // Sabah end
            { postcode: '92000', expected: 'B' }, // Gap (technically B by default logic)
            { postcode: '93000', expected: 'C' }, // Sarawak start
            { postcode: '98999', expected: 'C' }, // Sarawak end
            { postcode: '99000', expected: 'B' }, // Above Sarawak
            { postcode: 'abc', expected: 'B' },   // Invalid
            { postcode: '', expected: 'B' },      // Empty
            { postcode: '01000', expected: 'B' }  // Leading zero (parsed as 1000 => B)
        ];

        testCases.forEach(({ postcode, expected }) => {
            it(`should return Zone ${expected} for postcode ${postcode}`, () => {
                expect(getShippingZone(postcode)).toBe(expected);
            });
        });
    });

    describe('calculateShippingCost', () => {
        // Zone A: RM8, Zone B: RM12, Zone C: RM18. Free >= RM300
        const testCases = [
            { postcode: '40000', subtotal: 100, expected: 8 },    // Zone A
            { postcode: '70000', subtotal: 100, expected: 12 },   // Zone B
            { postcode: '90000', subtotal: 100, expected: 18 },   // Zone C
            { postcode: '90000', subtotal: 300, expected: 0 },    // Free exact
            { postcode: '90000', subtotal: 500, expected: 0 },    // Free above
            { postcode: '90000', subtotal: 299.99, expected: 18 },// Not free
            { postcode: '40000', subtotal: 0, expected: 8 },      // Zero subtotal
        ];

        testCases.forEach(({ postcode, subtotal, expected }) => {
            it(`should return RM${expected} for postcode ${postcode} and subtotal ${subtotal}`, () => {
                expect(calculateShippingCost(postcode, subtotal)).toBe(expected);
            });
        });
    });
});
