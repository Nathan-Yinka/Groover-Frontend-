import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { FiLock, FiUser } from "react-icons/fi";
import { useDispatch } from "react-redux";
import logo from "../../assets/logo.svg";
import { toast } from "sonner";
import authService from "../../app/service/auth.service";
import AppInit from "../../app/state.helper";
import Loader from "../dashboard/components/loader";
import artist1 from "../../assets/artist1.png";
import artist2 from "../../assets/artist2.png";
import artist3 from "../../assets/artist3.png";
import loginpageImage from "../../assets/loginpage_image.svg";
import AuthInputField from "./components/AuthInputField";
import AuthCheckbox from "./components/AuthCheckbox";

const reviews = [
  {
    name: "Alessio Cappello",
    role: "Independent Artist",
    image: artist1,
    rating: 5,
    text: "Thanks to SoundCampaign my music started circulating on Spotify more widely than ever before. The process is clear, transparent, and incredibly supportive.",
  },
  {
    name: "Annie Davidson",
    role: "Singer-Songwriter",
    image: artist2,
    rating: 5,
    text: "The Groover process is clear, transparent, and supportive. I got real curator feedback and meaningful exposure for my releases.",
  },
  {
    name: "Andy Fox",
    role: "Producer",
    image: artist3,
    rating: 4,
    text: "I have used different promo services before, but this is the one I keep coming back to. The campaign flow is smooth and the reporting is reliable.",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedUsername && savedRememberMe) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return undefined;

    const timer = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    const errors = [];

    if (!username.trim()) errors.push("Username is required.");
    if (!password.trim()) errors.push("Password is required.");

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);

    if (rememberMe) {
      localStorage.setItem("rememberedUsername", username);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberMe");
    }

    const credentials = { username, password };

    try {
      const response = await authService.login(credentials);

      if (response.success) {
        const initSuccess = await AppInit({ dispatch, isAuthenticated: true });

        if (initSuccess) {
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate("/home");
          }, 2000);
        } else {
          toast.error(
            "Failed to initialize the application. Please try again.",
          );
        }
      } else {
        throw new Error(
          response.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const activeReview = reviews[activeReviewIndex];
  const currentYear = new Date().getFullYear();

  return (
    <div
      className="h-screen w-full overflow-hidden bg-[#050607] text-white"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <img
            src={loginpageImage}
            alt="Login background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/82 via-black/74 to-black/86" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-white/10" />

          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute left-10 top-10 z-30 flex items-center gap-2"
          >
            <img src={logo} alt="Logo" className="h-auto w-44" />
          </button>

          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReviewIndex}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-[560px] text-white"
              >
                <p className="mb-3 text-[44px] font-semibold leading-none text-accent">
                  ”
                </p>
                <p className="max-w-[520px] text-[22px] font-medium leading-[1.28] text-white [text-shadow:0_8px_24px_rgba(0,0,0,0.55)] xl:text-[24px]">
                  {activeReview.text}
                </p>
                <p className="mt-2 text-[44px] font-semibold leading-none text-accent">
                  ”
                </p>

                <div className="mt-7 flex items-center gap-3">
                  <img
                    src={activeReview.image}
                    alt={activeReview.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-accent/60"
                  />
                  <div>
                    <p className="text-[17px] font-semibold text-white">
                      {activeReview.name}
                    </p>
                    <p className="text-sm font-normal text-white/75">
                      {activeReview.role}
                    </p>
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar
                          key={index}
                          className={`h-3.5 w-3.5 ${index < activeReview.rating ? "text-[#ffd24a]" : "text-white/30"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section
          className="relative flex h-full items-center justify-center px-4 sm:px-8"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -right-14 -top-16 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-[#174f35]/20 blur-3xl" />
          </div>

          <div className="relative w-full max-w-[460px] rounded-2xl border border-white/10 bg-[#0d0f10]/95 p-6 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.95)] md:p-8 lg:max-w-[430px] lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <div className="mb-6 lg:hidden flex justify-center">
              <button type="button" onClick={() => navigate("/")}>
                <img src={logo} alt="Logo" className="h-auto w-36" />
              </button>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="mt-1 text-sm text-white/65 md:text-base">
              Please enter your details to sign in.
            </p>

            <form className="mt-7 space-y-5" onSubmit={handleLogin}>
              <AuthInputField
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
                label="Username or Email"
                Icon={FiUser}
              />

              <AuthInputField
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                label="Password"
                Icon={FiLock}
                rightNode={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/45 hover:text-accent"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                }
              />

              <div className="flex items-center justify-between pt-0.5">
                <AuthCheckbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                <a
                  href="/contact"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="mt-1 flex w-full items-center justify-center rounded-lg border border-accent/35 bg-accent py-3 font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                {loading ? <Loader /> : "Log in"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/60">
                Don&apos;t have an account?{" "}
                <a
                  href="/login/signup"
                  className="font-semibold text-accent hover:underline"
                >
                  Create now
                </a>
              </p>
            </div>
          </div>

          <p
            className="absolute text-center text-sm text-white/35"
            style={{ bottom: "max(env(safe-area-inset-bottom), 24px)" }}
          >
            © {currentYear} SoundCampaign. All rights reserved.
          </p>
        </section>
      </div>

      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/60"
        >
          <div className="w-full max-w-xs rounded-xl border border-white/15 bg-[#101315] p-6 text-center shadow-xl">
            <FaCheckCircle className="mx-auto mb-4 text-5xl text-accent" />
            <h2 className="text-xl font-semibold text-white">
              Login Successful!
            </h2>
            <p className="mt-2 text-sm text-white/65">
              You have successfully logged in.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
