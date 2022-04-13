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
            <Route path="/home" element={<HomeWrapper />} />
            <Route path="/register/" element={<RegisterScreen />} />
            <Route path="/login/" element={<LoginScreen />} />
            <Route path="/doc/edit/:docid" element={<WorkspaceScreen />} />
          </Routes>
        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  )
}


export default App;
