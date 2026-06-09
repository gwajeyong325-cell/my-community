import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Checkbox, FormControlLabel,
  Divider, IconButton, InputAdornment, Alert,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { mockLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    mockLogin(email);
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg,#080B14 0%,#0D1424 100%)' }}>
      {/* 좌측 브랜드 */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: 8,
          background: 'linear-gradient(135deg, rgba(0,229,204,0.08) 0%, rgba(124,77,255,0.08) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 원 */}
        <Box sx={{ position: 'absolute', top: '20%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,204,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,77,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '14px', background: 'linear-gradient(135deg,#00E5CC,#7C4DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MusicNoteIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.8rem', background: 'linear-gradient(135deg,#00E5CC,#7C4DFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            sharemood
          </Typography>
        </Box>

        <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, lineHeight: 1.3 }}>
          음악으로<br />연결되는 사람들
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420, lineHeight: 1.8 }}>
          당신의 플레이리스트는 어떤 이야기를 담고 있나요?<br />
          음악 취향을 공유하고, 나와 비슷한 사람을 발견하세요.
        </Typography>
      </Box>

      {/* 우측 로그인 폼 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: { xs: 3, md: 6 } }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>다시 만나서 반가워요</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            계정이 없으신가요?{' '}
            <Typography component="span" onClick={() => navigate('/register')} sx={{ color: '#00E5CC', cursor: 'pointer', fontWeight: 600 }}>
              회원가입
            </Typography>
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoComplete="email"
            />
            <TextField
              label="비밀번호"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              disabled={!email}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw(!showPw)} edge="end" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      {showPw ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#00E5CC' } }} />}
                label={<Typography variant="body2" color="text.secondary">로그인 상태 유지</Typography>}
              />
              <Typography variant="body2" sx={{ color: '#00E5CC', cursor: 'pointer' }}>비밀번호 찾기</Typography>
            </Box>

            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 1, py: 1.5 }}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">또는</Typography>
          </Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[
              { label: 'Google로 계속하기', icon: <GoogleIcon />, bg: 'rgba(255,255,255,0.05)' },
              { label: 'Apple로 계속하기', icon: <AppleIcon />, bg: 'rgba(255,255,255,0.05)' },
            ].map((social) => (
              <Button
                key={social.label}
                variant="outlined"
                fullWidth
                startIcon={social.icon}
                sx={{ py: 1.2, borderColor: 'rgba(255,255,255,0.12)', color: 'white', background: social.bg, '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
              >
                {social.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
