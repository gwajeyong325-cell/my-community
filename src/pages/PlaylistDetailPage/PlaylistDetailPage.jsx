import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Avatar, Chip,
  Divider, TextField, IconButton, List, ListItem,
  ListItemAvatar, ListItemText, CircularProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const MOCK_SONGS = [
  { id: 1, title: 'After Hours', artist: 'The Weeknd', album: 'After Hours', duration_sec: 361, cover_url: 'https://picsum.photos/seed/s1/60/60' },
  { id: 2, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration_sec: 200, cover_url: 'https://picsum.photos/seed/s2/60/60' },
  { id: 3, title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', duration_sec: 215, cover_url: 'https://picsum.photos/seed/s3/60/60' },
  { id: 4, title: 'Heartless', artist: 'The Weeknd', album: 'After Hours', duration_sec: 176, cover_url: 'https://picsum.photos/seed/s4/60/60' },
];

const MOCK_COMMENTS = [
  { id: 1, user: { nickname: '감성충전소', avatar_url: 'https://picsum.photos/seed/u2/60/60' }, content: '이 플리 진짜 최고에요... 새벽에 들으면 눈물남', likes_count: 12, created_at: '2026-06-08' },
  { id: 2, user: { nickname: 'roadtrip_m', avatar_url: 'https://picsum.photos/seed/u3/60/60' }, content: '드라이브할 때 틀었더니 완전 내 스타일', likes_count: 7, created_at: '2026-06-07' },
];

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState(MOCK_SONGS);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaylist() {
      const { data } = await supabase
        .from('playlists')
        .select('*, profiles(nickname, avatar_url, username), playlist_songs(*)')
        .eq('id', id)
        .single();
      if (data) {
        setPlaylist(data);
        if (data.playlist_songs?.length > 0) setSongs(data.playlist_songs);
      } else {
        setPlaylist({
          id, title: '힐링 어쿠스틱', description: '지치고 힘든 날, 잠깐 쉬어가는 시간을 위한 플레이리스트입니다.',
          cover_url: 'https://picsum.photos/seed/heal5/600/600', mood: '힐링', genre: '인디',
          hashtags: ['#힐링', '#어쿠스틱', '#감성'],
          likes_count: 312, saves_count: 94,
          profiles: { nickname: '소리전도사', avatar_url: 'https://picsum.photos/seed/u4/100/100', username: 'soundmission' },
        });
      }
      setLoading(false);
    }
    fetchPlaylist();
  }, [id]);

  const handleComment = async () => {
    if (!newComment.trim() || !user) return;
    const newC = { id: Date.now(), user: { nickname: '나', avatar_url: '' }, content: newComment, likes_count: 0, created_at: new Date().toISOString().split('T')[0] };
    setComments([newC, ...comments]);
    setNewComment('');
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: '120px' }}><CircularProgress sx={{ color: '#00E5CC' }} /></Box>;
  if (!playlist) return null;

  return (
    <Box sx={{ pt: '64px', minHeight: '100vh' }}>
      {/* 히어로 헤더 */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
          mb: 0,
        }}
      >
        <Box component="img" src={playlist.cover_url} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(4px) brightness(0.4)' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #080B14 40%, transparent 100%)' }} />

        <Box sx={{ position: 'relative', p: { xs: 3, md: 6 }, pb: 0, display: 'flex', gap: 4, alignItems: 'flex-end', width: '100%', flexWrap: 'wrap' }}>
          <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', top: 16, left: 16, color: 'white', background: 'rgba(0,0,0,0.4)' }}>
            <ArrowBackIcon />
          </IconButton>

          <Box component="img" src={playlist.cover_url} alt="" sx={{ width: { xs: 140, md: 200 }, height: { xs: 140, md: 200 }, objectFit: 'cover', borderRadius: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', flexShrink: 0 }} />
          <Box sx={{ pb: 3 }}>
            {playlist.mood && <Chip label={playlist.mood} size="small" color="primary" sx={{ mb: 1.5 }} />}
            <Typography variant="h2" fontWeight={800} sx={{ mb: 1 }}>{playlist.title}</Typography>
            {playlist.description && <Typography color="text.secondary" sx={{ mb: 2, maxWidth: 500 }}>{playlist.description}</Typography>}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Avatar src={playlist.profiles?.avatar_url} sx={{ width: 28, height: 28 }} />
              <Typography variant="body2" sx={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#00E5CC' } }} onClick={() => navigate(`/profile/${playlist.profiles?.username}`)}>
                {playlist.profiles?.nickname}
              </Typography>
              <Typography variant="caption" color="text.secondary">·</Typography>
              <Typography variant="caption" color="text.secondary">{songs.length}곡</Typography>
            </Box>
            {playlist.hashtags?.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 2 }}>
                {playlist.hashtags.map((tag) => (
                  <Typography key={tag} variant="caption" sx={{ color: '#00E5CC', cursor: 'pointer' }}>{tag}</Typography>
                ))}
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button variant={liked ? 'contained' : 'outlined'} startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />} onClick={() => setLiked(!liked)} size="small">
                {(playlist.likes_count || 0) + (liked ? 1 : 0)}
              </Button>
              <Button variant={saved ? 'contained' : 'outlined'} startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />} onClick={() => setSaved(!saved)} size="small">
                {(playlist.saves_count || 0) + (saved ? 1 : 0)}
              </Button>
              <Button variant="outlined" startIcon={<ShareIcon />} size="small">공유</Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 3, md: 6 }, maxWidth: 1000, mx: 'auto', mt: 4 }}>
        {/* 수록곡 리스트 */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>수록곡</Typography>
          <Box sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            {songs.map((song, idx) => (
              <Box
                key={song.id}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 2, p: 2,
                  borderBottom: idx < songs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  '&:hover': { background: 'rgba(0,229,204,0.04)' },
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ width: 20, textAlign: 'center', flexShrink: 0 }}>
                  {idx + 1}
                </Typography>
                {song.cover_url ? (
                  <Box component="img" src={song.cover_url} alt="" sx={{ width: 44, height: 44, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <Box sx={{ width: 44, height: 44, borderRadius: 1.5, background: 'rgba(0,229,204,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MusicNoteIcon sx={{ color: '#00E5CC', fontSize: '1.2rem' }} />
                  </Box>
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{song.artist}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.3, flexShrink: 0 }}>
                  <AccessTimeIcon sx={{ fontSize: '0.8rem' }} />
                  {formatDuration(song.duration_sec)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 댓글 */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>댓글 {comments.length}</Typography>

          {user ? (
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Avatar sx={{ width: 36, height: 36, flexShrink: 0 }} />
              <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="댓글을 남겨보세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleComment()}
                  multiline maxRows={3} fullWidth size="small"
                />
                <IconButton onClick={handleComment} sx={{ color: newComment ? '#00E5CC' : 'rgba(255,255,255,0.3)', alignSelf: 'flex-end' }}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mb: 3, p: 2.5, background: 'rgba(0,229,204,0.06)', border: '1px solid rgba(0,229,204,0.2)', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                댓글을 남기려면{' '}
                <Typography component="span" sx={{ color: '#00E5CC', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>로그인</Typography>
                {' '}해주세요.
              </Typography>
            </Box>
          )}

          <List disablePadding>
            {comments.map((comment) => (
              <ListItem key={comment.id} alignItems="flex-start" disablePadding sx={{ mb: 2 }}>
                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Avatar src={comment.user.avatar_url} sx={{ width: 36, height: 36 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={700}>{comment.user.nickname}</Typography>
                      <Typography variant="caption" color="text.secondary">{comment.created_at}</Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>{comment.content}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small" sx={{ p: 0.3, color: 'rgba(255,255,255,0.3)' }}>
                          <FavoriteBorderIcon sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                        <Typography variant="caption" color="text.secondary">{comment.likes_count}</Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
}
