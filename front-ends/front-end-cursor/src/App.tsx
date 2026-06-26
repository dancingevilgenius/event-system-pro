import { Navigate, Route, Routes } from 'react-router-dom';
import AdminCompetitorsPage from './pages/AdminCompetitorsPage';
import AdminHomePage from './pages/AdminHomePage';
import AdminPlaceholderPage from './pages/AdminPlaceholderPage';
import CompetitorPage from './pages/CompetitorPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JudgingPage from './pages/JudgingPage';
import StaffPage from './pages/StaffPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/adminhome" element={<AdminHomePage />} />
      <Route path="/admin/event-details" element={<AdminPlaceholderPage title="Event Details" />} />
      <Route path="/admin/contests" element={<AdminPlaceholderPage title="Contests" />} />
      <Route path="/admin/competitors" element={<AdminCompetitorsPage />} />
      <Route
        path="/admin/competition-entries"
        element={<AdminPlaceholderPage title="Competition Entries" />}
      />
      <Route path="/staff" element={<StaffPage />} />
      <Route path="/judging" element={<JudgingPage />} />
      <Route path="/competitor" element={<CompetitorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
