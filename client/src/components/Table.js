import { useEffect, useState } from 'react';

const config = require('../config.json');

/** Table requires endpoints to know which flights to query from flight prices, and then handleClick is function to update state of parent
 * Nonstop, airline, duration, and price are all filters for possible flights.
*/ 
const Table = ({endpoints, handleClick, nonstop, airline, duration, price}) => {
  // Keep states of matching flights and current page within pagination
  const [flights, setFlights] = useState([])
  const [page, setPage] = useState(1);

  // Everytime state is updated, requery the database for matching flights
  useEffect(() => {
    if (endpoints[0] != "" && endpoints[1] != "") {
      fetch(`http://${config.server_host}:${config.server_port}/flight_search?startAirport=${endpoints[0]}&destAirport=${endpoints[1]}&page=${page}&nonstop=${nonstop}&minDuration=${duration[0]}&maxDuration=${duration[1]}&airline=${airline}&minPrice=${price[0]}&maxPrice=${price[1]}`)
      .then(res => res.json())
      .then(resJson => {
        const flightsFromSearch = resJson;
        setFlights(flightsFromSearch);
      });
    }
  }, [page, endpoints]);

  const movePage = (num) => {
    setPage(page + num);
  }


  return (
    <>
      <div class="rounded-lg relative h-96 bg-white z-75 mx-auto -mt-8 justify-evenly">
        {flights.length > 0 &&
          <table class="w-full text-sm text-left dark:text-black">
              <thead class="text-xs text-gray-700 uppercase dark:text-black">
                  <tr>
                      <th scope="col" class="px-6 py-3">ID</th>
                      <th scope="col" class="px-6 py-3">Airline</th>
                      <th scope="col" class="px-6 py-3">Travel Duration (Minutes)</th>
                      <th scope="col" class="px-6 py-3">Distance (Miles)</th>
                      <th scope="col" class="px-6 py-3">Total Fare</th>
                      <th scope="col" class="px-6 py-3">Layovers</th>
                  </tr>
              </thead>
              <tbody>
                {flights.map(flight => (
                  <tr class="border-b border-gray-200 hover:bg-slate-200" key={flight.FlightID} onClick={() => handleClick(flight.FlightID)}>
                    <td scope="row" class="px-6 py-4">
                        {flight.FlightID}
                    </td>
                    <td class="px-6 py-4">
                        {flight.AirlineName}
                    </td>
                    <td class="px-6 py-4">
                        {flight.TravelDuration}
                    </td>
                    <td class="px-6 py-4">
                        {flight.TravelDistance}
                    </td>
                    <td class="px-6 py-4">
                        {flight.TotalFare}
                    </td>
                    <td class="px-6 py-4">
                        {flight.Segments}
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        }
        { flights.length > 0 &&
          <div class="flex float-right">
            {page > 1 &&
                <button class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" onClick={() => {movePage(-1 * page + 1)}}>
                All Back
                </button>
            }
            {page > 1 &&
                <button class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" onClick={() => {movePage(-1)}}>
                Back
                </button>
            }

            {flights.length == 10 &&
                <button class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" onClick={() => {movePage(1)}}>
                Next
                {
                //<svg aria-hidden="true" class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                }
                </button>
            }
          </div>
        }
      </div>
    </>
  )
}

export default Table