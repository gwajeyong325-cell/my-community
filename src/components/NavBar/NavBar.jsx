import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Typography, IconButton,
  InputBase, Avatar, Badge, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { label: '둘러보기', icon: <HomeIcon />, path: '/' },
  { label: '탐색', icon: <ExploreIcon />, path: '/explore' },
  { label: '커뮤니티', icon: <GroupIcon />, path: '/community' },
];

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  const hiddenPaths = ['/login', '/register'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

  return (
    <AppBar position="fixed" sx={{ zIndex: 1300 }}>
      <Toolbar sx={{ gap: 1, px: { xs: 2, md: 4 }, minHeight: '64px !important' }}>
        {/* 로고 */}
        <Typography
          variant="h6"
          onClick={() => navigate('/')}
          sx={{
            fontWeight: 800,
            fontSize: '1.3rem',
            letterSpacing: '-0.03em',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #00E5CC, #7C4DFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mr: 2,
            flexShrink: 0,
          }}
        >
          sharemood
        </Typography>

        {/* 데스크탑 네비 */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              variant="text"
              onClick={() => navigate(link.path)}
              sx={{
                color: location.pathname === link.path ? '#00E5CC' : 'rgba(255,255,255,0.65)',
                fontWeight: location.pathname === link.path ? 700 : 400,
                fontSize: '0.9rem',
                px: 1.5,
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        {/* 검색창 */}
        <Box
          sx={{
            flex: 1,
            mx: 2,
            maxWidth: 480,
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            background: searchFocus ? 'rgba(0,229,204,0.08)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${searchFocus ? 'rgba(0,229,204,0.4)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '12px',
            px: 2,
            py: 0.5,
            transition: 'all 0.2s',
          }}
        >
          <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', mr: 1 }} />
          <InputBase
            placeholder="플레이리스트, 아티스트, 무드 검색..."
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            sx={{ color: 'white', fontSize: '0.9rem', flex: 1 }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* 우측 액션 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              {/* 로그인 상태 표시 */}
              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  gap: 0.8,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '20px',
                  background: 'rgba(0,229,204,0.1)',
                  border: '1px solid rgba(0,229,204,0.3)',
                }}
              >
                <CheckCircleIcon sx={{ color: '#00E5CC', fontSize: '1rem' }} />
                <Typography variant="caption" sx={{ color: '#00E5CC', fontWeight: 600 }}>
                  {user.nickname || user.email?.split('@')[0] || '로그인됨'}
                </Typography>
              </Box>

              <IconButton
                onClick={() => navigate('/create')}
                sx={{
                  color: '#00E5CC',
                  background: 'rgba(0,229,204,0.08)',
                  '&:hover': { background: 'rgba(0,229,204,0.18)' },
                  display: { xs: 'none', sm: 'flex' },
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Avatar
                onClick={() => navigate('/profile')}
                sx={{ width: 36, height: 36, cursor: 'pointer', border: '2px solid rgba(0,229,204,0.5)' }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={() => { logout(); navigate('/'); }}
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.8rem',
                  py: 0.5,
                  '&:hover': { borderColor: 'rgba(255,80,80,0.5)', color: '#FF5252', background: 'rgba(255,80,80,0.06)' },
                }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button variant="text" onClick={() => navigate('/login')} sx={{ color: 'rgba(255,255,255,0.7)', display: { xs: 'none', sm: 'block' } }}>
                로그인
              </Button>
              <Button variant="contained" onClick={() => navigate('/register')} sx={{ display: { xs: 'none', sm: 'block' } }}>
                시작하기
              </Button>
            </>
          )}

          {/* 모바일 햄버거 */}
          <IconButton sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }} onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* 모바일 드로어 */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            background: 'rgba(8,11,20,0.95)',
            backdropFilter: 'blur(24px)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 800, background: 'linear-gradient(135deg,#00E5CC,#7C4DFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            sharemood
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton
                onClick={() => { navigate(link.path); setMobileOpen(false); }}
                selected={location.pathname === link.path}
                sx={{ '&.Mui-selected': { color: '#00E5CC', background: 'rgba(0,229,204,0.08)' } }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {!user && (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button variant="outlined" fullWidth onClick={() => { navigate('/login'); setMobileOpen(false); }}>로그인</Button>
            <Button variant="contained" fullWidth onClick={() => { navigate('/register'); setMobileOpen(false); }}>시작하기</Button>
          </Box>
        )}
      </Drawer>
    </AppBar>
  );
}
