import { Navigate, Route, Routes } from 'react-router-dom';
import ActivityMonitor from './components/ActivityMonitor';
import LoginFlashHandler from './components/LoginFlashHandler';
import ProtectedRoute from './components/ProtectedRoute';
import AccountPage from './pages/AccountPage';
import AdminCompetitorsPage from './pages/AdminCompetitorsPage';
import AdminContestResultsPage from './pages/AdminContestResultsPage';
import AdminContestsPage from './pages/AdminContestsPage';
import AdminHomePage from './pages/AdminHomePage';
import AdminPlaceholderPage from './pages/AdminPlaceholderPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import CompetitorPage from './pages/CompetitorPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JudgingPage from './pages/JudgingPage';
import StaffPage from './pages/StaffPage';

export default function App() {
  return (
    <>
      <ActivityMonitor />
      <LoginFlashHandler />
      <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/changepassword"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adminhome"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/event-details"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminPlaceholderPage title="Event Details" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contests"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminContestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contests/contest"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminContestResultsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/competitors"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminCompetitorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/competition-entries"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminPlaceholderPage title="Competition Entries" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute roles={['staff']}>
            <StaffPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/judging"
        element={
          <ProtectedRoute roles={['staff']}>
            <JudgingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/competitor"
        element={
          <ProtectedRoute roles={['competitor']}>
            <CompetitorPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
