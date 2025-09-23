import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Car, CheckCircle, Shield, Users, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login-select");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="floating-orb w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 top-10 -left-20" />
      <div className="floating-orb w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-600 top-1/2 -right-20" />
      <div className="floating-orb w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-600 bottom-20 left-1/4" />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-200">Secure Parking Management</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Park<span className="text-red-500">Meter</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleGetStarted}
              variant="outline" 
              className="glass border-white/20 text-white hover:bg-white/10"
            >
              Login
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Smart parking registration and verification system.
              </h2>
              <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                Ensure registered vehicles get priority access while managing unauthorized parking efficiently.
              </p>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-blue-500/25 border-0"
              >
                <Car className="mr-3 w-5 h-5" />
                Get Started
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <Card className="glass rounded-3xl border-white/20 overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src="https://harmless-tapir-303.convex.cloud/api/storage/8a729d1e-7a01-4e23-86d3-f24604bf4ab8"
                  alt="Smart Parking System"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute bottom-6 right-6 glass rounded-2xl p-4 border-white/20">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-sm text-white/70">Verified Access</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto px-6 pb-20"
      >
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Secure Registration",
              description: "Advanced vehicle verification system with real-time validation"
            },
            {
              icon: Users,
              title: "Staff Management", 
              description: "Dedicated interfaces for staff and users with role-based access"
            },
            {
              icon: Sparkles,
              title: "Smart Monitoring",
              description: "Automated violation detection and priority access management"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Card className="glass rounded-2xl border-white/20 p-8 h-full">
                <CardContent className="p-0 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      
    </div>
  );
}