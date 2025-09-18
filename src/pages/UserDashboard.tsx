import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { 
  Car, 
  Users, 
  Clock, 
  AlertTriangle, 
  LogOut,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const demoMode = params.get("demo") === "1";

  // Add state before any early returns so demo UI and header can use them safely
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>(() => {
    const saved = localStorage.getItem("pm_display_name");
    return saved ?? "";
  });
  // Add: date of birth state persisted locally
  const [dateOfBirth, setDateOfBirth] = useState<string>(() => {
    return localStorage.getItem("pm_dob") ?? "";
  });

  // Redirect if staff (only when not in demo mode)
  if (!demoMode && user && (user.role === "staff" || user.role === "admin")) {
    navigate("/staff-dashboard");
    return null;
  }

  // Render a static demo dashboard when demoMode is enabled (no backend calls)
  if (demoMode) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="floating-orb w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 top-10 -left-20" />
        <div className="floating-orb w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-600 bottom-10 -right-20" />

        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 glass border-b border-white/20 p-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Parkmeter — My Profile</h1>
                <p className="text-white/70">Member since • Demo Account</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                className="glass border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate("/")}
              >
                Home
              </Button>
              <Button 
                onClick={() => signOut()}
                variant="outline"
                className="glass border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.header>

        <div className="relative z-10 max-w-7xl mx-auto p-6">
          {/* Profile header card */}
          <Card className="glass border-white/20 mb-6">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full glass flex items-center justify-center">
                  <Users className="w-8 h-8 text-white/80" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Demo User</div>
                  <div className="inline-flex items-center gap-2 text-white/70 text-sm">
                    <span className="px-3 py-1 rounded-full bg-white/10">Member since</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/60">Current Time (IST)</div>
                <div className="text-2xl font-bold text-blue-300">
                  {new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}
                </div>
                <div className="text-sm text-white/70">
                  {new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="text-sm text-white/70 mb-1">My Vehicles</div>
                <div className="text-3xl font-bold">0</div>
                <div className="text-sm text-white/60">Registered vehicles</div>
              </CardContent>
            </Card>
            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="text-sm text-white/70 mb-1">Recent Sessions</div>
                <div className="text-3xl font-bold">0</div>
                <div className="text-sm text-white/60">This month</div>
              </CardContent>
            </Card>
            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="text-sm text-white/70 mb-1">Parking Layout</div>
                <div className="text-2xl font-bold text-blue-400">Available</div>
                <div className="text-sm text-white/60">View parking spaces</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="glass border-white/20">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">Register Vehicle</div>
                    <div className="text-sm text-white/70">Add a new vehicle to your account</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass border-white/20">
                <CardContent className="p-5">
                  <div className="font-medium mb-1">Payment History</div>
                  <div className="text-sm text-white/70">View your payment history and receipts</div>
                </CardContent>
              </Card>
              <Card className="glass border-white/20">
                <CardContent className="p-5">
                  <div className="font-medium mb-1">Parking History</div>
                  <div className="text-sm text-white/70">View your parking session history</div>
                </CardContent>
              </Card>
              <Card className="glass border-white/20">
                <CardContent className="p-5">
                  <div className="font-medium mb-1">Notifications</div>
                  <div className="text-sm text-white/70">Manage your account notifications</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* My Vehicles placeholder */}
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="w-5 h-5 mr-2" />
                My Vehicles
              </CardTitle>
              <CardDescription className="text-white/70">
                Your registered vehicles in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-white/60">
                <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No vehicles registered yet</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Add: Only run staff-only queries if the user is staff/admin
  const isStaff = user?.role === "staff" || user?.role === "admin";

  // Replace previous queries to avoid Unauthorized for regular users
  const userVehicles = useQuery(api.vehicles.getVehicles, isStaff ? {} : "skip");
  const userParkingHistory = useQuery(api.parking.getParkingHistory, isStaff ? {} : "skip");
  
  // Filter user's own vehicles and sessions based on email
  const myVehicles = userVehicles?.filter(v => v.ownerEmail === user?.email) || [];
  const mySessions = userParkingHistory?.filter(s => 
    myVehicles.some(v => v._id === s.vehicleId)
  ) || [];
  
  const activeSessions = mySessions.filter(s => s.status === "active");

  if (!displayName && user?.name) {
    // Initialize from authenticated user's name if nothing saved yet
    // Note: simple synchronous set; safe as it only runs on first render where condition matches
    const name = user?.name ?? "";
    localStorage.setItem("pm_display_name", name);
    setTimeout(() => setDisplayName(name), 0);
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <div className="floating-orb w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 top-10 -left-20" />
      <div className="floating-orb w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-600 bottom-10 -right-20" />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 glass border-b border-white/20 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Parking</h1>
              <p className="text-white/70">Welcome back, {displayName || user?.name || user?.email}</p>
            </div>
          </div>
          
          <Button 
            onClick={() => signOut()}
            variant="outline"
            className="glass border-white/20 text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">My Vehicles</p>
                  <p className="text-2xl font-bold">{myVehicles.length}</p>
                </div>
                <Car className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Active Sessions</p>
                  <p className="text-2xl font-bold">{activeSessions.length}</p>
                </div>
                <Clock className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Sessions</p>
                  <p className="text-2xl font-bold">{mySessions.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">This Month</p>
                  <p className="text-2xl font-bold">
                    {mySessions.filter(s => {
                      const sessionDate = new Date(s.entryTime);
                      const now = new Date();
                      return sessionDate.getMonth() === now.getMonth() && 
                             sessionDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Vehicles */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  My Vehicles
                </CardTitle>
                <CardDescription className="text-white/70">
                  Your registered vehicles in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {myVehicles.length === 0 ? (
                  <div className="text-center py-8 text-white/60">
                    <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No vehicles registered yet</p>
                    <p className="text-sm">Contact staff to register your vehicle</p>
                  </div>
                ) : (
                  myVehicles.map((vehicle) => (
                    <div key={vehicle._id} className="glass rounded-lg p-4 border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-lg">{vehicle.licensePlate}</span>
                        <Badge 
                          variant={vehicle.status === "registered" ? "default" : "destructive"}
                          className={vehicle.status === "registered" ? "bg-green-500" : ""}
                        >
                          {vehicle.status === "registered" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {vehicle.status}
                        </Badge>
                      </div>
                      <p className="text-white/80">{vehicle.vehicleModel}</p>
                      <p className="text-white/60 text-sm">Color: {vehicle.vehicleColor}</p>
                      <p className="text-white/50 text-xs mt-2">
                        Registered: {new Date(vehicle._creationTime).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Parking History */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Parking Sessions
                </CardTitle>
                <CardDescription className="text-white/70">
                  Your parking history and active sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {mySessions.length === 0 ? (
                  <div className="text-center py-8 text-white/60">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No parking sessions yet</p>
                    <p className="text-sm">Your parking history will appear here</p>
                  </div>
                ) : (
                  mySessions
                    .sort((a, b) => b.entryTime - a.entryTime)
                    .slice(0, 10)
                    .map((session) => (
                      <div key={session._id} className="glass rounded-lg p-4 border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{session.licensePlate}</span>
                          <Badge 
                            variant={session.status === "active" ? "default" : "secondary"}
                            className={session.status === "active" ? "bg-green-500" : ""}
                          >
                            {session.status === "active" ? (
                              <Clock className="w-3 h-3 mr-1" />
                            ) : (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            {session.status}
                          </Badge>
                        </div>
                        <p className="text-white/70 text-sm">Location: {session.location}</p>
                        <div className="text-white/60 text-xs mt-2 space-y-1">
                          <p>Entry: {new Date(session.entryTime).toLocaleString()}</p>
                          {session.exitTime && (
                            <p>Exit: {new Date(session.exitTime).toLocaleString()}</p>
                          )}
                          {session.status === "active" && (
                            <p className="text-green-400">Currently parked</p>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription className="text-white/70">
                Contact our staff for assistance with vehicle registration or parking issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="glass rounded-lg p-4 border-white/10">
                  <Car className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <h3 className="font-semibold mb-1">Vehicle Registration</h3>
                  <p className="text-sm text-white/70">Visit the security office to register new vehicles</p>
                </div>
                <div className="glass rounded-lg p-4 border-white/10">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <h3 className="font-semibold mb-1">Report Issues</h3>
                  <p className="text-sm text-white/70">Contact staff for parking violations or disputes</p>
                </div>
                <div className="glass rounded-lg p-4 border-white/10">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <h3 className="font-semibold mb-1">Status Updates</h3>
                  <p className="text-sm text-white/70">Check here for real-time parking status updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="glass border-white/20">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/80 block mb-2">Display Name</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={(user?.name || user?.email) ?? "Your name"}
                  className="glass border-white/20"
                />
                <p className="text-xs text-white/60 mt-2">
                  This name appears on your dashboard. It's stored on this device.
                </p>
              </div>

              {/* Add: Date of Birth */}
              <div>
                <label className="text-sm text-white/80 block mb-2">Date of Birth</label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="glass border-white/20"
                />
                <p className="text-xs text-white/60 mt-2">
                  Your DOB is stored locally and used for personalization only.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="glass border-white/20 text-white hover:bg-white/10"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  localStorage.setItem("pm_display_name", displayName || "");
                  localStorage.setItem("pm_dob", dateOfBirth || "");
                  toast.success("Profile updated");
                  setIsEditOpen(false);
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}