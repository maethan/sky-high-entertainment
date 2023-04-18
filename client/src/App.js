import './App.css';
import { useEffect, useState } from 'react';
const config = require('./config.json');

function App() {
  const [test, setTest] = useState([]);
  const [airportSearch, setAirportSearch] = useState([]);
  const [flightSearch, setFlightSearch] = useState([]);
  const [movieSearch, setMovieSesarch] = useState([]);
  const [getMovie, setGetMovie] = useState([]);
  const [getFlight, setGetFlight] = useState([]);
  const [getSegmentRecommendations, setSegmentRecommendations] = useState([]);
  const [getRouteAirlines, setRouteAirlines] = useState([]);

  //constants just for testing
  const search = 'atl';
  const imdbID = 'tt0092067';
  const flightID = 26;

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

    fetch(`http://${config.server_host}:${config.server_port}/get_movie?imdbID=${imdbID}`)
    .then(res => res.json())
    .then(resJson => {
      setGetMovie(resJson)
    })

    fetch(`http://${config.server_host}:${config.server_port}/get_flight?flightID=${flightID}`)
    .then(res => res.json())
    .then(resJson => {
      setGetFlight(resJson)
    })

    fetch(`http://${config.server_host}:${config.server_port}/get_segment_recommendations?flightID=6&segments=1&genre1=comedy&genre2=documentary`)
    .then(res => res.json())
    .then(resJson => {
      setSegmentRecommendations(resJson)
    })

    fetch(`http://${config.server_host}:${config.server_port}/get_route_airlines?source=ROB&destination=FNA`)
    .then(res => res.json())
    .then(resJson => {
      setRouteAirlines(resJson)
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
      {
        getMovie.map(item => <div>Movie title GET MOVIE: {item.name}</div>)
      }
      {
        getFlight.map(item => <div>Flight GET Flight: {item.FlightID}, Start: {item.StartingAirport}, End: {item.DestinationAirport}, Duration: {item.TravelDuration}</div>)
      }
      {
        getSegmentRecommendations.map(item => <div>Rec1: {item.first}, Rec2: {item.second}, Rec3: {item.third}</div>)
      }
      {
        getRouteAirlines.map(item => <div>Airline Name: {item.Name}</div>)
      }
    </div>
  );
}

export default App;
