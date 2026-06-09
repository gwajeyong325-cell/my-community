import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, Button, Chip } from '@mui/material';

function UserCard({ profile }) {
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);

  if (!profile) return null;

  return (
    <Box
      sx={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        transition: 'all 0.3s ease',
        '&:hover': {
          border: '1px solid rgba(0,229,204,0.2)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Avatar
        src={profile.avatar_url}
        onClick={() => navigate(`/profile/${profile.id}`)}
        sx={{ width: 64, height: 64, cursor: 'pointer', border: '2px solid rgba(0,229,204,0.4)' }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" fontWeight={600}>
          {profile.nickname}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          @{profile.username}
        </Typography>
      </Box>
      {profile.bio && (
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.4 }}>
          {profile.bio}
        </Typography>
      )}
      {profile.user_genres?.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
          {profile.user_genres.slice(0, 2).map((g) => (
            <Chip key={g.id} label={g.genre} size="small" color="primary" />
          ))}
        </Box>
      )}
      <Button
        variant={following ? 'outlined' : 'contained'}
        size="small"
        fullWidth
        onClick={() => setFollowing(!following)}
        sx={{ mt: 0.5 }}
      >
        {following ? '팔로잉' : '팔로우'}
      </Button>
    </Box>
  );
}

export default UserCard;
