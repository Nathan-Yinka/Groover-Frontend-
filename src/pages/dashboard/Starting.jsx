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
import { toast } from "sonner";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PropTypes from "prop-types";

// Services and Assets
import { fetchCurrentGame, fetchProducts, submitCurrentGame } from "../../app/service/products.service";
import ErrorHandler from "../../app/ErrorHandler";
import authService from "../../app/service/auth.service";
import { fetchProfileFailure, fetchProfileStart, fetchProfileSuccess } from "../../app/slice/profile.slice";
import { showAlert, hideAlert } from "../../app/slice/ui.slice";
import { formatCurrencyWithCode } from "../../utils/currency";
import { profile as profileRoute, level as levelRoute } from "../../constants/app.routes";
import Loader from "./components/Load";
import MusicVisualizer from "./components/MusicVisualizer";
import BottomNavMobile from "./components/BottomNavMobile";

// Assets (Using V2 assets for consistency)
import v2HeroStudioCurator from "../../assets/v2_hero_studio_curator.png";
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
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                toast.error(response.message || "Failed to load profile.");
            }
        } catch (error) {
            dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
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
            setIsModalOpen(true);
            return;
        }

        setIsLoadingTerminal(true);
        showGlobalAlert('sync', 'System Sync', 'Retrieving available task...');
        
        try {
            // FIX: Use fetchCurrentGame() as per V1 logic
            const response = await dispatch(fetchCurrentGame());
            if (response?.success) {
                dispatch(hideAlert());
                if (response?.data?.special_product) {
                    showGlobalAlert('success', 'Special Album', 'A premium special track has entered the queue.');
                }
                // AUTO-OPEN MODAL after procurement
                setIsModalOpen(true);
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
        showGlobalAlert('sync', 'Submission', 'Committing curation data...');

        try {
            const response = await dispatch(submitCurrentGame(selectedStar, comments));
            if (response?.success) {
                setComments("");
                setSelectedStar(0);
                setIsModalOpen(false);
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

    if (isLoading && isInitialLoad) return <Loader fullScreen={true} size="large" />;

    return (
        <div className="min-h-screen grow bg-[#f6f1ea] text-[#221d1a] selection:bg-[#EC6345]/30 overflow-x-hidden font-sans">
            {/* BRAND TOP BAR */}
            <div className="px-4 pt-4 md:px-8 md:pt-6 sticky top-0 z-[100]">
                <div className="mx-auto flex max-w-[1600px] items-center justify-between rounded-[22px] md:rounded-[26px] border border-white/60 bg-white/70 px-4 md:px-6 py-2.5 md:py-3 shadow-[0_20px_55px_-40px_rgba(26,20,18,0.55)] backdrop-blur-xl">
                    <div className="flex items-center gap-4 md:gap-8">
                        <div>
                            <p className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a56657]">
                                Optimization Lab
                            </p>
                            <p className="hidden md:block mt-1 text-[11px] font-medium text-[#8b8580]">
                                Precision tuning for high-fidelity music assets.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button 
                            type="button"
                            onClick={() => navigate(notificationsRoute)}
                            className="relative flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-[#eadfd4] bg-[#fffaf6] text-[#2f2724] transition hover:-translate-y-0.5"
                        >
                            <IoNotificationsOutline className="text-lg md:text-xl" />
                        </button>

                        <button 
                            type="button"
                            onClick={() => navigate(profileRoute)}
                            className="flex items-center gap-2 md:gap-3 rounded-full border border-[#eadfd4] bg-[#fffaf6] p-1 md:p-1.5 md:pr-5 transition hover:-translate-y-0.5"
                        >
                            {profile?.profile_picture ? (
                                <img src={profile.profile_picture} alt="Profile" className="h-7 w-7 md:h-9 md:h-9 rounded-full object-cover ring-2 ring-[#EC6345]/10" />
                            ) : (
                                <div className="h-7 w-7 md:h-9 md:w-9 rounded-full bg-slate-100 flex items-center justify-center">
                                    <BiUserCircle className="text-xl md:text-2xl text-slate-300" />
                                </div>
                            )}
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-bold text-[#221d1a] uppercase tracking-wider">{profile?.first_name || 'Curator'}</p>
                                <p className="text-[10px] font-medium text-[#a56657] uppercase tracking-tighter">{profile?.wallet?.package?.name || 'VIP 0'}</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <main className="mx-auto w-full max-w-[1600px] px-4 py-8 md:px-8 lg:py-16">
                
                {/* THE ORBITAL COMMAND CENTER */}
                <section className="relative min-h-[750px] lg:min-h-[850px] flex items-center justify-center overflow-hidden rounded-[60px] bg-[#120d0c] shadow-3xl border border-white/5">
                    {/* AVANT-GARDE BACKGROUND */}
                    <div className="absolute inset-0 z-0">
                        <img src={v2HeroStudioCurator} className="h-full w-full object-cover opacity-20 scale-110 blur-[2px]" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#120d0c] via-transparent to-[#120d0c]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,99,69,0.15)_0%,transparent_70%)]" />
                    </div>

                    {/* THE MUSIC FLUX TICKER (TOP RAIL) */}
                    <div className="absolute top-0 left-0 right-0 z-0 overflow-hidden opacity-80 pointer-events-none">
                        <motion.div 
                            animate={{ x: [0, -2000] }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="flex gap-16 whitespace-nowrap pt-8"
                        >
                            {[...shuffledProducts, ...shuffledProducts, ...shuffledProducts].map((p, i) => (
                                <div key={i} className="h-44 w-44 rounded-[40px] border border-white/20 bg-[#1b1513] overflow-hidden flex-shrink-0 shadow-2xl relative">
                                    <img src={p.image || missionBg} className="h-full w-full object-cover grayscale brightness-90 transition-all duration-700" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* THE MUSIC FLUX TICKER (BOTTOM RAIL) */}
                    <div className="absolute bottom-0 left-0 right-0 z-0 overflow-hidden opacity-80 pointer-events-none">
                        <motion.div 
                            animate={{ x: [-2000, 0] }}
                            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                            className="flex gap-16 whitespace-nowrap pb-8"
                        >
                            {/* Reversing for diversity so top and bottom rails don't show the same images at once */}
                            {[...shuffledProducts, ...shuffledProducts, ...shuffledProducts].reverse().map((p, i) => (
                                <div key={i} className="h-44 w-44 rounded-[40px] border border-white/20 bg-[#1b1513] overflow-hidden flex-shrink-0 shadow-2xl relative">
                                    <img src={p.image || missionBg} className="h-full w-full object-cover grayscale brightness-90 transition-all duration-700" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* DECORATIVE ROTATING RINGS */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="h-[400px] w-[400px] rounded-full border border-dashed border-white/5 sm:h-[500px] sm:w-[500px]" 
                        />
                        <motion.div 
                          animate={{ rotate: -360 }}
                          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full border border-white/10 opacity-40 sm:h-[350px] sm:w-[350px]" 
                        />
                    </div>

                    <div className="relative z-10 w-full max-w-7xl px-6 py-12 flex flex-col items-center justify-center gap-16">

                        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-16 lg:gap-8">
                            
                            {/* LEFT WING: FINANCIAL MODULES */}
                            <div className="flex flex-col gap-6 order-2 lg:order-1 w-full lg:w-auto">
                                <motion.div 
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="group rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-2xl transition-all hover:bg-white/[0.05]"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EC6345]/20 text-[#EC6345]">
                                            <IoWalletOutline className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Balance</p>
                                            <p className="text-2xl font-bold text-white tracking-tighter">{formatCurrencyWithCode(profile?.wallet?.balance || 0)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-green-500 uppercase tracking-widest">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Live Balance Terminal
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="group rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-2xl transition-all hover:bg-white/[0.05]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                                            <BiTrendingUp className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Daily Yield</p>
                                            <p className="text-xl font-bold text-white">{formatCurrencyWithCode(profile?.today_profit || 0)}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="group rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-2xl transition-all hover:bg-white/[0.05]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                                            <IoWalletOutline className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Salary</p>
                                            <p className="text-xl font-bold text-white">{formatCurrencyWithCode(profile?.wallet?.salary || 0)}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* CENTER: THE START CORE */}
                            <div className="relative order-1 lg:order-2">
                                <motion.div 
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="relative flex h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] items-center justify-center"
                                >
                                    {/* Glowing Aura (Concentrated for compact core) */}
                                    <div className="absolute inset-0 rounded-full bg-[#EC6345]/30 blur-[40px] animate-pulse" />
                                    <div className="absolute -inset-3 rounded-full border border-white/5 animate-[spin_20s_linear_infinite]" />
                                    
                                    <button
                                        onClick={handleStartOptimization}
                                        disabled={isLoadingTerminal}
                                        className="group relative flex h-full w-full flex-col items-center justify-center rounded-full border border-white/20 bg-[#1b1513] text-white shadow-3xl transition-all hover:border-[#EC6345]/50 active:scale-95 disabled:opacity-50 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#EC6345]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <IoMusicalNotesOutline className="mb-1 text-2xl text-[#EC6345] group-hover:scale-110 transition-transform duration-700" />
                                        <div className="text-center">
                                            <span className="block text-[6px] font-black uppercase tracking-[0.6em] text-white/30 mb-0.5 leading-none">Access</span>
                                            <span className="block text-xl font-black uppercase tracking-tighter sm:text-2xl leading-none">
                                                {isLoading_current ? "..." : "START"}
                                            </span>
                                        </div>
                                    </button>
                                </motion.div>
                            </div>

                            {/* RIGHT WING: MISSION MODULES */}
                            <div className="flex flex-col gap-6 order-3 w-full lg:w-auto">
                            <motion.div 
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="group rounded-[32px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl shadow-2xl transition-all hover:bg-white/[0.05]"
                            >
                                <div className="flex items-center justify-between gap-12 mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Assignment Delta</p>
                                        <p className="text-2xl font-bold text-white tracking-tighter">{profile?.current_number_count || 0} / {profile?.total_number_can_play || 0}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EC6345]/10 text-[#EC6345]">
                                        <p className="text-[10px] font-black">{Math.round(((profile?.current_number_count || 0) / (profile?.total_number_can_play || 1)) * 100)}%</p>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(((profile?.current_number_count || 0) / (profile?.total_number_can_play || 1)) * 100, 100)}%` }}
                                        className="h-full bg-[#EC6345] rounded-full shadow-[0_0_10px_rgba(236,99,69,0.5)]"
                                    />
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="group rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-2xl transition-all hover:bg-white/[0.05]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-500">
                                        <BiLockAlt className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Frozen Amount</p>
                                        <p className="text-xl font-bold text-white">{formatCurrencyWithCode(profile?.wallet?.on_hold || 0)}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
                </section>


                {/* LIVE ALBUM FEED */}
                <section className="mt-24 overflow-hidden rounded-[40px] bg-[#1b1513] p-8 lg:p-12 relative shadow-3xl">
                     <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EC6345]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                     
                     <div className="relative z-10 flex flex-wrap items-end justify-between gap-6 mb-16">
                        <div className="space-y-4">
                            <span className="text-[11px] font-black text-[#EC6345] uppercase tracking-[0.4em] block">Global Network</span>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter text-white">Live Submission Feed</h2>
                        </div>
                        <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-md">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Network Live</span>
                        </div>
                     </div>

                     <div className="relative">
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-4 lg:gap-6">
                            {shuffledProducts.slice(0, 7).map((product, i) => (
                                <motion.div 
                                    key={product.id || i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl transition-all group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[#EC6345]/20">
                                        <img 
                                            src={product.image || missionBg} 
                                            className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                                            alt="" 
                                        />
                                    </div>
                                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest text-center truncate">{product.name || 'Anonymous hit'}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                     </div>
                </section>

                {/* COMMAND STATUS BAR (INTEGRATED FOOTER) */}
                <div className="mt-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-[32px] border border-white/10 bg-[#0d0908] p-6 md:p-8 backdrop-blur-md relative overflow-hidden group shadow-2xl">
                        {/* Status Ambient Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#EC6345]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="relative z-10 flex items-center gap-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[#EC6345]">
                                <IoTimeOutline className="text-2xl animate-pulse" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] mb-1.5">Network Availability</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-bold text-[#EC6345] tracking-tight tabular-nums">
                                        {profile?.settings?.service_availability_start_time || "00:00:00"} — {profile?.settings?.service_availability_end_time || "23:59:59"}
                                    </span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block h-10 w-px bg-white/5" />

                        <div className="relative z-10 flex items-center gap-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[#EC6345]">
                                <IoRocketOutline className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] mb-1.5">Curation Inquiries</p>
                                <p className="text-sm font-medium text-white/70">
                                    Reach out via the <span className="text-white hover:text-[#EC6345] transition-colors cursor-pointer underline underline-offset-6 font-black decoration-[#EC6345] uppercase tracking-tighter">Support Terminal</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
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
                                    onClick={() => setIsModalOpen(false)}
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
                                <h2 className="text-xl font-black tracking-tighter text-white mb-1 uppercase">Task Submission</h2>
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
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Quality Score</p>
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
                                    <span className="font-black text-white/20 uppercase tracking-widest">Protocol ID</span>
                                    <span className="font-bold text-white/50 tracking-widest">{currentGame?.rating_no}</span>
                                </div>
                            </div>

                            {/* Comment Entry */}
                            <div className="mb-6 text-left">
                                <p className="text-[8px] font-black text-[#EC6345] uppercase tracking-[0.2em] mb-2">Intelligence Comment</p>
                                <textarea 
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Add intelligence..."
                                    className="w-full rounded-2xl bg-white/[0.03] border border-white/5 p-3 text-[11px] text-white placeholder:text-white/10 focus:outline-none focus:border-[#EC6345]/30 transition-all h-20 resize-none"
                                />
                            </div>

                            {/* Master Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="h-12 rounded-2xl border border-white/10 bg-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-red-400 transition-all"
                                >
                                    Abort
                                </button>
                                <button 
                                    onClick={handleSubmit}
                                    className="group relative h-12 rounded-2xl bg-[#EC6345] overflow-hidden text-[9px] font-black text-white shadow-xl transition-all active:scale-95"
                                >
                                    {isLoading ? "SYNCING..." : "COMMIT"}
                                </button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <MusicVisualizer />
            <BottomNavMobile />
        </div>
    );
};

export default Starting;
