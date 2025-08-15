import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Home, CheckCircle, MapPin, DollarSign } from 'lucide-react';

export default function UserTypesSection({ user }) {
  const tenantBenefits = [
    "AI ranks properties perfectly matched to your needs",
    "Upload documents once, apply everywhere",
    "Real-time application status updates",
    "Direct communication with verified landlords"
  ];

  const landlordBenefits = [
    "List properties with advanced filtering options",
    "AI-matched tenant recommendations",
    "Streamlined application management",
    "Verified tenant profiles with income proof"
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Perfect for Everyone
          </h2>
          <p className="text-xl text-gray-600">
            Whether you're looking for a home or listing properties
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Tenant Card */}
          <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 ml-4">For Tenants</h3>
              </div>
              
              <p className="text-gray-600 mb-6 text-lg">
                Find your perfect home with AI that understands your preferences
              </p>
              
              <ul className="space-y-3 mb-8">
                {tenantBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link href={user ? "/dashboard/tenant" : "/signup"}>
                  {user ? "Go to Dashboard" : "Find My Home"}
                  <MapPin className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Landlord Card */}
          <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 ml-4">For Landlords</h3>
              </div>
              
              <p className="text-gray-600 mb-6 text-lg">
                Maximize your property's potential with intelligent tenant matching
              </p>
              
              <ul className="space-y-3 mb-8">
                {landlordBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Link href={user ? "/dashboard/landlord" : "/signup"}>
                  {user ? "Manage Properties" : "List Property"}
                  <DollarSign className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}