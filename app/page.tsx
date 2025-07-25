import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Globe, Zap, ArrowRight } from 'lucide-react';
import { Stars } from '@/components/animation/stars';

// Feature data for better maintainability
const features = [
  {
    icon: <Sparkles className="w-6 h-6 text-white" />,
    title: 'AI-Powered',
    description:
      'Get intelligent responses and curated resources tailored to your needs',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-cyan-500',
  },
  {
    icon: <Globe className="w-6 h-6 text-white" />,
    title: 'Resource Discovery',
    description: 'Discover the best learning resources and tools for any topic',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-500',
  },
  {
    icon: <Zap className="w-6 h-6 text-white" />,
    title: 'Fast & Accurate',
    description: 'Get instant, relevant answers with detailed explanations',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-pink-500',
  },
] as const;

export default function LandingPage() {
  return (
    <div className="star-bg relative min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/20 overflow-hidden">
      <Stars />

      <Navigation />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 z-10 px-4 py-12">
        <div className="text-center max-w-5xl mx-auto">
          {/* Hero Image */}
          <div className="mb-8">
            <Image
              src="/images/marketplace-illustration.jpg"
              alt="IndieHash - AI-powered assistant for discovering resources and learning"
              width={500}
              height={500}
              className="mx-auto drop-shadow-2xl rounded-xl"
              priority
              sizes="(max-width: 768px) 300px, 500px"
            />
          </div>

          {/* Hero Text */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold gradient-text drop-shadow-lg mb-6 tracking-tight leading-tight">
            IndieHash
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Your AI-powered assistant for discovering resources, learning new
            skills, and exploring ideas
          </p>

          <ActionButtons />
        </div>

        {/* Feature Cards */}
        <section
          className="w-full max-w-6xl mx-auto"
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading" className="sr-only">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradientFrom={feature.gradientFrom}
                gradientTo={feature.gradientTo}
              />
            ))}
          </div>
        </section>
      </main>

      <BackgroundDecorations />
    </div>
  );
}

// Navigation component for better organization
function Navigation() {
  return (
    <nav className="flex justify-center sm:justify-between items-center px-8 p-4 z-10 glass-dark rounded-b-2xl mx-4 mt-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-2">
          <span className="text-white font-bold text-sm">I</span>
        </div>
        <span className="text-2xl font-bold gradient-text">IndieHash</span>
      </div>
      <div className="sm:flex items-center space-x-6 hidden">
        <Link
          href="/workspace"
          className="btn-primary px-6 py-3 md:py-2 rounded-full text-sm font-medium"
        >
          Launch app
        </Link>
        <Link
          href="/resources"
          className="text-gray-300 hover:text-white transition-colors duration-300 font-medium px-4 py-3 md:py-2 rounded-full hover:bg-white/10"
        >
          Resources
        </Link>
      </div>
    </nav>
  );
}

// Feature card component for reusability
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

function FeatureCard({
  icon,
  title,
  description,
  gradientFrom,
  gradientTo,
}: FeatureCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradientFrom} ${gradientTo} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

// Action buttons component
function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
      <Link
        href="/workspace"
        className="group btn-primary px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
      >
        Get Started
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
      <Link
        href="/resources"
        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        <Globe className="w-5 h-5" />
        Explore Resources
      </Link>
    </div>
  );
}

// Background decorations component
function BackgroundDecorations() {
  return (
    <>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
    </>
  );
}
