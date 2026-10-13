import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiLock, FiUser } from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showAlert } from "../../app/slice/ui.slice";
import ErrorHandler from "../../app/ErrorHandler";
import authService from "../../app/service/auth.service";
import AppInit from "../../app/state.helper";
import Loader from "../dashboard/components/loader";
import logo from "../../assets/LogoWithText.svg";
import loginpageImage from "../../assets/left.png";
import Load from "../dashboard/components/Load";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedUsername && savedRememberMe) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    const errors = [];

    if (!username.trim()) errors.push("Username is required.");
    if (!password.trim()) errors.push("Password is required.");

    if (errors.length > 0) {
      dispatch(showAlert({
        type: 'error',
        title: 'Login Error',
        message: errors.join(' | ')
      }));
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
          navigate("/home");
        } else {
          dispatch(showAlert({
            type: 'error',
            title: 'Error',
            message: "Failed to initialize the application."
          }));
        }
      }
    } catch (error) {
      // Error is now handled by the service layer (ErrorHandler)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F0] flex flex-col">
      {loading && <Load fullScreen={true} />}
      {/* Header */}
      <header className="bg-[#2d2d2d] px-8 py-4">
        <div className="mx-auto max-w-[1150px]">
          <button
            onClick={() => navigate("/")}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="Groover" className="h-auto w-[145px]" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto grid w-full max-w-[1250px] flex-1 grid-cols-1 gap-8 px-5 py-6 md:px-8 md:py-1 lg:grid-cols-2">
        {/* Left Section - Image */}
        <div className="flex items-center justify-center">
          <img
            src={loginpageImage}
            alt="Join our roster of music curators & pros"
            className="w-full max-w-[420px] h-auto object-cover sm:max-w-[500px] lg:max-w-[550px]"
          />
        </div>

        {/* Right Section - Form */}
        <div className="relative flex flex-col justify-center p-5 sm:p-8 lg:p-12">
          {/* Decorative Circles */}
          <div className="absolute top-12 right-12 w-24 h-24 rounded-full border-4 border-[#8fa3d9] opacity-40" />
          <div className="absolute top-20 right-32 w-8 h-8 rounded-full bg-[#e8a89d] opacity-50" />
          <div className="absolute top-32 right-20 w-12 h-12 rounded-full border-4 border-[#8fa3d9] opacity-40" />
          <div className="absolute bottom-32 left-8 w-16 h-16 rounded-full bg-[#e8a89d] opacity-40" />
          <div className="absolute bottom-20 right-20 w-12 h-12 rounded-full border-4 border-[#d4a5a0] opacity-40" />

          {/* Form */}
          <div className="max-w-md mx-auto w-full relative z-10">
            <h2 className="text-3xl font-black text-[#2d2d2d] mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Please enter your details to sign in.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div className="relative">
                <label className="block text-sm font-semibold text-[#2d2d2d] mb-2">
                  Username or Email
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username or email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ff6b56] focus:ring-1 focus:ring-[#ff6b56]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#2d2d2d] mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ff6b56] focus:ring-1 focus:ring-[#ff6b56]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-[#ff6b56] transition-colors"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded accent-[#ff6b56]"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <a
                  href="/contact"
                  className="text-sm font-semibold text-[#ff6b56] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff6b56] text-white font-bold py-3 rounded-lg hover:bg-[#ff5544] transition-colors mt-8 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? <Loader /> : "Log in"}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Don&apos;t have an account?{" "}
              <a
                href="/login/signup"
                className="text-[#ff6b56] font-semibold hover:underline"
              >
                Create now
              </a>
            </p>
          </div>
        </div>
      </div>



      {/* Categories Section */}
      <style>{`
        .underline-animate {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        .underline-animate::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #2d2d2d;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .underline-animate:hover::after {
          transform: scaleX(1);
        }
      `}</style>
      <div className="bg-[#F7F6F0] px-8 py-16">
        <div className="max-w-[1250px] mx-auto grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* By Genre */}
          <div>
            <h3 className="text-[16px] font-black text-[#2d2d2d] mb-8">
              Curators/pros by genre
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Classical/Instrumental
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Electronic
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Folk/Acoustic
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Hip-hop/Rap
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Metal
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Pop
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top R&B/Soul
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Rock/Punk
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top World/Spiritual
                </span>
              </li>
            </ul>
          </div>

          {/* By Subgenre */}
          <div>
            <h3 className="text-[16px] font-black text-[#2d2d2d] mb-8">
              Curators/pros by subgenre
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Alternative rock
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Dance music
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Hip-hop
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top House music
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Indie folk
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Indie pop
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Indie rock
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Pop rock
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top R&B
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top Singer songwriter
                </span>
              </li>
            </ul>
          </div>

          {/* By Type */}
          <div>
            <h3 className="text-[16px] font-black text-[#2d2d2d] mb-8">
              Curators/pros by type
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Bookers
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Youtube/Twitch Channels
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Labels
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Managers
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Media Outlets/Journalists
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Mentors
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Playlist Curators
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Radio stations
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Social Media Influencers
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Sound Experts
                </span>
              </li>
            </ul>
          </div>

          {/* By Country */}
          <div>
            <h3 className="text-[16px] font-black text-[#2d2d2d] mb-8">
              Curators/pros by country
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Brazil
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Canada
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music France
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Germany
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Italy
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Mexico
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Netherlands
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music Spain
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music United Kingdom
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-[14px] underline-animate">
                  Top music United States
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
