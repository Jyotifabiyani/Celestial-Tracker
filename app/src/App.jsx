import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import EventDetail from './pages/EventDetail';
import CalendarPage from './pages/Calendar'; // Renamed from Calendar to avoid naming conflicts
import { Typography } from '@mui/material';
import Settings from './pages/Settings';
import Chatbot from './components/Chatbot';
import RemindersPage from './components/RemindersPage';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `
            linear-gradient(rgba(11, 15, 28, 0.9), rgba(11, 15, 28, 0.9)),
            url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')
            center/cover fixed
          `,
          minHeight: '100vh',
          color: '#ffffff',
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NavBar />
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/event/:id" element={<EventDetail />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/reminders" element={<RemindersPage />} />
                {/* 404 Fallback Route - should be last */}
                <Route
                  path="*"
                  element={
                    <Typography variant="h4" color="error" align="center" mt={5}>
                      404 - Page Not Found
                    </Typography>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;