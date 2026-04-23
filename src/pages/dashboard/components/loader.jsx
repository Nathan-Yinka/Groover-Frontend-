import PropTypes from "prop-types";

const Loader = ({
  visible = true,
  height = 20,
  width = 20,
  color = "#ff6b56",
  secondaryColor = "rgba(255,255,255,0.28)",
  strokeWidth = "8",
}) => {
  if (!visible) {
    return null;
  }

  const ringInset = Math.max(2, Math.round(Number(strokeWidth) / 3));
  const dotSize = Math.max(4, Math.round(Math.min(height, width) / 4.8));

  return (
    <>
      <span
        className="relative inline-flex items-center justify-center"
        style={{ height: `${height}px`, width: `${width}px` }}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            border: `${Math.max(2, Math.round(Number(strokeWidth) / 4))}px solid ${secondaryColor}`,
          }}
        />
        <span
          className="absolute rounded-full border-t-transparent animate-spin"
          style={{
            inset: `${ringInset}px`,
            borderWidth: `${Math.max(2, Math.round(Number(strokeWidth) / 4))}px`,
            borderColor: color,
            borderTopColor: "transparent",
          }}
        />
        <span
          className="absolute rounded-full"
          style={{
            height: `${dotSize}px`,
            width: `${dotSize}px`,
            background: color,
            boxShadow: `0 0 14px ${color}`,
            animation: "buttonLoaderPulse 1s ease-in-out infinite",
          }}
        />
      </span>

      <style>{`
        @keyframes buttonLoaderPulse {
          0%, 100% {
            transform: scale(0.75);
            opacity: 0.75;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

Loader.propTypes = {
  visible: PropTypes.bool,
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
  secondaryColor: PropTypes.string,
  strokeWidth: PropTypes.string,
};

export default Loader;
