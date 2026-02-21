import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useBlogPosts } from '../src/hooks/useBlogPosts';
import { Clock, MoveRight, Layers, Activity } from 'lucide-react';

const Blog: React.FC = () => {
    const { data: posts, isLoading } = useBlogPosts();

    return (
        <div className="pt-24 pb-16 bg-evo-black min-h-screen">
            <SEO
                title="Research Insights & Clinical Protocols | Evo™ Peptides"
                description="Explore the latest clinical data, reconstitution guides, and metabolic research from the Evo™ Laboratory."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-16 border-l-4 border-evo-orange pl-8 py-4">
                    <div className="inline-block px-3 py-1 bg-evo-orange/10 text-evo-orange text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        Clinical Data & Insights
                    </div>
                    <h1 className="text-4xl md:text-7xl font-display font-bold text-white uppercase italic tracking-tighter mb-4">
                        Research <br /><span className="text-gray-500">Insights.</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl font-light">
                        Surgical precision in scientific reporting. Access our full library of Tier-1 comparison data, laboratory protocols, and safety standards.
                    </p>
                </header>

                {isLoading ? (
                    <div className="text-white text-center py-20">Loading Research Hub...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts?.map((post) => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.id}`}
                                className="group bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-evo-orange/30 transition-all flex flex-col h-full shadow-2xl"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={post.imageUrl || '/images/evo-dna.webp'}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-evo-black/80 backdrop-blur-md border border-white/10 text-evo-orange text-[9px] font-black uppercase tracking-widest rounded-full">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 mb-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                        <div className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</div>
                                        <div className="flex items-center gap-1"><Layers size={12} /> Level 1</div>
                                    </div>

                                    <h2 className="text-2xl font-display font-bold text-white uppercase italic leading-tight mb-4 group-hover:text-evo-orange transition-colors">
                                        {post.title}
                                    </h2>

                                    <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] group-hover:text-evo-orange transition-colors">Access Protocol</span>
                                        <MoveRight size={18} className="text-evo-orange group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-20 p-12 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[3rem] items-center justify-between hidden lg:flex">
                    <div>
                        <h3 className="text-2xl font-display font-bold text-white uppercase italic italic">Synthesized Excellence.</h3>
                        <p className="text-gray-500 text-sm mt-2">All data is batch-verified using HPLC and Mass Spectrometry.</p>
                    </div>
                    <div className="flex gap-8">
                        <div className="flex items-center gap-3">
                            <Activity className="text-evo-orange" size={20} />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Lab Feed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
