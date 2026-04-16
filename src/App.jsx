import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  homepage,
  home,
  withdraw,
  deposit,
  starting,
  profile,
  personal,
  level,
  payment,
  notifications,
  records,
  contact,
  terms,
  about,
  faq,
  events,
  certificate,
  signup,
  contact1,
  login,
  termsandconds,
  loader,
} from "./constants/app.routes";

import LoginLayout from "./pages/authentication/LoginLayout";
import HomeLayout from "./pages/dashboard/HomeLayout";
import Login from "./pages/authentication/Login";
import Home from "./pages/dashboard/Home";
import WithdrawLayout from "./pages/dashboard/WithdrawLayout";
import Withdraw from "./pages/dashboard/Withdraw";
import DepositLayout from "./pages/dashboard/DepositLayout";
import Deposit from "./pages/dashboard/Deposit";
import Starting from "./pages/dashboard/Starting";
import Profile from "./pages/dashboard/Profile";
import PersonalInfo from "./pages/dashboard/PersonalInfo";
import Level from "./pages/dashboard/Level";
import Payment from "./pages/dashboard/Payment";
import Notification from "./pages/dashboard/Notifications";
import Records from "./pages/dashboard/Records";
import ContactUs from "./pages/dashboard/ContactUs";
import Terms from "./pages/dashboard/Terms";
import AboutUs from "./pages/dashboard/AboutUs";
import FAQs from "./pages/dashboard/FAQs";
import Events from "./pages/dashboard/Events";
import Certificate from "./pages/dashboard/Certificate";
import SignUp from "./pages/authentication/SignUp";
import ProtectedRoute from "./pages/ProtectedRoute"; // Import the ProtectedRoute
import Loader from "./pages/Loader";
import { Toaster } from "sonner";
import TermsandCond from "./pages/dashboard/Termsandcond";
import Landing from "./pages/landing-page/Landing";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Loader Route */}
        <Route path={homepage} element={<Landing />} />

        {/* Public Routes */}
        <Route path={login} element={<LoginLayout />}>
          <Route index element={<Login />} />
          <Route path={signup} element={<SignUp />} />
        </Route>
        <Route path={contact1} element={<ContactUs />} />
        <Route path={termsandconds} element={<TermsandCond />} />
        <Route path={loader} element={<Loader />} />


        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={home} element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path={starting} element={<Starting />} />
            <Route path={profile} element={<Profile />} />
            <Route path={personal} element={<PersonalInfo />} />
            <Route path={level} element={<Level />} />
            <Route path={payment} element={<Payment />} />
            <Route path={notifications} element={<Notification />} />
            <Route path={records} element={<Records />} />
            <Route path={contact} element={<ContactUs />} />
            <Route path={terms} element={<Terms />} />
            <Route path={about} element={<AboutUs />} />
            <Route path={faq} element={<FAQs />} />
            <Route path={events} element={<Events />} />
            <Route path={certificate} element={<Certificate />} />

            <Route path={withdraw} element={<WithdrawLayout />}>
              <Route index element={<Withdraw />} />
            </Route>
            <Route path={deposit} element={<DepositLayout />}>
              <Route index element={<Deposit />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster
        position={"top-right"}
        richColors
        duration={5000}
        className="z-[9999999999999999999]"
        closeButton
      />
    </Router>
  );
}

export default App;


