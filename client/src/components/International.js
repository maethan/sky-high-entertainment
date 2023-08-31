import { useEffect, useState } from "react";
import Table from "../components/Table";
import IntTable from "../components/IntTable";
import Navbar from "./Navbar";

import FlightModal from "../components/FlightModal";
const config = require("../config.json");

const International = () => {
	const [startingAirport, setStartingAirport] = useState([]);
	const [startSearchResults, setStartSearchResults] = useState([]);
	const [endSearchResults, setEndSearchResults] = useState([]);
	const [displayStartSearch, setDisplayStartSearch] = useState("");
	const [flights, setFlights] = useState([]);
	const [page, setPage] = useState(1);
	const [route, setRoute] = useState();
	const [endpoints, setEndpoints] = useState(["", ""]);
	const [selectedFlightID, setFlightID] = useState(null);

	const search = () => {
		setEndpoints([startSearchResults, endSearchResults]);
	};

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
					src="https://cdn.onemileatatime.com/wp-content/uploads/2019/11/La-Compagnie-Business-Class-A321neo-61.jpg?width=1200&auto_optimize=low&quality=75&height=900&aspect_ratio=4%3A3"
					class="object-cover relative h-[60vh] w-[100vw]"
				/>

				<div className="bg-slate-100 p-6 rounded-lg w-fit flex absolute top-1/2 left-1/2 transform -translate-x-1/2">
					<div className="flex-container flex-column pos-abs">
						<input
							type="text"
							placeholder="Starting Airport"
							class="w-48 px-3 py-3 placeholder-slate-600 text-slate-600 bg-white rounded-lg text-sm border-0 shadow outline-none focus:outline-none focus:ring"
							onChange={(e) => setStartSearchResults(e.target.value)}
						/>
					</div>

					<div className="w-4"></div>
					<input
						type="text"
						placeholder="Destination Airport"
						class="w-48 px-3 py-3 placeholder-slate-600 text-slate-600 bg-white rounded-lg text-sm border-0 shadow outline-none focus:outline-none focus:ring"
						onChange={(e) => setEndSearchResults(e.target.value)}
					/>
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
				</div>
			</div>

			<div>
				<IntTable endpoints={endpoints} handleClick={handleClick} />
			</div>
		</>
	);
};

export default International;
