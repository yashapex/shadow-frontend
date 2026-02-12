import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axiosconfig";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { Logo } from "@/components/layout/Logo";
import { Eye, EyeOff, User, Briefcase, AlertTriangle, CheckCircle, KeyRound, Info } from "lucide-react";

type AuthMode = "login" | "signup";
type UserRole = "candidate" | "recruiter";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accessKey?: string;
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
    if (password.length < 8) return "Min 8 chars";
    if (!password.match(/[a-z]/)) return "Need lowercase";
    if (!password.match(/[A-Z]/)) return "Need uppercase";
    if (!password.match(/[0-9]/)) return "Need number";
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = "Required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (authMode === "signup") {
      if (!formData.fullName) newErrors.fullName = "Required";
      if (!formData.password) {
        newErrors.password = "Required";
      } else {
        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Required";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mismatch";
      }
      if (userRole === "recruiter" && !formData.accessKey) {
        newErrors.accessKey = "Required";
      }
    } else {
      if (!formData.password) newErrors.password = "Required";
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
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email" && formData.email && !validateEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email" }));
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
      const backendMsg = error.response?.data?.message || "Authentication failed.";
      alert(`Error: ${backendMsg}`);
    }
  };

  const handleAuthModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "", accessKey: "" });
    setErrors({});
    setTouched({});
    setPasswordStrength(0);
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setFormData((prev) => ({ ...prev, accessKey: "" }));
    setErrors((prev) => ({ ...prev, accessKey: undefined }));
  };

  // Comfortable input class
  const inputClass = (field: string) =>
    `w-full px-4 py-3.5 bg-card/50 border rounded-xl text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:outline-none focus:bg-card hover:border-accent/30 ${
      touched[field] && errors[field as keyof FormErrors]
        ? "border-destructive focus:border-destructive"
        : "border-border focus:border-accent"
    }`;

  return (
    <div className="relative h-screen w-full bg-background text-foreground overflow-hidden flex items-center justify-center">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-[460px] px-4 flex flex-col max-h-screen">
        
        {/* Logo Area */}
        <div className="flex items-center justify-center mb-6 shrink-0">
          <Logo size="lg" clickable={true} />
        </div>

        {/* Auth Card */}
        <div className="relative glass-card rounded-3xl p-8 max-h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-30" />
          
          <div className="relative z-10">
            {/* Header / Toggle */}
            <div className="flex gap-8 mb-6 pb-2 border-b border-border/30 justify-center shrink-0">
              {["login", "signup"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleAuthModeChange(mode as AuthMode)}
                  className={`relative font-display font-bold text-lg pb-2 transition-all duration-300 capitalize ${
                    authMode === mode ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
                  }`}
                >
                  {mode === "login" ? "Login" : "Sign Up"}
                  {authMode === mode && (
                    <div className="absolute -bottom-[1px] left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-destructive rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Role Selector */}
            <div className="flex gap-3 mb-8 bg-muted/20 p-1.5 rounded-2xl border border-border/50 shrink-0">
              {["candidate", "recruiter"].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role as UserRole)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 capitalize ${
                    userRole === role
                      ? "bg-gradient-to-br from-accent to-destructive text-accent-foreground shadow-md transform scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                  }`}
                >
                  {role === "candidate" ? <User className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                  {role}
                </button>
              ))}
            </div>

            <div className="animate-fade-in-up">
              <div className="text-center mb-6">
                <h2 className="font-display text-2xl font-bold mb-2 text-gradient">
                  {authMode === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {authMode === "login" ? "Enter your credentials to continue" : "Join Shadow and start your journey today"}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {authMode === "signup" && (
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("fullName")}
                      placeholder="Full Name"
                      className={inputClass("fullName")}
                    />
                    {touched.fullName && errors.fullName && (
                      <p className="mt-1.5 text-xs text-destructive flex items-center gap-1.5 font-medium px-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {errors.fullName}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("email")}
                    placeholder="Email Address"
                    className={inputClass("email")}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1.5 font-medium px-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {errors.email}
                    </p>
                  )}
                </div>

                {authMode === "signup" && userRole === "recruiter" && (
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        name="accessKey"
                        value={formData.accessKey}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("accessKey")}
                        placeholder="Recruiter Access Key"
                        className={`${inputClass("accessKey")} pr-10`}
                      />
                      <Info className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/70" title="Required for recruiter access" />
                    </div>
                    {touched.accessKey && errors.accessKey && (
                      <p className="mt-1.5 text-xs text-destructive flex items-center gap-1.5 font-medium px-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {errors.accessKey}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <div className="relative">
                    <input
                      type={showPassword.login ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("password")}
                      placeholder="Password"
                      className={`${inputClass("password")} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("login")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-all p-1"
                    >
                      {showPassword.login ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1.5 font-medium px-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {errors.password}
                    </p>
                  )}
                  {authMode === "signup" && formData.password && (
                    <div className="flex gap-1.5 mt-2 h-1 px-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-500 ${
                            i < passwordStrength
                              ? passwordStrength >= 4 ? "bg-green-500" : passwordStrength >= 3 ? "bg-yellow-500" : "bg-destructive"
                              : "bg-muted/30"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {authMode === "signup" && (
                  <div>
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Confirm Password"
                      className={inputClass("confirmPassword")}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-destructive flex items-center gap-1.5 font-medium px-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-4 bg-gradient-to-br from-accent to-destructive text-accent-foreground font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 text-base relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {isLoading ? "Processing..." : authMode === "login" ? "Sign In" : "Create Account"}
                  </span>
                </button>
              </form>

              <div className="text-center mt-6 text-sm text-muted-foreground">
                {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={() => handleAuthModeChange(authMode === "login" ? "signup" : "login")} className="text-accent hover:text-destructive font-semibold transition-colors">
                  {authMode === "login" ? "Sign up" : "Log in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center animate-scale-in p-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-destructive flex items-center justify-center shadow-lg pulse-glow">
              <CheckCircle className="w-12 h-12 text-accent-foreground" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-2 text-foreground">
              {authMode === "login" ? "Welcome Back!" : "Success!"}
            </h2>
            <p className="text-muted-foreground text-base">
              Redirecting you to the dashboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}