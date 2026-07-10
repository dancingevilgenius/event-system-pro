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
import EventMerchandisePosDemoPage from './pages/EventMerchandisePosDemoPage';
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
import WsdcFindDancerPage from './pages/WsdcFindDancerPage';
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
      <Route path="/event-merchandise-pos-demo" element={<EventMerchandisePosDemoPage />} />
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
          <ProtectedRoute roles={['ADMIN']}>
            <GoverningBodyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-log"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminAuditLogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adminhome"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wsdc-find-dancer"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <WsdcFindDancerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={EVENT_HOME_PATH}
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <EventHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={EVENTS_PATH}
        element={
          <ProtectedRoute roles={['ADMIN']}>
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
          <ProtectedRoute roles={['ADMIN']}>
            <AdminEventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={CREATE_EVENT_PATH}
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminAddEventPage />
          </ProtectedRoute>
        }
      />
      <Route path="/add-event" element={<Navigate to={CREATE_EVENT_PATH} replace />} />
      <Route
        path={`${EVENT_GROUPS_PATH}/:eventGroupCode/:eventId/attendees`}
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminEventAttendeesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${EVENT_GROUPS_PATH}/:eventGroupCode/:eventId/competitors`}
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminEventSectionPlaceholderPage title="Competitors" />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${EVENT_GROUPS_PATH}/:eventGroupCode/:eventId/contests`}
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminEventContestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${EVENT_GROUPS_PATH}/:eventGroupCode/:eventId`}
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminEventPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${EVENT_GROUPS_PATH}/:eventGroupCode`}
        element={
          <ProtectedRoute roles={['ADMIN']}>
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
          <ProtectedRoute roles={['ADMIN']}>
            <AdminContestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contests/contest"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminContestResultsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/competitors"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminCompetitorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/competition-entries"
        element={
          <ProtectedRoute roles={['ADMIN']}>
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
          <ProtectedRoute roles={['STAFF']}>
            <StaffPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/judging"
        element={
          <ProtectedRoute roles={['STAFF']}>
            <JudgingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/competitor"
        element={
          <ProtectedRoute roles={['COMPETITOR']}>
            <CompetitorPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
