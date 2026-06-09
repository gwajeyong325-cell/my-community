import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, Avatar,
  CircularProgress, Grid,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import UserCard from '../../components/UserCard/UserCard';

const MOODS = ['새벽 감성', '비 오는 날', '드라이브', '카페', '공부', '이별', '봄', '집중', '파티', '힐링'];

const MOCK_PLAYLISTS = [
  { id: 1, title: '새벽에 듣는 재즈', cover_url: 'https://picsum.photos/seed/jazz1/400/400', mood: '새벽 감성', likes_count: 142, saves_count: 38, profiles: { nickname: '야행성재즈' } },
  { id: 2, title: '비 오는 날 playlist', cover_url: 'https://picsum.photos/seed/rain2/400/400', mood: '비 오는 날', likes_count: 89, saves_count: 22, profiles: { nickname: '감성충전소' } },
  { id: 3, title: '카페에서 집중할 때', cover_url: 'https://picsum.photos/seed/cafe3/400/400', mood: '카페', likes_count: 203, saves_count: 67, profiles: { nickname: '커피홀릭' } },
  { id: 4, title: '드라이브 팝 믹스', cover_url: 'https://picsum.photos/seed/drive4/400/400', mood: '드라이브', likes_count: 175, saves_count: 51, profiles: { nickname: 'roadtrip_m' } },
  { id: 5, title: '힐링 어쿠스틱', cover_url: 'https://picsum.photos/seed/heal5/400/400', mood: '힐링', likes_count: 312, saves_count: 94, profiles: { nickname: '소리전도사' } },
  { id: 6, title: '새벽 공부 브금', cover_url: 'https://picsum.photos/seed/study6/400/400', mood: '공부', likes_count: 261, saves_count: 88, profiles: { nickname: 'studymode' } },
];

const MOCK_CREATORS = [
  { id: 'u1', nickname: '야행성재즈', username: 'jazznight', avatar_url: 'https://picsum.photos/seed/u1/100/100', bio: '새벽 감성 플레이리스트 전문', user_genres: [{ id: 1, genre: '재즈' }, { id: 2, genre: 'R&B' }] },
  { id: 'u2', nickname: '감성충전소', username: 'feelstation', avatar_url: 'https://picsum.photos/seed/u2/100/100', bio: '음악으로 하루를 채워요', user_genres: [{ id: 3, genre: 'K-POP' }, { id: 4, genre: '인디' }] },
  { id: 'u3', nickname: 'roadtrip_m', username: 'roadtrip', avatar_url: 'https://picsum.photos/seed/u3/100/100', bio: '드라이브 플레이리스트 큐레이터', user_genres: [{ id: 5, genre: 'POP' }, { id: 6, genre: '힙합' }] },
  { id: 'u4', nickname: '소리전도사', username: 'soundmission', avatar_url: 'https://picsum.photos/seed/u4/100/100', bio: '모든 장르를 사랑합니다', user_genres: [{ id: 7, genre: '클래식' }, { id: 8, genre: '인디' }] },
];

const FEATURED = MOCK_PLAYLISTS[4];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState(MOCK_PLAYLISTS);
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPlaylists() {
      setLoading(true);
      const query = supabase
        .from('playlists')
        .select('*, profiles(nickname, avatar_url)')
        .eq('is_public', true)
        .order('likes_count', { ascending: false })
        .limit(12);
      if (selectedMood) query.eq('mood', selectedMood);
      const { data } = await query;
      if (data && data.length > 0) setPlaylists(data);
      setLoading(false);
    }
    fetchPlaylists();
  }, [selectedMood]);

  return (
    <Box sx={{ pt: '64px', minHeight: '100vh' }}>

      {/* 히어로 섹션: 오늘의 추천 */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
          mb: 8,
        }}
      >
        <Box
          component="img"
          src={FEATURED.cover_url}
          alt=""
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px) brightness(0.5)' }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #080B14 30%, transparent 100%)' }} />

        <Box sx={{ position: 'relative', p: { xs: 4, md: 8 }, pb: { xs: 6, md: 8 }, maxWidth: 700 }}>
          <Chip label="오늘의 추천" size="small" sx={{ mb: 2, background: 'rgba(0,229,204,0.2)', color: '#00E5CC', border: '1px solid rgba(0,229,204,0.4)', fontWeight: 700 }} />
          <Typography variant="h1" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: '2rem', md: '3rem' } }}>
            {FEATURED.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar src={FEATURED.profiles?.avatar_url} sx={{ width: 32, height: 32 }} />
            <Typography color="text.secondary">{FEATURED.profiles?.nickname}</Typography>
            <Chip label={FEATURED.mood} size="small" color="primary" />
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={() => navigate(`/playlist/${FEATURED.id}`)}>
              지금 듣기
            </Button>
            <Button variant="outlined" startIcon={<BookmarkIcon />}>저장</Button>
            <Button variant="outlined" startIcon={<FavoriteIcon />} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              좋아요 {FEATURED.likes_count}
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 3, md: 6 }, maxWidth: 1400, mx: 'auto' }}>

        {/* 무드 탐색 */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h3" fontWeight={700}>무드로 탐색하기</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
            <Chip
              label="전체"
              onClick={() => setSelectedMood(null)}
              variant={selectedMood === null ? 'filled' : 'outlined'}
              color={selectedMood === null ? 'primary' : 'default'}
              sx={{ flexShrink: 0, cursor: 'pointer', fontWeight: 600 }}
            />
            {MOODS.map((mood) => (
              <Chip
                key={mood} label={mood}
                onClick={() => setSelectedMood(mood === selectedMood ? null : mood)}
                variant={selectedMood === mood ? 'filled' : 'outlined'}
                color={selectedMood === mood ? 'primary' : 'default'}
                sx={{ flexShrink: 0, cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>

        {/* 인기 플레이리스트 그리드 */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h3" fontWeight={700}>인기 플레이리스트</Typography>
            <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/explore')} sx={{ color: '#00E5CC' }}>
              전체보기
            </Button>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#00E5CC' }} />
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {playlists.map((pl) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={pl.id}>
                  <PlaylistCard playlist={pl} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* 추천 크리에이터 */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h3" fontWeight={700}>추천 크리에이터</Typography>
            <Typography variant="body2" color="text.secondary">음악 취향이 독특한 유저들</Typography>
          </Box>
          <Grid container spacing={2.5}>
            {MOCK_CREATORS.map((creator) => (
              <Grid item xs={6} sm={4} md={3} key={creator.id}>
                <UserCard profile={creator} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA 배너 */}
        {!user && (
          <Box
            sx={{
              mb: 8,
              background: 'linear-gradient(135deg, rgba(0,229,204,0.1), rgba(124,77,255,0.1))',
              border: '1px solid rgba(0,229,204,0.2)',
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" fontWeight={700} sx={{ mb: 1.5 }}>나와 음악 취향이 같은 사람을 찾아보세요</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>플레이리스트를 공유하고, 팔로우하고, 함께 음악을 즐겨요.</Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" size="large" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate('/register')}>
                무료로 시작하기
              </Button>
              <Button variant="outlined" size="large" onClick={() => navigate('/explore')}>
                둘러보기
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
