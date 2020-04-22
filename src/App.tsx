import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar'
import Classes from './App.module.css';
import LandingPage from './pages/LandingPage';
import BlogEditorPage from './pages/BlogEditorPage';
import WriteBlogPage from './pages/WriteBlogPage';
import Login from './components/Login'

const App = () => {
  return (
    <BrowserRouter>
      <div className={Classes.App}>
        <Navbar />
        <Switch>
          <Route path="/" exact>
            <LandingPage />
          </Route>
          <Route path="/write-blog">
            <WriteBlogPage />
          </Route>
          <Route path="/blog-editor">
            <BlogEditorPage />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
