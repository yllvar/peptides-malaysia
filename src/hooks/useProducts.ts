import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.map((p: any) => ({
                ...p,
                image: p.imageUrl,
                price: typeof p.price === 'string' ? parseFloat(p.price) : Number(p.price),
                // Map first tech spec to match UI expected format if exists
                techSpec: p.techSpecs?.[0] ? {
                    ...p.techSpecs[0],
                    mass: p.techSpecs[0].molarMass,
                    formula: p.techSpecs[0].molecularFormula,
                    focus: p.techSpecs[0].researchFocus
                } : undefined,
                // Map COA
                coa: p.coaDocuments?.[0] ? {
                    ...p.coaDocuments[0],
                    productName: p.name, // COA document usually has product name
                } : undefined
            })) as Product[];
        },
        staleTime: 0, // Keep disabled for now to ensure images refresh
    });
}
