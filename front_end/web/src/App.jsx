import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
       {/* AppRoutes tự hiển thị trang  */}
       <AppRoutes />
    </AuthProvider>
  );
}

export default App;