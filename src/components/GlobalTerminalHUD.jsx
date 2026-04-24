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
        <AnimatePresence>
            {alert.visible && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="fixed inset-x-4 top-10 z-[9999999] flex justify-center pointer-events-none"
                >
                    <div className={`relative flex items-center gap-6 rounded-[32px] border-2 px-8 py-5 shadow-3xl backdrop-blur-2xl transition-all pointer-events-auto ${
                        alert.type === 'error' ? 'border-red-500/30 bg-red-950/20' : 
                        alert.type === 'success' ? 'border-green-500/30 bg-green-950/20' : 
                        'border-[#EC6345]/30 bg-[#1b1513]/80'
                    }`}>
                        {/* Background Pulsing Glow */}
                        <div className={`absolute inset-0 rounded-[32px] opacity-10 animate-pulse ${
                            alert.type === 'error' ? 'bg-red-500' : 
                            alert.type === 'success' ? 'bg-green-500' : 
                            'bg-[#EC6345]'
                        }`} />

                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                            {alert.type === 'error' && <HiOutlineRefresh className="text-3xl text-red-500 animate-spin" />}
                            {alert.type === 'success' && <HiOutlineLightningBolt className="text-3xl text-green-400" />}
                            {alert.type === 'sync' && <div className="h-8 w-8 rounded-full border-4 border-t-[#EC6345] border-white/10 animate-spin" />}
                        </div>

                        <div className="relative max-w-[300px]">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 opacity-50 ${
                                alert.type === 'error' ? 'text-red-400' : 
                                alert.type === 'success' ? 'text-green-400' : 
                                'text-[#EC6345]'
                            }`}>
                                {String(alert.title)}
                            </h4>
                            <p className="text-sm font-bold text-white tracking-tight leading-tight">
                                {typeof alert.message === 'string' ? alert.message : (alert.message?.message || JSON.stringify(alert.message) || String(alert.message))}
                            </p>
                        </div>

                        {alert.type !== 'sync' && (
                           <div className="relative ml-4 h-1 w-20 rounded-full bg-white/10 overflow-hidden">
                               <motion.div 
                                 initial={{ x: '-100%' }}
                                 animate={{ x: '0%' }}
                                 transition={{ duration: 5 }}
                                 className={`h-full w-full ${
                                    alert.type === 'error' ? 'bg-red-500' : 
                                    alert.type === 'success' ? 'bg-green-500' : 
                                    'bg-[#EC6345]'
                                 }`} 
                               />
                           </div>
                        )}

                        {/* Manual Close for convenience */}
                        <button 
                            onClick={() => dispatch(hideAlert())}
                            className="relative ml-2 text-white/20 hover:text-white transition-colors"
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
