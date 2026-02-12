import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axiosconfig";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { Logo } from "@/components/layout/Logo";

type AuthMode = "login" | "signup";
type UserRole = "candidate" | "recruiter";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accessKey?: string;
  rememberMe?: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  accessKey?: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [userRole, setUserRole] = useState<UserRole>("candidate");
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accessKey: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const togglePassword = (field: string) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!password.match(/[a-z]/)) return "Password must contain at least one lowercase letter";
    if (!password.match(/[A-Z]/)) return "Password must contain at least one uppercase letter";
    if (!password.match(/[0-9]/)) return "Password must contain at least one number";
    if (!password.match(/[^a-zA-Z0-9]/)) return "Password must contain at least one special character";
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (authMode === "signup") {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else {
        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (userRole === "recruiter" && !formData.accessKey) {
        newErrors.accessKey = "Access key is required for recruiters";
      }
    } else {
      if (!formData.password) newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (name === "password") setPasswordStrength(calculatePasswordStrength(value));
    if (name === "confirmPassword" && formData.password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: value !== formData.password ? "Passwords do not match" : undefined,
      }));
    }
    if (name === "password" && formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: value !== formData.confirmPassword ? "Passwords do not match" : undefined,
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email" && formData.email && !validateEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
    }
    if (field === "password" && formData.password && authMode === "signup") {
      const err = validatePassword(formData.password);
      if (err) setErrors((prev) => ({ ...prev, password: err }));
    }
    if (field === "confirmPassword" && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true, accessKey: true });
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const AUTH_PATH = "/auth";
      let response;

      if (authMode === "signup") {
        response = await api.post(`${AUTH_PATH}/signup`, {
          username: formData.email,
          password: formData.password,
          name: formData.fullName,
          role: userRole.toUpperCase(),
          adminKey: formData.accessKey || null,
        });
      } else {
        response = await api.post(`${AUTH_PATH}/login`, {
          username: formData.email,
          password: formData.password,
        });
      }

      if (response.status === 200) {
        const { token, userProfileresponse } = response.data;
        login(token, { name: userProfileresponse.name, role: userProfileresponse.role });
        setIsLoading(false);
        setShowSuccess(true);

        setTimeout(() => {
          const targetRoute = userProfileresponse.role === "RECRUITER" ? "/recruiter" : "/dashboard";
          navigate(targetRoute);
        }, 2000);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Auth Error:", error);
      const backendMsg = error.response?.data?.message || "Authentication failed. Please try again.";
      alert(`Error: ${backendMsg}`);
      if (backendMsg.includes("User with this email already exists")) {
        setErrors((prev) => ({ ...prev, email: "This email is already taken" }));
      }
    }
  };

  const getStrengthLabel = () => {
    const labels = ["Weak", "Fair", "Good", "Strong"];
    return passwordStrength > 0 ? labels[passwordStrength - 1] : "Too short";
  };

  const getStrengthColor = () => {
    if (passwordStrength >= 4) return "text-green-500";
    if (passwordStrength >= 3) return "text-yellow-500";
    if (passwordStrength >= 1) return "text-destructive";
    return "text-muted-foreground";
  };

  const handleAuthModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "", accessKey: "", rememberMe: false });
    setErrors({});
    setTouched({});
    setPasswordStrength(0);
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setFormData((prev) => ({ ...prev, accessKey: "" }));
    setErrors((prev) => ({ ...prev, accessKey: undefined }));
  };

  const handleContinue = () => {
    const role = localStorage.getItem("userRole");
    navigate(role === "RECRUITER" ? "/recruiter" : "/dashboard");
  };

  const inputClass = (field: string) =>
    `w-full px-5 py-4 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:outline-none focus:bg-primary/20 hover:border-accent/30 ${
      touched[field] && errors[field as keyof FormErrors]
        ? "border-destructive focus:border-destructive focus:shadow-[0_0_0_3px_hsl(var(--destructive)/0.15)]"
        : "border-border/30 focus:border-accent focus:shadow-[0_0_0_3px_hsl(var(--accent)/0.15)]"
    }`;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-[480px]">
          {/* Logo */}
          <div className="flex items-center justify-center mb-12">
            <Logo size="lg" clickable={true} />
          </div>

          {/* Auth Card */}
          <div className="relative glass-card rounded-3xl p-12 overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,hsl(var(--accent)/0.08)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10">
              {/* Auth Toggle */}
              <div className="flex gap-8 mb-8 pb-6 border-b border-border/30 justify-center">
                <button
                  onClick={() => handleAuthModeChange("login")}
                  className={`relative font-bold text-2xl transition-all duration-300 ${
                    authMode === "login" ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
                  }`}
                >
                  Login
                  {authMode === "login" && (
                    <div className="absolute -bottom-6 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-destructive" />
                  )}
                </button>
                <button
                  onClick={() => handleAuthModeChange("signup")}
                  className={`relative font-bold text-2xl transition-all duration-300 ${
                    authMode === "signup" ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
                  }`}
                >
                  Sign Up
                  {authMode === "signup" && (
                    <div className="absolute -bottom-6 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-destructive" />
                  )}
                </button>
              </div>

              {/* Role Selector */}
              <div className="flex gap-4 mb-8 bg-background p-2 rounded-2xl border border-border/30">
                <button
                  onClick={() => handleRoleChange("candidate")}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 ${
                    userRole === "candidate"
                      ? "bg-gradient-to-br from-accent to-destructive text-accent-foreground shadow-[0_4px_20px_hsl(var(--accent)/0.4)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                  }`}
                >
                  <span className="text-xl">👤</span>
                  Candidate
                </button>
                <button
                  onClick={() => handleRoleChange("recruiter")}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 ${
                    userRole === "recruiter"
                      ? "bg-gradient-to-br from-accent to-destructive text-accent-foreground shadow-[0_4px_20px_hsl(var(--accent)/0.4)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                  }`}
                >
                  <span className="text-xl">💼</span>
                  Recruiter
                </button>
              </div>

              {/* Login Form */}
              {authMode === "login" && (
                <div className="animate-fade-in-up">
                  <div className="text-center mb-8">
                    <h2 className="font-display text-3xl font-bold mb-2 text-gradient">Welcome Back</h2>
                    <p className="text-muted-foreground text-[0.95rem]">Sign in to continue to your dashboard</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-6">
                      <label className="block text-muted-foreground text-sm font-semibold mb-3">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("email")}
                        placeholder="your.email@example.com"
                        className={inputClass("email")}
                      />
                      {touched.email && errors.email && (
                        <p className="mt-2 text-sm text-destructive flex items-center gap-1">⚠️ {errors.email}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-muted-foreground text-sm font-semibold mb-3">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.login ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("password")}
                          placeholder="Enter your password"
                          className={`${inputClass("password")} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword("login")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-all duration-300 text-xl hover:scale-110"
                        >
                          {showPassword.login ? "🙈" : "👁️"}
                        </button>
                      </div>
                      {touched.password && errors.password && (
                        <p className="mt-2 text-sm text-destructive flex items-center gap-1">⚠️ {errors.password}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} className="peer sr-only" />
                        <div className="relative w-5 h-5 bg-background border border-border/30 rounded-md transition-all duration-300 peer-checked:bg-gradient-to-br peer-checked:from-accent peer-checked:to-destructive peer-checked:border-accent group-hover:border-accent" />
                        <span className="text-muted-foreground text-sm">Remember me</span>
                      </label>
                      <a href="#" className="text-accent text-sm hover:text-destructive transition-colors duration-300">
                        Forgot password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-8 py-4 bg-gradient-to-br from-accent to-destructive text-accent-foreground font-semibold rounded-xl shadow-[0_4px_20px_hsl(var(--accent)/0.4)] hover:shadow-[0_6px_30px_hsl(var(--destructive)/0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                      <span className="relative flex items-center justify-center gap-2">
                        {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {isLoading ? "Signing In..." : "Sign In"}
                      </span>
                    </button>

                    <div className="text-center mt-8 text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button type="button" onClick={() => handleAuthModeChange("signup")} className="text-accent hover:text-destructive transition-colors duration-300">
                        Sign up now
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Signup Form */}
              {authMode === "signup" && (
                <div className="animate-fade-in-up">
                  <div className="text-center mb-8">
                    <h2 className="font-display text-3xl font-bold mb-2 text-gradient">Create Account</h2>
                    <p className="text-muted-foreground text-[0.95rem]">Join Shadow and start your journey</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-6">
                      <label className="block text-muted-foreground text-sm font-semibold mb-3">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("fullName")}
                        placeholder={userRole === "candidate" ? "John Doe" : "Jane Smith"}
                        className={inputClass("fullName")}
                      />
                      {touched.fullName && errors.fullName && (
                        <p className="mt-2 text-sm text-destructive flex items-center gap-1">⚠️ {errors.fullName}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-muted-foreground text-sm font-semibold mb-3">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("email")}
                        placeholder={userRole === "candidate" ? "your.email@example.com" : "your.email@company.com"}
                        className={inputClass("email")}
                      />
                      {touched.email && errors.email && (
                        <p className="mt-2 text-sm text-destructive flex items-center gap-1">⚠️ {errors.email}</p>
                      )}
                      {touched.email && !errors.email && formData.email && validateEmail(formData.email) && (
                        <p className="mt-2 text-sm text-green-500 flex items-center gap-1">✓ Email is valid</p>
                      )}
                    </div>

                    {userRole === "recruiter" && (
                      <div className="mb-6">
                        <label className="flex items-center justify-between text-muted-foreground text-sm font-semibold mb-3">
                          <span>Secret Recruiter Access Key</span>
                          <span className="w-[18px] h-[18px] rounded-full bg-accent/15 flex items-center justify-center text-xs cursor-help hover:bg-accent hover:text-accent-foreground transition-all duration-300" title="This key verifies you are an authorized recruiter">
                            ⓘ
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="accessKey"
                            value={formData.accessKey}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur("accessKey")}
                            placeholder="Enter your access key"
                            className={`${inputClass("accessKey")} pr-12`}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">🔑</span>
                        </div>
                        {touched.accessKey && errors.accessKey && (
                          <p className="mt-2 text-sm text-destructive flex items-center gap-1">⚠️ {errors.accessKey}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3 px-4 py-2 bg-accent/10 border border-accent rounded-lg text-sm text-accent">
                          <span className="text-base">🛡️</span>
                          <span>Verified Recruiter Authorization Required</span>
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="block text-muted-foreground text-sm font-semibold mb-3">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.signup ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("password")}
                          placeholder="Create a strong password"
                          className={`${inputClass("password")} pr-12`}
                        />
                        <button type="button" onClick={() => togglePassword("signup")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-all duration-300 text-xl hover:scale-110">
                          {showPassword.signup ? "🙈" : "👁️"}
                        </button>
                      </div>
                      {touched.password && errors.password && (
                        <p className="mt-2 text-sm text-destructive flex items-center gap-1">⚠️ {errors.password}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                              i < passwordStrength
                                ? passwordStrength >= 4 ? "bg-green-500" : passwordStrength >= 3 ? "bg-yellow-500" : "bg-destructive"
                                : "bg-muted/30"
                            }`}
                          />
                        ))}
                      </div>
                      {formData.password && (
                        <p className={`text-xs mt-1 ${getStrengthColor()}`}>Password strength: {getStrengthLabel()}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-muted-foreground text-sm font-semibold mb-3">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("confirmPassword")}
                          placeholder="Re-enter your password"
                          className={`${inputClass("confirmPassword")} pr-12`}
                        />
                        <button type="button" onClick={() => togglePassword("confirm")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-all duration-300 text-xl hover:scale-110">
                          {showPassword.confirm ? "🙈" : "👁️"}
                        </button>
                      </div>
                      {touched.confirmPassword && errors.confirmPassword && (
                        <p className="mt-2 text-sm text-destructive flex items-center gap-1">⚠️ {errors.confirmPassword}</p>
                      )}
                      {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="mt-2 text-sm text-green-500 flex items-center gap-1">✓ Passwords match</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-8 py-4 bg-gradient-to-br from-accent to-destructive text-accent-foreground font-semibold rounded-xl shadow-[0_4px_20px_hsl(var(--accent)/0.4)] hover:shadow-[0_6px_30px_hsl(var(--destructive)/0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                      <span className="relative flex items-center justify-center gap-2">
                        {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {isLoading ? "Creating Account..." : userRole === "recruiter" ? "Create Recruiter Account" : "Create Account"}
                      </span>
                    </button>

                    <div className="text-center mt-8 text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <button type="button" onClick={() => handleAuthModeChange("login")} className="text-accent hover:text-destructive transition-colors duration-300">
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center animate-scale-in">
            <div className="w-[100px] h-[100px] mx-auto mb-8 rounded-full bg-gradient-to-br from-accent to-destructive flex items-center justify-center text-[50px] shadow-[0_10px_40px_hsl(var(--accent)/0.6)] pulse-glow">
              ✓
            </div>
            <h2 className="font-display text-3xl font-bold mb-4">
              {authMode === "login" ? "Welcome Back!" : "Account Created!"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {authMode === "login" ? "Login successful. Redirecting to your dashboard..." : "Your account has been created successfully. Redirecting..."}
            </p>
            <button
              onClick={handleContinue}
              className="px-8 py-4 bg-gradient-to-br from-accent to-destructive text-accent-foreground font-semibold rounded-xl shadow-[0_4px_20px_hsl(var(--accent)/0.4)] hover:shadow-[0_6px_30px_hsl(var(--destructive)/0.6)] hover:-translate-y-0.5 transition-all duration-300 max-w-[300px] mx-auto"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
