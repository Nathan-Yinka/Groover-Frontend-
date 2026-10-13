import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircle, IoAlertCircle, IoClose } from "react-icons/io5";
import { hideAlert } from '../app/slice/ui.slice';

// Simple, light toast notification. Kept in this file (and keeping the
// historical "GlobalTerminalHUD" import name) so nothing else needs to change,
// but the design is intentionally plain: one accent color, no glow effects,
// and a bullet list when there's more than one message instead of one long
// run-on sentence.
const Toast = () => {
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

    const messages = Array.isArray(alert.message)
        ? alert.message
        : [typeof alert.message === 'string' ? alert.message : (alert.message?.message || JSON.stringify(alert.message) || String(alert.message))];

    const accent = alert.type === 'error' ? '#dc2626' : alert.type === 'success' ? '#16a34a' : '#EC6345';

    return (
        <AnimatePresence>
            {alert.visible && (
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-x-4 top-4 md:top-6 md:left-auto md:right-6 md:inset-x-auto z-[9999999] flex justify-center md:justify-end pointer-events-none"
                >
                    <div
                        className="pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-lg md:max-w-[380px]"
                        style={{ borderColor: `${accent}40` }}
                    >
                        <div className="mt-0.5 shrink-0" style={{ color: accent }}>
                            {alert.type === 'error' && <IoAlertCircle className="text-xl" />}
                            {alert.type === 'success' && <IoCheckmarkCircle className="text-xl" />}
                            {alert.type === 'sync' && <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: accent, borderTopColor: 'transparent' }} />}
                            {!['error', 'success', 'sync'].includes(alert.type) && <IoAlertCircle className="text-xl" />}
                        </div>

                        <div className="min-w-0 flex-1">
                            {alert.title && (
                                <p className="text-sm font-bold text-[#221d1a]">{alert.title}</p>
                            )}
                            {messages.length > 1 ? (
                                <ul className="mt-0.5 space-y-0.5">
                                    {messages.map((m, i) => (
                                        <li key={i} className="text-[13px] leading-snug text-[#6b625d]">&bull; {m}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-0.5 text-[13px] leading-snug text-[#6b625d]">{messages[0]}</p>
                            )}
                        </div>

                        {alert.type !== 'sync' && (
                            <button
                                onClick={() => dispatch(hideAlert())}
                                className="shrink-0 text-[#a39a92] hover:text-[#221d1a] transition-colors"
                                aria-label="Dismiss"
                            >
                                <IoClose className="text-lg" />
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
