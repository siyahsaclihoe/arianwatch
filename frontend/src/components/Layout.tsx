import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AIRecommend from './AIRecommend';

interface LayoutProps {
    children: React.ReactNode;
    noNavbar?: boolean;
}

export default function Layout({ children, noNavbar = false }: LayoutProps) {
    return (
        <div className="min-h-screen bg-dark-bg text-gray-100 font-sans flex">
            <Sidebar />
            <div className="flex-1 ml-16 md:ml-20 relative">
                {!noNavbar && <Navbar />}
                <main className={`${!noNavbar ? 'pt-0' : ''}`}>
                    {children}
                </main>
            </div>
            <AIRecommend />
        </div>
    );
}
