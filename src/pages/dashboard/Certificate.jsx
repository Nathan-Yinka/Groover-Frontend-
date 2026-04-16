import certImage from "../../assets/cert.jpg";
import BackButton from "./components/BackButton";
import BottomNavMobile from "./components/BottomNavMobile";

const Certificate = () => {
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <div className="rounded-2xl border border-white/10 bg-[#0d0f10] p-4 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.95)] md:p-6">
          <BackButton className="mb-5" />
          <h1 className="text-center text-2xl font-bold tracking-tight md:text-4xl">
            Certificate
          </h1>
          <p className="mt-2 text-center text-xs text-white/65 md:text-sm">
            Company registration and incorporation certificate.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#101214] via-[#121417] to-[#0c0d0f] p-3 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.95)] md:p-5">
          <div className="flex max-h-[78vh] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0a0c0d]">
            <img
              src={certImage}
              alt="Certificate of Incorporation"
              className="max-h-[74vh] w-full object-contain"
            />
          </div>
        </div>

        <BottomNavMobile className="md:hidden" />
      </div>
    </div>
  );
};

export default Certificate;
