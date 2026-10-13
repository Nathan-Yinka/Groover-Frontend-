import { useCallback, useEffect, useState, useMemo } from "react";
import { 
  BiUserCircle, 
  BiWallet, 
  BiTrendingUp, 
  BiLockAlt, 
  BiBriefcase, 
  BiPulse 
} from "react-icons/bi";
import { 
  IoStar, 
  IoTrophy, 
  IoLayersOutline, 
  IoWalletOutline, 
  IoNotificationsOutline, 
  IoRocketOutline, 
  IoPlayOutline, 
  IoMusicalNotesOutline, 
  IoChevronForwardOutline, 
  IoShieldCheckmarkOutline, 
  IoTimeOutline, 
  IoPulseOutline,
  IoClose
} from "react-icons/io5";
import { FiPlusSquare, FiMusic, FiClock } from "react-icons/fi";
import { HiOutlineLightningBolt, HiOutlineRefresh } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PropTypes from "prop-types";

// Services and Assets
import { fetchCurrentGame, fetchProducts, submitCurrentGame } from "../../app/service/products.service";
import ErrorHandler from "../../app/ErrorHandler";
import authService from "../../app/service/auth.service";
import { fetchProfileFailure, fetchProfileStart, fetchProfileSuccess } from "../../app/slice/profile.slice";
import { showAlert, hideAlert, setModalOpen } from "../../app/slice/ui.slice";
import { formatCurrencyWithCode } from "../../utils/currency";
import { home, profile as profileRoute, level as levelRoute, notifications as notificationsRoute, contact } from "../../constants/app.routes";
import Loader from "./components/Load";

import BottomNavMobile from "./components/BottomNavMobile";

// Assets
import missionBg from "../../assets/v2_mission_bg.png";

const MySwal = withReactContent(Swal);

const ResponsiveSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    sm: { height: "70px", width: "w-2", bars: 12 },
    default: { height: "180px", width: "w-3", bars: 20 },
    lg: { height: "240px", width: "w-4", bars: 25 },
  };

  const current = sizeClasses[size] || sizeClasses.default;

  return (
    <div className="flex items-end gap-1.5 h-full" style={{ height: current.height }}>
      {[...Array(current.bars)].map((_, i) => (
        <motion.div
          key={i}
          className={`${current.width} bg-[#EC6345] rounded-full shadow-[0_0_25px_rgba(236,99,69,0.4)]`}
          animate={{
            height: [
              "15%", 
              `${30 + Math.random() * 70}%`, 
              `${15 + Math.random() * 30}%`, 
              `${50 + Math.random() * 50}%`, 
              "15%"
            ],
          }}
          transition={{
            duration: 0.9 + Math.random() * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.04,
          }}
        />
      ))}
    </div>
  );
};

ResponsiveSpinner.propTypes = {
  size: PropTypes.oneOf(["sm", "default", "lg"]),
};

