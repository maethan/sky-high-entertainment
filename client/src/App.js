import './App.css';
import { useEffect, useState } from 'react';
const config = require('./config.json');

function App() {
  const [test, setTest] = useState([]);

  useEffect(() => {
    // Hint: here is some pseudocode to guide you
    fetch(`http://${config.server_host}:${config.server_port}/test`)
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson)
        setTest(resJson)
      })
  }, []);

  return (
    <div className="App">
      {
        test.map(item => <div>{item.name}</div>)
      }
    </div>
  );
}

export default App;
