import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineLightningBolt, HiOutlineRefresh } from "react-icons/hi";
import { hideAlert } from '../app/slice/ui.slice';

const GlobalTerminalHUD = () => {
    const { alert } = useSelector((state) => state.ui);
    const dispatch = useDispatch();

    useEffect(() => {
        if (alert.visible && alert.type !== 'sync') {
            const timer = setTimeout(() => {
                dispatch(hideAlert());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert.visible, alert.type, dispatch]);

    return (
        <AnimatePresence mode="wait">
            {alert.visible && (
                <motion.div 
                    initial={{ opacity: 0, y: -40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 350 }}
                    className="fixed inset-x-4 top-4 md:top-10 z-[9999999] flex justify-center pointer-events-none"
                >
                    <div className={`relative flex items-center gap-3 md:gap-6 rounded-2xl md:rounded-[32px] border bg-[#1b1513]/90 px-4 md:px-8 py-3 md:py-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all pointer-events-auto ${
                        alert.type === 'error' ? 'border-red-500/30 ring-1 ring-red-500/20' : 
                        alert.type === 'success' ? 'border-green-500/30 ring-1 ring-green-500/20' : 
                        'border-[#EC6345]/30 ring-1 ring-[#EC6345]/20'
                    }`}>
                        {/* Background Pulsing Glow */}
                        <div className={`absolute inset-0 rounded-2xl md:rounded-[32px] opacity-[0.03] animate-pulse ${
                            alert.type === 'error' ? 'bg-red-500' : 
                            alert.type === 'success' ? 'bg-green-500' : 
                            'bg-[#EC6345]'
                        }`} />

                        <div className="relative flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-white/5">
                            {alert.type === 'error' && <HiOutlineRefresh className="text-xl md:text-3xl text-red-500 animate-spin" />}
                            {alert.type === 'success' && <HiOutlineLightningBolt className="text-xl md:text-3xl text-green-400" />}
                            {alert.type === 'sync' && <div className="h-6 w-6 md:h-8 md:w-8 rounded-full border-2 md:border-4 border-t-[#EC6345] border-white/10 animate-spin" />}
                        </div>

                        <div className="relative max-w-[200px] md:max-w-[400px]">
                            <h4 className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] font-mono mb-0.5 md:mb-1 opacity-40 ${
                                alert.type === 'error' ? 'text-red-400' : 
                                alert.type === 'success' ? 'text-green-400' : 
                                'text-[#EC6345]'
                            }`}>
                                {String(alert.title)}
                            </h4>
                            <p className="text-[11px] md:text-sm font-bold text-white tracking-tight leading-tight">
                                {typeof alert.message === 'string' ? alert.message : (alert.message?.message || JSON.stringify(alert.message) || String(alert.message))}
                            </p>
                        </div>

                        {alert.type !== 'sync' && (
                           <div className="hidden sm:block relative ml-4 h-1 w-20 rounded-full bg-white/5 overflow-hidden">
                               <motion.div 
                                 initial={{ x: '-100%' }}
                                 animate={{ x: '0%' }}
                                 transition={{ duration: 5, ease: "linear" }}
                                 className={`h-full w-full ${
                                    alert.type === 'error' ? 'bg-red-500' : 
                                    alert.type === 'success' ? 'bg-green-500' : 
                                    'bg-[#EC6345]'
                                 }`} 
                               />
                           </div>
                        )}

                        <button 
                            onClick={() => dispatch(hideAlert())}
                            className="relative ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-[10px] text-white/20 hover:bg-white/10 hover:text-white transition-all"
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalTerminalHUD;
