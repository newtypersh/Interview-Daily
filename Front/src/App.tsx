import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Header from './components/layout/Header';
import Home from './pages/Home';
import DailyInterview from './pages/DailyInterview';
import Feedback from './pages/DailyInterview/Feedback';
import Settings from './pages/Settings';
import History from './pages/History';
import { useAuth } from './hooks/useAuth.ts';
import { api } from './apis/axios';

function App() {
  const { data: isLoggedIn, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post('/oauth2/logout', {}, { baseURL: '' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={handleLogout} />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/daily-interview"
              element={isLoggedIn ? <DailyInterview /> : <Navigate to="/" />}
            />
            <Route
              path="/daily-interview/feedback"
              element={isLoggedIn ? <Feedback /> : <Navigate to="/" />}
            />
            <Route
              path="/settings"
              element={isLoggedIn ? <Settings /> : <Navigate to="/" />}
            />
            <Route
              path="/history"
              element={isLoggedIn ? <History /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
