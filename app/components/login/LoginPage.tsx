"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginPage.module.css";
import { httpClient } from "../../utils/api";
import { useToast } from "../Toast/useToast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegErrors {
  fullName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
}

interface StudentData {
  _id: string;
  studentName: string;
  email: string;
  mobileNumber: string;
  [key: string]: unknown;
}

// ─── Tech logos ───────────────────────────────────────────────────────────────

const techLogos = [
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    alt: "Python",
    style: { top: "32%", left: "30%" }
  },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    alt: "SQL",
    style: { top: "24%", left: "20%" }
  },
  // {
  //   src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
  //   alt: "PySpark",
  //   style: { top: "30%", left: "8%" }
  // },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hadoop/hadoop-original.svg",
    alt: "Hadoop",
    style: { top: "22%", left: "46%" }
  },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
    alt: "Azure",
    style: { top: "48%", left: "14%" }
  },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    alt: "GCP",
    style: { top: "46%", left: "36%" }
  },
  {
    src: "https://www.vectorlogo.zone/logos/databricks/databricks-icon.svg",
    alt: "Databricks",
    style: { top: "62%", left: "22%" }
  },
  // {
  //   src: "https://www.vectorlogo.zone/logos/apache_hive/apache_hive-icon.svg",
  //   alt: "Hive",
  //   style: { top: "60%", left: "44%" }
  // }
];

const carouselSlides = ["Grow with projects", "Learn from experts", "Build your career"];

// ─── OTP Input ────────────────────────────────────────────────────────────────

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(4, "").split("").slice(0, 4);

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = [...digits];
    arr[i] = ch;
    onChange(arr.join("").trimEnd());
    if (ch && i < 3) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      const arr = [...digits];
      arr[i - 1] = "";
      onChange(arr.join("").trimEnd());
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted) {
      onChange(pasted);
      inputs.current[Math.min(pasted.length, 3)]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className={styles.otpRow}>
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ""}
          className={`${styles.otpBox} ${digits[i] ? styles.otpFilled : ""}`}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active || remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [active, remaining]);

  const start = () => { setRemaining(seconds); setActive(true); };
  const reset = () => { setRemaining(seconds); setActive(true); };

  return { remaining, start, reset, done: remaining <= 0 && active };
}

// ─── Eye icon ─────────────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ─── Back button ──────────────────────────────────────────────────────────────

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button className={styles.backBtn} onClick={onClick}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      Back
    </button>
  );
}

// ─── Field error ──────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className={styles.fieldError}>{msg}</p>;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateRegister(
  fullName: string,
  email: string,
  mobile: string,
  password: string,
  confirmPassword: string
): RegErrors {
  const errs: RegErrors = {};

  if (!fullName.trim()) errs.fullName = "Full name is required.";
  else if (fullName.trim().length < 2) errs.fullName = "Name must be at least 2 characters.";

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) errs.email = "Email is required.";
  else if (!emailRe.test(email)) errs.email = "Enter a valid email address.";

  if (!mobile) errs.mobile = "Mobile number is required.";
  else if (mobile.length !== 10) errs.mobile = "Enter a valid 10-digit mobile number.";

  const pwRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password) errs.password = "Password is required.";
  else if (!pwRe.test(password))
    errs.password = "Min 8 chars, include uppercase, lowercase, number & special character.";

  if (!confirmPassword) errs.confirmPassword = "Please confirm your password.";
  else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match.";

  return errs;
}

// ─── Session helper ───────────────────────────────────────────────────────────

function saveSession(token: string, student: StudentData) {
  localStorage.setItem("student_token", token);
  localStorage.setItem("student", JSON.stringify(student));
}

// ─── Mask email helper ────────────────────────────────────────────────────────

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.slice(0, 2);
  const masked = "*".repeat(Math.max(user.length - 2, 2));
  return `${visible}${masked}@${domain}`;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [currentSlide, setCurrentSlide] = useState(0);

  // ── Login state ───────────────────────────────────────────────────────────────
