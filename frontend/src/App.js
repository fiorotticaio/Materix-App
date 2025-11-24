import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.js';
import Home from './pages/Home';
import PlantViewer from './pages/PlantViewer';
import SelectedMaterials from './pages/SelectedMaterials';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/plant-viewer" element={<PlantViewer />} />
      <Route path="/selected-materials" element={<SelectedMaterials />} />
    </Routes>
  );
}

export default App;
