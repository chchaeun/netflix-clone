import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Likes from "./Routes/Likes";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
function App() {
  return (
    <Router basename="/netflix-clone">
      <Header />
      <Switch>
        <Route path={["/tv", "/tv/:category/:tvId"]}>
          <Tv />
        </Route>
        <Route path={["/search", "/search/:type/:id"]}>
          <Search />
        </Route>
        <Route path={["/likes", "/likes/:type/:id"]}>
          <Likes />
        </Route>
        <Route path={["/", "/movies/:category/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
