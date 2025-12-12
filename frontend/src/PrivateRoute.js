import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // exp do JWT vem em *segundos*, não em ms
    if (decoded.exp * 1000 < Date.now()) {
      // Token expirado → remover
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }

    return children;

  } catch (err) {
    // Token inválido ou corrompido
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
}