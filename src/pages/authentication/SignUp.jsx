import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { toast } from "sonner";
import logo from "../../assets/LogoWithText.svg";
import loginpageImage from "../../assets/left.png";
import authService from "../../app/service/auth.service";
import ErrorHandler from "../../app/ErrorHandler";
import AuthInputField from "./components/AuthInputField";
import AuthCheckbox from "./components/AuthCheckbox";

const inputTheme = {
  labelClassName: "!text-[#2d2d2d] !font-semibold",
  iconClassName: "!text-gray-400 text-base",
  inputClassName:
    "!h-[48px] !rounded-lg !border-gray-300 !bg-white !text-gray-800 !placeholder:text-gray-400 focus:!border-[#ff6b56] focus:!ring-[#ff6b56]/25",
};

const SignUp = () => {
  const navigate = useNavigate();

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

    if (!formData.termsAccepted) {
      errors.push("Please accept the terms and conditions to continue.");
    }

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
    <div className="flex min-h-screen flex-col bg-[#F7F6F0]">
      <header className="bg-[#2d2d2d] px-8 py-4">
        <div className="mx-auto max-w-[1150px]">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center transition-opacity hover:opacity-80"
          >
            <img src={logo} alt="Groover" className="h-auto w-[145px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1250px] flex-1 grid-cols-1 gap-8 px-5 py-6 md:px-8 md:py-1 lg:grid-cols-2">
        <div className="flex items-center justify-center">
          <img
            src={loginpageImage}
            alt="Join our roster of music curators & pros"
            className="h-auto w-full max-w-[420px] object-cover sm:max-w-[500px] lg:max-w-[550px]"
          />
        </div>

        <section className="relative flex flex-col justify-center overflow-hidden p-5 sm:p-8 lg:p-12">
          <div className="pointer-events-none absolute right-12 top-12 h-24 w-24 rounded-full border-4 border-[#8fa3d9] opacity-40" />
          <div className="pointer-events-none absolute right-32 top-20 h-8 w-8 rounded-full bg-[#e8a89d] opacity-50" />
          <div className="pointer-events-none absolute right-20 top-32 h-12 w-12 rounded-full border-4 border-[#8fa3d9] opacity-40" />
          <div className="pointer-events-none absolute bottom-32 left-8 h-16 w-16 rounded-full bg-[#e8a89d] opacity-40" />
          <div className="pointer-events-none absolute bottom-20 right-20 h-12 w-12 rounded-full border-4 border-[#d4a5a0] opacity-40" />

          <div className="relative z-10 mx-auto w-full max-w-[720px]">
            <h1 className="mb-2 text-3xl font-black text-[#2d2d2d]">
              Create an account
            </h1>
            <p className="mb-8 text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-[#ff6b56] hover:underline"
              >
                Log in
              </button>
            </p>

            <form
              noValidate
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5"
            >
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
                <p className="mb-2 block text-sm font-semibold text-[#2d2d2d]">
                  Gender
                </p>
                <div className="flex flex-wrap items-center gap-5 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800">
                  {[
                    { label: "Male", value: "M" },
                    { label: "Female", value: "F" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="inline-flex cursor-pointer items-center gap-2.5 text-base"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        onChange={handleChange}
                        checked={formData.gender === option.value}
                        className="h-4 w-4 border-gray-300 accent-[#ff6b56]"
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
                  rightNode={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-gray-400 transition-colors hover:text-[#ff6b56]"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  }
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
                  rightNode={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="text-gray-400 transition-colors hover:text-[#ff6b56]"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  }
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
                  rightNode={
                    <button
                      type="button"
                      onClick={() =>
                        setShowTransactionalPassword((prev) => !prev)
                      }
                      className="text-gray-400 transition-colors hover:text-[#ff6b56]"
                    >
                      {showTransactionalPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  }
                  {...inputTheme}
                />

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

              {formData.transactional_password && !isTransactionPinValid ? (
                <p className="-mt-2 text-xs font-medium text-[#b42318]">
                  Transaction PIN must be exactly 4 digits.
                </p>
              ) : null}

              <AuthCheckbox
                id="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                containerClassName="items-start !text-sm !text-gray-700"
                textClassName="text-gray-700"
                boxClassName="!h-5 !w-5 !rounded !border !border-gray-300 !bg-white peer-checked:!border-[#ff6b56] peer-checked:!bg-[#ff6b56]/10"
                dotClassName="!h-2.5 !w-2.5"
                checkedDotClassName="bg-[#ff6b56]"
                label={
                  <span>
                    I agree to the{" "}
                    <a
                      href="/termsandconds"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#ff6b56] hover:underline"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/termsandconds"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#ff6b56] hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </span>
                }
              />

              <button
                type="submit"
                className="mt-8 flex w-full items-center justify-center rounded-lg bg-[#ff6b56] px-5 py-3 font-bold text-white transition-colors hover:bg-[#ff5544] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading || !isTransactionPinValid}
              >
                {loading ? "Submitting..." : "Register Now"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SignUp;
