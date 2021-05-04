import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Library from "./pages/library";

import "./App.css";
import Read from "./pages/read";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/read/:id">
          <Read />
        </Route>
        <Route path="/">
          <Library />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
