const Loader = ({ fullScreen = false, size = "default" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8",
  };

  const containerClasses = fullScreen
    ? "flex justify-center items-center h-screen bg-darker"
    : "flex justify-center items-center min-h-[200px]";

  return (
    <>
      <div className={containerClasses}>
        <div id="container" className="flex space-x-2">
          <div
            id="ball-1"
            className={`circle ${sizeClasses[size]} bg-accent rounded-full animate-bounce`}
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            id="ball-2"
            className={`circle ${sizeClasses[size]} bg-accent rounded-full animate-bounce`}
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            id="ball-3"
            className={`circle ${sizeClasses[size]} bg-accent rounded-full animate-bounce`}
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        .circle {
          animation: bounce 1.4s ease-in-out infinite both;
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Loader;
