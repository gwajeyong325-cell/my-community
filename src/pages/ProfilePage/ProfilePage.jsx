import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, Button, Tab, Tabs,
  Grid, CircularProgress, Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';

const MOCK_PROFILE = {
  id: 'u1', nickname: '내 프로필', username: 'myprofile',
  bio: '음악을 통해 세상을 봐요 🎵', avatar_url: '',
  follower_count: 142, following_count: 38,
  user_genres: [{ id: 1, genre: 'K-POP' }, { id: 2, genre: '인디' }],
  user_moods: [{ id: 1, mood: '새벽 감성' }, { id: 2, mood: '드라이브' }],
};

const MOCK_PLAYLISTS = [
  { id: 1, title: '내 플레이리스트 1', cover_url: 'https://picsum.photos/seed/my1/400/400', mood: '새벽 감성', likes_count: 42, saves_count: 11, profiles: { nickname: '내 프로필' } },
  { id: 2, title: '드라이브 믹스', cover_url: 'https://picsum.photos/seed/my2/400/400', mood: '드라이브', likes_count: 88, saves_count: 25, profiles: { nickname: '내 프로필' } },
];

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(MOCK_PLAYLISTS);
  const [loading, setLoading] = useState(true);
  const [isMe, setIsMe] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      if (user && !username) {
        const { data } = await supabase.from('profiles').select('*, user_genres(*), user_moods(*)').eq('id', user.id).single();
        setProfile(data || { ...MOCK_PROFILE, nickname: user.email?.split('@')[0] || '나' });
        setIsMe(true);
      } else if (username) {
        const { data } = await supabase.from('profiles').select('*, user_genres(*), user_moods(*)').eq('username', username).single();
        setProfile(data || MOCK_PROFILE);
        setIsMe(user && data?.id === user.id);
      } else {
        setProfile(MOCK_PROFILE);
        setIsMe(false);
      }

      const query = supabase.from('playlists').select('*, profiles(nickname)');
      if (user && !username) query.eq('user_id', user.id);
      const { data: pls } = await query;
      if (pls && pls.length > 0) setPlaylists(pls);
      setLoading(false);
    }
    fetchProfile();
  }, [user, username]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: '120px' }}><CircularProgress sx={{ color: '#00E5CC' }} /></Box>;
  if (!profile) return null;

  const tabs = ['플레이리스트', '저장한 목록', '좋아요한 목록', '활동 내역'];

  return (
    <Box sx={{ pt: '64px', minHeight: '100vh' }}>
      {/* 프로필 헤더 */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, rgba(0,229,204,0.08) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          px: { xs: 3, md: 6 }, py: 5,
        }}
      >
        <Box sx={{ maxWidth: 900, mx: 'auto', display: 'flex', gap: 4, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Avatar
            src={profile.avatar_url}
            sx={{ width: { xs: 80, md: 120 }, height: { xs: 80, md: 120 }, border: '3px solid rgba(0,229,204,0.4)', fontSize: '3rem' }}
          >
            {profile.nickname?.[0]?.toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
              <Typography variant="h3" fontWeight={700}>{profile.nickname}</Typography>
              <Typography variant="body2" color="text.secondary">@{profile.username}</Typography>
            </Box>

            {profile.bio && <Typography color="text.secondary" sx={{ mb: 2 }}>{profile.bio}</Typography>}

            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography fontWeight={700}>{profile.follower_count ?? 0}</Typography>
                <Typography variant="caption" color="text.secondary">팔로워</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography fontWeight={700}>{profile.following_count ?? 0}</Typography>
                <Typography variant="caption" color="text.secondary">팔로잉</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography fontWeight={700}>{playlists.length}</Typography>
                <Typography variant="caption" color="text.secondary">플레이리스트</Typography>
              </Box>
            </Box>

            {(profile.user_genres?.length > 0 || profile.user_moods?.length > 0) && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
                {profile.user_genres?.map((g) => <Chip key={g.id} label={g.genre} size="small" color="primary" />)}
                {profile.user_moods?.map((m) => <Chip key={m.id} label={m.mood} size="small" variant="outlined" sx={{ borderColor: 'rgba(0,229,204,0.3)', color: '#00E5CC' }} />)}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {isMe ? (
                <>
                  <Button variant="outlined" startIcon={<EditIcon />} size="small">프로필 편집</Button>
                  <Button variant="contained" startIcon={<AddCircleOutlineIcon />} size="small" onClick={() => navigate('/create')}>플레이리스트 추가</Button>
                </>
              ) : (
                <Button variant="contained" size="small">팔로우</Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 탭 */}
      <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)', px: { xs: 3, md: 6 } }}>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', textTransform: 'none', fontWeight: 500 },
              '& .Mui-selected': { color: '#00E5CC !important' },
              '& .MuiTabs-indicator': { background: '#00E5CC' },
            }}
          >
            {tabs.map((t) => <Tab key={t} label={t} />)}
          </Tabs>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 3, md: 6 }, py: 4 }}>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          {tab === 0 && (
            <Grid container spacing={2.5}>
              {playlists.map((pl) => (
                <Grid item xs={6} sm={4} md={3} key={pl.id}>
                  <PlaylistCard playlist={pl} />
                </Grid>
              ))}
              {playlists.length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>아직 플레이리스트가 없어요.</Typography>
                    {isMe && (
                      <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate('/create')}>
                        첫 번째 플레이리스트 만들기
                      </Button>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
          {tab !== 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">아직 내용이 없습니다.</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
