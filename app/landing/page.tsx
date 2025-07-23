'use client';

import '@/app/landing/landing.css';
import Link from 'next/link';
import { useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Globe, Zap } from 'lucide-react';

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
    <div className="star-bg relative min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/20">
      <Stars />
      {/* Top Navigation */}
      <nav className="flex justify-between items-center px-8 pt-6 z-10 glass-dark rounded-b-2xl mx-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">I</span>
          </div>
          <span className="text-2xl font-bold gradient-text">IndieHash</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="/chat"
            className="btn-primary px-6 py-2 rounded-full text-sm font-medium"
          >
            Launch app
          </Link>
          <Link
            href="/resources"
            className="text-gray-300 hover:text-white transition font-medium px-4 py-2 rounded-full hover:bg-white/10"
          >
            Resources
          </Link>
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 z-10 px-4">
        {/* <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-8 float pulse-glow"> */}
        <Image
          src="/images/marketplace-illustration.jpg"
          alt="IndieHash Cat Logo"
          width={500}
          height={500}
          className="mb-6"
          priority
        />
        {/* </div> */}
        <h1 className="text-6xl md:text-7xl font-extrabold text-center gradient-text drop-shadow-lg mb-4 tracking-tight">
          IndieHash
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 text-center mb-12 max-w-2xl leading-relaxed">
          Your AI-powered assistant for discovering resources, learning new
          skills, and exploring ideas
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
          <Link
            href="/chat"
            className="btn-primary px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 hover:scale-105 transition-all"
          >
            Get Started
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          {/* <Link
            href="/chat"
            className="group bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all hover:scale-105 shadow-xl flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link> */}
          <Link
            href="/resources"
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/20 transition-all hover:scale-105 flex items-center gap-2"
          >
            {/* <Globe className="w-5 h-5" /> */}
            Explore Resources
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              AI-Powered
            </h3>
            <p className="text-gray-400">
              Get intelligent responses and curated resources tailored to your
              needs
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Resource Discovery
            </h3>
            <p className="text-gray-400">
              Discover the best learning resources and tools for any topic
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Fast & Accurate
            </h3>
            <p className="text-gray-400">
              Get instant, relevant answers with detailed explanations
            </p>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />

      {/* <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-indigo-500/10 to-transparent z-0"></div> */}
    </div>
  );
}
