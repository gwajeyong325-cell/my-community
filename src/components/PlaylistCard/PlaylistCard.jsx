import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, IconButton, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

function PlaylistCard({ playlist, compact = false }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!playlist) return null;

  return (
    <Box
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      sx={{
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          border: '1px solid rgba(0,229,204,0.2)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 20px rgba(0,229,204,0.05)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* 커버 이미지 */}
      <Box sx={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
        {playlist.cover_url ? (
          <Box
            component="img"
            src={playlist.cover_url}
            alt={playlist.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(0,229,204,0.2), rgba(124,77,255,0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MusicNoteIcon sx={{ fontSize: '3rem', color: 'rgba(0,229,204,0.5)' }} />
          </Box>
        )}

        {/* 무드 태그 */}
        {playlist.mood && (
          <Chip
            label={playlist.mood}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              color: '#00E5CC',
              border: '1px solid rgba(0,229,204,0.3)',
              fontSize: '0.7rem',
            }}
          />
        )}
      </Box>

      {/* 카드 내용 */}
      <Box sx={{ p: compact ? 1.5 : 2 }}>
        <Typography
          variant={compact ? 'body2' : 'body1'}
          sx={{ fontWeight: 600, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {playlist.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Avatar sx={{ width: 20, height: 20, border: 'none' }} />
          <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {playlist.profiles?.nickname || '익명'}
          </Typography>
        </Box>

        {/* 좋아요/저장 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={(e) => e.stopPropagation()}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              sx={{ p: 0.3, color: liked ? '#FF5252' : 'rgba(255,255,255,0.4)' }}
            >
              {liked ? <FavoriteIcon sx={{ fontSize: '1rem' }} /> : <FavoriteBorderIcon sx={{ fontSize: '1rem' }} />}
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {(playlist.likes_count || 0) + (liked ? 1 : 0)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
              sx={{ p: 0.3, color: saved ? '#00E5CC' : 'rgba(255,255,255,0.4)' }}
            >
              {saved ? <BookmarkIcon sx={{ fontSize: '1rem' }} /> : <BookmarkBorderIcon sx={{ fontSize: '1rem' }} />}
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {(playlist.saves_count || 0) + (saved ? 1 : 0)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PlaylistCard;
