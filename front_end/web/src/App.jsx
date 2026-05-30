import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* AppRoutes tự hiển thị trang */}
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;