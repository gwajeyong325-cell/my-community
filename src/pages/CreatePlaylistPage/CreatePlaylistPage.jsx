import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Chip,
  CircularProgress, IconButton, Alert,
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const MOODS  = ['Chill', '감성', '집중', '새벽', '여행', '드라이브', '우울', '행복', '파티', '힐링'];
const GENRES = ['K-POP', 'POP', 'J-POP', '힙합', 'R&B', '재즈', '락', '클래식', 'EDM', '인디'];

export default function CreatePlaylistPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverLoading, setCoverLoading] = useState(false);
  const [mood, setMood] = useState('');
  const [genre, setGenre] = useState('');
  const [hashInput, setHashInput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const getRandomCover = async () => {
    setCoverLoading(true);
    const seed = Math.random().toString(36).slice(2, 8);
    setCoverUrl(`https://picsum.photos/seed/${seed}/600/600`);
    setCoverLoading(false);
  };

  const addHashtag = () => {
    const tag = hashInput.trim().replace(/^#/, '');
    if (!tag || hashtags.includes(`#${tag}`)) return;
    setHashtags([...hashtags, `#${tag}`]);
    setHashInput('');
  };

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    if (!title.trim()) { setError('제목을 입력해주세요.'); return; }
    setSaving(true);
    setError('');
    const { error: err } = await supabase.from('playlists').insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      cover_url: coverUrl,
      mood,
      genre,
      hashtags,
    });
    setSaving(false);
    if (err) {
      setError('저장 중 오류가 발생했습니다.');
    } else {
      navigate('/profile');
    }
  };

  return (
    <Box sx={{ pt: '80px', minHeight: '100vh', px: { xs: 3, md: 6 }, pb: 8 }}>
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'white', background: 'rgba(255,255,255,0.06)' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h3" fontWeight={700}>플레이리스트 등록</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* 커버 이미지 */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box
              sx={{
                width: 180, height: 180, borderRadius: 3,
                background: coverUrl ? 'none' : 'linear-gradient(135deg, rgba(0,229,204,0.15), rgba(124,77,255,0.15))',
                border: '2px dashed rgba(0,229,204,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0, position: 'relative',
              }}
            >
              {coverLoading ? (
                <CircularProgress size={32} sx={{ color: '#00E5CC' }} />
              ) : coverUrl ? (
                <Box component="img" src={coverUrl} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', px: 2 }}>커버 이미지</Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<AutorenewIcon />} onClick={getRandomCover}>
                랜덤 이미지 생성
              </Button>
              <Typography variant="caption" color="text.secondary">버튼을 클릭하면 랜덤한 커버 이미지가 추가됩니다.</Typography>
            </Box>
          </Box>

          {/* 제목/설명 */}
          <TextField label="플레이리스트 제목 *" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth placeholder="어떤 플레이리스트인가요?" />
          <TextField label="설명" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} placeholder="이 플레이리스트에 대해 소개해주세요..." />

          {/* 무드 선택 */}
          <Box>
            <Typography variant="body1" fontWeight={600} sx={{ mb: 1.5 }}>무드 선택</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {MOODS.map((m) => (
                <Chip
                  key={m} label={m}
                  onClick={() => setMood(mood === m ? '' : m)}
                  variant={mood === m ? 'filled' : 'outlined'}
                  color={mood === m ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          {/* 장르 선택 */}
          <Box>
            <Typography variant="body1" fontWeight={600} sx={{ mb: 1.5 }}>장르 선택</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {GENRES.map((g) => (
                <Chip
                  key={g} label={g}
                  onClick={() => setGenre(genre === g ? '' : g)}
                  variant={genre === g ? 'filled' : 'outlined'}
                  color={genre === g ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          {/* 해시태그 */}
          <Box>
            <Typography variant="body1" fontWeight={600} sx={{ mb: 1.5 }}>해시태그</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
              <TextField
                placeholder="#태그 추가"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addHashtag()}
                size="small"
                sx={{ flex: 1 }}
              />
              <IconButton onClick={addHashtag} sx={{ color: '#00E5CC', background: 'rgba(0,229,204,0.1)' }}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {hashtags.map((tag) => (
                <Chip
                  key={tag} label={tag}
                  onDelete={() => setHashtags(hashtags.filter((t) => t !== tag))}
                  deleteIcon={<CloseIcon />}
                  color="primary"
                  size="small"
                />
              ))}
            </Box>
          </Box>

          <Button
            variant="contained" fullWidth size="large"
            onClick={handleSave} disabled={saving || !title.trim()}
            sx={{ py: 1.8, fontSize: '1rem', mt: 1 }}
          >
            {saving ? '저장 중...' : '플레이리스트 등록'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
