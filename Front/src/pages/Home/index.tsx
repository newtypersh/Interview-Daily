import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../../components/auth/LoginModal';

interface HomeProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

export default function Home({ isLoggedIn, onLogin }: HomeProps) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleDailyInterviewClick = () => {
    navigate('/daily-interview');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isLoggedIn ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">
                Interview Daily
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                매일 면접 연습으로 실력을 키워보세요
              </p>
              <button
                onClick={handleLoginClick}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                로그인
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-12">
                오늘의 면접을 시작해보세요
              </h1>
              <button
                onClick={handleDailyInterviewClick}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-4 px-12 rounded-lg transition-colors text-lg"
              >
                데일리 면접뷰
              </button>
            </div>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={onLogin}
      />
    </div>
  );
}
