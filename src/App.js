import logo from './logo.svg';
import './App.css';
import LogIn from './Components/Pages/LogIn/LogIn';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Registration from './Components/Pages/Registration/Registration';
import Home from './Components/Pages/Home/Home';
import PrivateRoutes from './Components/Pages/PrivateRoutes/PrivateRoutes';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LogIn />}/>
          <Route path='/home' element={ <PrivateRoutes> <Home /> </PrivateRoutes>}/>
          <Route path='/reg' element={<Registration />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
