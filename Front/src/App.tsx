import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import DailyInterview from './pages/DailyInterview';
import Feedback from './pages/DailyInterview/Feedback';
import Settings from './pages/Settings';
import History from './pages/History';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} onLogin={handleLogin} />} />
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
