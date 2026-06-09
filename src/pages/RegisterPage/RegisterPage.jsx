import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, LinearProgress,
  Avatar, Chip, Alert, IconButton, InputAdornment,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { signUp, updateProfile } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

const GENRES = ['K-POP', 'POP', 'J-POP', '힙합', 'R&B', '재즈', '락', '클래식', 'EDM', '인디'];
const MOODS  = ['새벽 감성', '비 오는 날', '드라이브', '카페', '공부', '이별', '봄', '집중', '파티', '힐링'];
const STEPS  = ['기본정보', '프로필', '장르', '무드', '완료'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '', password: '', passwordConfirm: '', nickname: '',
    avatarUrl: '', bio: '',
    genres: [], moods: [],
  });
  const [showPw, setShowPw] = useState(false);
  const [userId, setUserId] = useState(null);

  const pwValid = form.password.length >= 8;
  const pwMatch = form.password === form.passwordConfirm;

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const toggleItem = (field, val) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(val) ? prev[field].filter(v => v !== val) : [...prev[field], val],
    }));
  };

  const handleStep0 = async () => {
    if (!pwValid) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    if (!pwMatch) { setError('비밀번호가 일치하지 않습니다.'); return; }
    setError('');
    setLoading(true);
    const { data, error: err } = await signUp({
      email: form.email,
      password: form.password,
      username: form.email.split('@')[0],
      nickname: form.nickname,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setUserId(data.user?.id);
    setStep(1);
  };

  const handleStep1 = () => setStep(2);
  const handleStep2 = () => setStep(3);

  const handleStep3 = async () => {
    setLoading(true);
    if (userId) {
      await updateProfile(userId, { bio: form.bio, avatar_url: form.avatarUrl });
      if (form.genres.length > 0) {
        await supabase.from('user_genres').insert(form.genres.map(g => ({ user_id: userId, genre: g })));
      }
      if (form.moods.length > 0) {
        await supabase.from('user_moods').insert(form.moods.map(m => ({ user_id: userId, mood: m })));
      }
    }
    setLoading(false);
    setStep(4);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg,#080B14 0%,#0D1424 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        {/* 로고 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg,#00E5CC,#7C4DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MusicNoteIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(135deg,#00E5CC,#7C4DFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            sharemood
          </Typography>
        </Box>

        {/* 스텝 인디케이터 */}
        {step < 4 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              {STEPS.map((s, i) => (
                <Typography
                  key={s}
                  variant="caption"
                  sx={{ color: i === step ? '#00E5CC' : i < step ? 'rgba(0,229,204,0.5)' : 'rgba(255,255,255,0.25)', fontWeight: i === step ? 700 : 400, fontSize: '0.7rem' }}
                >
                  {s}
                </Typography>
              ))}
            </Box>
            <LinearProgress
              variant="determinate"
              value={(step / 4) * 100}
              sx={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg,#00E5CC,#7C4DFF)', borderRadius: 2 } }}
            />
          </Box>
        )}

        {/* 카드 */}
        <Box sx={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          {/* STEP 0: 기본 정보 */}
          {step === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="h4" fontWeight={700}>기본 정보 입력</Typography>
              <TextField label="이메일" type="email" value={form.email} onChange={handleChange('email')} fullWidth required />
              <TextField
                label="비밀번호 (8자 이상)"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                fullWidth required
                error={form.password.length > 0 && !pwValid}
                helperText={form.password.length > 0 && !pwValid ? '8자 이상 입력해주세요' : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPw(!showPw)} sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        {showPw ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="비밀번호 확인"
                type="password"
                value={form.passwordConfirm}
                onChange={handleChange('passwordConfirm')}
                fullWidth required
                disabled={!pwValid}
                error={form.passwordConfirm.length > 0 && !pwMatch}
                helperText={form.passwordConfirm.length > 0 && !pwMatch ? '비밀번호가 일치하지 않습니다' : ''}
              />
              <TextField label="닉네임" value={form.nickname} onChange={handleChange('nickname')} fullWidth required />
              <Button variant="contained" fullWidth size="large" onClick={handleStep0} disabled={loading || !form.email || !pwValid || !pwMatch || !form.nickname} sx={{ py: 1.5 }}>
                {loading ? '처리 중...' : '다음'}
              </Button>
            </Box>
          )}

          {/* STEP 1: 프로필 설정 */}
          {step === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, alignItems: 'center' }}>
              <Typography variant="h4" fontWeight={700} alignSelf="flex-start">프로필 설정</Typography>
              <Avatar src={form.avatarUrl} sx={{ width: 100, height: 100, border: '3px solid rgba(0,229,204,0.4)', fontSize: '2.5rem' }}>
                {form.nickname?.[0]?.toUpperCase()}
              </Avatar>
              <Button variant="outlined" startIcon={<CloudUploadIcon />} size="small">
                프로필 이미지 업로드
              </Button>
              <TextField label="한 줄 소개" value={form.bio} onChange={handleChange('bio')} fullWidth multiline rows={2} placeholder="나를 음악으로 소개해보세요..." />
              <Button variant="contained" fullWidth size="large" onClick={handleStep1} sx={{ py: 1.5 }}>다음</Button>
              <Button variant="text" fullWidth onClick={handleStep1}>건너뛰기</Button>
            </Box>
          )}

          {/* STEP 2: 선호 장르 */}
          {step === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography variant="h4" fontWeight={700}>선호 장르 선택</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>여러 개 선택할 수 있어요</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {GENRES.map((g) => (
                  <Chip
                    key={g} label={g}
                    onClick={() => toggleItem('genres', g)}
                    variant={form.genres.includes(g) ? 'filled' : 'outlined'}
                    color={form.genres.includes(g) ? 'primary' : 'default'}
                    sx={{ cursor: 'pointer', fontWeight: form.genres.includes(g) ? 700 : 400 }}
                  />
                ))}
              </Box>
              <Button variant="contained" fullWidth size="large" onClick={handleStep2} sx={{ py: 1.5 }}>다음</Button>
              <Button variant="text" fullWidth onClick={handleStep2}>건너뛰기</Button>
            </Box>
          )}

          {/* STEP 3: 선호 무드 */}
          {step === 3 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography variant="h4" fontWeight={700}>좋아하는 무드</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>어떤 분위기의 음악을 좋아하세요?</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {MOODS.map((m) => (
                  <Chip
                    key={m} label={m}
                    onClick={() => toggleItem('moods', m)}
                    variant={form.moods.includes(m) ? 'filled' : 'outlined'}
                    color={form.moods.includes(m) ? 'primary' : 'default'}
                    sx={{ cursor: 'pointer', fontWeight: form.moods.includes(m) ? 700 : 400 }}
                  />
                ))}
              </Box>
              <Button variant="contained" fullWidth size="large" onClick={handleStep3} disabled={loading} sx={{ py: 1.5 }}>
                {loading ? '저장 중...' : '완료'}
              </Button>
            </Box>
          )}

          {/* STEP 4: 완료 */}
          {step === 4 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', textAlign: 'center', py: 2 }}>
              <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#00E5CC,#7C4DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleIcon sx={{ color: 'white', fontSize: '2.5rem' }} />
              </Box>
              <Typography variant="h3" fontWeight={700}>환영합니다! 🎵</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                이제 당신만의 음악 이야기를<br />시작해보세요.
              </Typography>
              <Button variant="contained" fullWidth size="large" onClick={() => navigate('/')} sx={{ py: 1.5 }}>
                홈으로 이동
              </Button>
            </Box>
          )}
        </Box>

        {step === 0 && (
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
            이미 계정이 있으신가요?{' '}
            <Typography component="span" onClick={() => navigate('/login')} sx={{ color: '#00E5CC', cursor: 'pointer', fontWeight: 600 }}>
              로그인
            </Typography>
          </Typography>
        )}
      </Box>
    </Box>
  );
}
