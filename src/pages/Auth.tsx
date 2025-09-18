import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX, Shield, Users, ArrowLeft, Car } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginType = searchParams.get("type") || "user";
  
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>(loginType === "staff" ? "staff" : "user");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || (userRole === "staff" ? "/staff-dashboard" : "/user-dashboard");
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth, userRole]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      formData.append("role", userRole);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      formData.append("role", userRole);
      await signIn("email-otp", formData);

      const redirect = redirectAfterAuth || (userRole === "staff" ? "/staff-dashboard" : "/user-dashboard");
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const isStaffLogin = loginType === "staff";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background orbs */}
      <div className="floating-orb w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 top-10 -left-20" />
      <div className="floating-orb w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-600 top-1/2 -right-20" />
      
      {/* Navigation */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/login-select")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">Parkmeter</span>
          </div>
        </div>
      </div>

      {/* Auth Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
        <Card className="w-full max-w-md glass rounded-3xl border-white/20">
          {step === "signIn" ? (
            <>
              <CardHeader className="text-center pb-6">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                  isStaffLogin 
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500" 
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                }`}>
                  {isStaffLogin ? (
                    <Shield className="w-8 h-8 text-white" />
                  ) : (
                    <Users className="w-8 h-8 text-white" />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">
                  {isStaffLogin ? "Staff Access" : "User Access"}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {isStaffLogin 
                    ? "Enter your credentials to access staff dashboard"
                    : "Enter your email to access your parking account"
                  }
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleEmailSubmit}>
                <CardContent className="space-y-6">
                  {isStaffLogin && (
                    <div>
                      <label className="text-sm font-medium text-white/80 mb-2 block">
                        Department
                      </label>
                      <Select value={userRole} onValueChange={setUserRole}>
                        <SelectTrigger className="glass border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Security Staff</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Demo Login for Staff */}
                  {isStaffLogin && (
                    <div className="glass border-white/20 rounded-xl p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm text-white/80">
                          Want to preview the staff dashboard?
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="glass border-white/20 text-white hover:bg-white/10"
                          onClick={() => navigate("/staff-dashboard?demo=1")}
                        >
                          Demo Login
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Show Demo Login only for User login */}
                  {!isStaffLogin && (
                    <div className="glass border-white/20 rounded-xl p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm text-white/80">
                          Want to explore quickly?
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="glass border-white/20 text-white hover:bg-white/10"
                          onClick={() => navigate("/user-dashboard?demo=1")}
                        >
                          Demo Login
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        className="pl-9 glass border-white/20 text-white placeholder:text-white/50"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      disabled={isLoading}
                      className="glass border-white/20 text-white hover:bg-white/10"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}
                </CardContent>
              </form>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Check your email</CardTitle>
                <CardDescription className="text-white/70">
                  We've sent a code to {step.email}
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleOtpSubmit}>
                <CardContent className="pb-4">
                  <input type="hidden" name="email" value={step.email} />
                  <input type="hidden" name="code" value={otp} />

                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                          const form = (e.target as HTMLElement).closest("form");
                          if (form) {
                            form.requestSubmit();
                          }
                        }
                      }}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} className="glass border-white/20 text-white" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  
                  {error && (
                    <p className="mt-2 text-sm text-red-400 text-center">
                      {error}
                    </p>
                  )}
                  
                  <p className="text-sm text-white/60 text-center mt-4">
                    Didn't receive a code?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-white/80 hover:text-white"
                      onClick={() => setStep("signIn")}
                    >
                      Try again
                    </Button>
                  </p>
                </CardContent>
                
                <CardFooter className="flex-col gap-2">
                  <Button
                    type="submit"
                    className={`w-full py-6 text-lg rounded-2xl ${
                      isStaffLogin 
                        ? "bg-blue-500 hover:bg-blue-600" 
                        : "bg-purple-500 hover:bg-purple-600"
                    } text-white`}
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("signIn")}
                    disabled={isLoading}
                    className="w-full text-white/70 hover:text-white hover:bg-white/5"
                  >
                    Use different email
                  </Button>
                </CardFooter>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}