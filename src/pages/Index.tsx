import { useState } from "react";
import { Mail, Lock, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4444/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setStep("otp");
        toast({ title: "OTP Sent!", description: data.message });
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Server error", variant: "destructive" });
    }

    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4444/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({ title: "Success!", description: data.message });
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Server error", variant: "destructive" });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-bg animate-gradient-shift bg-[length:200%_200%]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-primary shadow-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              {step === "email" ? "Sign in to continue" : "Verify your email"}
            </p>
          </div>

          {/* Auth card */}
          <div className="backdrop-blur-xl bg-card/50 border border-border/50 rounded-2xl p-8 shadow-card animate-scale-in">
            {!isSuccess ? (
              <>
                {step === "email" ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary transition-all"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300 group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending OTP...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Send Verification Code
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Secure authentication
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      We'll send a one-time verification code to your email.
                      <br />
                      No password required.
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Verification Code</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter the 6-digit code sent to{" "}
                        <span className="text-foreground font-medium">{email}</span>
                      </p>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isLoading}>
                          <InputOTPGroup>
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                              <InputOTPSlot
                                key={index}
                                index={index}
                                className="w-12 h-14 text-lg bg-secondary/50 border-border/50"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Verifying...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Verify & Sign In
                        </div>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                      }}
                      disabled={isLoading}
                    >
                      ← Back to email
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={async () => {
                          try {
                            const response = await fetch("http://localhost:4444/api/auth/send-otp", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email }),
                            });
                            const data = await response.json();
                            toast({ title: "Code Resent", description: data.message });
                          } catch (err) {
                            toast({ title: "Error", description: "Server error", variant: "destructive" });
                          }
                        }}
                      >
                        Didn't receive the code? <span className="text-primary font-medium">Resend</span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <div className="text-center py-8 space-y-4 animate-scale-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Welcome!</h2>
                <p className="text-muted-foreground">You've successfully signed in to your account</p>
                <Button
                  className="mt-6 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  onClick={() => {
                    // Reset for demo purposes
                    setIsSuccess(false);
                    setStep("email");
                    setEmail("");
                    setOtp("");
                  }}
                >
                  Continue to Dashboard
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-muted-foreground animate-fade-in">
            <p>Protected by enterprise-grade encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
