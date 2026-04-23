import PropTypes from "prop-types";

const Loader = ({ fullScreen = false, size = "default" }) => {
  const sizeClasses = {
    small: "h-24 w-24",
    default: "h-32 w-32",
    large: "h-40 w-40",
  };

  const containerClasses = fullScreen
    ? "flex min-h-screen items-center justify-center bg-[#f6f1ea] px-6"
    : "flex min-h-[220px] items-center justify-center px-6";

  return (
    <>
      <div className={containerClasses}>
        <div className="flex flex-col items-center gap-5 text-center">
          <div className={`relative ${sizeClasses[size]}`}>
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#ffb29f_0%,rgba(236,99,69,0.22)_40%,rgba(246,241,234,0)_72%)] blur-xl" />
            <div className="absolute inset-[8%] rounded-full border border-[#ec6345]/20 bg-[#fffaf5] shadow-[0_25px_60px_-35px_rgba(39,39,39,0.55)]" />
            <div className="absolute inset-[14%] rounded-full border-2 border-[#ec6345]/20 border-t-[#ec6345] animate-spin" />
            <div
              className="absolute inset-[24%] rounded-full border border-[#332823]/10 border-b-[#ffb29f]"
              style={{ animation: "spin 3.2s linear infinite reverse" }}
            />
            <div className="absolute inset-[34%] flex items-end justify-center gap-1 rounded-full bg-[radial-gradient(circle_at_top,#2d201d_0%,#191312_75%)] px-4 pb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              {[0, 1, 2, 3].map((bar) => (
                <span
                  key={bar}
                  className="loader-bar w-1.5 rounded-full bg-gradient-to-t from-[#ec6345] via-[#ff9f88] to-[#ffe1d7]"
                  style={{ animationDelay: `${bar * 0.14}s` }}
                />
              ))}
            </div>
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-[#fff7f2] shadow-[0_0_0_5px_rgba(255,255,255,0.08)]" />
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#9a5c4f]">
              Groover
            </p>
            <p className="text-sm text-[#5f5b57] md:text-base">
              Tuning your dashboard experience...
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .loader-bar {
          height: 18%;
          animation: loaderWave 1.15s ease-in-out infinite;
          transform-origin: center bottom;
        }

        @keyframes loaderWave {
          0%, 100% {
            height: 18%;
            opacity: 0.42;
          }
          50% {
            height: 52%;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  size: PropTypes.oneOf(["small", "default", "large"]),
};

export default Loader;
