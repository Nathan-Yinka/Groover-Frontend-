import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { GoArrowLeft } from "react-icons/go";

const BackButton = ({ label = "Back", className = "", onClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
      return;
    }
    navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`relative z-50 inline-flex items-center gap-2 rounded-lg border border-[#EC6345]/35 bg-[#EC6345]/10 px-4 py-2.5 text-[#EC6345] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EC6345] hover:text-white hover:shadow-[0_10px_25px_-12px_rgba(236,99,69,0.75)] ${className}`}
    >
      <GoArrowLeft className="text-lg" />
      <span className="text-sm font-semibold tracking-wide">{label}</span>
    </button>
  );
};

BackButton.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default BackButton;
