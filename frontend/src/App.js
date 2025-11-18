import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.js';
import Home from './pages/Home';
import PlantViewer from './pages/PlantViewer';
import HighlightsResults from './pages/HighlightsResults';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/plant-viewer" element={<PlantViewer />} />
      <Route path="/highlights-results" element={<HighlightsResults />} />
    </Routes>
  );
}

export default App;
