import './App.css';
import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {GlobalStoreContextProvider} from './store'
import { AuthContextProvider } from './auth';
import {
    WorkspaceScreen,
    HomeWrapper,
    RegisterScreen,
    LoginScreen,
    HomeScreen
} from './components';


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
            <Route path="/home" element={<HomeScreen />} />
          </Routes>
        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  )
}


export default App;
