import React, { useState, useEffect } from 'react';
import airportImages from '../utils/airports';
import Plane from '../assets/plane';
import Navbar from './Navbar';
import {
   PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter, 
} from 'recharts';
const config = require('../config.json');

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ADD FUNCTIONALITY TO ONLY SHOW AIRLINES WITH STARTING AIRPORT
const airlines = [
  "Delta",
  "JetBlue Airways",
  "American Airlines",
  "United",
  "Spirit Airlines",
  "Frontier Airlines",
  "Alaska Airlines",
  "Boutique Air",
  "Sun Country Airlines",
  "Cape Air",
  "Key Lime Air",
  "Contour Airlines",
  "Southern Airways Express"
]

const Airports = () => {
  const [airports, setAirports] = useState([])
  const [selectedAirport, setSelectedAirport] = useState([""])
  const [domestic, setDomestic] = useState(true)
  const [filter, setFilter] = useState("")
  const [airportAggregations, setAirportAggregations] = useState([])
  const [pieData, setPieData] = useState([])
  const [barData, setBarData] = useState([])
  const [fetched, setFetched] = useState(false)
  const [airline, setAirline] = useState("Delta")
  const [dropdown, setDropdown] = useState(false)
  const [airlineData, setAirlineData] = useState([])
  const [intlData, setIntlData] = useState([])
  const [currentUserAirports, setCurrentUserAirports] = useState([])

  useEffect(() => {
    if (!fetched) {
      setFetched(true)
      fetch(`http://${config.server_host}:${config.server_port}/get_domestic_airports`)
        .then(res => res.json())
        .then(resJson => {
          setAirports(resJson)
          fetch(`http://${config.server_host}:${config.server_port}/get_current_user_airports`,{
            method: 'GET',
            credentials: 'include',
          })
          .then(res => res.json())
          .then(resJson => {
            setCurrentUserAirports(resJson)
          })
        }
      )
    }
  }, [])

  useEffect(() => {
    setPieData([])
    setBarData([])
    setAirportAggregations([])
    setIntlData([])
    if (domestic && selectedAirport[0].length > 1) {
      fetch(`http://${config.server_host}:${config.server_port}/airport_aggregations?airport=${selectedAirport[0]}`)
      .then(res => res.json())
      .then(resJson => {
        const sortedArr = resJson.sort((a, b) => b.Count - a.Count);
        let sum = 0;
        sortedArr.forEach((item) => {
          sum += item.Count
        })
        sum -= (sortedArr[0].Count + sortedArr[1].Count + sortedArr[2].Count);

        const data = [
          { name: sortedArr[0].DestinationAirport, value: sortedArr[0].Count },
          { name: sortedArr[1].DestinationAirport, value: sortedArr[1].Count },
          { name: sortedArr[2].DestinationAirport, value: sortedArr[2].Count },
          { name: "Other", value: sum }
        ]

        const barDataProcessing = resJson.map((airport) => {
          return {
            "name": airport.DestinationAirport,
            "Base": airport.AvgBase.toFixed(2),
            "With Fees": (airport.AvgTotalFare - airport.AvgBase).toFixed(2),
          }  
        })

        setPieData(data)
        setBarData(barDataProcessing)
        setAirportAggregations(resJson)
        fetch(`http://${config.server_host}:${config.server_port}/get_airline?airline=${airline}&startingAirport=${selectedAirport[0]}`)
        .then(res => res.json())
        .then(resJson => {
          setAirlineData(resJson)
        })
      })
    } else if (!domestic && selectedAirport[0].length > 1) {
      fetch(`http://${config.server_host}:${config.server_port}/get_intl_airport?airport=${selectedAirport[0]}`)
      .then(res => res.json())
      .then(resJson => {
        setIntlData(resJson)
      })
    }
  }, [selectedAirport])

  const handleToggle = (toDomestic) => {
    if ((domestic && !toDomestic) ||(!domestic && toDomestic)) {
      setAirports([])
      if (toDomestic) {
        fetch(`http://${config.server_host}:${config.server_port}/get_domestic_airports`)
        .then(res => res.json())
        .then(resJson => {
          setAirports(resJson)
          // FIGURE OUT A WAY TO NOT MAKE THIS LAG
          setDomestic(toDomestic)
        })
      } else {
        fetch(`http://${config.server_host}:${config.server_port}/get_international_airports?page=0&limit=30`)
        .then(res => res.json())
        .then(resJson => {
          setAirports(resJson)
          setDomestic(toDomestic)
        })
      }
    } 
  }

  const selectAirline = (air) => {
    setDropdown(false)
    setAirline(air)
    fetch(`http://${config.server_host}:${config.server_port}/get_airline?airline=${air}&startingAirport=${selectedAirport[0]}`)
    .then(res => res.json())
    .then(resJson => {
      setAirlineData(resJson)
    })
  }

  const addFavoriteAirport = (airport) => {
    fetch(`http://${config.server_host}:${config.server_port}/add_favorite_airport?airportCode=${airport[0]}&airportCountry=${airport[2]}&airportName=${airport[1]}`, {
      method: 'POST',
      credentials: 'include',
    })
    .then(res => res.json())
    .then(resJson => {
      console.log(resJson)
      setCurrentUserAirports(resJson.favoriteAirports)
    })
  }

  const removeFavoriteAirport = (airport) => {
    fetch(`http://${config.server_host}:${config.server_port}/remove_favorite_airport?airportCode=${airport[0]}`, {
      method: 'POST',
      credentials: 'include',
    })
    .then(res => res.json())
    .then(resJson => {
      setCurrentUserAirports(resJson.favoriteAirports)
    })
  }

  return (
    <>
    <div className="sticky top-0 z-40">
      <Navbar />
    </div>
    <div className="h-[90vh] grid grid-cols-10">
      <div id="airport-list" className="col-span-3 px-4 border-l border-r border-l-1 border-r-1">
        <div className="flex h-[6vh]">
          <div class="relative w-full mr-4">
            <input id="filter" onChange={(e) => setFilter(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5" placeholder="Search Airports"/>
          </div>
          <div className="flex h-fit">
            <button onClick={() => handleToggle(true)} className={`${domestic ? "bg-blue-500 text-white" : "text-blue-500"} px-2 py-2 rounded-tl rounded-bl border-[1px] border-blue-500`}>
              DOM
            </button>
            <button onClick = {() => handleToggle(false)} className={`${!domestic ? "bg-blue-500 text-white" : "text-blue-500"} px-2 py-2 rounded-tr rounded-br border border-b-[1px] border-r-[1px] border-t-[1px] border-blue-500`}>
              INTL
            </button>
          </div>
        </div>
        <div className="h-[84vh] overflow-auto">
        {
          airports.length > 0 && 
          airports.filter((airport) => {
            const iata = domestic ? airport.StartingAirport : airport.IATA
            const country = airport.Country
            const name = airport.Name
            const city = airport.City

            return (
              iata?.toLowerCase().includes(filter?.toLowerCase()) ||
              name?.toLowerCase().includes(filter?.toLowerCase()) || 
              city?.toLowerCase().includes(filter?.toLowerCase()) ||
              country?.toLowerCase().includes(filter?.toLowerCase())
            )
          }).map((airport, index) => {
            const iata = airport.StartingAirport
            return (
              <div onClick={() => {domestic ? setSelectedAirport([airport.StartingAirport, airport.Name, airport.City]) : setSelectedAirport([airport.IATA, airport.Name, airport.City])}} key={index} className="hover:bg-gray-100 duration-150 cursor-pointer flex my-2 border border-1 rounded-lg">
                {domestic && (
                  <div className="w-32 h-32 rounded-tl-lg rounded-bl-lg">
                    <img className="object-fill rounded-tl-lg rounded-bl-lg" src={airportImages.get(iata)} alt="airport"></img>
                  </div>
                )}
                <div className={`${domestic ? "w-48" : "w-full" } pl-4 pt-2`}>
                  <div className=""><span className="font-bold">{airport.City}</span> • {domestic ? airport.StartingAirport : airport.IATA}</div>
                  <div className="">{airport.Name}</div>
                  {
                    !domestic && (
                      <div className="pb-2">
                        {airport.Country}
                      </div>
                    )
                  }
                </div>
              </div>
            )
          })
        }
        {
          airports.length === 0 && (
            <div role="status" className="w-fit mr-auto ml-auto mt-40">
              <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </div>
          )
        }
        </div>
      </div>
      <div className="col-span-7 pt-2 overflow-auto"> 
        <div className="text-center">
          {
            selectedAirport[0].length === 0 && (
              <div className="text-2xl tracking-wide mx-auto w-fit pt-40">
                <Plane />
                No airport selected
              </div>
            )
          }
          <div className="flex mx-auto w-fit">
            {selectedAirport[0].length > 0 && !currentUserAirports.some(e => e.airportCode === selectedAirport[0]) && (
              <div onClick={() => addFavoriteAirport(selectedAirport)} className="mt-2 mr-2 hover:text-blue-600 hover:scale-105 cursor-pointer duration-150">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-bookmark-plus" viewBox="0 0 16 16">
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z"/>
                  </svg>  
              </div>
            )}
            {selectedAirport[0].length > 0 && currentUserAirports.some(e => e.airportCode === selectedAirport[0]) && (
              <div onClick={() => removeFavoriteAirport(selectedAirport)} className="mt-2 mr-2 hover:text-blue-600 hover:scale-95 cursor-pointer duration-150">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-bookmark-x-fill" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zM6.854 5.146a.5.5 0 1 0-.708.708L7.293 7 6.146 8.146a.5.5 0 1 0 .708.708L8 7.707l1.146 1.147a.5.5 0 1 0 .708-.708L8.707 7l1.147-1.146a.5.5 0 0 0-.708-.708L8 6.293 6.854 5.146z"/>
                  </svg> 
              </div>
            )}

            <div className="text-4xl font-medium tracking-wide"> 
              {selectedAirport[2]}
            </div> 
            <div className="ml-2 mt-4">{selectedAirport[0]}</div>
          </div>
          <div>
            {selectedAirport[1]}
          </div>
          {
            selectedAirport[0].length > 0 && airportAggregations.length === 0 && intlData.length === 0 && (
              <span class="relative flex h-10 w-10 mx-auto mt-32">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-10 w-10 bg-sky-500"></span>
              </span>
            )
          }
          { airportAggregations.length > 0 && (
            <div className="flex">
              <div className="mt-2">
                <div className="text-lg font-semibold mb-2">Total Flights</div>
                <PieChart width={400} height={250}>
                  <Pie
                    data={pieData}
                    cx="45%"
                    cy="40%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ transform: 'translate(0px, -30px)', margin: 0, padding: 0 }}
                  />
                  <Tooltip />
                </PieChart>
                <div className="text-lg font-semibold mb-2">Avg Cost to Various Airports</div>
                <BarChart
                  width={500}
                  height={300}
                  data={barData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Base" stackId="a" fill="#8884d8" />
                  <Bar dataKey="With Fees" stackId="a" fill="#82ca9d" />
                </BarChart>
              </div>
              <div className="mt-10">
                <div className="text-lg font-semibold mb-2">Airline Distance vs Cost</div>
                <ScatterChart width={400} height={400}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="TravelDistance" name="Distance (mi)" />
                  <YAxis type="number" dataKey="TotalFare" name="Cost ($)" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="A school" data={airlineData} fill="#8884d8" />
                </ScatterChart>
                <div class="relative inline-block text-left">
                    <div>
                      <button type="button" onClick={() => setDropdown(!dropdown)} class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                        {airline}
                        <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div class={`${dropdown ? "opacity-100" : "opacity-0 -z-50"} overflow-auto h-[16vh] duration-100 absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`} role="menu">
                      <div class="py-1" role="none">
                        {
                          airlines.map((airline, index) => {
                            return (
                              <div key={index} onClick={() => selectAirline(airline)} class="cursor-pointer text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900" role="menuitem">{airline}</div>
                            )
                          })
                        }   
                      </div>
                    </div>
                </div>
              </div>
            </div>
          )}
          {
            intlData.length > 0 && (
              <table class="table-fixed mx-auto w-[60vw] my-4">
                <thead>
                  <tr>
                    <th>Destination</th>
                    <th>City</th>
                    <th>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    intlData.map((intl) => (
                      <tr>
                        <td>{intl.Destination}</td>
                        <td>{intl.City}</td>
                        <td>{intl.Country}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
    </>
  )
}

export default Airports;