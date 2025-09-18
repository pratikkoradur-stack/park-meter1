import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Car, Shield, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function LoginSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <div className="floating-orb w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 top-10 -left-20" />
      <div className="floating-orb w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-600 top-1/2 -right-20" />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">Parkmeter</span>
          </div>
        </div>
      </motion.nav>

      {/* Login Selection */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Access Level</h1>
            <p className="text-xl text-white/80">Select the appropriate login interface for your role</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Staff Login */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass rounded-3xl border-white/20 p-8 h-full cursor-pointer hover:scale-105 transition-transform duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Staff Access</CardTitle>
                  <CardDescription className="text-white/70 text-lg">
                    Manage parking registrations, monitor violations, and control access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3 text-white/80">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>Vehicle registration & verification</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>Parking session management</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>Violation reporting & resolution</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate("/auth?type=staff")}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg rounded-2xl"
                  >
                    Staff Login
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* User Login */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glass rounded-3xl border-white/20 p-8 h-full cursor-pointer hover:scale-105 transition-transform duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">User Access</CardTitle>
                  <CardDescription className="text-white/70 text-lg">
                    View your parking history, check vehicle status, and manage profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3 text-white/80">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span>View parking history</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span>Check vehicle registration status</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span>Manage personal information</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate("/auth?type=user")}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg rounded-2xl"
                  >
                    User Login
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
