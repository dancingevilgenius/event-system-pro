import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";
import StaffPage from "@/pages/StaffPage";
import CompetitorPage from "@/pages/CompetitorPage";
import JudgingPage from "@/pages/JudgingPage";
import { MessageStack } from "@/components/MessageStack";

export default function App() {
  return (
    <>
      <MessageStack />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/competitor" element={<CompetitorPage />} />
        <Route path="/judging" element={<JudgingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
