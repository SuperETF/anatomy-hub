import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import BasicQuiz from './pages/basicQuiz'; // 🔥 컴포넌트 이름 대문자!
import Verify from './pages/verify';
import ResetPassword from './pages/ResetPassword';
import FindAccount from './pages/FindAccount'; // 🔍 컴포넌트 import
import QuizComingSoon from './pages/QuizComingSoon';

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Login />} />           {/* 홈 → 로그인 */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/basicquiz" element={<BasicQuiz />} />
  <Route path="/verify" element={<Verify />} />
  <Route path="/reset" element={<ResetPassword />} /> 
  <Route path="/find" element={<FindAccount />} /> {/* ✅ 추가된 경로 */} 
  <Route path="/quiz/functional" element={<QuizComingSoon />} />
  <Route path="/quiz/neuro" element={<QuizComingSoon />} />
</Routes>

    </BrowserRouter>
  );
}

export default App;
