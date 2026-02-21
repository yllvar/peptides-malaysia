import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useProducts } from '../src/hooks/useProducts';

interface BlogCTABoxProps {
    productId: string;
}

const BlogCTABox: React.FC<BlogCTABoxProps> = ({ productId }) => {
    const { data: products } = useProducts();
    const product = products?.find(p => p.id === productId);

    if (!product) return null;

    return (
        <div className="my-12 bg-gradient-to-br from-evo-orange/20 to-evo-black border border-evo-orange/30 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-evo-orange/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden border border-white/10">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-3 py-1 bg-evo-orange text-black text-[10px] font-black uppercase tracking-widest mb-4 rounded-sm">
                        Research Protocol Essential
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 italic uppercase">
                        {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed font-light">
                        {product.description.split('.')[0]}. Optimized for maximum protocol integrity.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link
                            to={`/product/${product.id}`}
                            className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full hover:bg-evo-orange hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={14} /> Add to Cart
                        </Link>
                        <Link
                            to="/shop"
                            className="px-8 py-4 bg-transparent border border-white/20 text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                        >
                            Review All Protocols <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCTABox;
