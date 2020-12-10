import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { UserProvider } from "./components/user-provider"

import { Home } from "./pages/home-page"
import { LogIn } from "./pages/login-page"
import { Signup } from "./pages/signup-page"

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <Switch>
            <Route path="/login">
              <LogIn />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </UserProvider>
    </Router>
  )
}

export default App
