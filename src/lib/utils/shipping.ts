export function getShippingZone(postcode: string): 'A' | 'B' | 'C' {
    const code = parseInt(postcode, 10);
    if (isNaN(code)) return 'B'; // Default to B if invalid

    // KL & Selangor postcodes: 40000-68100
    if (code >= 40000 && code <= 68100) return 'A';

    // Sabah: 88000-91999, Sarawak: 93000-98999
    if ((code >= 88000 && code <= 91999) || (code >= 93000 && code <= 98999)) return 'C';

    // Everything else in Peninsular Malaysia
    return 'B';
}

export function calculateShippingCost(postcode: string, subtotal: number): number {
    if (subtotal >= 300) return 0; // Free shipping for orders >= RM300

    const zone = getShippingZone(postcode);
    switch (zone) {
        case 'A': return 8;
        case 'B': return 12;
        case 'C': return 18;
        default: return 12;
    }
}
