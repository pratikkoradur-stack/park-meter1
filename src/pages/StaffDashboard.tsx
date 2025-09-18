import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { motion } from "framer-motion";
import { 
  Car, 
  Shield, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  LogOut,
  Users,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function StaffDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const demoMode = params.get("demo") === "1";

  // ADD: demo-only local state so the register form works in demo without auth
  const [demoStats, setDemoStats] = useState({
    vehicles: 0,
    activeSessions: 0,
    openViolations: 0,
    registeredToday: 0,
  });
  const [demoVehicle, setDemoVehicle] = useState({
    licensePlate: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    vehicleModel: "",
    vehicleColor: "",
    notes: "",
  });
  const [demoExtraVehicleInfo, setDemoExtraVehicleInfo] = useState({
    studentId: "",
    dormitory: "",
    roomNumber: "",
    make: "",
    year: String(new Date().getFullYear()),
  });

  // ADD: demo submit handler (no backend calls)
  const handleDemoRegisterVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const composedModel = [demoExtraVehicleInfo.make, demoVehicle.vehicleModel, demoExtraVehicleInfo.year]
      .filter(Boolean)
      .join(" ")
      .trim();

    const composedNotesParts: Array<string> = [];
    if (demoVehicle.notes) composedNotesParts.push(demoVehicle.notes.trim());
    composedNotesParts.push(
      `Student ID: ${demoExtraVehicleInfo.studentId || "-"}`,
      `Dormitory: ${demoExtraVehicleInfo.dormitory || "-"}`,
      `Room: ${demoExtraVehicleInfo.roomNumber || "-"}`
    );
    const composedNotes = composedNotesParts.join(" | ");

    // Simulate success
    toast.success("Vehicle registered (demo)");
    setDemoStats((s) => ({
      ...s,
      vehicles: s.vehicles + 1,
      registeredToday: s.registeredToday + 1,
    }));
    // Reset fields
    setDemoVehicle({
      licensePlate: "",
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      vehicleModel: "",
      vehicleColor: "",
      notes: "",
    });
    setDemoExtraVehicleInfo({
      studentId: "",
      dormitory: "",
      roomNumber: "",
      make: "",
      year: String(new Date().getFullYear()),
    });
  };

  // Redirect if not staff (only when authenticated and not in demo)
  if (!demoMode && user && user.role !== "staff" && user.role !== "admin") {
    navigate("/user-dashboard");
    return null;
  }

  const [isLayoutOpen, setIsLayoutOpen] = useState(false);

  // Render a static demo dashboard when demoMode is enabled (no backend calls)
  if (demoMode) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="floating-orb w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 top-10 -left-20" />
        <div className="floating-orb w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-600 bottom-10 -right-20" />

        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 glass border-b border-white/20 p-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Staff Dashboard — Demo</h1>
                <p className="text-white/70">Preview mode • No live data</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                className="glass border-white/20 text-white hover:bg-white/10"
                onClick={() => setIsLayoutOpen(true)}
              >
                Parking Layout
              </Button>
              <Button 
                variant="outline"
                className="glass border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate("/")}
              >
                Home
              </Button>
              <Button 
                variant="outline"
                className="glass border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate("/auth?type=staff")}
              >
                Logout
              </Button>
            </div>
          </div>
        </motion.header>

        <Dialog open={isLayoutOpen} onOpenChange={setIsLayoutOpen}>
          <DialogContent className="glass border-white/20">
            <DialogHeader>
              <DialogTitle>Parking Layout</DialogTitle>
            </DialogHeader>
            <div className="text-white/80">
              Parking layout preview — coming soon.
            </div>
          </DialogContent>
        </Dialog>

        <div className="relative z-10 max-w-7xl mx-auto p-6">
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
                    <p className="text-white/70 text-sm">Total Vehicles</p>
                    <p className="text-2xl font-bold">{demoStats.vehicles}</p>
                  </div>
                  <Car className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Active Sessions</p>
                    <p className="text-2xl font-bold">{demoStats.activeSessions}</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Open Violations</p>
                    <p className="text-2xl font-bold">{demoStats.openViolations}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Registered Today</p>
                    <p className="text-2xl font-bold">{demoStats.registeredToday}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Register Vehicle (Demo)
                </CardTitle>
                <CardDescription className="text-white/70">
                  Demo submission updates stats locally. No sign-in required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDemoRegisterVehicle} className="space-y-4">
                  {/* Student Information */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-white/80">Student Information</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Student ID</Label>
                        <Input
                          value={demoExtraVehicleInfo.studentId}
                          onChange={(e) =>
                            setDemoExtraVehicleInfo({ ...demoExtraVehicleInfo, studentId: e.target.value })
                          }
                          className="glass border-white/20"
                          placeholder="Enter student ID"
                        />
                      </div>
                      <div>
                        <Label>Dormitory</Label>
                        <Select
                          value={demoExtraVehicleInfo.dormitory}
                          onValueChange={(value) =>
                            setDemoExtraVehicleInfo({ ...demoExtraVehicleInfo, dormitory: value })
                          }
                        >
                          <SelectTrigger className="glass border-white/20">
                            <SelectValue placeholder="Select dormitory" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alpha">Alpha</SelectItem>
                            <SelectItem value="beta">Beta</SelectItem>
                            <SelectItem value="gamma">Gamma</SelectItem>
                            <SelectItem value="delta">Delta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Room Number</Label>
                        <Input
                          value={demoExtraVehicleInfo.roomNumber}
                          onChange={(e) =>
                            setDemoExtraVehicleInfo({ ...demoExtraVehicleInfo, roomNumber: e.target.value })
                          }
                          className="glass border-white/20"
                          placeholder="Enter room number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information (additional) */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-white/80">Vehicle Information</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Make</Label>
                        <Select
                          value={demoExtraVehicleInfo.make}
                          onValueChange={(value) =>
                            setDemoExtraVehicleInfo({ ...demoExtraVehicleInfo, make: value })
                          }
                        >
                          <SelectTrigger className="glass border-white/20">
                            <SelectValue placeholder="Select vehicle make" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Toyota">Toyota</SelectItem>
                            <SelectItem value="Honda">Honda</SelectItem>
                            <SelectItem value="Hyundai">Hyundai</SelectItem>
                            <SelectItem value="Ford">Ford</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input
                          value={demoExtraVehicleInfo.year}
                          onChange={(e) =>
                            setDemoExtraVehicleInfo({ ...demoExtraVehicleInfo, year: e.target.value })
                          }
                          className="glass border-white/20"
                          placeholder="e.g., 2025"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>License Plate</Label>
                      <Input
                        value={demoVehicle.licensePlate}
                        onChange={(e) => setDemoVehicle({ ...demoVehicle, licensePlate: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                    </div>
                    <div>
                      <Label>Owner Name</Label>
                      <Input
                        value={demoVehicle.ownerName}
                        onChange={(e) => setDemoVehicle({ ...demoVehicle, ownerName: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={demoVehicle.ownerEmail}
                        onChange={(e) => setDemoVehicle({ ...demoVehicle, ownerEmail: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={demoVehicle.ownerPhone}
                        onChange={(e) => setDemoVehicle({ ...demoVehicle, ownerPhone: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vehicle Model</Label>
                      <Input
                        value={demoVehicle.vehicleModel}
                        onChange={(e) => setDemoVehicle({ ...demoVehicle, vehicleModel: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                    </div>
                    <div>
                      <Label>Color</Label>
                      <Input
                        value={demoVehicle.vehicleColor}
                        onChange={(e) => setDemoVehicle({ ...demoVehicle, vehicleColor: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      value={demoVehicle.notes}
                      onChange={(e) => setDemoVehicle({ ...demoVehicle, notes: e.target.value })}
                      className="glass border-white/20"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                    Register Vehicle
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription className="text-white/70">
                  Live list disabled in demo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="glass rounded-lg p-4 border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">KA01AB1234</span>
                    <Badge>active</Badge>
                  </div>
                  <p className="text-sm text-white/70">Location: Zone A, Spot 15</p>
                  <p className="text-sm text-white/60">Started: 10:24 AM</p>
                </div>
                <div className="glass rounded-lg p-4 border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">MH12CD5678</span>
                    <Badge>active</Badge>
                  </div>
                  <p className="text-sm text-white/70">Location: Zone C, Spot 02</p>
                  <p className="text-sm text-white/60">Started: 10:10 AM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const vehicles = useQuery(api.vehicles.getVehicles, {});
  const activeSessions = useQuery(api.parking.getActiveSessions, {});
  const violations = useQuery(api.violations.getViolations, { resolved: false });
  
  const registerVehicle = useMutation(api.vehicles.registerVehicle);
  const startSession = useMutation(api.parking.startParkingSession);
  const endSession = useMutation(api.parking.endParkingSession);
  const reportViolation = useMutation(api.violations.reportViolation);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    vehicleModel: "",
    vehicleColor: "",
    notes: ""
  });
  
  const [newSession, setNewSession] = useState({
    licensePlate: "",
    location: "",
    notes: ""
  });
  
  const [newViolation, setNewViolation] = useState({
    licensePlate: "",
    violationType: "",
    description: "",
    location: ""
  });

  const [stats, setStats] = useState({
    vehicles: 0,
    activeSessions: 0,
    openViolations: 0,
    registeredToday: 0,
  });

  const [extraVehicleInfo, setExtraVehicleInfo] = useState({
    studentId: "",
    dormitory: "",
    roomNumber: "",
    make: "",
    year: String(new Date().getFullYear()),
  });

  const handleRegisterVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Compose payload from existing fields + extras
      const composedModel = [extraVehicleInfo.make, newVehicle.vehicleModel, extraVehicleInfo.year]
        .filter(Boolean)
        .join(" ")
        .trim();

      const composedNotesParts: Array<string> = [];
      if (newVehicle.notes) composedNotesParts.push(newVehicle.notes.trim());
      composedNotesParts.push(
        `Student ID: ${extraVehicleInfo.studentId || "-"}`,
        `Dormitory: ${extraVehicleInfo.dormitory || "-"}`,
        `Room: ${extraVehicleInfo.roomNumber || "-"}`
      );
      const composedNotes = composedNotesParts.join(" | ");

      await registerVehicle({
        licensePlate: newVehicle.licensePlate,
        ownerName: newVehicle.ownerName,
        ownerEmail: newVehicle.ownerEmail,
        ownerPhone: newVehicle.ownerPhone,
        vehicleModel: composedModel || newVehicle.vehicleModel,
        vehicleColor: newVehicle.vehicleColor,
        notes: composedNotes,
      });
      toast.success("Vehicle registered successfully");

      // Increment only when a user registers a vehicle
      setStats((s) => ({
        ...s,
        vehicles: s.vehicles + 1,
        registeredToday: s.registeredToday + 1,
      }));

      // Reset both forms
      setNewVehicle({
        licensePlate: "",
        ownerName: "",
        ownerEmail: "",
        ownerPhone: "",
        vehicleModel: "",
        vehicleColor: "",
        notes: ""
      });
      setExtraVehicleInfo({
        studentId: "",
        dormitory: "",
        roomNumber: "",
        make: "",
        year: String(new Date().getFullYear()),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to register vehicle");
    }
  };

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await startSession(newSession);
      toast.success("Parking session started");
      setNewSession({ licensePlate: "", location: "", notes: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start session");
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      await endSession({ sessionId: sessionId as any });
      toast.success("Parking session ended");
    } catch (error) {
      toast.error("Failed to end session");
    }
  };

  const handleReportViolation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reportViolation(newViolation);
      toast.success("Violation reported");
      setNewViolation({ licensePlate: "", violationType: "", description: "", location: "" });
    } catch (error) {
      toast.error("Failed to report violation");
    }
  };

  const filteredVehicles = vehicles?.filter(v => 
    v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <div className="floating-orb w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 top-10 -left-20" />
      <div className="floating-orb w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-600 bottom-10 -right-20" />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 glass border-b border-white/20 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Staff Dashboard</h1>
              <p className="text-white/70">Welcome back, {user?.name || user?.email}</p>
            </div>
          </div>
          
          <Button 
            variant="outline"
            className="glass border-white/20 text-white hover:bg-white/10"
            onClick={() => setIsLayoutOpen(true)}
          >
            Parking Layout
          </Button>
          <Button 
            variant="outline"
            className="glass border-white/20 text-white hover:bg-white/10"
            onClick={() => navigate("/login-select")}
          >
            Logout
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
                  <p className="text-white/70 text-sm">Total Vehicles</p>
                  <p className="text-2xl font-bold">{stats.vehicles}</p>
                </div>
                <Car className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Active Sessions</p>
                  <p className="text-2xl font-bold">{stats.activeSessions}</p>
                </div>
                <Clock className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Open Violations</p>
                  <p className="text-2xl font-bold">{stats.openViolations}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Registered Today</p>
                  <p className="text-2xl font-bold">{stats.registeredToday}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Tabs */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="vehicles" className="space-y-6">
            <TabsList className="glass border-white/20 p-1">
              <TabsTrigger value="vehicles" className="data-[state=active]:bg-white/20">
                <Car className="w-4 h-4 mr-2" />
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="parking" className="data-[state=active]:bg-white/20">
                <Clock className="w-4 h-4 mr-2" />
                Parking
              </TabsTrigger>
              <TabsTrigger value="violations" className="data-[state=active]:bg-white/20">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Violations
              </TabsTrigger>
            </TabsList>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Register Vehicle */}
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      Register Vehicle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegisterVehicle} className="space-y-4">
                      {/* Student Information */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-white/80">Student Information</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Student ID</Label>
                            <Input
                              value={extraVehicleInfo.studentId}
                              onChange={(e) =>
                                setExtraVehicleInfo({ ...extraVehicleInfo, studentId: e.target.value })
                              }
                              className="glass border-white/20"
                              placeholder="Enter student ID"
                            />
                          </div>
                          <div>
                            <Label>Dormitory</Label>
                            <Select
                              value={extraVehicleInfo.dormitory}
                              onValueChange={(value) =>
                                setExtraVehicleInfo({ ...extraVehicleInfo, dormitory: value })
                              }
                            >
                              <SelectTrigger className="glass border-white/20">
                                <SelectValue placeholder="Select dormitory" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="alpha">Alpha</SelectItem>
                                <SelectItem value="beta">Beta</SelectItem>
                                <SelectItem value="gamma">Gamma</SelectItem>
                                <SelectItem value="delta">Delta</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Room Number</Label>
                            <Input
                              value={extraVehicleInfo.roomNumber}
                              onChange={(e) =>
                                setExtraVehicleInfo({ ...extraVehicleInfo, roomNumber: e.target.value })
                              }
                              className="glass border-white/20"
                              placeholder="Enter room number"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Information (additional) */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-white/80">Vehicle Information</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Make</Label>
                            <Select
                              value={extraVehicleInfo.make}
                              onValueChange={(value) =>
                                setExtraVehicleInfo({ ...extraVehicleInfo, make: value })
                              }
                            >
                              <SelectTrigger className="glass border-white/20">
                                <SelectValue placeholder="Select vehicle make" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Toyota">Toyota</SelectItem>
                                <SelectItem value="Honda">Honda</SelectItem>
                                <SelectItem value="Hyundai">Hyundai</SelectItem>
                                <SelectItem value="Ford">Ford</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Year</Label>
                            <Input
                              value={extraVehicleInfo.year}
                              onChange={(e) =>
                                setExtraVehicleInfo({ ...extraVehicleInfo, year: e.target.value })
                              }
                              className="glass border-white/20"
                              placeholder="e.g., 2025"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>License Plate</Label>
                          <Input
                            value={newVehicle.licensePlate}
                            onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                            className="glass border-white/20"
                            required
                          />
                        </div>
                        <div>
                          <Label>Owner Name</Label>
                          <Input
                            value={newVehicle.ownerName}
                            onChange={(e) => setNewVehicle({...newVehicle, ownerName: e.target.value})}
                            className="glass border-white/20"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={newVehicle.ownerEmail}
                            onChange={(e) => setNewVehicle({...newVehicle, ownerEmail: e.target.value})}
                            className="glass border-white/20"
                            required
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={newVehicle.ownerPhone}
                            onChange={(e) => setNewVehicle({...newVehicle, ownerPhone: e.target.value})}
                            className="glass border-white/20"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Vehicle Model</Label>
                          <Input
                            value={newVehicle.vehicleModel}
                            onChange={(e) => setNewVehicle({...newVehicle, vehicleModel: e.target.value})}
                            className="glass border-white/20"
                            required
                          />
                        </div>
                        <div>
                          <Label>Color</Label>
                          <Input
                            value={newVehicle.vehicleColor}
                            onChange={(e) => setNewVehicle({...newVehicle, vehicleColor: e.target.value})}
                            className="glass border-white/20"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          value={newVehicle.notes}
                          onChange={(e) => setNewVehicle({...newVehicle, notes: e.target.value})}
                          className="glass border-white/20"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                        Register Vehicle
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Vehicle Search & List */}
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      Vehicle Registry
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        placeholder="Search by license plate or owner..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 glass border-white/20"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {filteredVehicles?.map((vehicle) => (
                        <div key={vehicle._id} className="glass rounded-lg p-4 border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{vehicle.licensePlate}</span>
                            <Badge variant={vehicle.status === "registered" ? "default" : "destructive"}>
                              {vehicle.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/70">{vehicle.ownerName}</p>
                          <p className="text-sm text-white/60">{vehicle.vehicleModel} - {vehicle.vehicleColor}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Parking Tab */}
            <TabsContent value="parking" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Start Session */}
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle>Start Parking Session</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleStartSession} className="space-y-4">
                      <div>
                        <Label>License Plate</Label>
                        <Input
                          value={newSession.licensePlate}
                          onChange={(e) => setNewSession({...newSession, licensePlate: e.target.value})}
                          className="glass border-white/20"
                          required
                        />
                      </div>
                      <div>
                        <Label>Location/Zone</Label>
                        <Input
                          value={newSession.location}
                          onChange={(e) => setNewSession({...newSession, location: e.target.value})}
                          className="glass border-white/20"
                          placeholder="e.g., Zone A, Spot 15"
                          required
                        />
                      </div>
                      <div>
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          value={newSession.notes}
                          onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                          className="glass border-white/20"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
                        Start Session
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Active Sessions */}
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {activeSessions?.map((session) => (
                        <div key={session._id} className="glass rounded-lg p-4 border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{session.licensePlate}</span>
                            <Button
                              size="sm"
                              onClick={() => handleEndSession(session._id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              End Session
                            </Button>
                          </div>
                          <p className="text-sm text-white/70">Location: {session.location}</p>
                          <p className="text-sm text-white/60">
                            Started: {new Date(session.entryTime).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Violations Tab */}
            <TabsContent value="violations" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Report Violation */}
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle>Report Violation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleReportViolation} className="space-y-4">
                      <div>
                        <Label>License Plate</Label>
                        <Input
                          value={newViolation.licensePlate}
                          onChange={(e) => setNewViolation({...newViolation, licensePlate: e.target.value})}
                          className="glass border-white/20"
                          required
                        />
                      </div>
                      <div>
                        <Label>Violation Type</Label>
                        <Select 
                          value={newViolation.violationType} 
                          onValueChange={(value) => setNewViolation({...newViolation, violationType: value})}
                        >
                          <SelectTrigger className="glass border-white/20">
                            <SelectValue placeholder="Select violation type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unauthorized">Unauthorized Parking</SelectItem>
                            <SelectItem value="expired">Expired Session</SelectItem>
                            <SelectItem value="wrong_zone">Wrong Zone</SelectItem>
                            <SelectItem value="blocking">Blocking Access</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={newViolation.location}
                          onChange={(e) => setNewViolation({...newViolation, location: e.target.value})}
                          className="glass border-white/20"
                          required
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={newViolation.description}
                          onChange={(e) => setNewViolation({...newViolation, description: e.target.value})}
                          className="glass border-white/20"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                        Report Violation
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Open Violations */}
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle>Open Violations</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {violations?.map((violation) => (
                        <div key={violation._id} className="glass rounded-lg p-4 border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{violation.licensePlate}</span>
                            <Badge variant="destructive">{violation.violationType}</Badge>
                          </div>
                          <p className="text-sm text-white/70">{violation.description}</p>
                          <p className="text-sm text-white/60">Location: {violation.location}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}