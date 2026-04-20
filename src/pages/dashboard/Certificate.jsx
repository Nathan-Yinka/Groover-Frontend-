import certImage from "../../assets/cert.jpg";
import BackButton from "./components/BackButton";
import BottomNavMobile from "./components/BottomNavMobile";

const Certificate = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333]">
      <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <div className="rounded-[18px] border border-[#e5ded3] bg-white p-4 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] md:p-6">
          <BackButton className="mb-5" />
          <h1 className="text-center text-2xl font-bold tracking-tight md:text-4xl">
            Certificate
          </h1>
          <p className="mt-2 text-center text-xs text-[#605E5E] md:text-sm">
            Company registration and incorporation certificate.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e5ded3] bg-white p-3 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.55)] md:p-5">
          <div className="flex max-h-[78vh] items-center justify-center overflow-hidden rounded-xl border border-[#e5ded3] bg-[#fbfaf6]">
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


