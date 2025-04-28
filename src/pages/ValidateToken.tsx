import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ValidateToken: React.FC = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Checa se já há token e redireciona
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    } else {
      setChecking(false);
    }
  }, [navigate]);

  const handleSimularLogin = () => {
    // Insere um token de teste e redireciona
    localStorage.setItem("token", "dummy-token");
    navigate("/", { replace: true });
  };

  // Enquanto checa o token, não renderiza nada
  if (checking) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Acesso Restrito</h1>
        <p className="text-xl text-gray-600 mb-6">
          Você precisa estar autenticado para continuar.
        </p>
        <button
          onClick={handleSimularLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Simular Login
        </button>
      </div>
    </div>
  );
};

export default ValidateToken;
