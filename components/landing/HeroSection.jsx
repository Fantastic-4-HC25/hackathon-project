import Link from "next/link";
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, User } from 'lucide-react';

export default function HeroSection({ user }) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Powered by AI • Trusted by Thousands
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Rental Match
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Whether you're a tenant looking for the ideal home or a landlord finding the right tenant, 
            RentMatch makes the process seamless and stress-free with AI-powered matching.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 text-lg">
                  <Link href="/dashboard/tenant">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  <Link href="/profile">
                    View Profile
                    <User className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 text-lg">
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  <Link href="/login">
                    Login
                    <User className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">95%</div>
              <div className="text-sm text-gray-600">Match Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24h</div>
              <div className="text-sm text-gray-600">Avg. Response</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}