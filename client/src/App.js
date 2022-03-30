import './App.css';
import {React} from 'react'
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
          <Route path="/" exact component={HomeScreen} />
          <Route path="/connect" exact component={WorkspaceScreen} />
        </Routes>
      </GlobalStoreContextProvider>
    </BrowserRouter>
  )
}


export default App;
