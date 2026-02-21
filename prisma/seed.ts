import { PrismaClient } from '@prisma/client';
import { PRODUCTS, BLOG_POSTS, COA_DATA, TECHNICAL_SPECS } from '../src/constants';

const prisma = new PrismaClient();

async function seed() {
    console.log('🌱 Seeding Neon Postgres via Prisma...');

    // 0. Clear existing data (except users/sessions)
    console.log('🧹 Clearing existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.orderPayment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.technicalSpec.deleteMany();
    await prisma.coaDocument.deleteMany();
    await prisma.product.deleteMany();
    await prisma.blogPost.deleteMany();
    console.log('✅ Data cleared');

    // 1. Seed Products
    for (const p of PRODUCTS) {
        await prisma.product.upsert({
            where: { id: p.id },
            update: {
                name: p.name,
                price: p.price,
                category: p.category,
                description: p.description,
                imageUrl: p.image,
                badge: p.badge || null,
                isNew: p.isNew || false,
                inStock: p.inStock,
                features: p.features,
            },
            create: {
                id: p.id,
                name: p.name,
                slug: p.id,
                price: p.price,
                category: p.category,
                description: p.description,
                imageUrl: p.image,
                badge: p.badge || null,
                isNew: p.isNew || false,
                inStock: p.inStock,
                stockQuantity: p.inStock ? 50 : 0,
                features: p.features,
                isPublished: true,
            },
        });
    }
    console.log(`✅ Seeded ${PRODUCTS.length} products`);

    // 2. Seed Technical Specs (idempotent: delete existing for product, then create)
    for (const s of TECHNICAL_SPECS) {
        const keyIngredient = s.name.replace('Evo ', '').split(' ')[0];
        const product = PRODUCTS.find(p => p.name.includes(keyIngredient));
        const productId = product?.id || null;

        // Delete existing specs for this product to prevent duplicates
        if (productId) {
            await prisma.technicalSpec.deleteMany({
                where: { productId },
            });
        }

        await prisma.technicalSpec.create({
            data: {
                productId,
                molecularFormula: s.formula,
                molarMass: s.mass,
                researchFocus: s.focus,
                halfLife: s.halfLife,
                category: s.category,
            },
        });
    }
    console.log(`✅ Seeded ${TECHNICAL_SPECS.length} technical specs`);

    // 3. Seed Blog Posts
    for (const b of BLOG_POSTS) {
        await prisma.blogPost.upsert({
            where: { slug: `post-${b.id}` },
            update: {
                title: b.title,
                excerpt: b.excerpt,
                content: b.content,
                category: b.category,
                readTime: b.readTime,
                imageUrl: b.imageUrl,
                relatedProductId: b.relatedProductId,
                purityBatch: b.purityBatch,
                references: b.references || [],
                faqs: b.faqs || [],
            },
            create: {
                title: b.title,
                slug: `post-${b.id}`,
                excerpt: b.excerpt,
                content: b.content,
                category: b.category,
                readTime: b.readTime,
                imageUrl: b.imageUrl,
                relatedProductId: b.relatedProductId,
                purityBatch: b.purityBatch,
                references: b.references || [],
                faqs: b.faqs || [],
                isPublished: true,
                publishedAt: new Date(b.date),
            },
        });
    }
    console.log(`✅ Seeded ${BLOG_POSTS.length} blog posts`);

    // 4. Seed COA Documents (idempotent: delete existing for product, then create)
    for (const c of COA_DATA) {
        const product = PRODUCTS.find(p => p.name.includes(c.productName) || c.productName.includes(p.name));
        const productId = product?.id || null;

        // Delete existing COA for this product to prevent duplicates
        if (productId) {
            await prisma.coaDocument.deleteMany({
                where: { productId },
            });
        }

        await prisma.coaDocument.create({
            data: {
                productId,
                productName: c.productName,
                batchNumber: c.batchNumber,
                purity: c.purity,
                testDate: new Date(c.date),
            },
        });
    }
    console.log(`✅ Seeded ${COA_DATA.length} COA documents`);

    console.log('\n🎉 Seed complete!');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
