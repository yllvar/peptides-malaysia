import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../constants';

export function useBlogPosts() {
    return useQuery({
        queryKey: ['blog-posts'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/blog');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();

                if (!data || data.length === 0) return BLOG_POSTS;

                return data.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    excerpt: p.excerpt,
                    content: p.content,
                    category: p.category,
                    date: p.publishedAt ? new Date(p.publishedAt).toISOString().split('T')[0] : '2026-02-21',
                    readTime: p.readTime || '5 min',
                    imageUrl: p.imageUrl,
                    references: p.references || [],
                    faqs: p.faqs || [],
                    relatedProductId: p.relatedProductId,
                    purityBatch: p.purityBatch
                })) as BlogPost[];
            } catch (error) {
                console.error('Failed to fetch from API, falling back to constants:', error);
                return BLOG_POSTS;
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });
}
