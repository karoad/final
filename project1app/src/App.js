import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router} from 'react-router-dom';
import BaseRouter from './routes'

function App() {
  return (
    <div className="App">
      <Router>
          <BaseRouter></BaseRouter>
      </Router>
    </div>
  );
}

export default App;
// //<script src="https://d3js.org/d3.v6.min.js"></script>

// <script>
//   console.log(d3); // test if d3 is loaded
//   // Add an SVG
//   // Add Rectangles
//   // Add Circles
//   // Add Lines
//   // Add Polygons
// </script>