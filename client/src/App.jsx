import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages with Code Splitting
const Home = lazy(() => import("./pages/Home"));
const Categories = lazy(() => import("./pages/Categories"));
const Jury = lazy(() => import("./pages/Jury"));
const Guidelines = lazy(() => import("./pages/Guidelines"));
const Judging = lazy(() => import("./pages/Judging"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const PreviousEditions = lazy(() => import("./pages/PreviousEditions"));
const Media = lazy(() => import("./pages/Media.jsx"));
const Blogs = lazy(() => import("./pages/Blogs.jsx"));
const BlogDetail = lazy(() => import("./pages/BlogDetail.jsx"));
const EditionDetail = lazy(() => import("./pages/EditionDetail.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const NominationForm = lazy(() => import("./pages/NominationForm.jsx"));
const UserDashboard = lazy(() => import("./pages/UserDashboard.jsx"));
const NominationDetails = lazy(() => import("./pages/NominationDetails.jsx"));
const SuccessPage = lazy(() => import("./pages/SuccessPage.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const AdminRegister = lazy(() => import("./pages/AdminRegister.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const FAQ = lazy(() => import("./pages/FAQ.jsx"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail.jsx"));
const AuthCallback = lazy(() => import("./pages/AuthCallback.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const DeveloperAuth = lazy(() => import("./pages/DeveloperAuth.jsx"));

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import CallButton from "./components/CallButton.jsx";


export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#3a1418]">
      <ScrollToTop />
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-[#3a1418]">
        <Suspense fallback={
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
            <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold tracking-widest uppercase animate-pulse text-[#d4af37]">Loading...</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/jury" element={<Jury />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/judging" element={<Judging />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            {/* Backward compatible + navbar links */}
            <Route path="/previous" element={<PreviousEditions />} />
            <Route path="/previous-editions" element={<PreviousEditions />} />
            <Route path="/media" element={<Media />} />
            <Route path="/editions/:year" element={<EditionDetail />} />
            <Route path="/:year/:slug" element={<EditionDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/nominate" element={<NominationForm />} />
            <Route path="/nominate/:id" element={<NominationForm />} />
            <Route
              path="/nomination/:id"
              element={<NominationDetails />}
            />
            <Route path="/success" element={<SuccessPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/developer" element={<DeveloperAuth />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>



      {!location.pathname.startsWith("/admin") && <Footer />}
      {!location.pathname.startsWith("/admin") && (
        <>
          <WhatsAppButton />
          <CallButton />
        </>
      )}
    </div >
  );
}
