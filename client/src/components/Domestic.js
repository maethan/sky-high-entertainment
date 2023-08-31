import Table from "../components/Table";
import FlightModal from "../components/FlightModal";
import Navbar from "../components/Navbar";

import React, { useEffect, useRef, useState } from "react";
import { Slider } from "@mui/material";
import toast from "react-hot-toast";

const config = require("../config.json");

const Domestic = () => {
  // Keep state for what the user has selected for starting and ending airports
	const [startSearchResults, setStartSearchResults] = useState("");
	const [endSearchResults, setEndSearchResults] = useState("");
	const [endpoints, setEndpoints] = useState(["", ""]);

  // Use this state to see which flight the user has selected, this also controlls if a modal will show by being null or not null
	const [selectedFlightID, setFlightID] = useState(null);

  // This state simply controls if the filter panels shows or not
	const [showFilters, setShowFilters] = useState(false);

  // Keeps track of filter values
	const [nonstop, setNonstop] = useState(0);
	const [duration, setDuration] = useState([0, 3540]);
	const [airline, setAirline] = useState("");
	const [price, setPrice] = useState([0, 8261]);

  // All possible domestic airports [0] stores option in drop-down list, and [1] is the actual value
	const airports = [
		["ATL, Hartsfield Jackson Atlanta International Airport,Atlanta", "ATL"],
		["BOS, General Edward Lawrence Logan International Airport,Boston", "BOS"],
		["CLT, Charlotte Douglas International Airport,Charlotte", "CLT"],
		["DEN, Denver International Airport,Denver", "DEN"],
		["DFW, Dallas Fort Worth International Airport,Dallas-Fort Worth", "DFW"],
		["DTW, Detroit Metropolitan Wayne County Airport,Detroit", "DTW"],
		["EWR, Newark Liberty International Airport,Newark", "EWR"],
		["IAD, Washington Dulles International Airport,Washington", "IAD"],
		["JFK, John F Kennedy International Airport,New York", "JFK"],
		["LAX, Los Angeles International Airport,Los Angeles", "LAX"],
		["LGA, La Guardia Airport,New York", "LGA"],
		["MIA, Miami International Airport,Miami", "MIA"],
		["OAK, Metropolitan Oakland International Airport,Oakland", "OAK"],
		["ORD, Chicago O'Hare International Airport,Chicago", "ORD"],
		["PHL, Philadelphia International Airport,Philadelphia", "PHL"],
		["SFO, San Francisco International Airport,San Francisco", "SFO"],
	];

  // All domestic airlines
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
		"Southern Airways Express",
	];
	airlines.sort();

  // Method for searching for flights in the database, simply checks if the inputs are legal, then tells table component the updated endpoints
	const search = () => {
		if (
			startSearchResults !== endSearchResults &&
			startSearchResults !== "" &&
			endSearchResults !== ""
		) {
			setEndpoints([startSearchResults, endSearchResults]);
		} else {
			alert("Please check that all fields are unique and not empty!");
		}
	};

  // Handle if a user clicks on a flight
	const handleClick = (num) => {
		setFlightID(num);
	};

	return (
		<>
		  <div className="sticky top-0 z-40">
        <Navbar />
      </div>
			<div class="w-[100vw] relative">
				<img
					src="https://mixkit.imgix.net/videos/preview/mixkit-pink-sunset-seen-from-a-plane-window-4204-0.jpg?q=80&auto=format%2Ccompress"
					class="object-cover relative h-[60vh] w-[100vw]"
				/>
        <div className="p-6 rounded-lg text-4xl font-medium text-white w-fit flex absolute top-44 left-96 transform translate-x-2">
          Find your quick trip entertainment
        </div>
				<div className="bg-slate-100 p-6 rounded-lg w-fit flex absolute top-1/2 left-1/2 transform -translate-x-1/2">
					<div className="flex-container flex-column pos-abs">
						<select
							class="w-48 px-3 py-3 border-[1px] border-gray-500 placeholder-slate-600 text-slate-600 bg-white rounded-lg text-sm shadow outline-none focus:outline-none focus:ring"
							onChange={(e) => {
								setStartSearchResults(e.target.value);
							}}
						>
							<option value="">Source Airport</option>
							{airports.map((airport) => (
								<option value={airport[1]}>{airport[0]}</option>
							))}
						</select>
					</div>
					<div className="w-4"></div>
					<select
						class="w-48 px-3 py-3 border-[1px] border-gray-500 placeholder-slate-600 text-slate-600 bg-white rounded-lg text-sm shadow outline-none focus:outline-none focus:ring"
						onChange={(e) => {
							setEndSearchResults(e.target.value);
						}}
					>
						<option value="">Destination Airport</option>
						{airports.map((airport) => (
							<option value={airport[1]}>{airport[0]}</option>
						))}
					</select>
					<button
						type="button"
						onClick={() => setShowFilters(!showFilters)}
						class="absolute inset-y-0 right-0 hover:opacity-60 duration-100 flex items-center pr-3"
					>
						<svg
							viewBox="0 0 16 16"
							xmlns="http://www.w3.org/2000/svg"
							style={{
								display: "block",
								height: 14,
								width: 14,
								fill: "currentColor",
							}}
							aria-hidden="true"
							role="presentation"
							focusable="false"
						>
							<path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
						</svg>
					</button>
					<div className="w-6"></div>
					<button
						type="button"
						class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
						onClick={() => {
							search();
						}}
					>
						Find Flights
						<svg
							aria-hidden="true"
							class="w-5 h-5 ml-2 -mr-1"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
								clip-rule="evenodd"
							></path>
						</svg>
					</button>
					<div className="w-3"></div>
				</div>
			</div>

			<div class="w-11/12 rounded-lg relative h-96 bg-white z-75 mx-auto -mt-8 justify-evenly">
				{showFilters && (
					<div className="p-4 mb-4 border border-1 border-gray-300 rounded-lg items-center">
						<div className="flex ">
							<div className="pr-2 w-[30%] mx-auto">
								<div>Flight Duration: </div>
								<Slider
									value={duration}
									min={0}
									max={3540}
									step={30}
									onChange={(e, newValue) => setDuration(newValue)}
									valueLabelDisplay="auto"
									valueLabelFormat={(value) => <div>{value}</div>}
								/>
							</div>
							<div className="pl-2 pr-2 w-[30%] mx-auto">
								<div>Price (USD): </div>
								<Slider
									value={price}
									min={0}
									max={8261}
									step={25}
									onChange={(e, newValue) => setPrice(newValue)}
									valueLabelDisplay="auto"
									valueLabelFormat={(value) => <div>{value}</div>}
								/>
							</div>
							<div className="w-[17%] mx-auto">
								<div>Airline: </div>
								<select
									id="filter"
									onChange={(e) => setAirline(e.target.value)}
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
								>
									<option value="">Options:</option>
									{airlines.map((airli) => (
										<option value={airli}>{airli}</option>
									))}
								</select>
							</div>
							<div className="w-[12%] mx-auto">
								<div>Nonstop Only?: </div>
								<input
									type="checkbox"
									onChange={() => {
										nonstop == 1 ? setNonstop(0) : setNonstop(1);
									}}
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
								/>
							</div>
						</div>
					</div>
				)}
				<div className="h-5"></div>
				<div>
					<Table
						endpoints={endpoints}
						handleClick={handleClick}
						nonstop={nonstop}
						duration={duration}
						airline={airline}
						price={price}
					/>
				</div>
			</div>
			<FlightModal flightID={selectedFlightID} handleClick={handleClick} />
		</>
	);
};

export default Domestic;
