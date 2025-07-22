'use client';

import '@/app/landing/landing.css';
import Link from 'next/link';
import { useEffect } from 'react';
import Image from 'next/image';

function Stars() {
  useEffect(() => {
    const container = document.getElementById('glitter-bg');
    if (container) {
      container.innerHTML = '';
      for (let i = 0; i < 120; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.animationDuration = `${1.5 + Math.random() * 2}s`;
        container.appendChild(star);
      }
    }
  }, []);
  return <div id="glitter-bg" className="glitter" />;
}

export default function LandingPage() {
  return (
    <div className="star-bg relative min-h-screen flex flex-col justify-between">
      <Stars />
      {/* Top Navigation */}
      <nav className="flex justify-between items-center px-8 pt-6 z-10">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            IndieHash
          </span>
        </div>
        <div className="flex items-center space-x-8">
          <Link
            href="/chat"
            className="text-gray-300 hover:text-primary transition font-medium"
          >
            Launch app
          </Link>
          <Link
            href="/resources"
            className="text-gray-300 hover:text-primary transition font-medium"
          >
            Resources
          </Link>
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 z-10">
        <Image
          src="/images/marketplace-illustration.jpg"
          alt="IndieHash Cat Logo"
          width={500}
          height={500}
          className="mb-6"
          priority
        />
        <h1 className="text-7xl md:text-8xl font-extrabold text-center bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent drop-shadow-lg mb-4">
          IndieHash
        </h1>
        <p className="text-lg md:text-xl text-primary-light text-center mb-8 tracking-wide">
          A Content Marketplace by IndieHash
        </p>
        <form className="w-full max-w-lg flex items-center justify-center mb-12">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 py-4 px-6 rounded-l-full bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-lg border-none"
            required
          />
          <button
            type="submit"
            className="py-4 px-8 rounded-r-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-gray-900 font-bold text-lg transition"
          >
            THANK YOU
          </button>
        </form>
      </main>
      {/* Decorative bottom element */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-0">
        <svg
          width="600"
          height="120"
          viewBox="0 0 600 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="300"
            cy="120"
            rx="300"
            ry="60"
            fill="url(#paint0_linear)"
            fillOpacity="0.15"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="0"
              y1="120"
              x2="600"
              y2="120"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFB800" />
              <stop offset="1" stopColor="#FFD54F" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
