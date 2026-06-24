import { Navigate, Route, Routes } from 'react-router-dom';
import CompetitorPage from './pages/CompetitorPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StaffPage from './pages/StaffPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/staff" element={<StaffPage />} />
      <Route path="/competitor" element={<CompetitorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