const [loginStep, setLoginStep] = useState<
  "email" | "otp-email" | "otp" | "forgot-password"
  >("email");
  // ── Forgot Password ───────────────────────────────────────────────────────

const [forgotStep, setForgotStep] = useState<"email" | "otp" | "reset">("email");

const [forgotEmail, setForgotEmail] = useState("");
const [forgotOtp, setForgotOtp] = useState("");

const [forgotPassword, setForgotPassword] = useState("");
const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");

const [showForgotPw, setShowForgotPw] = useState(false);
const [showForgotConfirmPw, setShowForgotConfirmPw] = useState(false);

const [forgotLoading, setForgotLoading] = useState(false);

const forgotTimer = useCountdown(30);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginEmailErrors, setLoginEmailErrors] = useState<{ email?: string; password?: string }>({});
  const [loginEmailTouched, setLoginEmailTouched] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // OTP login
  const [otpLoginEmail, setOtpLoginEmail] = useState("");
  const [otpLoginEmailError, setOtpLoginEmailError] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const loginTimer = useCountdown(30);

  // ── Register state ────────────────────────────────────────────────────────────
  const [regStep, setRegStep] = useState<"details" | "otp">("details");
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [regErrors, setRegErrors] = useState<RegErrors>({});
  const [regTouched, setRegTouched] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regOtp, setRegOtp] = useState("");
  const [regStudentId, setRegStudentId] = useState<string | null>(null);
  const [regVerifying, setRegVerifying] = useState(false);
  const regTimer = useCountdown(30);

  // ── Forgot Password: Send OTP ─────────────────────────────────────────────

const handleForgotSendOtp = async () => {
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!forgotEmail.trim() || !emailRe.test(forgotEmail)) {
    error("Invalid Email", "Enter a valid email address.");
    return;
  }

  setForgotLoading(true);

  try {
    await httpClient.post("/auth/student/forgot-password/send-otp", {
      email: forgotEmail.trim().toLowerCase(),
    });

    forgotTimer.start();

    success(
      "OTP Sent!",
      `OTP sent to ${maskEmail(forgotEmail)}`
    );

    setForgotStep("otp");
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      "Failed to send OTP.";

    error("Failed", msg);
  } finally {
    setForgotLoading(false);
  }
};

// ── Forgot Password: Verify OTP ───────────────────────────────────────────

const handleForgotVerifyOtp = async () => {
  if (forgotOtp.length !== 4) return;

  setForgotLoading(true);

  try {
    await httpClient.post(
      "/auth/student/forgot-password/verify-otp",
      {
        email: forgotEmail.trim().toLowerCase(),
        otp: forgotOtp,
      }
    );

    success(
      "OTP Verified",
      "Now create your new password."
    );

    setForgotStep("reset");
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      "Invalid or expired OTP.";

    error("Verification Failed", msg);
  } finally {
    setForgotLoading(false);
  }
};

// ── Forgot Password: Reset Password ───────────────────────────────────────

const handleForgotResetPassword = async () => {
  const pwRe =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!pwRe.test(forgotPassword)) {
    error(
      "Weak Password",
      "Min 8 chars, include uppercase, lowercase, number & special character."
    );
    return;
  }

  if (forgotPassword !== forgotConfirmPassword) {
    error("Password Mismatch", "Passwords do not match.");
    return;
  }

  setForgotLoading(true);

  try {
    await httpClient.post(
      "/auth/student/forgot-password/reset-password",
      {
        email: forgotEmail.trim().toLowerCase(),
        otp: forgotOtp,
        password: forgotPassword,
      }
    );

    success(
      "Password Reset Successful",
      "Please login using your new password."
    );

    setForgotStep("email");

    setForgotEmail("");
    setForgotOtp("");
    setForgotPassword("");
    setForgotConfirmPassword("");

    setLoginStep("email");
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      "Failed to reset password.";

    error("Reset Failed", msg);
  } finally {
    setForgotLoading(false);
  }
};

// ── Forgot Password: Resend OTP ────────────────────────────────────────────

