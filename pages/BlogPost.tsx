import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogPosts } from '../src/hooks/useBlogPosts';
import { ArrowLeft, Clock, Calendar, ExternalLink, ShieldCheck, HelpCircle, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';
import BlogCTABox from '../components/BlogCTABox';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: posts, isLoading } = useBlogPosts();
  const post = posts?.find(p => p.id === id);

  if (isLoading) {
    return (
      <div className="pt-32 pb-16 bg-evo-black min-h-screen text-center text-white">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 pb-16 bg-evo-black min-h-screen text-center">
        <h1 className="text-white text-2xl mb-4">Article Not Found</h1>
        <Link to="/education" className="text-evo-orange underline">Return to Hub</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <SEO
        title={`${post.title} | Evo™ Peptides Research`}
        description={post.excerpt || post.title}
        image={post.imageUrl}
        type="article"
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
        </Link>

        {post.imageUrl && (
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 mb-10">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-evo-black via-transparent to-transparent"></div>
          </div>
        )}

        <header className="mb-10">
          <span className="inline-block bg-evo-orange/10 text-evo-orange text-xs font-bold px-3 py-1 rounded mb-4 uppercase tracking-wider">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center space-x-6 text-sm text-gray-400 border-b border-white/10 pb-8">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> {post.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" /> {post.readTime} Read
            </div>
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none mb-12">
          <div className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* TRUST FACTOR - Batch & Purity Badge */}
        {post.purityBatch && (
          <div className="bg-white/5 border-l-4 border-evo-orange p-6 mb-12 rounded-r-2xl flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Analytical Verification</div>
              <div className="text-lg font-display font-bold text-white uppercase italic">Batch #{post.purityBatch}</div>
            </div>
            <div className="flex items-center gap-3 bg-evo-orange/10 px-4 py-2 rounded-full border border-evo-orange/20">
              <ShieldCheck className="text-evo-orange" size={20} />
              <span className="text-xs font-black text-white uppercase tracking-tighter">HPLC Verified {'>'}99.9%</span>
            </div>
          </div>
        )}

        {/* THE KIT - Conversion CTA */}
        {post.relatedProductId && (
          <BlogCTABox productId={post.relatedProductId} />
        )}

        {/* FAQ SECTION - Objection Handling */}
        {post.faqs && post.faqs.length > 0 && (
          <div className="mb-12 space-y-6">
            <h3 className="text-2xl font-display font-bold text-white uppercase italic tracking-tighter flex items-center gap-3">
              <HelpCircle className="text-evo-orange" /> Common Inquiries
            </h3>
            <div className="space-y-4">
              {post.faqs.map((faq, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-all">
                  <h4 className="text-white font-bold mb-2 flex items-center justify-between">
                    {faq.question}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REFERENCES - Scientific Authority */}
        {post.references && post.references.length > 0 && (
          <div className="mb-12 pt-8 border-t border-white/10">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Scientific Citations</h3>
            <ul className="space-y-2">
              {post.references.map((ref, i) => (
                <li key={i}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-evo-orange transition-colors flex items-center gap-2 underline underline-offset-4 decoration-white/10"
                  >
                    <ExternalLink size={14} /> {ref.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FOOTER DISCLAIMER */}
        <div className="mt-16 pt-8 border-t border-white/10 bg-white/5 p-8 rounded-lg">
          <h3 className="text-white font-bold mb-2">Research Disclaimer</h3>
          <p className="text-sm text-gray-400">
            The information provided above is for educational and laboratory safety purposes only. It is not medical advice. All compounds discussed are for in-vitro research use only.
          </p>
        </div>

      </article>
    </div>
  );
};

export default BlogPost;