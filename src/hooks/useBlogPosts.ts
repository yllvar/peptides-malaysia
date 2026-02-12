import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '../types';

export function useBlogPosts() {
    return useQuery({
        queryKey: ['blog-posts'],
        queryFn: async () => {
            const response = await fetch('/api/blog');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.map((p: any) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt,
                content: p.content,
                category: p.category,
                date: new Date(p.publishedAt).toISOString().split('T')[0], // Simplified date
                readTime: `${p.readTimeEstimate} min read`,
                imageUrl: p.imageUrl
            })) as BlogPost[];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });
}
