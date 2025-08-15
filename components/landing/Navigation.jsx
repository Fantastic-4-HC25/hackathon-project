import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Home, User } from 'lucide-react';

export default function Navigation({ user }) {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RentMatch
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button asChild variant="ghost" className="text-gray-600 hover:text-blue-600">
                  <Link href="/dashboard/tenant">Dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}