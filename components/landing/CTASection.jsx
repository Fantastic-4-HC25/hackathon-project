import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
            <Star className="h-8 w-8 text-yellow-300" />
          </div>
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Transform Your Rental Experience?
        </h2>
        
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users who've found their perfect match through our AI-powered platform
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-2 border-white text-blue-600 hover:bg-white/10 px-8 py-4 text-lg font-semibold">
            <Link href="/login">
              Login
            </Link>
          </Button>
        </div>
        
        <p className="text-blue-200 text-sm mt-6">
          No credit card required • Setup in under 5 minutes
        </p>
      </div>
    </section>
  );
}