import { useState, useEffect } from 'react';
import { Box, Typography, Chip, Grid, TextField, InputAdornment, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { supabase } from '../../lib/supabase';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';

const MOODS  = ['전체', '새벽 감성', '비 오는 날', '드라이브', '카페', '공부', '이별', '봄', '집중', '파티', '힐링'];
const GENRES = ['전체', 'K-POP', 'POP', 'J-POP', '힙합', 'R&B', '재즈', '락', '클래식', 'EDM', '인디'];

const MOCK = [
  { id: 1, title: '새벽 재즈', cover_url: 'https://picsum.photos/seed/e1/400/400', mood: '새벽 감성', genre: '재즈', likes_count: 142, saves_count: 38, profiles: { nickname: '야행성재즈' } },
  { id: 2, title: '비 오는 날 감성', cover_url: 'https://picsum.photos/seed/e2/400/400', mood: '비 오는 날', genre: 'K-POP', likes_count: 89, saves_count: 22, profiles: { nickname: '감성충전소' } },
  { id: 3, title: '카페 집중 BGM', cover_url: 'https://picsum.photos/seed/e3/400/400', mood: '카페', genre: '인디', likes_count: 203, saves_count: 67, profiles: { nickname: '커피홀릭' } },
  { id: 4, title: '드라이브 팝 믹스', cover_url: 'https://picsum.photos/seed/e4/400/400', mood: '드라이브', genre: 'POP', likes_count: 175, saves_count: 51, profiles: { nickname: 'roadtrip_m' } },
  { id: 5, title: '힐링 어쿠스틱', cover_url: 'https://picsum.photos/seed/e5/400/400', mood: '힐링', genre: '인디', likes_count: 312, saves_count: 94, profiles: { nickname: '소리전도사' } },
  { id: 6, title: '공부 집중 브금', cover_url: 'https://picsum.photos/seed/e6/400/400', mood: '공부', genre: '클래식', likes_count: 261, saves_count: 88, profiles: { nickname: 'studymode' } },
  { id: 7, title: 'K-POP 파티 믹스', cover_url: 'https://picsum.photos/seed/e7/400/400', mood: '파티', genre: 'K-POP', likes_count: 199, saves_count: 71, profiles: { nickname: 'kpopisgod' } },
  { id: 8, title: '새벽 감성 인디', cover_url: 'https://picsum.photos/seed/e8/400/400', mood: '새벽 감성', genre: '인디', likes_count: 155, saves_count: 43, profiles: { nickname: '인디감성' } },
];

export default function ExplorePage() {
  const [selectedMood, setSelectedMood] = useState('전체');
  const [selectedGenre, setSelectedGenre] = useState('전체');
  const [search, setSearch] = useState('');
  const [playlists, setPlaylists] = useState(MOCK);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPlaylists() {
      setLoading(true);
      let query = supabase.from('playlists').select('*, profiles(nickname, avatar_url)').eq('is_public', true).order('likes_count', { ascending: false }).limit(24);
      if (selectedMood !== '전체') query = query.eq('mood', selectedMood);
      if (selectedGenre !== '전체') query = query.eq('genre', selectedGenre);
      if (search) query = query.ilike('title', `%${search}%`);
      const { data } = await query;
      if (data && data.length > 0) setPlaylists(data);
      setLoading(false);
    }
    fetchPlaylists();
  }, [selectedMood, selectedGenre, search]);

  const filtered = MOCK.filter(p => {
    const matchMood = selectedMood === '전체' || p.mood === selectedMood;
    const matchGenre = selectedGenre === '전체' || p.genre === selectedGenre;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchMood && matchGenre && matchSearch;
  });

  return (
    <Box sx={{ pt: '80px', minHeight: '100vh', px: { xs: 3, md: 6 }, pb: 8 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Typography variant="h2" fontWeight={800} sx={{ mb: 1 }}>탐색하기</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>무드와 장르로 내 취향의 플레이리스트를 찾아보세요.</Typography>

        {/* 검색 */}
        <TextField
          placeholder="플레이리스트, 아티스트, 무드 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 4, maxWidth: 600 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment>,
          }}
        />

        {/* 무드 필터 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>무드</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {MOODS.map((m) => (
              <Chip
                key={m} label={m}
                onClick={() => setSelectedMood(m)}
                variant={selectedMood === m ? 'filled' : 'outlined'}
                color={selectedMood === m ? 'primary' : 'default'}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>

        {/* 장르 필터 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>장르</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {GENRES.map((g) => (
              <Chip
                key={g} label={g}
                onClick={() => setSelectedGenre(g)}
                variant={selectedGenre === g ? 'filled' : 'outlined'}
                color={selectedGenre === g ? 'primary' : 'default'}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#00E5CC' }} /></Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {filtered.length}개의 플레이리스트
            </Typography>
            <Grid container spacing={2.5}>
              {filtered.map((pl) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={pl.id}>
                  <PlaylistCard playlist={pl} />
                </Grid>
              ))}
              {filtered.length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography color="text.secondary">검색 결과가 없습니다.</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
}
