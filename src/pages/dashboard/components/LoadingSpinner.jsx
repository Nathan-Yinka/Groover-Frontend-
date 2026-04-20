const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#F7F6F0",
      }}
    >
      <div style={{ width: "700px", height: "700px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          width="100%"
          height="100%"
          style={{
            shapeRendering: "auto",
            display: "block",
            background: "transparent",
          }}
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g>
            <path
              style={{ transform: "scale(0.8)", transformOrigin: "50px 50px" }}
              strokeLinecap="round"
              d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
              strokeDasharray="207.83703186035157 48.75189636230468"
              strokeWidth="10"
              stroke="#EC6345"
              fill="none"
            >
              <animate
                values="0;256.58892822265625"
                keyTimes="0;1"
                dur="1s"
                repeatCount="indefinite"
                attributeName="stroke-dashoffset"
              ></animate>
            </path>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default LoadingSpinner;
