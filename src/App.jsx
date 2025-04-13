// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout'; // ✅ 추가

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import BasicQuiz from './pages/basicquiz';
import Verify from './pages/verify';
import ResetPassword from './pages/ResetPassword';
import FindAccount from './pages/FindAccount';
import QuizComingSoon from './pages/QuizComingSoon';

function App() {
  return (
    <BrowserRouter>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/basicquiz" element={<BasicQuiz />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/find" element={<FindAccount />} />
          <Route path="/quiz/functional" element={<QuizComingSoon />} />
          <Route path="/quiz/neuro" element={<QuizComingSoon />} />
        </Routes>
      </MobileLayout>
    </BrowserRouter>
  );
}

export default App;
