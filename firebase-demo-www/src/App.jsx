import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { Home } from "./pages/home-page"
import { LogIn } from "./pages/login-page"
import { Signup } from "./pages/signup-page"

function App() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      // Initialize Firebase
      setInitialized(true)
    }
  }, [initialized])

  return (
    <Router>
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
    </Router>
  )
}

export default App
