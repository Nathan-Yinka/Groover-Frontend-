import React from "react";

const AuthInputField = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  label,
  Icon,
  rightNode,
  autoComplete,
  inputClassName = "",
  labelClassName = "",
  iconClassName = "",
  wrapperClassName = "",
  required = false,
  disabled = false,
  inputMode,
  maxLength,
  minLength,
  pattern,
}) => (
  <div className={wrapperClassName}>
    <label
      htmlFor={id}
      className={`mb-2 block text-sm font-medium text-white/85 ${labelClassName}`}
    >
      {label}
    </label>
    <div className="relative">
      <Icon
        className={`pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-white/45 ${iconClassName}`}
      />
      <input
        type={type || "text"}
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        inputMode={inputMode}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        placeholder={placeholder}
        className={`block h-[50px] w-full rounded-[10px] border border-[#2e3746] bg-[#121821] py-3 pl-12 pr-11 text-[16px] text-white transition focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/35 md:text-sm ${inputClassName}`}
      />
      {rightNode ? (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightNode}</div>
      ) : null}
    </div>
  </div>
);

export default AuthInputField;
