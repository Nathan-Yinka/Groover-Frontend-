import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { toast } from "sonner";
import logo from "../../assets/logo.svg";
import loginpageImage from "../../assets/loginpage_image.svg";
import authService from "../../app/service/auth.service";
import ErrorHandler from "../../app/ErrorHandler";
import AuthInputField from "./components/AuthInputField";
import AuthCheckbox from "./components/AuthCheckbox";

const inputTheme = {
  labelClassName: "!text-[#354052]",
  iconClassName: "!text-[#98a2b3] text-base",
  inputClassName:
    "h-[52px] text-base !border-[#d2d8e2] !bg-white !text-[#101828] !placeholder:text-[#8f99ab] focus:!border-accent/65 focus:!ring-accent/30",
};

const SignUp = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    gender: "",
    transactional_password: "",
    invitation_code: "",
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTransactionalPassword, setShowTransactionalPassword] =
    useState(false);
  const transactionalPassword = formData.transactional_password.trim();
  const isTransactionPinValid = /^\d{4}$/.test(transactionalPassword);

  const normalizePhoneNumber = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const hasPlus = trimmed.startsWith("+");
    const digits = trimmed.replace(/\D/g, "");
    return `${hasPlus ? "+" : ""}${digits}`;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let nextValue = value;

    if (name === "email") {
      nextValue = value.trim().toLowerCase();
    }
    if (name === "transactional_password") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }
    if (name === "invitation_code") {
      nextValue = value.trim().toUpperCase();
    }
    if (name === "phone_number") {
      nextValue = value.slice(0, 20);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = [];
    const username = formData.username.trim();
    const firstName = formData.first_name.trim();
    const lastName = formData.last_name.trim();
    const email = formData.email.trim().toLowerCase();
    const phoneNumber = normalizePhoneNumber(formData.phone_number);
    const invitationCode = formData.invitation_code.trim().toUpperCase();
    const transactionalPassword = formData.transactional_password.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const validGender = ["M", "F"];

    if (!firstName) errors.push("First name is required.");
    if (!lastName) errors.push("Last name is required.");

    if (!username) {
      errors.push("Username is required.");
    } else if (username.length > 30) {
      errors.push("Username must not exceed 30 characters.");
    }

    if (!email) {
      errors.push("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Please enter a valid email address.");
    }

    if (!phoneNumber) {
      errors.push("Phone number is required.");
    } else if (!/^\+?\d{7,15}$/.test(phoneNumber)) {
      errors.push("Phone number must be 7 to 15 digits.");
    }

    if (!validGender.includes(formData.gender)) {
      errors.push("Please select Male or Female.");
    }

    if (!password.trim()) errors.push("Password is required.");
    if (!confirmPassword.trim()) errors.push("Confirm password is required.");
    if (password !== confirmPassword) errors.push("Passwords do not match.");

    if (!/^\d{4}$/.test(transactionalPassword)) {
      errors.push("Transaction PIN must be exactly 4 digits.");
    }

    if (!invitationCode) {
      errors.push("Invitation code is required.");
    } else if (invitationCode.length !== 6) {
      errors.push("Invitation code must be 6 characters.");
    }

    if (!formData.termsAccepted) errors.push("Please accept the terms and conditions to continue.");

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);

    const payload = {
      username,
      email,
      phone_number: phoneNumber,
      password,
      first_name: firstName,
      last_name: lastName,
      gender: formData.gender,
      transactional_password: transactionalPassword,
      invitation_code: invitationCode,
    };

    try {
      const response = await authService.register(payload);

      if (response.success) {
        toast.success("Registration successful!");
        setTimeout(() => navigate("/login"), 1600);
      } else {
        ErrorHandler(response.message);
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[#f2f4f7] text-[#111827] lg:h-[100dvh] lg:overflow-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="grid min-h-screen grid-cols-1 lg:h-full lg:grid-cols-[1fr_1fr]">
        <section className="relative hidden overflow-hidden bg-black lg:block">
          <img
            src={loginpageImage}
            alt="Signup background"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/78 via-black/68 to-black/84" />
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute left-12 top-12 z-30"
          >
            <img src={logo} alt="SoundCampaign" className="h-auto w-44" />
          </button>

          <div className="absolute inset-x-12 bottom-24 z-10 max-w-[590px] text-white">
            <h1 className="text-6xl font-semibold leading-[1.03] tracking-tight">
              Join our community
              <br />
              and <span className="text-accent">earn.</span>
            </h1>
            <p className="mt-7 max-w-[540px] text-[17px] leading-8 text-white/85">
              Review albums, complete daily tasks, and earn as you grow on
              SoundCampaign.
            </p>
          </div>

          <p className="absolute bottom-10 left-12 z-10 text-sm text-white/65">
            © {currentYear} SoundCampaign • Privacy • Terms
          </p>
        </section>

        <section className="flex min-h-screen flex-col bg-[#f8fafc] lg:h-full lg:min-h-0 lg:overflow-hidden">
          <div className="flex items-center justify-between bg-[#f8fafc] px-5 py-4 sm:px-8 lg:hidden">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-xl bg-[#0b0b0c] p-2 shadow-sm"
            >
              <img src={logo} alt="SoundCampaign" className="h-auto w-32" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-1 text-sm font-medium text-accent"
            >
              <FiArrowLeft className="text-sm" />
              Back
            </button>
          </div>

          <div className="px-5 pb-6 pt-4 sm:px-8 lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:px-12 lg:pb-10 lg:pt-10">
            <div className="mx-auto flex min-h-full w-full max-w-[920px] flex-col lg:justify-center">
              <div className="mx-auto w-full max-w-[720px]">
                <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#111827] sm:text-5xl">
                  Create an account
                </h2>
                <p className="mt-2 text-base text-[#667085]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-medium text-accent hover:underline"
                  >
                    Log in
                  </button>
                </p>

                <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <AuthInputField
                    id="first_name"
                    name="first_name"
                    label="First Name"
                    placeholder="John"
                    Icon={FiUser}
                    value={formData.first_name}
                    onChange={handleChange}
                    autoComplete="given-name"
                    maxLength={30}
                    {...inputTheme}
                  />
                  <AuthInputField
                    id="last_name"
                    name="last_name"
                    label="Last Name"
                    placeholder="Doe"
                    Icon={FiUser}
                    value={formData.last_name}
                    onChange={handleChange}
                    autoComplete="family-name"
                    maxLength={30}
                    {...inputTheme}
                  />
                </div>

                <AuthInputField
                  id="username"
                  name="username"
                  label="Username"
                  placeholder="Create a username"
                  Icon={FiUser}
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  maxLength={30}
                  {...inputTheme}
                />

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <AuthInputField
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="john@example.com"
                    Icon={FiMail}
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    maxLength={254}
                    {...inputTheme}
                  />
                  <AuthInputField
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                    Icon={FiPhone}
                    value={formData.phone_number}
                    onChange={handleChange}
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={20}
                    {...inputTheme}
                  />
                </div>

                <div>
                  <p className="mb-2 block text-sm font-medium text-[#354052]">Gender</p>
                  <div className="flex flex-wrap items-center gap-5 rounded-[10px] border border-[#d2d8e2] bg-white px-4 py-3 text-[#344054]">
                    {[
                      { label: "Male", value: "M" },
                      { label: "Female", value: "F" },
                    ].map((option) => (
                      <label key={option.value} className="inline-flex cursor-pointer items-center gap-2.5 text-base">
                        <input
                          type="radio"
                          name="gender"
                          value={option.value}
                          onChange={handleChange}
                          checked={formData.gender === option.value}
                          className="h-4 w-4 border-[#98a2b3] text-accent focus:ring-accent"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <AuthInputField
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    placeholder="Enter your password"
                    Icon={FiLock}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    rightNode={(
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-[#8d98ab] hover:text-accent"
                      >
                        {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    )}
                    {...inputTheme}
                  />

                  <AuthInputField
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm Password"
                    placeholder="Confirm password"
                    Icon={FiLock}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    rightNode={(
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="text-[#8d98ab] hover:text-accent"
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff className="h-5 w-5" />
                        ) : (
                          <FiEye className="h-5 w-5" />
                        )}
                      </button>
                    )}
                    {...inputTheme}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <AuthInputField
                    id="transactional_password"
                    name="transactional_password"
                    type={showTransactionalPassword ? "text" : "password"}
                    label="Transaction Password"
                    placeholder="4-digit pin"
                    Icon={FiLock}
                    value={formData.transactional_password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    inputMode="numeric"
                    maxLength={4}
                    rightNode={(
                      <button
                        type="button"
                        onClick={() => setShowTransactionalPassword((prev) => !prev)}
                        className="text-[#8d98ab] hover:text-accent"
                      >
                        {showTransactionalPassword ? (
                          <FiEyeOff className="h-5 w-5" />
                        ) : (
                          <FiEye className="h-5 w-5" />
                        )}
                      </button>
                    )}
                    {...inputTheme}
                  />
                  {formData.transactional_password && !isTransactionPinValid ? (
                    <p className="-mt-2 text-xs font-medium text-[#b42318] sm:col-span-2">
                      Transaction PIN must be exactly 4 digits.
                    </p>
                  ) : null}

                  <AuthInputField
                    id="invitation_code"
                    name="invitation_code"
                    label="Invitation Code"
                    placeholder="Enter code"
                    Icon={FiUser}
                    value={formData.invitation_code}
                    onChange={handleChange}
                    autoComplete="off"
                    maxLength={6}
                    {...inputTheme}
                  />
                </div>

                <AuthCheckbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  containerClassName="items-start"
                  textClassName="text-[#475467]"
                  boxClassName="!h-5 !w-5 !rounded-md !border-2 !border-black !bg-white"
                  dotClassName="!h-2.5 !w-2.5"
                  checkedDotClassName="bg-[#101828]"
                  label={(
                    <span>
                      I agree to the <a href="/termsandconds" target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">Terms and Conditions</a> and <a href="/termsandconds" target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">Privacy Policy</a>
                    </span>
                  )}
                />

                <button
                  type="submit"
                  className="mt-1 flex h-[54px] w-full items-center justify-center rounded-[10px] border border-accent/40 bg-accent px-5 text-base font-semibold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading || !isTransactionPinValid}
                >
                  {loading ? "Submitting..." : "Register Now"}
                </button>

                <div
                  className="mt-4 text-center lg:mt-8 lg:border-t lg:border-[#e4e7ec] lg:pt-5"
                  style={{ paddingBottom: "max(env(safe-area-inset-bottom), 10px)" }}
                >
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center gap-2 text-base text-[#667085] hover:text-accent"
                  >
                    <FiArrowLeft className="text-lg" />
                    Back to Login
                  </button>
                </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignUp;
