import PropTypes from "prop-types";
import { GoArrowLeft } from "react-icons/go";

const BackButton = ({ label = "Back", className = "", onClick }) => {
  const handleBack = () => {
    if (onClick) {
      onClick();
      return;
    }
    window.history.back();
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-xl border border-accent/45 bg-accent/15 px-4 py-2.5 text-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-black hover:shadow-[0_10px_25px_-12px_rgba(30,215,96,0.9)] ${className}`}
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
