import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-body">
      <Sidebar /> {/* Menu cố định bên trái */}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header /> {/* Header cố định bên trên */}
        
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Các route khác sẽ thêm vào đây */}
          </Routes>
        </main>
      </div>
    </div>
  );
}
export default App;