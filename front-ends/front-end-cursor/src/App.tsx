import { Navigate, Route, Routes } from 'react-router-dom';
import ActivityMonitor from './components/ActivityMonitor';
import LoginFlashHandler from './components/LoginFlashHandler';
import ProtectedRoute from './components/ProtectedRoute';
import AccountPage from './pages/AccountPage';
import AdminAuditLogPage from './pages/AdminAuditLogPage';
import AdminCompetitorsPage from './pages/AdminCompetitorsPage';
import AdminContestResultsPage from './pages/AdminContestResultsPage';
import AdminContestsPage from './pages/AdminContestsPage';
import AdminAddEventPage from './pages/AdminAddEventPage';
import AdminEventAttendeesPage from './pages/AdminEventAttendeesPage';
import AdminEventContestsPage from './pages/AdminEventContestsPage';
import AdminEventGroupPage from './pages/AdminEventGroupPage';
import AdminEventPage from './pages/AdminEventPage';
import AdminEventSectionPlaceholderPage from './pages/AdminEventSectionPlaceholderPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminHomePage from './pages/AdminHomePage';
import AdminPlaceholderPage from './pages/AdminPlaceholderPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import CompetitorPage from './pages/CompetitorPage';
import EventHomePage from './pages/EventHomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PublicHomePage from './pages/PublicHomePage';
import DemoPage from './pages/DemoPage';
import GoverningBodyPage from './pages/GoverningBodyPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JudgingPage from './pages/JudgingPage';
import SecretQuestionsPage from './pages/SecretQuestionsPage';
import StaffPage from './pages/StaffPage';
import StaticListDetailsPage from './pages/StaticListDetailsPage';
import StaticListsPage from './pages/StaticListsPage';
import TournamentBracketDemoPage from './pages/TournamentBracketDemoPage';
import { CREATE_EVENT_PATH, EVENT_HOME_PATH, EVENT_GROUPS_PATH, EVENTS_PATH } from './constants/eventRoutes';

export default function App() {
  return (
    <>
      <ActivityMonitor />
      <LoginFlashHandler />
      <Routes>
      <Route path="/" element={<PublicHomePage />} />
      <Route path="/home-page" element={<PublicHomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/tournament-bracket-demo" element={<TournamentBracketDemoPage />} />
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
        path="/secret-questions"
        element={
          <ProtectedRoute>
            <SecretQuestionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/static-lists"
        element={
          <ProtectedRoute>
            <StaticListsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/static-list-details/:listCode"
        element={
          <ProtectedRoute>
            <StaticListDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/governing-body"
        element={
          <ProtectedRoute roles={['admin']}>
            <GoverningBodyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-log"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminAuditLogPage />
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
        path={EVENT_HOME_PATH}
        element={
          <ProtectedRoute roles={['admin']}>
            <EventHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={EVENTS_PATH}
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminPlaceholderPage
              title="Events"
              backPath={EVENT_HOME_PATH}
              backLabel="Back to Event Home"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path={EVENT_GROUPS_PATH}
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminEventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={CREATE_EVENT_PATH}
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminAddEventPage />
          </ProtectedRoute>
        }
      />
      <Route path="/add-event" element={<Navigate to={CREATE_EVENT_PATH} replace />} />
      <Route
        path={`${EVENT_GROUPS_PATH}/:eventGroupCode/:eventId/attendees`}
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminEventAttendeesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${EVENT_GROUPS_PATH}/:eventGroupCode/:eventId/competitors`}
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminEventSectionPlaceholderPage title="Competitors" />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${EVENT_GROUPS_PATH}/:eventGroupCode/:eventId/contests`}
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminEventContestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${EVENT_GROUPS_PATH}/:eventGroupCode/:eventId`}
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminEventPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${EVENT_GROUPS_PATH}/:eventGroupCode`}
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminEventGroupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/event-details"
        element={<Navigate to={EVENT_GROUPS_PATH} replace />}
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
        path="/admin/tournament-bracket-demo"
        element={<Navigate to="/tournament-bracket-demo" replace />}
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
