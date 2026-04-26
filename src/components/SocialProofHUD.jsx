import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { IoCloseOutline, IoSparklesOutline } from "react-icons/io5";
import { fetchProducts } from '../app/service/products.service';
import v2AlbumArt from "../assets/v2_album_art.png";

const ACTIONS = ["just earned commission on", "successfully Status", "is now trending with", "completed a payout for", "finalized a win on", "launched a global hit with"];
const NAMES = [
 "Peter Ander", "Sarah Jenkins", "Marco Rossi", "Ellen Wu", "David Chen", "Sofia Garcia", "Liam O'Connor", "Amina Al-Farsi", "Hiroshi Tanaka", "Emma Wilson",
 "Hans Müller", "Chloe Dubois", "Arjun Patel", "Isabella Santos", "Lucas Meyer", "Yuki Sato", "Olga Ivanova", "Jean-Pierre Blanc", "Maria Hernandez", "Sven Lindberg",
 "Aisha Bello", "Keiko Mori", "Omar El-Sayed", "Elena Popova", "Carlos Ruiz", "Ingrid Vogt", "Mateo Silva", "Noor Khan", "Lars Jensen", "Fatima Zahra",
 "John Doe", "Jane Smith", "Robert Brown", "Emily Davis", "Michael Miller", "Jessica Taylor", "William Thomas", "Olivia Moore", "James Jackson", "Sophia White"
];

const SocialProofHUD = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { products } = useSelector((state) => state.products);
    const [showActivity, setShowActivity] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(null);
    const activityTimerRef = useRef(null);
    const visibleTimerRef = useRef(null);

    // Only allow on Landing (/) and Home Dashboard (/home)
    const isAllowedPage = useMemo(() => {
        const path = location.pathname;
        return path === "/" || path === "/home" || path === "/home/";
    }, [location.pathname]);

    // Ensure products are available
    useEffect(() => {
        if (isAllowedPage && (!products || products.length === 0)) {
            dispatch(fetchProducts());
        }
    }, [products, dispatch, isAllowedPage]);

    const generateRandomActivity = useCallback(() => {
        if (!isAllowedPage) return null;
        
        const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
        const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        
        if (!products || products.length === 0) {
             return {
                name: randomName,
                action: `${randomAction} the`,
                productName: "Premium Curation",
                amount: (Math.random() * (1200 - 150) + 150).toFixed(2),
                images: [v2AlbumArt]
            };
        }

        const numProducts = Math.floor(Math.random() * 3) + 1;
        const selectedProducts = [...products]
            .sort(() => 0.5 - Math.random())
            .slice(0, numProducts);
        
        const randomAmount = (Math.random() * (1200 - 150) + 150).toFixed(2);
        
        return {
            name: randomName,
            action: `${randomAction} ${numProducts > 1 ? 'the Combo' : 'the'}`,
            productName: numProducts > 1 ? "Premium Stack" : selectedProducts[0].product_name || selectedProducts[0].name,
            amount: randomAmount,
            images: selectedProducts.map(p => p.product_image_url || p.image || v2AlbumArt)
        };
    }, [products, isAllowedPage]);

    useEffect(() => {
        if (!isAllowedPage) {
            setShowActivity(false);
            if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
            if (visibleTimerRef.current) clearTimeout(visibleTimerRef.current);
            return;
        }

        const cycle = () => {
            if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
            if (visibleTimerRef.current) clearTimeout(visibleTimerRef.current);

            const nextWait = Math.floor(Math.random() * (85000 - 35000) + 35000);
            
            activityTimerRef.current = setTimeout(() => {
                const activity = generateRandomActivity();
                if (activity) {
                    setCurrentActivity(activity);
                    setShowActivity(true);
                    visibleTimerRef.current = setTimeout(() => {
                        setShowActivity(false);
                        cycle(); 
                    }, 7000);
                } else {
                    cycle();
                }
            }, nextWait);
        };

        cycle();

        return () => {
            if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
            if (visibleTimerRef.current) clearTimeout(visibleTimerRef.current);
        };
    }, [generateRandomActivity, isAllowedPage]);

    if (!isAllowedPage) return null;

    return (
        <AnimatePresence mode="wait">
            {showActivity && currentActivity && (
                <motion.div
                    key={currentActivity.name + currentActivity.amount}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="fixed bottom-20 md:bottom-24 right-4 left-4 md:left-auto md:right-6 z-[1000] flex items-center gap-3 md:gap-4 bg-white/95 backdrop-blur-2xl p-3 md:p-4 rounded-xl md:rounded-2xl border border-[#EC6345]/30 shadow-2xl shadow-[#EC6345]/15 md:max-w-[340px]"
                >
                    <div className="relative min-w-[60px] md:min-w-[70px] h-[60px] md:h-[70px] flex items-center justify-center bg-slate-50 rounded-lg md:rounded-xl border border-slate-100 overflow-hidden shadow-inner">
                        {currentActivity.images.slice(0, 3).map((img, i) => (
                            <img 
                                key={i} 
                                src={img} 
                                className={`absolute w-full h-full object-cover transition-all duration-500 shadow-lg ${i === 1 ? 'translate-x-2 translate-y-2 scale-90 border-2 border-white rounded-lg z-10' : i === 2 ? '-translate-x-2 -translate-y-1 scale-75 border-2 border-white rounded-lg z-0 opacity-50' : 'z-20 border-2 border-white rounded-lg'}`} 
                                alt="" 
                            />
                        ))}
                    </div>
                    
                    <div className="flex-grow pr-2 md:pr-4">
                        <div className="flex items-center justify-between mb-0.5 md:mb-1">
                            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Global Feed</span>
                            <button onClick={() => setShowActivity(false)} className="text-slate-300 hover:text-[#EC6345] transition-colors">
                                <IoCloseOutline className="text-lg" />
                            </button>
                        </div>
                        <p className="text-[10px] md:text-[11px] font-medium text-slate-800 leading-tight">
                            <span className="font-bold text-[#333333]">{currentActivity.name}</span> {currentActivity.action} 
                            <br />
                            <span className="text-[#EC6345] font-black uppercase italic tracking-tighter line-clamp-1">{currentActivity.productName}</span>
                        </p>
                        <div className="mt-1.5 md:mt-2 flex items-center gap-2">
                            <div className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] md:text-[10px] font-bold rounded-md border border-green-100 flex items-center gap-1">
                                <IoSparklesOutline className="animate-spin-slow text-[8px] md:text-xs" />
                                Earned ${currentActivity.amount}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SocialProofHUD;
