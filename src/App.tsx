import React from 'react'
import Containers from './components/Containers'
import Login from './pages/Login'
import { Route, Switch } from 'react-router-dom'

export default function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Containers} />
    </Switch>
  )
}