const Starting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profile = useSelector((state) => state.profile.user);
    const isLoading = useSelector((state) => state.products.isLoading);
    const isLoading_current = useSelector((state) => state.products.isLoading_current);
    const products = useSelector((state) => state.products.products);
    const currentGame = useSelector((state) => state.products.currentGame);

    const [currentSlide, setCurrentSlide] = useState(0);
    const { notifications } = useSelector((state) => state.notifications);
    const unreadNotifications = notifications.filter(n => !n.is_read).length;
    const isModalOpen = useSelector((state) => state.ui.isModalOpen);
    const [selectedStar, setSelectedStar] = useState(0);
    const [comments, setComments] = useState("");
    const [shuffledProducts, setShuffledProducts] = useState([]);
    const [imagesReady, setImagesReady] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isLoadingTerminal, setIsLoadingTerminal] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});

    // Logic for interacting with the Global Terminal HUD
    const showGlobalAlert = (type, title, message) => {
        dispatch(showAlert({ type, title, message }));
    };

    // --- LOGIC PORTED FROM STARTING.JSX ---

    const fetchProfileData = useCallback(async () => {
        dispatch(fetchProfileStart());
        try {
            const response = await authService.fetchProfile();
            if (response.success) {
                dispatch(fetchProfileSuccess(response.data));
            } else {
                dispatch(fetchProfileFailure(response.message || "Failed to load profile."));
                dispatch(showAlert({ type: 'error', title: 'Error', message: response.message || "Failed to load profile." }));
            }
        } catch (error) {
            dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
            dispatch(showAlert({ type: 'error', title: 'Connection Error', message: "An error occurred while fetching your profile." }));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!profile) fetchProfileData();
    }, [fetchProfileData, profile]);

    useEffect(() => {
        if (!products || products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products]);

    useEffect(() => {
        if (products && products.length > 0) {
            setShuffledProducts(shuffleArray(products));
        }
    }, [products]);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const preloadAndSwapImages = (newProducts) => {
        let loadedCount = 0;
        const totalImages = newProducts.length;
        newProducts.forEach((product) => {
            const img = new Image();
            img.src = product.image || "https://via.placeholder.com/150";
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) setShuffledProducts(newProducts);
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) setShuffledProducts(newProducts);
            };
        });
    };

    useEffect(() => {
        if (products && products.length > 0 && !isInitialLoad) {
            const reshuffleInterval = setInterval(() => {
                const newShuffledProducts = shuffleArray(products);
                preloadAndSwapImages(newShuffledProducts);
            }, 20000);
            return () => clearInterval(reshuffleInterval);
        }
    }, [products, isInitialLoad]);

    useEffect(() => {
        if (shuffledProducts && shuffledProducts.length > 0) {
            if (isInitialLoad) setImagesReady(false);
            let loadedCount = 0;
            shuffledProducts.forEach((product) => {
                const img = new Image();
                img.src = product.image || "https://via.placeholder.com/150";
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === shuffledProducts.length) {
                        setImagesReady(true);
                        setIsInitialLoad(false);
                    }
                };
                img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === shuffledProducts.length) {
                        setImagesReady(true);
                        setIsInitialLoad(false);
                    }
                };
            });
        }
    }, [shuffledProducts, isInitialLoad]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.ceil((shuffledProducts?.length || 1) / 7));
        }, 3000);
        return () => clearInterval(interval);
    }, [shuffledProducts]);

    const handleStartOptimization = async () => {
        if (currentGame && Object.keys(currentGame).length > 0) {
            if (currentGame.special_product) {
                showGlobalAlert('success', 'Special Album Detected', 'A premium track has entered the curation queue.');
            }
            dispatch(setModalOpen(true));
            return;
        }

        setIsLoadingTerminal(true);
        // Integrated inline spinner replaces intrusive global alert
        
        try {
            // FIX: Use fetchCurrentGame() as per V1 logic
            const response = await dispatch(fetchCurrentGame());
            if (response?.success) {
                // AUTO-OPEN MODAL after procurement
                dispatch(setModalOpen(true));
            } else {
                ErrorHandler(response);
            }
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsLoadingTerminal(false);
        }
    };

    const handleSubmit = async () => {
        if (isLoadingTerminal) return;
        if (selectedStar === 0) {
            ErrorHandler("Please provide a rating before submission.");
            return;
        }
        
        setIsLoadingTerminal(true);
        // Integrated inline spinner replaces intrusive global alert

        try {
            const response = await dispatch(submitCurrentGame(selectedStar, comments));
            if (response?.success) {
                setComments("");
                setSelectedStar(0);
                dispatch(setModalOpen(false));
                dispatch(setModalOpen(false));
                showGlobalAlert('success', 'Success', response?.data?.message || response?.message || 'Curation successfully submitted.');
                await fetchProfileData();
            } else {
                ErrorHandler(response);
            }
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsLoadingTerminal(false);
        }
    };

    if (isLoading && isInitialLoad) return <Loader fullScreen={true}  />;

    return (
        <div className="min-h-screen grow bg-[#f6f1ea] text-[#221d1a] selection:bg-[#EC6345]/30 overflow-x-hidden font-sans">
            <main className="w-full space-y-5 px-4 py-5 pb-32 md:px-6 md:py-6 md:pb-10">

                {/* GREETING + DAILY PROGRESS + AVAILABLE HOURS */}
                <div className="rounded-2xl bg-[#221917] p-5 text-white md:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                {profile?.profile_picture ? (
                                    <img src={profile.profile_picture} alt="" className="h-14 w-14 rounded-full object-cover" />
                                ) : (
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                                        <BiUserCircle className="text-3xl text-white/70" />
                                    </div>
                                )}
                                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#221917] bg-green-500" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Hi, {profile?.first_name || 'there'} 👋</h1>
                                <p className="text-sm text-white/60">Welcome back to your dashboard</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate(`${home}/${levelRoute}`)}
                            className="flex shrink-0 items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
                        >
                            {profile?.wallet?.package?.icon && <img src={profile.wallet.package.icon} alt="" className="h-6 w-6 object-contain" />}
                            {profile?.wallet?.package?.name || 'Basic'}
                        </button>
                    </div>

                    <div className="mt-5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-white/80">Daily Progress</span>
                            <span className="font-bold">{profile?.current_number_count || 0} / {profile?.total_number_can_play || 0}</span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(((profile?.current_number_count || 0) / (profile?.total_number_can_play || 1)) * 100, 100)}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full rounded-full bg-[#EC6345]"
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-white/80">
                            <IoTimeOutline className="text-lg text-[#ffb29f]" />
                            Available hours
                        </div>
                        <span className="text-base font-bold tabular-nums">
                            {profile?.settings?.service_availability_start_time?.slice(0, 5) || "00:00"} – {profile?.settings?.service_availability_end_time?.slice(0, 5) || "23:59"}
                        </span>
                    </div>
                </div>

                {/* WALLET STATS */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                        { label: "Wallet Balance", sub: "Available funds", value: formatCurrencyWithCode(profile?.wallet?.balance || 0), icon: IoWalletOutline },
                        { label: "Today's Profit", sub: "Earnings today", value: formatCurrencyWithCode(profile?.today_profit || 0), icon: BiTrendingUp },
                        { label: "On Hold", sub: "Frozen funds", value: formatCurrencyWithCode(profile?.wallet?.on_hold || 0), icon: BiLockAlt },
                        { label: "Salary", sub: "Daily salary", value: formatCurrencyWithCode(profile?.wallet?.salary || 0), icon: BiBriefcase },
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl bg-gradient-to-br from-[#221917] to-[#3b2a25] p-4 text-white">
                            <item.icon className="text-xl text-[#ffb29f]" />
                            <p className="mt-3 text-sm font-semibold">{item.label}</p>
                            <p className="text-xs text-white/50">{item.sub}</p>
                            <p className="mt-2 text-lg font-bold">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* SUBMISSIONS */}
                <div className="rounded-2xl border border-[#e5ded3] bg-white p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-[#221d1a]">Start Submission</h2>
                            <p className="text-sm text-[#605E5E]">Pick a track, rate it and submit your feedback to earn rewards.</p>
                        </div>
                        <div className="shrink-0 rounded-xl bg-[#f0ede6] px-4 py-2 text-lg font-bold">
                            {profile?.current_number_count || 0} / {profile?.total_number_can_play || 0}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleStartOptimization}
                        disabled={isLoadingTerminal}
                        className="mt-4 w-full rounded-xl bg-[#EC6345] py-3 text-sm font-bold text-white transition hover:bg-[#d9583b] disabled:opacity-50 sm:w-auto sm:px-10"
                    >
                        {isLoadingTerminal ? "Loading..." : "Start"}
                    </button>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                        {shuffledProducts.slice(0, 12).map((product, i) => (
                            <button
                                key={product.id || i}
                                type="button"
                                onClick={handleStartOptimization}
                                disabled={isLoadingTerminal}
                                className="aspect-square overflow-hidden rounded-xl border border-[#e5ded3] bg-[#f0ede6] transition hover:border-[#EC6345]/50 disabled:opacity-50"
                            >
                                <img src={product.image || missionBg} className="h-full w-full object-cover" alt={product.name || "Track"} />
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-center text-sm text-[#605E5E]">
                    Need help? <span onClick={() => navigate(`${home}/${contact}`)} className="cursor-pointer font-semibold text-[#EC6345] underline underline-offset-2">Contact support</span>
                </p>
            </main>


            {/* OPTIMIZATION MODAL (HIGH-FIDELITY TASK SUBMISSION) */}
            <AnimatePresence>
                {isModalOpen && currentGame && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-4 backdrop-blur-2xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            className={`relative w-full max-w-[480px] rounded-[32px] sm:rounded-[40px] border p-5 sm:p-8 shadow-[0_0_100px_rgba(0,0,0,0.8)] transition-all duration-700 ${
                                currentGame?.special_product 
                                ? 'bg-gradient-to-b from-[#1b1513] to-[#2d2208] border-amber-500/40 shadow-amber-500/20' 
                                : 'bg-[#1b1513] border-white/10'
                            }`}
                        >
                            {/* Special Product Badge */}
                            {currentGame?.special_product && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-amber-500 rounded-b-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] z-50 animate-bounce">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-black">Special Product</span>
                                </div>
                            )}

                            {/* Close Command (Top) */}
                            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex flex-col items-center gap-1 z-20">
                                <button 
                                    onClick={() => dispatch(setModalOpen(false))}
                                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/5 text-white/40 hover:bg-[#EC6345]/20 hover:text-[#EC6345] transition-all"
                                >
                                    <IoClose className="text-xl sm:text-2xl" />
                                </button>
                                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-white/20">Close</span>
                            </div>

                            {/* Merry Animation for Special Product */}
                            {currentGame?.special_product && (
                                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                                    {[...Array(12)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ y: '110%', x: Math.random() * 100 + '%' }}
                                            animate={{ 
                                                y: '-110%', 
                                                transition: { duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 } 
                                            }}
                                            className="absolute text-amber-500/20"
                                        >
                                            <FiMusic className="text-2xl" />
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <IoLayersOutline className="text-[120px]" />
                            </div>

                            {/* Modal Header */}
                            <div className="mb-4 text-center">
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EC6345]/10 text-[#EC6345] mb-2">
                                    <HiOutlineLightningBolt className="text-xl animate-pulse" />
                                </div>
                                <h2 className="text-xl font-black tracking-tighter text-white mb-1 uppercase">Submit Your Review</h2>
                            </div>

                            {/* Product Layout (Handles Combos) */}
                            <div className="mb-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                                <div className="flex items-center justify-center -space-x-4">
                                    {currentGame?.products && currentGame.products.length > 0 ? (
                                        currentGame.products.slice(0, 3).map((product, idx) => (
                                            <motion.div 
                                                key={product.id || idx}
                                                className="h-16 w-16 rounded-2xl border-2 border-[#1b1513] bg-[#1b1513] overflow-hidden shadow-2xl flex-shrink-0"
                                            >
                                                <img src={product.image || missionBg} className="h-full w-full object-cover" alt="" />
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="h-16 w-16 rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-2xl">
                                            <img src={currentGame?.image || missionBg} className="h-full w-full object-cover" alt="" />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 text-center">
                                    <h3 className="text-[10px] font-bold text-white truncate max-w-[200px] mx-auto">
                                        {currentGame?.products?.[0]?.name || currentGame?.name || 'Curation Hit'}
                                    </h3>
                                </div>
                            </div>

                            {/* Star Rating Interaction */}
                            <div className="mb-3 text-center">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Your Rating</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            onClick={() => setSelectedStar(star)}
                                            className="group transition-all active:scale-90"
                                        >
                                            <IoStar className={`text-2xl transition-all ${
                                                selectedStar >= star ? 'text-[#EC6345] drop-shadow-[0_0_10px_rgba(236,99,69,0.4)]' : 'text-white/10 group-hover:text-white/20'
                                            }`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Technical Specifications Grid */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-3">
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">Amount</p>
                                    <p className="text-sm font-bold text-[#EC6345] tabular-nums">USD {currentGame?.amount}</p>
                                </div>
                                <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-3">
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">Profit</p>
                                    <p className="text-sm font-bold text-green-500 tabular-nums">USD {currentGame?.commission}</p>
                                </div>
                            </div>

                            {/* Curation Metadata */}
                            <div className="space-y-1.5 mb-4 px-1">
                                <div className="flex justify-between items-center text-[8px]">
                                    <span className="font-black text-white/20 uppercase tracking-widest">Reference ID</span>
                                    <span className="font-bold text-white/50 tracking-widest">{currentGame?.rating_no}</span>
                                </div>
                            </div>

                            {/* Comment Entry */}
                            <div className="mb-6 text-left">
                                <p className="text-[8px] font-black text-[#EC6345] uppercase tracking-[0.2em] mb-2">Comment</p>
                                <textarea 
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Add Comment"
                                    className="w-full rounded-2xl bg-white/[0.03] border border-white/5 p-3 text-[11px] text-white placeholder:text-white/10 focus:outline-none focus:border-[#EC6345]/30 transition-all h-20 resize-none"
                                />
                            </div>

                            {/* Master Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => dispatch(setModalOpen(false))}
                                    className="h-12 rounded-2xl border border-white/10 bg-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-red-400 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="group relative h-12 rounded-2xl bg-[#EC6345] overflow-hidden text-[9px] font-black text-white shadow-xl transition-all active:scale-95"
                                >
                                    {isLoading ? "Submitting..." : "Submit"}
                                </button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Starting;
