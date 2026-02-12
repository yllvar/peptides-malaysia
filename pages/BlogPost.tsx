import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogPosts } from '../src/hooks/useBlogPosts';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

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
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/education" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Protocols
        </Link>

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

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

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