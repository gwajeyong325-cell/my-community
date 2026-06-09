import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, IconButton, Button,
  TextField, Divider, Collapse,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const MOCK_COMMENTS = {
  1: [
    { id: 101, user: { nickname: '감성충전소', avatar_url: 'https://picsum.photos/seed/u2/60/60' }, content: '저도 새벽엔 재즈죠... 완전 공감이에요 🎷', created_at: '2026-06-09T03:10:00' },
    { id: 102, user: { nickname: 'studymode', avatar_url: 'https://picsum.photos/seed/u5/60/60' }, content: '아티스트 이름 알려주세요!!', created_at: '2026-06-09T03:25:00' },
    { id: 103, user: { nickname: 'roadtrip_m', avatar_url: 'https://picsum.photos/seed/u3/60/60' }, content: '새벽 3시 재즈 + 아이스커피 조합 추천합니다 ☕', created_at: '2026-06-09T04:00:00' },
  ],
  2: [
    { id: 201, user: { nickname: '야행성재즈', avatar_url: 'https://picsum.photos/seed/u1/60/60' }, content: '저장했어요! 비 오는 날 들어볼게요 🌧️', created_at: '2026-06-08T18:30:00' },
    { id: 202, user: { nickname: 'roadtrip_m', avatar_url: 'https://picsum.photos/seed/u3/60/60' }, content: '한 달 공들인 거 느껴져요 ㅠㅠ 퀄리티 진짜', created_at: '2026-06-08T19:00:00' },
  ],
  3: [
    { id: 301, user: { nickname: '감성충전소', avatar_url: 'https://picsum.photos/seed/u2/60/60' }, content: '저도 음악 없으면 집중 0%예요 ㅋㅋㅋ', created_at: '2026-06-08T11:40:00' },
    { id: 302, user: { nickname: '야행성재즈', avatar_url: 'https://picsum.photos/seed/u1/60/60' }, content: '가사 없는 instrumental 추천해요! 방해 없이 집중됩니다', created_at: '2026-06-08T12:00:00' },
    { id: 303, user: { nickname: 'roadtrip_m', avatar_url: 'https://picsum.photos/seed/u3/60/60' }, content: '사람마다 다른 것 같아요. 저는 가사 있어도 괜찮더라고요', created_at: '2026-06-08T12:30:00' },
  ],
  4: [
    { id: 401, user: { nickname: 'studymode', avatar_url: 'https://picsum.photos/seed/u5/60/60' }, content: '동해 드라이브 저도 가고싶다... 플리 공유해주세요!', created_at: '2026-06-07T21:30:00' },
  ],
};

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
  const { user } = useAuth();

  const [liked, setLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState(MOCK_COMMENTS[post.id] || []);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    const text = newComment.trim();
    if (!text) return;
    const added = {
      id: Date.now(),
      user: {
        nickname: user?.nickname || user?.email?.split('@')[0] || '나',
        avatar_url: '',
      },
      content: text,
      created_at: new Date().toISOString(),
    };
    setComments([...comments, added]);
    setNewComment('');
  };

  return (
    <Box sx={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden', transition: 'border-color 0.2s', '&:hover': { borderColor: 'rgba(0,229,204,0.15)' } }}>
      <Box sx={{ p: 3 }}>
        {/* 작성자 */}
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

        {/* 본문 */}
        <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {post.content}
        </Typography>

        {/* 액션 버튼 */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={() => setLiked(!liked)} sx={{ color: liked ? '#FF5252' : 'rgba(255,255,255,0.4)' }}>
              {liked ? <FavoriteIcon sx={{ fontSize: '1.1rem' }} /> : <FavoriteBorderIcon sx={{ fontSize: '1.1rem' }} />}
            </IconButton>
            <Typography variant="caption" color="text.secondary">{post.likes_count + (liked ? 1 : 0)}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => setCommentsOpen(!commentsOpen)}
              sx={{ color: commentsOpen ? '#00E5CC' : 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
            >
              {commentsOpen
                ? <ChatBubbleIcon sx={{ fontSize: '1.1rem' }} />
                : <ChatBubbleOutlineIcon sx={{ fontSize: '1.1rem' }} />}
            </IconButton>
            <Typography variant="caption" sx={{ color: commentsOpen ? '#00E5CC' : 'text.secondary' }}>
              {comments.length}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />
          <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.4)' }}><BookmarkBorderIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
          <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.4)' }}><ShareIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
        </Box>
      </Box>

      {/* 댓글 섹션 */}
      <Collapse in={commentsOpen}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
        <Box sx={{ px: 3, pt: 2, pb: 3, background: 'rgba(0,0,0,0.15)' }}>

          {/* 댓글 목록 */}
          {comments.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2.5 }}>
              {comments.map((c) => (
                <Box key={c.id} sx={{ display: 'flex', gap: 1.5 }}>
                  <Avatar src={c.user.avatar_url} sx={{ width: 30, height: 30, flexShrink: 0, fontSize: '0.8rem' }}>
                    {c.user.nickname?.[0]}
                  </Avatar>
                  <Box sx={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, px: 2, py: 1.2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={700}>{c.user.nickname}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>{formatTime(c.created_at)}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
                      {c.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, textAlign: 'center', py: 1 }}>
              첫 번째 댓글을 남겨보세요 💬
            </Typography>
          )}

          {/* 댓글 입력 */}
          {user ? (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              <Avatar sx={{ width: 30, height: 30, flexShrink: 0, fontSize: '0.8rem', border: '1px solid rgba(0,229,204,0.4)' }}>
                {(user.nickname || user.email)?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, display: 'flex', gap: 1, alignItems: 'flex-end', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, px: 1.5, py: 0.5, '&:focus-within': { borderColor: 'rgba(0,229,204,0.4)' }, transition: 'border-color 0.2s' }}>
                <TextField
                  placeholder="댓글 달기..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                  multiline
                  maxRows={3}
                  fullWidth
                  variant="standard"
                  InputProps={{ disableUnderline: true, sx: { fontSize: '0.875rem', color: 'white', py: 0.5 } }}
                />
                <IconButton
                  size="small"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  sx={{ color: newComment.trim() ? '#00E5CC' : 'rgba(255,255,255,0.2)', transition: 'color 0.2s', mb: 0.3, flexShrink: 0 }}
                >
                  <SendIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, py: 1 }}>
              <Typography variant="caption" color="text.secondary">댓글을 남기려면</Typography>
              <Button size="small" variant="outlined" onClick={() => navigate('/login')} sx={{ py: 0.3, px: 1.5, fontSize: '0.75rem' }}>
                로그인
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
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
    const mockNew = {
      id: (!error && data) ? data.id : Date.now(),
      user: { nickname: user.nickname || user.email?.split('@')[0] || '나', avatar_url: '', username: 'me' },
      content: newPost,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
    };
    setPosts([mockNew, ...posts]);
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
              <Avatar sx={{ width: 44, height: 44, flexShrink: 0, border: '1px solid rgba(0,229,204,0.4)', fontSize: '1.1rem' }}>
                {(user.nickname || user.email)?.[0]?.toUpperCase()}
              </Avatar>
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
