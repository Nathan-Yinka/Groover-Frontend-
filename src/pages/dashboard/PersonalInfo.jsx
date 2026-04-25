import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "../../app/slice/ui.slice";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile, changePassword, changeTransactionPassword } from "../../app/service/profile.service";
import {
    fetchProfileStart,
    fetchProfileSuccess,
    fetchProfileFailure,
    setImagePreview,
} from "../../app/slice/profile.slice";
import authService from "../../app/service/auth.service";
import Loader from "./components/Load";
import ButtonLoader from "./components/loader";
import ErrorHandler from "../../app/ErrorHandler";
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoCallOutline, 
  IoShieldCheckmarkOutline, 
  IoLockClosedOutline, 
  IoIdCardOutline,
  IoCameraOutline,
  IoChevronForwardOutline,
  IoCloseOutline
} from "react-icons/io5";
import BackButton from "./components/BackButton";
import BottomNavMobile from "./components/BottomNavMobile";

const PersonalInfo = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.profile.user);
    const { isLoading, profilePicture, imagePreview } = useSelector((state) => state.profile);

    // Form state local for editing
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    // Password fields
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
    });

    const [transactionPasswordData, setTransactionPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
    });

    const [isLoginPasswordModalOpen, setIsLoginPasswordModalOpen] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isTransactionPasswordModalOpen, setIsTransactionPasswordModalOpen] = useState(false);
    const [isTransactionPasswordSaving, setIsTransactionPasswordSaving] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfileIfNeeded = async () => {
            if (!profile) {
                dispatch(fetchProfileStart());
                try {
                    const response = await authService.fetchProfile();
                    if (response.success) {
                        dispatch(fetchProfileSuccess(response.data));
                    } else {
                        dispatch(fetchProfileFailure(response.message || "Failed to load profile."));
                    }
                } catch (error) {
                    dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
                }
            }
        };
        fetchProfileIfNeeded();
    }, [dispatch, profile]);

    const hasChanges = useMemo(() => {
        if (!profile || !formData) return false;
        return Object.keys(formData).some(key => {
            if (key === "profile_picture") {
                return formData[key] instanceof File;
            }
            return formData[key] !== profile[key];
        });
    }, [formData, profile]);

    if (isLoading && !profile) return <Loader fullScreen={true} />;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch(setImagePreview(reader.result));
                setFormData((prev) => ({ ...prev, profile_picture: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async () => {
        setIsUpdatingProfile(true);
        try {
            // Prepare payload with only changed fields
            const changedData = {};
            Object.keys(formData).forEach((key) => {
                const value = formData[key];
                const originalValue = profile[key];

                // Special handling for profile_picture: only send if it's a new File
                if (key === "profile_picture") {
                    if (value instanceof File) {
                        changedData.profile_picture = value;
                    }
                } 
                // Only add other fields if they changed
                else if (value !== originalValue) {
                    changedData[key] = value;
                }
            });

            if (Object.keys(changedData).length === 0) {
                dispatch(showAlert({
                    type: 'info',
                    title: 'Dossier Message',
                    message: "No modifications detected in the dossier."
                }));
                setIsUpdatingProfile(false);
                return;
            }

            const result = await dispatch(updateProfile(changedData));
            if (result.success) {
                dispatch(showAlert({
                    type: 'success',
                    title: 'Dossier Updated',
                    message: "Dossier synchronized successfully."
                }));
                dispatch(setImagePreview(null)); // Clear preview after successful upload
                // The useEffect will handle updating formData when profile changes in Redux
            } else {
                ErrorHandler(result.message);
            }
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = async () => {
        if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_new_password) {
            dispatch(showAlert({
                type: 'error',
                title: 'Security Sync',
                message: "All password fields are required."
            }));
            return;
        }
        if (passwordData.new_password !== passwordData.confirm_new_password) {
            dispatch(showAlert({
                type: 'error',
                title: 'Security Sync',
                message: "New passwords do not match."
            }));
            return;
        }
        setIsSavingPassword(true);
        try {
            const result = await dispatch(changePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
            }));
            if (result.success) {
                dispatch(showAlert({
                    type: 'success',
                    title: 'Security Alert',
                    message: "Password updated successfully"
                }));
                setIsLoginPasswordModalOpen(false);
                setPasswordData({ current_password: "", new_password: "", confirm_new_password: "" });
            } else {
                ErrorHandler(result.message);
            }
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleTransactionPasswordChange = (e) => {
        const { name, value } = e.target;
        setTransactionPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTransactionPasswordSave = async () => {
        const { current_password, new_password, confirm_new_password } = transactionPasswordData;
        if (!current_password || !new_password || !confirm_new_password) {
            dispatch(showAlert({
                type: 'error',
                title: 'Security Sync',
                message: "All fields are required."
            }));
            return;
        }
        if (new_password !== confirm_new_password) {
            dispatch(showAlert({
                type: 'error',
                title: 'Security Sync',
                message: "New password and confirm password must match."
            }));
            return;
        }
        setIsTransactionPasswordSaving(true);
        try {
            const result = await dispatch(changeTransactionPassword({ current_password, new_password }));
            if (result.success) {
                dispatch(showAlert({
                    type: 'success',
                    title: 'Security Alert',
                    message: "Transaction password updated successfully"
                }));
                setIsTransactionPasswordModalOpen(false);
                setTransactionPasswordData({ current_password: "", new_password: "", confirm_new_password: "" });
            } else {
                ErrorHandler(result.message);
            }
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsTransactionPasswordSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F6F0] text-[#333333] selection:bg-[#EC6345]/30">
            <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-8 pb-32 md:px-8 md:py-10">
                
                {/* HEADER STATION */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative rounded-[32px] border border-[#e5ded3] bg-white p-6 md:p-8 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,99,69,0.04),transparent_50%)]" />
                  
                  <div className="relative z-10">
                    <BackButton className="mb-6" />
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC6345]/10 border border-[#EC6345]/20">
                          <IoIdCardOutline className="text-2xl text-[#EC6345]" />
                        </div>
                        <div>
                          <h1 className="text-3xl font-black tracking-tight text-[#333333] uppercase italic italic-heavy leading-none">
                            Personal Information
                          </h1>
                          <p className="mt-2 text-sm font-medium text-[#605E5E]">
                            Maintain your curator dossier and security credentials.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* IDENTITY MODULE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-4 v2-card p-8 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[#EC6345]/10 blur-3xl group-hover:bg-[#EC6345]/20 transition-all duration-700" />
                            <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-[48px] border-4 border-white shadow-2xl overflow-hidden bg-[#fbfaf6]">
                                {(imagePreview || profilePicture) ? (
                                    <img src={imagePreview || profilePicture} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <IoPersonOutline className="text-5xl text-[#EC6345]/20" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 h-12 w-12 flex items-center justify-center rounded-2xl bg-[#333333] border-4 border-white text-white shadow-xl cursor-pointer hover:bg-black transition-all hover:scale-110 active:scale-90">
                                <IoCameraOutline className="text-xl" />
                                <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </label>
                        </div>
                    </motion.div>

                    {/* BASIC INFORMATION PANE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-8 v2-card p-8 md:p-10"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-1 w-8 bg-[#EC6345] rounded-full" />
                            <h2 className="text-xl font-black text-[#333333] uppercase italic">Basic Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: "Username", name: "username", icon: IoPersonOutline, placeholder: "Curator ID" },
                                { label: "Email Address", name: "email", icon: IoMailOutline, placeholder: "curator@mission.com" },
                                { label: "Phone Number", name: "phone_number", icon: IoCallOutline, placeholder: "+1 000 000 000" },
                                { label: "First Name", name: "first_name", icon: IoIdCardOutline, placeholder: "Given Name" },
                                { label: "Last Name", name: "last_name", icon: IoIdCardOutline, placeholder: "Surname" }
                            ].map((field) => (
                                <div key={field.name} className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60 ml-2">{field.label}</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#605E5E]/30 group-focus-within:text-[#EC6345] transition-colors">
                                            <field.icon className="text-lg" />
                                        </div>
                                        <input
                                            type="text"
                                            name={field.name}
                                            value={formData[field.name] || ""}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className="w-full rounded-2xl border border-[#e5ded3] bg-[#fbfaf6] pl-12 pr-6 py-4 text-sm font-bold text-[#333333] placeholder:text-[#605E5E]/30 focus:outline-none focus:border-[#EC6345]/40 transition-all"
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60 ml-2">Gender Identification</label>
                                <div className="flex gap-4 p-1.5 bg-[#fbfaf6] border border-[#e5ded3] rounded-2xl">
                                    {["M", "F"].map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                formData.gender === g 
                                                ? "bg-[#333333] text-white shadow-lg" 
                                                : "text-[#605E5E] hover:bg-black/5"
                                            }`}
                                        >
                                            {g === "M" ? "Male" : "Female"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-[#e5ded3] flex flex-col md:flex-row gap-4">
                            <motion.button
                                whileHover={hasChanges ? { scale: 1.02 } : {}}
                                whileTap={hasChanges ? { scale: 0.98 } : {}}
                                onClick={handleUpdateProfile}
                                disabled={isUpdatingProfile || !hasChanges}
                                className={`flex items-center justify-center flex-1 rounded-[24px] py-5 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all ${
                                    hasChanges 
                                    ? "bg-[#333333] text-white shadow-black/10 hover:bg-black" 
                                    : "bg-[#e5ded3] text-[#605E5E]/40 cursor-not-allowed shadow-none"
                                }`}
                            >
                                {isUpdatingProfile ? <ButtonLoader /> : "Update Profile"}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* SECURITY SECTOR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {[
                        { 
                            title: "Login Security", 
                            desc: "Change your login password", 
                            icon: IoLockClosedOutline, 
                            action: () => setIsLoginPasswordModalOpen(true) 
                        },
                        { 
                            title: "Transaction Security", 
                            desc: "Change your transaction PIN", 
                            icon: IoShieldCheckmarkOutline, 
                            action: () => setIsTransactionPasswordModalOpen(true) 
                        }
                    ].map((sec, idx) => (
                        <motion.button
                            key={sec.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={sec.action}
                            className="v2-card p-6 flex items-center justify-between group hover:border-[#EC6345]/30 transition-all"
                        >
                            <div className="flex items-center gap-5">
                                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-[#EC6345]/10 text-[#EC6345] group-hover:bg-[#EC6345] group-hover:text-white transition-all">
                                    <sec.icon className="text-xl" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#333333]">{sec.title}</p>
                                    <p className="text-[10px] font-medium text-[#605E5E] tracking-tight">{sec.desc}</p>
                                </div>
                            </div>
                            <IoChevronForwardOutline className="text-[#605E5E]/30 group-hover:translate-x-1 group-hover:text-[#EC6345] transition-all" />
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* MODALS TERMINALS */}
            <AnimatePresence>
                {(isLoginPasswordModalOpen || isTransactionPasswordModalOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        {isLoginPasswordModalOpen && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-full max-w-md v2-card p-8 md:p-10 relative"
                            >
                                <button onClick={() => setIsLoginPasswordModalOpen(false)} className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-[#fbfaf6] text-[#605E5E] hover:text-[#EC6345] transition-colors">
                                    <IoCloseOutline className="text-2xl" />
                                </button>
                                
                                <div className="text-center mb-8">
                                    <div className="h-16 w-16 bg-[#EC6345]/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <IoLockClosedOutline className="text-3xl text-[#EC6345]" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#333333] uppercase italic">Change Password</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#605E5E]/40 mt-1">Update your account password</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: "Current Password", name: "current_password" },
                                        { label: "New Password", name: "new_password" },
                                        { label: "Confirm New Password", name: "confirm_new_password" }
                                    ].map(f => (
                                        <div key={f.name} className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#605E5E]/60 ml-1">{f.label}</label>
                                            <input
                                                type="password"
                                                name={f.name}
                                                value={passwordData[f.name]}
                                                onChange={handlePasswordChange}
                                                className="w-full rounded-2xl border border-[#e5ded3] bg-[#fbfaf6] px-5 py-3.5 text-sm font-bold text-[#333333] focus:outline-none focus:border-[#EC6345]/40"
                                            />
                                        </div>
                                    ))}
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleChangePassword}
                                        disabled={isSavingPassword}
                                        className="flex items-center justify-center w-full mt-4 rounded-2xl bg-[#333333] py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-black disabled:opacity-40"
                                    >
                                        {isSavingPassword ? <ButtonLoader /> : "Update Password"}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {isTransactionPasswordModalOpen && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-full max-w-md v2-card p-8 md:p-10 relative"
                            >
                                <button onClick={() => setIsTransactionPasswordModalOpen(false)} className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-[#fbfaf6] text-[#605E5E] hover:text-[#EC6345] transition-colors">
                                    <IoCloseOutline className="text-2xl" />
                                </button>
                                
                                <div className="text-center mb-8">
                                    <div className="h-16 w-16 bg-[#EC6345]/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <IoShieldCheckmarkOutline className="text-3xl text-[#EC6345]" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#333333] uppercase italic">Change PIN</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#605E5E]/40 mt-1">Update your 4-digit security PIN</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: "Current Access Code", name: "current_password" },
                                        { label: "New Access Code", name: "new_password" },
                                        { label: "Confirm Access Code", name: "confirm_new_password" }
                                    ].map(f => (
                                        <div key={f.name} className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#605E5E]/60 ml-1">{f.label}</label>
                                            <input
                                                type="password"
                                                name={f.name}
                                                maxLength="4"
                                                value={transactionPasswordData[f.name]}
                                                onChange={handleTransactionPasswordChange}
                                                className="w-full text-center tracking-[1em] rounded-2xl border border-[#e5ded3] bg-[#fbfaf6] px-5 py-3.5 text-lg font-black text-[#333333] focus:outline-none focus:border-[#EC6345]/40"
                                            />
                                        </div>
                                    ))}
                                    <p className="text-[9px] font-medium text-[#605E5E] text-center italic opacity-60">Must be exactly 4 numeric identification digits.</p>
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleTransactionPasswordSave}
                                        disabled={isTransactionPasswordSaving}
                                        className="flex items-center justify-center w-full mt-2 rounded-2xl bg-[#333333] py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-black disabled:opacity-40"
                                    >
                                        {isTransactionPasswordSaving ? <ButtonLoader /> : "Update PIN"}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNavMobile className="md:hidden" />
        </div>
    );
};

export default PersonalInfo;
