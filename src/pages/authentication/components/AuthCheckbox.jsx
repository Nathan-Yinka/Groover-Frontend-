import React from "react";

const AuthCheckbox = ({
  id = "remember-me",
  checked,
  onChange,
  label = "Remember me",
  containerClassName = "",
  textClassName = "",
  boxClassName = "",
  dotClassName = "",
  checkedDotClassName = "bg-accent",
}) => (
  <label
    htmlFor={id}
    className={`group inline-flex cursor-pointer items-center gap-2.5 text-sm text-white/78 ${containerClassName}`}
  >
    <input
      id={id}
      name={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="peer sr-only"
    />
    <span
      className={`grid h-[18px] w-[18px] place-items-center rounded-full border border-white/35 bg-transparent transition peer-checked:border-accent peer-checked:bg-accent/20 group-hover:border-accent/80 ${boxClassName}`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full transition ${
          checked ? checkedDotClassName : "bg-transparent"
        } ${dotClassName}`}
      />
    </span>
    <span className={textClassName}>{label}</span>
  </label>
);

export default AuthCheckbox;
