import React  from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NavBar from './components/Navbar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import About from './components/AboutUs';
import Contact from './components/Contact';
import Error from './components/Error';

function App() {

  return (
    
    <> 
    <BrowserRouter>
      <NavBar />
      <Switch>
      <Route path="/" component={MainContent} exact/>
        <Route path="/about" component={About}/>
        <Route path="/contact" component={Contact}/>
        <Route component={Error}/>
      </Switch>
      <br/><br/><br/>
      <Footer />
    </BrowserRouter>
    </>
  );
}

export default App;
