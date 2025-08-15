import { Card, CardContent } from '@/components/ui/card';
import { Brain, Shield, Clock, TrendingUp } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Advanced LLaMa 3 AI ranks properties based on your preferences, budget, and lifestyle"
    },
    {
      icon: Shield,
      title: "Verified Users",
      description: "KYC verification ensures trust and safety for all tenants and landlords"
    },
    {
      icon: Clock,
      title: "Instant Applications",
      description: "Apply to multiple properties instantly with one-click applications"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Landlords get insights on property performance and tenant preferences"
    }
  ];

  return (
    <section className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center border border-blue-200 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Why Choose RentMatch
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Intelligent Features for Modern Rentals
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform revolutionizes how tenants and landlords connect
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}