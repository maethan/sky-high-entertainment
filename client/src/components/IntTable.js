import { useEffect, useState } from "react";

const config = require("../config.json");

const IntTable = ({ endpoints, handleClick }) => {
	const [flights, setFlights] = useState([{ SCountry: "" }]);
	const [movies, setMovies] = useState([]);
	const [page, setPage] = useState(1);

	useEffect(() => {
		fetch(
			`http://${config.server_host}:${config.server_port}/route_search?startAirport=${endpoints[0]}&destAirport=${endpoints[1]}&page=${page}`
		)
			.then((res) => res.json())
			.then((resJson) => {
				const flightsFromSearch = resJson;
				setFlights(flightsFromSearch);
				fetch(
					`http://${config.server_host}:${
						config.server_port
					}/movie_search_2?countries=${[flights[0].SCountry]}&page=${page}`
				)
					.then((res) => res.json())
					.then((resJson) => {
						const moviesFromSearch = resJson;
						setMovies(moviesFromSearch);
					});
			});
	}, [page, endpoints]);

	const movePage = (num) => {
		setPage(page + num);
	};

	return (
		<>
			<div class="w-11/12 rounded-lg relative h-36 bg-white mx-auto -mt-8 justify-evenly">
				{flights.length > 0 && (
					<table class="w-full text-sm text-left dark:text-black">
						<thead class="text-xs text-gray-700 uppercase dark:text-black">
							<tr>
								<th scope="col" class="px-6 py-3">
									Airline
								</th>
								<th scope="col" class="px-6 py-3">
									Source Airport
								</th>
								<th scope="col" class="px-6 py-3">
									Destination Airport
								</th>
								<th scope="col" class="px-6 py-3">
									Source Country
								</th>
								<th scope="col" class="px-6 py-3">
									Destination Country
								</th>
								<th scope="col" class="px-6 py-3">
									Number of Stops
								</th>
							</tr>
						</thead>
						<tbody>
							{flights.map((flight) => (
								<tr
									class="border-b border-gray-200 hover:bg-slate-200"
									key={`${flight.Name}` + `${flight.SName}`}
								>
									<td scope="row" class="px-6 py-4">
										{flight.Name}
									</td>
									<td class="px-6 py-4">{flight.SName}</td>
									<td class="px-6 py-4">{flight.DName}</td>
									<td class="px-6 py-4">{flight.SCountry}</td>
									<td class="px-6 py-4">{flight.DCountry}</td>
									<td class="px-6 py-4">{flight.Stops}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
				{flights.length > 0 && (
					<div class="flex float-right">
						{page > 1 && (
							<button
								class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
								onClick={() => {
									movePage(-1 * page + 1);
								}}
							>
								All Back
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
						)}
						{page > 1 && (
							<button
								class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
								onClick={() => {
									movePage(-1);
								}}
							>
								Back
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
						)}

						{flights.length == 10 && (
							<button
								class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
								onClick={() => {
									movePage(1);
								}}
							>
								Next
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
						)}
					</div>
				)}
			</div>

			<div class="w-11/12 rounded-lg relative h-24 bg-white z-75 mx-auto -mt-8 justify-evenly">
				{flights.length > 0 && (
					<table class="w-full text-sm text-left dark:text-black">
						<thead class="text-L w-11 text-gray-1400 uppercase dark:text-black">
							<tr>
								<th scope="col" class=" px-6 py-3">
									Your Recommended Movies
								</th>
							</tr>
						</thead>

						<thead class="text-xs text-gray-700 uppercase dark:text-black">
							<tr>
								<th scope="col" class="px-6 py-3">
									Name
								</th>
								<th scope="col" class="px-6 py-3">
									Score
								</th>
								<th scope="col" class="px-6 py-3">
									Language{" "}
								</th>
								<th scope="col" class="px-6 py-3">
									Countries
								</th>
								<th scope="col" class="px-6 py-3">
									Genres
								</th>
								<th scope="col" class="px-6 py-3">
									Overview
								</th>
							</tr>
						</thead>
						<tbody>
							{movies.map((movie) => (
								<tr
									class="border-b border-gray-200 hover:bg-slate-200"
									key={`${movie.name}` + `${movie.budget}`}
								>
									<td scope="row" class="px-6 py-4">
										{movie.name}
									</td>
									<td class="px-6 py-4">{movie.imdbscore}</td>
									<td class="px-6 py-4">{movie.language}</td>
									<td class="px-6 py-4">{movie.countries}</td>
									<td class="px-6 py-4">{movie.genres}</td>
									<td class="px-6 py-4">{movie.overview}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
				{flights.length > 0 && (
					<div class="flex float-right">
						{page > 1 && (
							<button
								class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
								onClick={() => {
									movePage(-1 * page + 1);
								}}
							>
								All Back
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
						)}
						{page > 1 && (
							<button
								class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
								onClick={() => {
									movePage(-1);
								}}
							>
								Back
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
						)}

						{flights.length == 10 && (
							<button
								class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
								onClick={() => {
									movePage(1);
								}}
							>
								Next
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
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default IntTable;
