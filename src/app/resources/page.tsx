'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ThumbsUp, Youtube, Twitter, Instagram, Globe, Github, Search, Hash, Trophy, ArrowUpRight, ChevronLeft
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  platform: string;
  category: string;
  tags: string[];
  avatar?: string;
  handle: string;
  description: string;
  votes: number;
  url: string;
  verified: boolean;
}

const platformIcons: { [key: string]: any } = {
  youtube: Youtube,
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  website: Globe,
};

const ResourcesPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();

  const platforms = [
    { id: 'all', name: 'All' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'github', name: 'GitHub' },
    { id: 'website', name: 'Websites' },
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'frontend', name: 'Frontend Development' },
    { id: 'backend', name: 'Backend Development' },
    { id: 'blockchain', name: 'Blockchain' },
    { id: 'ai', name: 'AI & Machine Learning' },
    { id: 'mobile', name: 'Mobile Development' },
    { id: 'devops', name: 'DevOps' },
  ];

  const tags = [
    'React', 'TypeScript', 'Node.js', 'Python', 'JavaScript',
    'Web3', 'Solidity', 'AWS', 'Docker', 'AI'
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Fireship',
      platform: 'youtube',
      category: 'frontend',
      tags: ['JavaScript', 'Web3', 'React'],
      handle: '@fireship_dev',
      description: 'Quick, practical web development tutorials and tips',
      votes: 1234,
      url: 'https://youtube.com/c/fireship',
      verified: true
    },
    {
      id: '2',
      title: 'ThePrimeagen',
      platform: 'youtube',
      category: 'frontend',
      tags: ['TypeScript', 'Vim', 'Performance'],
      handle: '@ThePrimeagen',
      description: 'Advanced development concepts and performance optimization',
      votes: 892,
      url: 'https://youtube.com/ThePrimeagen',
      verified: true
    },
    {
      id: '3',
      title: 'Traversy Media',
      platform: 'youtube',
      category: 'frontend',
      tags: ['Web Development', 'JavaScript', 'React'],
      handle: '@traversymedia',
      description: 'Modern web development tutorials and courses',
      votes: 756,
      url: 'https://youtube.com/traversymedia',
      verified: true
    },
  ].sort((a, b) => b.votes - a.votes);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredResources = resources.filter(resource => {
    const matchesPlatform = selectedPlatform === 'all' || resource.platform === selectedPlatform;
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => resource.tags.includes(tag));
    return matchesPlatform && matchesCategory && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/landing')}
                className="text-gray-400 hover:text-primary"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Resources</h1>
            </div>
            <div className="max-w-xl w-full px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-800 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Platform filters */}
          <div className="flex items-center gap-2 py-3 -mb-px">
            {platforms.map(platform => {
              const Icon = platformIcons[platform.id];
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                    selectedPlatform === platform.id
                      ? 'bg-gradient-to-r from-primary to-primary-light text-gray-900'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {platform.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Categories</h2>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-primary to-primary-light text-gray-900 font-medium'
                        : 'text-gray-300 hover:bg-gray-900'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Popular Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-primary to-primary-light text-gray-900 font-medium'
                        : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                    } transition-colors`}
                  >
                    <Hash className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Resource List */}
          <div className="col-span-3">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 divide-y divide-gray-700">
              {filteredResources.map((resource, index) => {
                const PlatformIcon = platformIcons[resource.platform];
                return (
                  <div key={resource.id} className="flex items-center gap-6 p-6 hover:bg-gray-900 transition-colors">
                    {/* Rank */}
                    <div className="w-12 flex-shrink-0 text-center">
                      {index + 1 <= 3 ? (
                        <Trophy className={`h-6 w-6 mx-auto ${
                          index === 0 ? 'text-yellow-400' :
                          index === 1 ? 'text-gray-400' :
                          'text-amber-600'
                        }`} />
                      ) : (
                        <span className="text-lg font-bold text-gray-400">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Platform Icon */}
                    <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                      {PlatformIcon && <PlatformIcon className="h-6 w-6 text-primary" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-primary">
                              {resource.title}
                            </h3>
                            {resource.verified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 font-mono">
                            {resource.handle}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors">
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm font-medium">{resource.votes}</span>
                          </button>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-primary transition-colors"
                          >
                            <ArrowUpRight className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-300">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {resource.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage; 