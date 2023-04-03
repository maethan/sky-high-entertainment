import './App.css';
import { useEffect, useState } from 'react';
const config = require('./config.json');

function App() {
  const [test, setTest] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/routes`)
      .then(res => res.json())
      .then(resJson => {
        setTest(resJson)
      })
  }, []);

  return (
    <div className="App">
      {
        test.map(item => <div>Airline: {item.Airline}, Source: {item.Source}, Destination: {item.Destination}</div>)
      }
    </div>
  );
}

export default App;
