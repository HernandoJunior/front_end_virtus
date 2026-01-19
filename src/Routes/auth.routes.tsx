// src/Routes/auth.routes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login'

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* Qualquer rota desconhecida redireciona para login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}