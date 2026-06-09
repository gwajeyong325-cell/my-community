import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, IconButton, Button,
  TextField, InputAdornment, Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const MOCK_POSTS = [
  { id: 1, user: { nickname: '야행성재즈', avatar_url: 'https://picsum.photos/seed/u1/60/60', username: 'jazznight' }, content: '오늘 새벽에 발견한 재즈 앨범... 진짜 이 아티스트 왜 이제 알았지 🎷\n\n요즘 새벽 3시가 되면 재즈가 당기는 게 나만 그런 건 아니겠지?', likes_count: 47, comments_count: 12, created_at: '2026-06-09T02:30:00' },
  { id: 2, user: { nickname: '감성충전소', avatar_url: 'https://picsum.photos/seed/u2/60/60', username: 'feelstation' }, content: '비 오는 날 어울리는 플레이리스트 올렸어요 ☔\n링크 타고 들어오세요~ 완성하는 데 한 달 걸린 거라 퀄리티 보장합니다 ㅎㅎ', likes_count: 83, comments_count: 24, created_at: '2026-06-08T18:00:00' },
  { id: 3, user: { nickname: 'studymode', avatar_url: 'https://picsum.photos/seed/u5/60/60', username: 'studymode' }, content: '공부할 때 음악 틀면 집중 안 된다는 사람들도 있는데,, 저는 없으면 오히려 더 안 되던데요? 다들 어때요?', likes_count: 132, comments_count: 58, created_at: '2026-06-08T11:15:00' },
  { id: 4, user: { nickname: 'roadtrip_m', avatar_url: 'https://picsum.photos/seed/u3/60/60', username: 'roadtrip_m' }, content: '이번 주말 동해 드라이브 다녀왔는데 드라이브 플리 덕분에 진짜 영화 같았어요 🚗🌊\n추천해주신 분들 고마워요!!', likes_count: 96, comments_count: 31, created_at: '2026-06-07T21:00:00' },
];

function formatTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

function PostCard({ post }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  return (
    <Box sx={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, p: 3, transition: 'border-color 0.2s', '&:hover': { borderColor: 'rgba(0,229,204,0.15)' } }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Avatar src={post.user.avatar_url} sx={{ width: 44, height: 44, cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate(`/profile/${post.user.username}`)} />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" fontWeight={700} sx={{ cursor: 'pointer', '&:hover': { color: '#00E5CC' } }} onClick={() => navigate(`/profile/${post.user.username}`)}>
              {post.user.nickname}
            </Typography>
            <Typography variant="caption" color="text.secondary">{formatTime(post.created_at)}</Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">@{post.user.username}</Typography>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
        {post.content}
      </Typography>

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => setLiked(!liked)} sx={{ color: liked ? '#FF5252' : 'rgba(255,255,255,0.4)' }}>
            {liked ? <FavoriteIcon sx={{ fontSize: '1.1rem' }} /> : <FavoriteBorderIcon sx={{ fontSize: '1.1rem' }} />}
          </IconButton>
          <Typography variant="caption" color="text.secondary">{post.likes_count + (liked ? 1 : 0)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: '1.1rem' }} />
          </IconButton>
          <Typography variant="caption" color="text.secondary">{post.comments_count}</Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.4)' }}><BookmarkBorderIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.4)' }}><ShareIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
      </Box>
    </Box>
  );
}

export default function CommunityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!newPost.trim() || !user) return;
    setPosting(true);
    const { data, error } = await supabase.from('posts').insert({ user_id: user.id, content: newPost.trim() }).select().single();
    if (!error && data) {
      const mockNew = { id: data.id, user: { nickname: '나', avatar_url: '', username: 'me' }, content: newPost, likes_count: 0, comments_count: 0, created_at: new Date().toISOString() };
      setPosts([mockNew, ...posts]);
    } else {
      const mockNew = { id: Date.now(), user: { nickname: '나', avatar_url: '', username: 'me' }, content: newPost, likes_count: 0, comments_count: 0, created_at: new Date().toISOString() };
      setPosts([mockNew, ...posts]);
    }
    setNewPost('');
    setPosting(false);
  };

  return (
    <Box sx={{ pt: '80px', minHeight: '100vh', px: { xs: 3, md: 6 }, pb: 8 }}>
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h2" fontWeight={800} sx={{ mb: 1 }}>커뮤니티</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>음악에 대한 이야기를 자유롭게 나눠보세요.</Typography>

        {/* 글쓰기 */}
        {user ? (
          <Box sx={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ width: 44, height: 44, flexShrink: 0 }} />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  placeholder="지금 어떤 음악을 듣고 있나요?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  multiline rows={3} fullWidth
                  variant="standard"
                  InputProps={{ disableUnderline: true, sx: { fontSize: '1rem', color: 'white' } }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" onClick={handlePost} disabled={posting || !newPost.trim()} size="small">
                    {posting ? '게시 중...' : '게시하기'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ background: 'rgba(0,229,204,0.06)', border: '1px solid rgba(0,229,204,0.2)', borderRadius: 3, p: 3, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <EditIcon sx={{ color: '#00E5CC' }} />
              <Typography variant="body2">음악 이야기를 공유해보세요</Typography>
            </Box>
            <Button variant="contained" size="small" onClick={() => navigate('/login')}>로그인</Button>
          </Box>
        )}

        {/* 포스트 목록 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
