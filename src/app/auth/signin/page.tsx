'use client';

import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Welcome to IndieChat
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in is currently disabled.
          </p>
        </div>
      </div>
    </div>
  );
} 