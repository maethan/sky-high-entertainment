import './App.css';
import { useEffect, useState } from 'react';
const config = require('./config.json');

function App() {
  const [test, setTest] = useState([]);
  const [airportSearch, setAirportSearch] = useState([]);
  const [flightSearch, setFlightSearch] = useState([]);
  const [movieSearch, setMovieSesarch] = useState([]);

  const search = 'atl'

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/routes`)
      .then(res => res.json())
      .then(resJson => {
        setTest(resJson)
      })

    fetch(`http://${config.server_host}:${config.server_port}/airport_search?search=${search}`)
    .then(res => res.json())
    .then(resJson => {
      setAirportSearch(resJson)
    })

    fetch(`http://${config.server_host}:${config.server_port}/flight_search?nonstop=1&startAirport=atl&destAirport=bos`)
    .then(res => res.json())
    .then(resJson => {
      setFlightSearch(resJson)
    })

    fetch(`http://${config.server_host}:${config.server_port}/movie_search?genre1=thriller&company=disney`)
    .then(res => res.json())
    .then(resJson => {
      setMovieSesarch(resJson)
    })

  }, []);

  return (
    <div className="App">
      {
        test.map(item => <div>Airline: {item.Airline}, Source: {item.Source}, Destination: {item.Destination}</div>)
      }
      {
        airportSearch.map(item => <div>Name: {item.Name}, Country: {item.Country}, City: {item.City}</div>)
      }
      {
        flightSearch.map(item => <div>FlightID: {item.FlightID}</div>)
      }
      {
        movieSearch.map(item => <div>Movie title: {item.name}</div>)
      }
    </div>
  );
}

export default App;
