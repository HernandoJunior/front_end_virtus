import { Routes, Route } from 'react-router-dom';
//Pages
import  Login  from '../pages/Login'

export function AuthRoutes(){
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
    </Routes>
  )
}