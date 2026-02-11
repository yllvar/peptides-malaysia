import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Home } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="pt-32 pb-16 bg-evo-black min-h-screen flex flex-col items-center justify-center text-center px-4">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-evo-orange blur-[60px] opacity-20 animate-pulse"></div>
                <Ghost className="h-24 w-24 text-evo-orange relative" />
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-400 mb-8 uppercase tracking-widest">Protocol Path Missing</h2>
            <p className="text-gray-500 max-w-md mb-12 leading-relaxed">
                The research node you are looking for has been moved or de-indexed from the Evo™ database.
            </p>
            <Link
                to="/"
                className="inline-flex items-center px-8 py-4 bg-evo-orange hover:bg-evo-orangeHover text-white font-bold rounded transition-all group"
            >
                <Home className="mr-2 h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
                RETURN TO BASE
            </Link>
        </div>
    );
};

export default NotFound;
