import './App.css';
import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {GlobalStoreContextProvider} from './store'
import {
    HomeScreen,
    WorkspaceScreen
} from './components'

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStoreContextProvider>
        <Routes>
          <Route exact path="/" element={<HomeScreen />} />
          <Route exact path="/connect" element={<WorkspaceScreen />} />
        </Routes>
      </GlobalStoreContextProvider>
    </BrowserRouter>
  )
}


export default App;
