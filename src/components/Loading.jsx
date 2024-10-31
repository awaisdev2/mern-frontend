const Loading = () => {
  return (
    <div className="d-flex justify-content-between align-items-center my-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        height={60}
        width={50}
      >
        <linearGradient id="a12">
          <stop offset="0" stopColor="#FF156D" stopOpacity="0"></stop>
          <stop offset="1" stopColor="#FF156D"></stop>
        </linearGradient>
        <circle
          fill="none"
          stroke="url(#a12)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeDasharray="0 44 0 44 0 44 0 44 0 360"
          cx="100"
          cy="100"
          r="70"
          transform-origin="center"
        >
          <animateTransform
            type="rotate"
            attributeName="transform"
            calcMode="discrete"
            dur="1"
            values="360;324;288;252;216;180;144;108;72;36"
            repeatCount="indefinite"
          ></animateTransform>
        </circle>
      </svg>
      <p className="font-bold">Loading...</p>
    </div>
  );
};

export default Loading;
