import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00E5CC',
      light: '#4DFDE8',
      dark: '#00B8A9',
    },
    secondary: {
      main: '#7C4DFF',
      light: '#B47CFF',
      dark: '#4F2EC0',
    },
    background: {
      default: '#080B14',
      paper: 'rgba(255,255,255,0.05)',
    },
    text: {
      primary: 'rgba(255,255,255,0.92)',
      secondary: 'rgba(255,255,255,0.55)',
    },
    divider: 'rgba(255,255,255,0.08)',
    success: { main: '#00E676' },
    error: { main: '#FF5252' },
    warning: { main: '#FFD740' },
    info: { main: '#40C4FF' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 500 },
    h5: { fontSize: '1.125rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.7 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    caption: { fontSize: '0.75rem' },
  },
  shape: {
    borderRadius: 16,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #080B14 0%, #0D1424 50%, #080B14 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,229,204,0.3) transparent',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,229,204,0.3)',
            borderRadius: '3px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.2s ease',
        },
        contained: {
          background: 'linear-gradient(135deg, #00E5CC, #00B8A9)',
          color: '#080B14',
          boxShadow: '0 4px 20px rgba(0,229,204,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4DFDE8, #00E5CC)',
            boxShadow: '0 6px 28px rgba(0,229,204,0.5)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(0,229,204,0.5)',
          color: '#00E5CC',
          '&:hover': {
            borderColor: '#00E5CC',
            background: 'rgba(0,229,204,0.08)',
          },
        },
        text: {
          color: 'rgba(255,255,255,0.7)',
          '&:hover': { color: '#00E5CC', background: 'rgba(0,229,204,0.08)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '1px solid rgba(0,229,204,0.2)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 20px rgba(0,229,204,0.05)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(8,11,20,0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
            '&:hover fieldset': { borderColor: 'rgba(0,229,204,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#00E5CC' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#00E5CC' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
          '&:hover': {
            background: 'rgba(0,229,204,0.15)',
            borderColor: 'rgba(0,229,204,0.4)',
          },
        },
        colorPrimary: {
          background: 'rgba(0,229,204,0.15)',
          border: '1px solid rgba(0,229,204,0.4)',
          color: '#00E5CC',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.08)' },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid rgba(0,229,204,0.3)',
        },
      },
    },
  },
});

export default theme;
