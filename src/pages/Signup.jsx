import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/global.scss';
import '../styles/Signup.scss';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    job: '',
    experience: '',
    agreeTerms: false,
    agreeMarketing: false,
    agreePrivacy: false
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.password !== form.confirmPassword) {
      setError('비밀번호와 비밀번호 확인이 다릅니다.');
      return;
    }

    if (!form.agreeTerms || !form.agreePrivacy) {
      setError('필수 약관에 동의해야 합니다.');
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        setError('이미 가입된 이메일입니다.');
      } else {
        setError(signUpError.message);
      }
      return;
    }

    const user = data.user;

    if (!data.session) {
      setMessage('가입 성공! 이메일 인증 후 로그인 해주세요.');
      return navigate('/verify');
    }

    if (user) {
      const { error: profileError } = await supabase.from('user_profiles').insert([
        {
          id: user.id,
          name: form.name,
          job: form.job,
          experience: form.experience
        }
      ]);

      if (profileError) {
        setError('유저 정보 저장 실패: ' + profileError.message);
        return;
      }

      navigate('/dashboard');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="top-row">
          <button className="back-button" onClick={() => navigate('/login')}>
            ← 로그인으로 돌아가기
          </button>
        </div>
        <h1>회원가입</h1>

        <form onSubmit={handleSignup}>
          <label>이름</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>이메일</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>비밀번호</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />

          <label>비밀번호 확인</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />

          <label>직업</label>
          <input name="job" value={form.job} onChange={handleChange} />

          <label>경력</label>
          <input name="experience" value={form.experience} onChange={handleChange} />

          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="agreePrivacy" checked={form.agreePrivacy} onChange={handleChange} />
              개인정보 수집 및 이용에 동의합니다
            </label>
            <label>
              <input type="checkbox" name="agreeMarketing" checked={form.agreeMarketing} onChange={handleChange} />
              마케팅 정보 수신에 동의합니다 (선택)
            </label>
            <label>
              <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} />
              서비스 이용약관에 동의합니다
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <button type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
