import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const BASE_URL = 'https://evopeptides.shop';

async function generate() {
  console.log('Generating sitemap.xml...');

  const products = await prisma.product.findMany({
    where: { isPublished: true },
    select: { id: true, updatedAt: true }
  });

  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true }
  });

  const staticPages = [
    '',
    '/shop',
    '/about',
    '/lab-testing',
    '/education',
    '/blog',
    '/contact',
    '/latest',
  ];

  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static Pages
  staticPages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Dynamic Products
  products.forEach(product => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/product/${product.id}</loc>\n`;
    xml += `    <lastmod>${product.updatedAt.toISOString()}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  });

  // Dynamic Blog Posts
  posts.forEach(post => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${post.updatedAt.toISOString()}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xml);
  console.log('sitemap.xml written to public folder.');

  // Generate robots.txt
  const robots = `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml`;
  fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robots);
  console.log('robots.txt written to public folder.');

  await prisma.$disconnect();
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
