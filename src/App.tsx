import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Confirm from './pages/Confirm';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
