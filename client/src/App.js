import './App.css';
import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {GlobalStoreContextProvider} from './store'
import { AuthContextProvider } from './auth';
import {
    WorkspaceScreen
} from './components';
import HomeWrapper from './components/HomeWrapper';
import RegisterScreen from './components/RegisterScreen';
import LoginScreen from './components/LoginScreen';

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <GlobalStoreContextProvider>
          <Routes>
            <Route path="/" element={<HomeWrapper />} />
            <Route path="/register/" element={<RegisterScreen />} />
            <Route path="/login/" element={<LoginScreen />} />
            <Route path="/doc/edit/:id" element={<WorkspaceScreen />} />
          </Routes>
        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  )
}


export default App;