const handleForgotResendOtp = async () => {
  try {
    await httpClient.post(
      "/auth/student/forgot-password/send-otp",
      {
        email: forgotEmail.trim().toLowerCase(),
      }
    );

    forgotTimer.reset();

    success(
      "OTP Resent!",
      `New OTP sent to ${maskEmail(forgotEmail)}`
    );
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      "Failed to resend OTP.";

    error("Failed", msg);
  }
};

  // ── Redirect if already logged in ────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("student_token");
    if (token) {
      router.replace("/lms/dashboard");
    }
  }, [router]);

  // ── Carousel ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % carouselSlides.length), 3000);
    return () => clearInterval(t);
  }, []);

  // ── Live register validation ──────────────────────────────────────────────────
  // useEffect(() => {
  //   if (regTouched) {
  //     setRegErrors(validateRegister(regFullName, regEmail, regMobile, regPassword, regConfirm));
  //   }
  // }, [regFullName, regEmail, regMobile, regPassword, regConfirm, regTouched]);

  // ── Login: email + password ───────────────────────────────────────────────────

  const handleEmailLogin = async () => {
    setLoginEmailTouched(true);
    const errs: { email?: string; password?: string } = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginEmail.trim()) errs.email = "Email is required.";
    else if (!emailRe.test(loginEmail)) errs.email = "Enter a valid email address.";
    if (!loginPassword) errs.password = "Password is required.";
    setLoginEmailErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoginLoading(true);
    try {
      const res = await httpClient.post("/auth/student/login", {
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });
      saveSession(res.data.token, res.data.student);
      success("Login Successful! 🎉", "Welcome back! Redirecting to your dashboard.");
      router.push("/lms/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid email or password.";
      error("Login Failed", msg);
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Login: send OTP to email ──────────────────────────────────────────────────

  const handleSendLoginOtp = async () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!otpLoginEmail.trim() || !emailRe.test(otpLoginEmail)) {
      setOtpLoginEmailError("Enter a valid email address.");
      return;
    }
    setOtpLoginEmailError("");
    setOtpSending(true);
    try {
      await httpClient.post("/auth/student/send-otp", {
        email: otpLoginEmail.trim().toLowerCase(),
      });
      setLoginStep("otp");
      loginTimer.start();
      success("OTP Sent!", `Check your inbox at ${maskEmail(otpLoginEmail)}.`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to send OTP. Please try again.";
      error("Failed to Send OTP", msg);
    } finally {
      setOtpSending(false);
    }
  };

  // ── Login: verify OTP ─────────────────────────────────────────────────────────

  const handleVerifyLoginOtp = async () => {
    if (loginOtp.length !== 4) return;
    setOtpVerifying(true);
    try {
      const res = await httpClient.post("/auth/student/verify-otp", {
        email: otpLoginEmail.trim().toLowerCase(),
        otp: loginOtp,
      });
      saveSession(res.data.token, res.data.student);
      success("Login Successful! 🎉", "Welcome back! Redirecting to your dashboard.");
      router.push("/lms/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid or expired OTP.";
      error("Verification Failed", msg);
    } finally {
      setOtpVerifying(false);
    }
  };

  // ── Login: resend OTP ─────────────────────────────────────────────────────────

  const handleResendLoginOtp = async () => {
    try {
      await httpClient.post("/auth/student/send-otp", {
        email: otpLoginEmail.trim().toLowerCase(),
      });
      loginTimer.reset();
      success("OTP Resent!", `A new OTP has been sent to ${maskEmail(otpLoginEmail)}.`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to resend OTP.";
      error("Failed to Resend OTP", msg);
    }
  };

  // ── Register: submit details ──────────────────────────────────────────────────

 const handleRegisterSubmit = async () => {
  if (regLoading) return;

  setRegTouched(true);

  const errs = validateRegister(
    regFullName,
    regEmail,
    regMobile,
    regPassword,
    regConfirm
  );

  setRegErrors(errs);

  if (Object.keys(errs).length > 0) {
    return;
  }

  setRegLoading(true);

  try {
    console.log("REGISTER REQUEST");

    const res = await httpClient.post(
      "/auth/student/register",
      {
        studentName: regFullName.trim(),
        email: regEmail.trim().toLowerCase(),
        mobileNumber: regMobile.trim(),
        password: regPassword,
      }
    );

    console.log("REGISTER RESPONSE", res.data);

    const studentId =
      res.data.studentId ||
      res.data.student?._id ||
      res.data.data?._id;

    if (!studentId) {
      throw new Error("Student ID not returned from API");
    }

    setRegStudentId(studentId);

    setRegStep("otp");

    regTimer.start();

    success(
      "OTP Sent!",
      `Check your inbox at ${maskEmail(regEmail)}.`
    );
  } catch (err: any) {
    console.log("REGISTER ERROR", err?.response?.data);

    const msg =
      err?.response?.data?.message ||
      "Registration failed. Please try again.";

    error("Registration Failed", msg);
  } finally {
    setRegLoading(false);
  }
};

  // ── Register: verify OTP ──────────────────────────────────────────────────────

  const handleVerifyRegOtp = async () => {
    if (regOtp.length !== 4 || !regStudentId) return;
    setRegVerifying(true);
    try {
      const res = await httpClient.post("/auth/student/verify-registration", {
        studentId: regStudentId,
        otp: regOtp,
      });
      saveSession(res.data.token, res.data.student);
      success("Account Created! 🎉", "Your account has been verified. Redirecting to your dashboard.");
      router.push("/lms/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid or expired OTP.";
      error("Verification Failed", msg);
    } finally {
      setRegVerifying(false);
    }
  };

  // ── Register: resend OTP ──────────────────────────────────────────────────────

  const handleResendRegOtp = async () => {
    if (!regStudentId) return;
    try {
      await httpClient.post("/auth/student/resend-registration-otp", {
        studentId: regStudentId,
      });
      regTimer.reset();
      success("OTP Resent!", `A new OTP has been sent to ${maskEmail(regEmail)}.`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to resend OTP.";
      error("Failed to Resend OTP", msg);
    }
  };

  // ── Tab switch ────────────────────────────────────────────────────────────────

  const switchTab = (t: "login" | "register") => {
    setTab(t);
    setLoginStep("email");
    setLoginOtp(""); setOtpLoginEmail(""); setOtpLoginEmailError("");
    setLoginEmail(""); setLoginPassword(""); setShowLoginPw(false);
    setLoginEmailErrors({}); setLoginEmailTouched(false);
    setRegStep("details"); setRegOtp(""); setRegStudentId(null);
    setRegFullName(""); setRegEmail(""); setRegMobile("");
    setRegPassword(""); setRegConfirm("");
    setRegErrors({}); setRegTouched(false);
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>

      {/* ═══ LEFT PANEL ═══ */}
      <div className={styles.leftPanel}>
        <div className={styles.imageArea}>
          {techLogos.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              className={styles.techLogo}
              style={{ ...logo.style, animationDelay: `${i * 0.35}s` } as React.CSSProperties}
            />
          ))}
          <div className={styles.girlWrap}>
            <img src="/assets/images/login/girl.png" alt="Student" className={styles.girlImg} />
          </div>
          <div className={styles.carousel}>
            <p className={styles.carouselText}>{carouselSlides[currentSlide]}</p>
            <div className={styles.dots}>
              {carouselSlides.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === currentSlide ? styles.dotActive : ""}`}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>

          {/* Tabs */}
          <div className={styles.tabsWrapper}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tabBtn} ${tab === "login" ? styles.tabActive : ""}`}
                onClick={() => switchTab("login")}
              >
                Login
              </button>
              <button
                className={`${styles.tabBtn} ${tab === "register" ? styles.tabActive : ""}`}
                onClick={() => switchTab("register")}
              >
                Register
              </button>
              <span
                className={styles.tabSlider}
                style={{ left: tab === "login" ? "4px" : "calc(50% + 0px)" }}
              />
            </div>
          </div>

          {/* ════ LOGIN TAB ════ */}
          {tab === "login" && (
            <div className={styles.tabContent}>

              {/* Step 1 — Email + Password */}
              {loginStep === "email" && (
                <>
                  <div className={styles.tabHeader}>
                    <h2 className={styles.welcomeTitle}>Welcome Back</h2>
                    <p className={styles.welcomeSub}>Sign in with your email and password</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className={`${styles.input} ${loginEmailTouched && loginEmailErrors.email ? styles.inputError : ""}`}
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (loginEmailTouched) {
                          const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          setLoginEmailErrors((prev) => ({
                            ...prev,
                            email: !e.target.value.trim()
                              ? "Email is required."
                              : !emailRe.test(e.target.value)
                              ? "Enter a valid email address."
                              : undefined,
                          }));
                        }
                      }}
                      onBlur={() => setLoginEmailTouched(true)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                    />
                    <FieldError msg={loginEmailErrors.email} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <div className={styles.passwordWrap}>
                      <input
                        type={showLoginPw ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`${styles.input} ${loginEmailTouched && loginEmailErrors.password ? styles.inputError : ""}`}
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (loginEmailTouched) {
                            setLoginEmailErrors((prev) => ({
                              ...prev,
                              password: !e.target.value ? "Password is required." : undefined,
                            }));
                          }
                        }}
                        onBlur={() => setLoginEmailTouched(true)}
                        onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                      />
                      <button className={styles.eyeBtn} type="button" onClick={() => setShowLoginPw((p) => !p)}>
                        <EyeIcon open={showLoginPw} />
                      </button>
                    </div>
                    <FieldError msg={loginEmailErrors.password} />
                  </div>

                  <div className={styles.forgotRow}>
                    <button
  className={styles.forgotBtn}
  onClick={() => {
    setForgotStep("email");
    setForgotEmail("");
    setForgotOtp("");
    setForgotPassword("");
    setForgotConfirmPassword("");
    setLoginStep("forgot-password");
  }}
>
  Forgot Password?
</button>
                  </div>

                  <button
                    className={styles.primaryBtn}
                    onClick={handleEmailLogin}
                    disabled={loginLoading}
                  >
                    {loginLoading ? <span className={styles.spinner} /> : "Login"}
                  </button>

                  <div className={styles.divider}><span>or</span></div>

                  <button
                    className={styles.altLoginBtn}
                    onClick={() => {
                      setLoginEmail(""); setLoginPassword("");
                      setLoginEmailErrors({}); setLoginEmailTouched(false);
                      setShowLoginPw(false);
                      setOtpLoginEmail(""); setOtpLoginEmailError("");
                      setLoginStep("otp-email");
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Login with Email OTP
                  </button>
                </>
              )}

              {/* Step 2 — Enter email for OTP */}
              {loginStep === "otp-email" && (
                <>
                  <BackBtn onClick={() => { setLoginStep("email"); setOtpLoginEmail(""); setOtpLoginEmailError(""); }} />

                  <div className={styles.tabHeader}>
                    <h2 className={styles.welcomeTitle}>Login with OTP</h2>
                    <p className={styles.welcomeSub}>Enter your registered email to receive an OTP</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className={`${styles.input} ${otpLoginEmailError ? styles.inputError : ""}`}
                      value={otpLoginEmail}
                      onChange={(e) => {
                        setOtpLoginEmail(e.target.value);
                        if (otpLoginEmailError) setOtpLoginEmailError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendLoginOtp()}
                    />
                    <FieldError msg={otpLoginEmailError} />
                  </div>

                  <button
                    className={styles.primaryBtn}
                    onClick={handleSendLoginOtp}
                    disabled={otpSending}
                  >
                    {otpSending ? <span className={styles.spinner} /> : "Send OTP"}
                  </button>

                  <div className={styles.divider}><span>or</span></div>

                  <button
                    className={styles.altLoginBtn}
                    onClick={() => { setOtpLoginEmail(""); setOtpLoginEmailError(""); setLoginStep("email"); }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                      <path d="M12 18h.01" />
                    </svg>
                    Login with Password
                  </button>
                </>
              )}

              {/* Step 3 — OTP verify */}
         {/* Step 4 — Forgot Password */}
{loginStep === "forgot-password" && (
  <>
    {/* EMAIL STEP */}
    {forgotStep === "email" && (
      <>
        <BackBtn
          onClick={() => {
            setLoginStep("email");
            setForgotEmail("");
          }}
        />

        <div className={styles.tabHeader}>
          <h2 className={styles.welcomeTitle}>Forgot Password</h2>
          <p className={styles.welcomeSub}>
            Enter your registered email address
          </p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            className={styles.input}
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
        </div>

        <button
          className={styles.primaryBtn}
          onClick={handleForgotSendOtp}
          disabled={forgotLoading}
        >
          {forgotLoading ? (
            <span className={styles.spinner} />
          ) : (
            "Send OTP"
          )}
        </button>
      </>
    )}

    {/* OTP STEP */}
    {forgotStep === "otp" && (
      <>
        <BackBtn
          onClick={() => {
            setForgotStep("email");
            setForgotOtp("");
          }}
        />

        <div className={styles.tabHeader}>
          <h2 className={styles.welcomeTitle}>Verify OTP</h2>

          <p className={styles.welcomeSub}>
            OTP sent to{" "}
            <span className={styles.highlight}>
              {maskEmail(forgotEmail)}
            </span>
          </p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Enter 4-digit OTP</label>

          <OtpInput
            value={forgotOtp}
            onChange={setForgotOtp}
          />
        </div>

        <div className={styles.resendRow}>
          {!forgotTimer.done ? (
            <span className={styles.timerText}>
              Resend OTP in{" "}
              <strong className={styles.timerNum}>
                {forgotTimer.remaining}s
              </strong>
            </span>
          ) : (
            <button
              className={styles.resendBtn}
              onClick={handleForgotResendOtp}
            >
              Resend OTP
            </button>
          )}
        </div>

        <button
          className={styles.primaryBtn}
          onClick={handleForgotVerifyOtp}
          disabled={forgotOtp.length !== 4 || forgotLoading}
        >
          {forgotLoading ? (
            <span className={styles.spinner} />
          ) : (
            "Verify OTP"
          )}
        </button>
      </>
    )}

    {/* RESET PASSWORD STEP */}
    {forgotStep === "reset" && (
      <>
        <BackBtn
          onClick={() => {
            setForgotStep("otp");
          }}
        />

        <div className={styles.tabHeader}>
          <h2 className={styles.welcomeTitle}>Reset Password</h2>

          <p className={styles.welcomeSub}>
            Create your new password
          </p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>New Password</label>

          <div className={styles.passwordWrap}>
            <input
              type={showForgotPw ? "text" : "password"}
              placeholder="Enter new password"
              className={styles.input}
              value={forgotPassword}
              onChange={(e) =>
                setForgotPassword(e.target.value)
              }
            />

            <button
              className={styles.eyeBtn}
              type="button"
              onClick={() =>
                setShowForgotPw((p) => !p)
              }
            >
              <EyeIcon open={showForgotPw} />
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Confirm Password
          </label>

          <div className={styles.passwordWrap}>
            <input
              type={
                showForgotConfirmPw
                  ? "text"
                  : "password"
              }
              placeholder="Confirm password"
              className={styles.input}
              value={forgotConfirmPassword}
              onChange={(e) =>
                setForgotConfirmPassword(
                  e.target.value
                )
              }
            />

            <button
              className={styles.eyeBtn}
              type="button"
              onClick={() =>
                setShowForgotConfirmPw((p) => !p)
              }
            >
              <EyeIcon
                open={showForgotConfirmPw}
              />
            </button>
          </div>
        </div>

        <button
          className={styles.primaryBtn}
          onClick={handleForgotResetPassword}
          disabled={forgotLoading}
        >
          {forgotLoading ? (
            <span className={styles.spinner} />
          ) : (
            "Reset Password"
          )}
        </button>
      </>
    )}
  </>
)}

            </div>
          )}

          {/* ════ REGISTER TAB ════ */}
          {tab === "register" && (
            <div className={styles.tabContent}>

              {/* Details step */}
              {regStep === "details" && (
                <>
                  <div className={styles.tabHeader}>
                    <h2 className={styles.welcomeTitle}>Create Account</h2>
                    <p className={styles.welcomeSub}>Fill in your details to get started</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className={`${styles.input} ${regTouched && regErrors.fullName ? styles.inputError : ""}`}
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      // onBlur={() => setRegTouched(true)}
                    />
                    <FieldError msg={regErrors.fullName} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className={`${styles.input} ${regTouched && regErrors.email ? styles.inputError : ""}`}
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      // onBlur={() => setRegTouched(true)}
                    />
                    <FieldError msg={regErrors.email} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Mobile Number</label>
                    <div className={styles.phoneWrap}>
                      <span className={styles.countryCode}>+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Enter 10-digit number"
                        className={`${styles.input} ${styles.phoneInput} ${regTouched && regErrors.mobile ? styles.inputError : ""}`}
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        // onBlur={() => setRegTouched(true)}
                      />
                    </div>
                    <FieldError msg={regErrors.mobile} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <div className={styles.passwordWrap}>
                      <input
                        type={showRegPw ? "text" : "password"}
                        placeholder="Create a strong password"
                        className={`${styles.input} ${regTouched && regErrors.password ? styles.inputError : ""}`}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        // onBlur={() => setRegTouched(true)}
                      />
                      <button className={styles.eyeBtn} type="button" onClick={() => setShowRegPw((p) => !p)}>
                        <EyeIcon open={showRegPw} />
                      </button>
                    </div>
                    <FieldError msg={regErrors.password} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Confirm Password</label>
                    <div className={styles.passwordWrap}>
                      <input
                        type={showRegConfirm ? "text" : "password"}
                        placeholder="Re-enter your password"
                        className={`${styles.input} ${regTouched && regErrors.confirmPassword ? styles.inputError : ""}`}
                        value={regConfirm}
                        onChange={(e) => setRegConfirm(e.target.value)}
                        // onBlur={() => setRegTouched(true)}
                      />
                      <button className={styles.eyeBtn} type="button" onClick={() => setShowRegConfirm((p) => !p)}>
                        <EyeIcon open={showRegConfirm} />
                      </button>
                    </div>
                    <FieldError msg={regErrors.confirmPassword} />
                  </div>

                 <button
  type="button"
  className={styles.primaryBtn}
  onClick={handleRegisterSubmit}
  disabled={regLoading}
>
  {regLoading ? (
    <span className={styles.spinner} />
  ) : (
    "Send OTP"
  )}
</button>
                </>
              )}

              {/* OTP step */}
              {regStep === "otp" && (
                <>
                  <BackBtn onClick={() => { setRegStep("details"); setRegOtp(""); }} />

                  <div className={styles.tabHeader}>
                    <h2 className={styles.welcomeTitle}>Verify Your Email</h2>
                    <p className={styles.welcomeSub}>
                      OTP sent to <span className={styles.highlight}>{maskEmail(regEmail)}</span>
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Enter 4-digit OTP</label>
                    <OtpInput value={regOtp} onChange={setRegOtp} />
                  </div>

                  <div className={styles.resendRow}>
                    {!regTimer.done ? (
                      <span className={styles.timerText}>
                        Resend OTP in <strong className={styles.timerNum}>{regTimer.remaining}s</strong>
                      </span>
                    ) : (
                      <button className={styles.resendBtn} onClick={handleResendRegOtp}>
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    className={styles.primaryBtn}
                    onClick={handleVerifyRegOtp}
                    disabled={regOtp.length !== 4 || regVerifying}
                  >
                    {regVerifying ? <span className={styles.spinner} /> : "Verify & Register"}
                  </button>
                </>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}