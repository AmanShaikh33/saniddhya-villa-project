import logo from "../../assets/logo.png";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-cream flex items-center justify-center z-[100]">
      <div className="relative w-64">
        {/* Dimmed base logo, always visible */}
        <img src={logo} alt="Saniddhya Villas" className="w-full opacity-15" />

        {/* Full-color logo revealed left-to-right via clip-path animation */}
        <img
          src={logo}
          alt=""
          className="absolute inset-0 w-full animate-reveal-wipe"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;