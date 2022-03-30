import './App.css';
import {React} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {GlobalStoreContextProvider} from './store'
import {
    HomeScreen,
    WorkspaceScreen
} from './components'

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStoreContextProvider>
        <Switch>
          <Route path="/" exact component={HomeScreen} />
          <Route path="/connect/:id" exact component={WorkspaceScreen} />
        </Switch>
      </GlobalStoreContextProvider>
    </BrowserRouter>
  )
}


export default App;
