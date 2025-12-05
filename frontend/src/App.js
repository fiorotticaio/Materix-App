import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.js';
import Home from './pages/Home';
import PlantViewer from './pages/PlantViewer';
import SelectedMaterials from './pages/SelectedMaterials';
import PrivateRoute from './PrivateRoute';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';

function App() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

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