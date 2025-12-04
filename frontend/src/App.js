import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.js';
import Home from './pages/Home';
import PlantViewer from './pages/PlantViewer';
import SelectedMaterials from './pages/SelectedMaterials';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/" element={<Login />} />

      {/* Rotas protegidas */}
      <Route 
        path="/home" 
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route 
        path="/plant-viewer" 
        element={
          <PrivateRoute>
            <PlantViewer />
          </PrivateRoute>
        }
      />

      <Route 
        path="/selected-materials" 
        element={
          <PrivateRoute>
            <SelectedMaterials />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;