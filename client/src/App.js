//App.js

import axios from 'axios';

import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
// eslint-disable-next-line
import Home from './pages/Home';
import Cart from './pages/Cart';

//data will be the string we send from our server
// const apiCall = () => {
//   axios.get(process.env.REACT_APP_BACKEND_URL).then((data) => {
//     //this console.log will be in our frontend console
//     console.log(data)
//   })
// }

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
