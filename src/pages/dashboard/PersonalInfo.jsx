import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { fadeIn, slideIn } from "../../motion";
import { updateProfile, changePassword, changeTransactionPassword } from "../../app/service/profile.service";
import {
    fetchProfileStart,
    fetchProfileSuccess,
    fetchProfileFailure,
    updateProfileSuccess,
    setImagePreview,
} from "../../app/slice/profile.slice";
import authService from "../../app/service/auth.service";
import Loader from "./components/Load";
import ButtonLoader from "./components/loader";
import ErrorHandler from "../../app/ErrorHandler";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaShieldAlt } from "react-icons/fa";
import { MdOutlinePhotoCamera } from "react-icons/md";
import BackButton from "./components/BackButton";

const PersonalInfo = () => {
    const dispatch = useDispatch();
    const { user: formData = {}, isLoading, profilePicture, imagePreview } = useSelector(
        (state) => state.profile
    );

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

    // Toggle Modals
    const toggleLoginPasswordModal = () => {
        setIsLoginPasswordModalOpen(!isLoginPasswordModalOpen);
        // Clear state when opening modal
        if (!isLoginPasswordModalOpen) {
            setPasswordData({
                current_password: "",
                new_password: "",
                confirm_new_password: "",
            });
        }
    };

    // Toggle Transaction Password Modal
    const toggleTransactionPasswordModal = () => {
        setIsTransactionPasswordModalOpen(!isTransactionPasswordModalOpen);
        // Clear state when opening modal
        if (!isTransactionPasswordModalOpen) {
            setTransactionPasswordData({
                current_password: "",
                new_password: "",
                confirm_new_password: "",
            });
        }
    };

    // Handle click outside modal to close
    const handleModalBackdropClick = (e, modalType) => {
        if (e.target === e.currentTarget) {
            if (modalType === 'login') {
                toggleLoginPasswordModal();
            } else if (modalType === 'transaction') {
                toggleTransactionPasswordModal();
            }
        }
    };

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            dispatch(fetchProfileStart());
            try {
                const response = await authService.fetchProfile();
                if (response.success) {
                    dispatch(fetchProfileSuccess(response.data));
                } else {
                    dispatch(fetchProfileFailure(response.message || "Failed to load profile."));
                    ErrorHandler(response.message)
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
                toast.error("An error occurred while fetching your profile.");
            }
        };

        if (!formData) {
            fetchProfile();
        }
    }, [dispatch, formData]);

    // Handle Profile Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateProfileSuccess({ ...formData, [name]: value })); // Update Redux state
    };

    // Handle Image Upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch(setImagePreview(reader.result)); // Set preview in Redux
                dispatch(updateProfileSuccess({ ...formData, profile_picture: file })); // Update Redux state
            };
            reader.readAsDataURL(file);
        }
    };

    // Update Profile
    const handleUpdateProfile = async () => {
        // Validate required fields
        if (!formData.username || !formData.email || !formData.phone_number) {
            toast.error("Username, email, and phone number are required.");
            return;
        }

        // Prepare payload with only changed fields
        const updatedData = {};
        Object.keys(formData).forEach((key) => {
            if (key === "profile_picture") {
                if (typeof profilePicture !== "string" || !profilePicture.startsWith("http")) {
                    updatedData.profile_picture = profilePicture; // Include if it's a file
                }
            } else if (formData[key] !== updatedData[key]) {
                updatedData[key] = formData[key]; // Include other changed fields
            }
        });

        // If no changes detected, show a toast and exit
        if (Object.keys(updatedData).length === 0) {
            toast.error("No changes detected.");
            return;
        }

        setIsUpdatingProfile(true);

        try {
            const result = await dispatch(updateProfile(updatedData));
            if (result.success) {
                console.log("dwfwefwe", result)
                toast.success(result.message);
                dispatch(updateProfileSuccess(result.data)); // Update Redux state with new profile
            } else {
                // Check for error object or array
                const errorMessage = result.message;
                ErrorHandler(errorMessage)
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            // Handle unexpected error format
            ErrorHandler(error);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    // Show Loader when the page is loading
    if (isLoading || !formData) {
        return <Loader />;
    }

    // Handle Password Changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChangePassword = async () => {
        // Validate required fields
        if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_new_password) {
            toast.error("All password fields are required.");
            return;
        }

        // Ensure new passwords match
        if (passwordData.new_password !== passwordData.confirm_new_password) {
            toast.error("New passwords do not match.");
            return;
        }

        // Ensure current and new passwords are not the same
        if (passwordData.current_password === passwordData.new_password) {
            toast.error("New password cannot be the same as the current password.");
            return;
        }

        // Prepare data for API
        const payload = {
            current_password: passwordData.current_password,
            new_password: passwordData.new_password,
        };

        // Show loader on button
        setIsSavingPassword(true);

        try {
            // Dispatch change password action
            const result = await dispatch(changePassword(payload));
            if (result.success) {
                toast.success(result.message || "Password updated successfully.");
                toggleLoginPasswordModal(); // Close modal
                setPasswordData({
                    current_password: "",
                    new_password: "",
                    confirm_new_password: "",
                }); // Reset fields
            } else {
                ErrorHandler(result.message);
            }
        } catch (error) {
            ErrorHandler(error);
        } finally {
            // Hide loader after update
            setIsSavingPassword(false);
        }
    };

    // Handle Transaction Password Input Changes
    const handleTransactionPasswordChange = (e) => {
        const { name, value } = e.target;
        setTransactionPasswordData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle Transaction Password Save
    const handleTransactionPasswordSave = async () => {
        const { current_password, new_password, confirm_new_password } = transactionPasswordData;

        // Frontend validation
        if (!current_password || !new_password || !confirm_new_password) {
            toast.error("All fields are required.");
            return;
        }
        if (new_password !== confirm_new_password) {
            toast.error("New password and confirm password must match.");
            return;
        }
        if (current_password === new_password) {
            toast.error("New transaction password cannot be the same as the current password.");
            return;
        }
        if (new_password.length !== 4 || isNaN(new_password)) {
            toast.error("Transaction password must be exactly 4 numeric characters.");
            return;
        }

        // Show loader
        setIsTransactionPasswordSaving(true);

        try {
            const payload = { current_password, new_password }; // Backend only needs current and new password
            const result = await dispatch(changeTransactionPassword(payload));
            if (result.success) {
                toast.success(result.message || "Transaction password updated successfully.");
                toggleTransactionPasswordModal(); // Close modal
                setTransactionPasswordData({
                    current_password: "",
                    new_password: "",
                    confirm_new_password: "",
                }); // Reset fields
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
        <div className="min-h-screen bg-[#060606] px-3 py-4 text-white md:px-8 md:py-6">
            {/* Back Button */}
            <BackButton className="mb-6" />

            {/* Page Title */}
            <motion.div
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 1 * 2).animate}
                className="text-center mb-8"
            >
                <h1 className="mb-2 text-2xl font-bold tracking-tight text-white md:text-3xl">Personal Information</h1>
                <p className="text-sm text-white/70 md:text-base">Manage your account details and security settings</p>
            </motion.div>

            {/* Profile Picture Section */}
            <motion.div
                initial={slideIn("up", null).initial}
                whileInView={slideIn("up", 1 * 2).animate}
                className="mb-6 rounded-2xl border border-white/10 bg-[#0d0f10] p-5 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.95)] md:p-6"
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-accent/30 shadow-lg">
                            {(imagePreview || profilePicture) ? (
                                <img
                                    src={imagePreview || profilePicture}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-[#15191b]">
                                    <FaUser className="text-3xl text-white/40" />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 cursor-pointer rounded-full border border-accent/30 bg-accent p-2 text-black shadow-lg transition hover:brightness-110">
                            <MdOutlinePhotoCamera className="text-lg" />
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <p className="text-center text-xs text-white/70 md:text-sm">Click the camera icon to update your profile picture</p>
                </div>
            </motion.div>

            {/* Personal Information Form */}
            <motion.div
                initial={slideIn("up", null).initial}
                whileInView={slideIn("up", 2 * 2).animate}
                className="mb-6 rounded-2xl border border-white/10 bg-[#0d0f10] p-5 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.95)] md:p-6"
            >
                <h2 className="mb-6 flex items-center text-xl font-bold text-white">
                    <FaIdCard className="mr-3 text-accent" />
                    Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-white/90">
                            <FaUser className="mr-2 text-sm text-accent" />
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username || ""}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-white/15 bg-[#14181b] p-3 text-sm text-white placeholder:text-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-accent/45"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-white/90">
                            <FaEnvelope className="mr-2 text-sm text-accent" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-white/15 bg-[#14181b] p-3 text-sm text-white placeholder:text-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-accent/45"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-white/90">
                            <FaPhone className="mr-2 text-sm text-accent" />
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number || ""}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-white/15 bg-[#14181b] p-3 text-sm text-white placeholder:text-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-accent/45"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white/90">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name || ""}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-white/15 bg-[#14181b] p-3 text-sm text-white placeholder:text-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-accent/45"
                            placeholder="Enter your first name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white/90">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name || ""}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-white/15 bg-[#14181b] p-3 text-sm text-white placeholder:text-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-accent/45"
                            placeholder="Enter your last name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white/90">Gender</label>
                        <div className="flex space-x-6 mt-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="M"
                                    checked={formData.gender === "M"}
                                    onChange={handleChange}
                                    className="h-4 w-4 border-white/30 text-accent focus:ring-accent"
                                />
                                <span className="text-sm text-white/85">Male</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="F"
                                    checked={formData.gender === "F"}
                                    onChange={handleChange}
                                    className="h-4 w-4 border-white/30 text-accent focus:ring-accent"
                                />
                                <span className="text-sm text-white/85">Female</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white/90">Referral Code</label>
                        <input
                            type="text"
                            name="referral_code"
                            value={formData.referral_code || ""}
                            readOnly
                            className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-[#13171a] p-3 text-sm text-white/75"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={slideIn("up", null).initial}
                whileInView={slideIn("up", 3 * 2).animate}
                className="mb-20 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdateProfile}
                    disabled={isUpdatingProfile}
                    className="flex items-center justify-center space-x-2 rounded-xl border border-accent/35 bg-accent px-6 py-3.5 font-semibold text-black transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isUpdatingProfile ? (
                        <ButtonLoader />
                    ) : (
                        <>
                            <FaUser className="text-lg" />
                            <span>Update Profile</span>
                        </>
                    )}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleLoginPasswordModal}
                    className="flex items-center justify-center space-x-2 rounded-xl border border-white/15 bg-[#11151b] px-6 py-3.5 font-semibold text-white transition duration-200 hover:border-accent/35 hover:text-accent"
                >
                    <FaLock className="text-lg" />
                    <span>Change Login Password</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleTransactionPasswordModal}
                    className="flex items-center justify-center space-x-2 rounded-xl border border-white/15 bg-[#11151b] px-6 py-3.5 font-semibold text-white transition duration-200 hover:border-accent/35 hover:text-accent"
                >
                    <FaShieldAlt className="text-lg" />
                    <span>Change Transaction Password</span>
                </motion.button>
            </motion.div>

            {/* Login Password Modal */}
            {isLoginPasswordModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
                    onClick={(e) => handleModalBackdropClick(e, 'login')}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-md rounded-2xl border border-accent/25 bg-[#0d1012] p-6 text-white shadow-[0_30px_70px_-35px_rgba(44,205,121,0.45)]"
                    >
                        <button
                            onClick={toggleLoginPasswordModal}
                            className="absolute right-4 top-4 rounded-full border border-accent/30 bg-accent/10 px-2 text-xl font-bold text-accent transition hover:bg-accent/20"
                        >
                            ✕
                        </button>
                        <div className="text-center mb-6">
                            <FaLock className="mx-auto mb-3 text-4xl text-accent" />
                            <h2 className="text-2xl font-bold text-white">Change Login Password</h2>
                            <p className="mt-2 text-sm text-white/65">Enter your current and new password</p>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-white/85">Current Password</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
                                    className="mt-1 w-full rounded-lg border border-white/15 bg-[#15191d] p-3 text-sm text-white placeholder:text-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-accent/45"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-white/85">New Password</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
                                    className="mt-1 w-full rounded-lg border border-white/15 bg-[#15191d] p-3 text-sm text-white placeholder:text-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-accent/45"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-white/85">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirm_new_password"
                                    value={passwordData.confirm_new_password}
                                    onChange={handlePasswordChange}
                                    className="mt-1 w-full rounded-lg border border-white/15 bg-[#15191d] p-3 text-sm text-white placeholder:text-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-accent/45"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleChangePassword}
                                className="mt-4 flex w-full items-center justify-center space-x-2 rounded-lg border border-accent/35 bg-accent py-3 font-semibold text-black transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isSavingPassword}
                            >
                                {isSavingPassword ? (
                                    <ButtonLoader />
                                ) : (
                                    <>
                                        <FaLock className="text-lg" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            )}

            {/* Transaction Password Modal */}
            {isTransactionPasswordModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
                    onClick={(e) => handleModalBackdropClick(e, 'transaction')}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-md rounded-2xl border border-accent/25 bg-[#0d1012] p-6 text-white shadow-[0_30px_70px_-35px_rgba(44,205,121,0.45)]"
                    >
                        <button
                            onClick={toggleTransactionPasswordModal}
                            className="absolute right-4 top-4 rounded-full border border-accent/30 bg-accent/10 px-2 text-xl font-bold text-accent transition hover:bg-accent/20"
                        >
                            ✕
                        </button>
                        <div className="text-center mb-6">
                            <FaShieldAlt className="mx-auto mb-3 text-4xl text-accent" />
                            <h2 className="text-2xl font-bold text-white">Change Transaction Password</h2>
                            <p className="mt-2 text-sm text-white/65">Enter your 4-digit transaction password</p>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-white/85">Current Password</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={transactionPasswordData.current_password}
                                    onChange={handleTransactionPasswordChange}
                                    className="mt-1 w-full rounded-lg border border-white/15 bg-[#15191d] p-3 text-sm text-white placeholder:text-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-accent/45"
                                    placeholder="Enter current password"
                                    maxLength="4"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-white/85">New Password</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={transactionPasswordData.new_password}
                                    onChange={handleTransactionPasswordChange}
                                    className="mt-1 w-full rounded-lg border border-white/15 bg-[#15191d] p-3 text-sm text-white placeholder:text-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-accent/45"
                                    placeholder="Enter new 4-digit password"
                                    maxLength="4"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-white/85">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirm_new_password"
                                    value={transactionPasswordData.confirm_new_password}
                                    onChange={handleTransactionPasswordChange}
                                    className="mt-1 w-full rounded-lg border border-white/15 bg-[#15191d] p-3 text-sm text-white placeholder:text-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-accent/45"
                                    placeholder="Confirm new password"
                                    maxLength="4"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleTransactionPasswordSave}
                                className="mt-4 flex w-full items-center justify-center space-x-2 rounded-lg border border-accent/35 bg-accent py-3 font-semibold text-black transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isTransactionPasswordSaving}
                            >
                                {isTransactionPasswordSaving ? (
                                    <ButtonLoader />
                                ) : (
                                    <>
                                        <FaShieldAlt className="text-lg" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default PersonalInfo;
