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
          <Route exact path="/home" element={<HomeScreen />} />
          <Route path="/doc/edit/:id" element={<WorkspaceScreen />} />
        </Routes>
      </GlobalStoreContextProvider>
    </BrowserRouter>
  )
}


export default App;
