import React from "react";
import { useEffect, useState } from "react";

const config = require("../config.json");

// Modal that takes in the flight ID of the clicked flight, and then a method for handling clicks
const FlightModal = ({ flightID, handleClick }) => {
    // States for all attributes of the modal
	const [flightInfo, setFlightInfo] = useState([]);
	const [recommendedMovies, setRecommendedMovies] = useState([]);
	const [genres, setGenres] = useState(["", "", "", "", "", "", ""]);
	const [headers, setHeaders] = useState([]);
	const [test, setTest] = useState("");

    // At most there are 7 total segments in a flight
	const columns = [
		"Flight 1",
		"Layover 1",
		"Flight 2",
		"Layover 2",
		"Flight 3",
		"Layover 3",
		"Flight 4",
	];

    // All genres of movies
	const allGenres = [
		"Mystery",
		"Fantasy",
		"Comedy",
		"History",
		"Foreign",
		"War",
		"Crime",
		"Romance",
		"Horror",
		"Music",
		"Documentary",
		"Science Fiction",
		"Action",
		"Family",
		"Drama",
		"TV Movie",
		"Adventure",
		"Western",
		"Animation",
		"Thriller",
	];
	allGenres.sort();

    // Method for if a user changes the genre of a segment recommendation - simply changes state of genre
	const setGenre = (num, genre) => {
		let temp = genres;
		temp[num] = genre;
		setGenres(temp);
	};

    // Every time a state is updated, requery recommended results and fetch flight information
	useEffect(() => {
		if (flightID) {
			fetch(
				`http://${config.server_host}:${config.server_port}/get_flight?flightID=${flightID}`
			)
				.then((res) => res.json())
				.then((resJson) => {
					setFlightInfo(resJson);
					return resJson;
				})
				.then((restJson) => {
					fetch(
						`http://${config.server_host}:${config.server_port}/get_segment_recommendations?flightID=${flightID}&segments=${restJson[0].Segments}&genre1=${genres[0]}&genre2=${genres[1]}&genre3=${genres[2]}&genre4=${genres[3]}&genre5=${genres[4]}&genre6=${genres[5]}&genre7=${genres[6]}`
					)
						.then((res) => res.json())
						.then((resoJson) => {
							setRecommendedMovies(resoJson);
							setHeaders(
								columns.slice(0, Array.from(Object.entries(resoJson[0])).length)
							);
						});
				});
		}
	}, [flightID]);

    // Reset recommomendations every time a user clicks out of modal
	const resetRecs = () => {
		fetch(
			`http://${config.server_host}:${config.server_port}/get_segment_recommendations?flightID=${flightID}&segments=${flightInfo[0].Segments}&genre1=${genres[0]}&genre2=${genres[1]}&genre3=${genres[2]}&genre4=${genres[3]}&genre5=${genres[4]}&genre6=${genres[5]}&genre7=${genres[6]}`
		)
			.then((res) => res.json())
			.then((resoJson) => {
				setRecommendedMovies(resoJson);
				setHeaders(
					columns.slice(0, Array.from(Object.entries(resoJson[0])).length)
				);
			});
	};

	return (
		<>
			{flightID && (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="relative w-auto my-6 mx-auto max-w-3xl">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
								{/*header*/}
								<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
									<h3 className="text-3xl font-semibold">
										Flight ID: {flightID}
									</h3>
								</div>
								{/*body*/}
								<div className="relative p-6 flex-auto">
									Flight Information:
									<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
										<table class="w-full text-sm text-left text-gray-500">
											<thead class="text-xs text-gray-700 uppercase">
												<tr>
													<th scope="col" class="px-6 py-3 bg-gray-50">
														Airline
													</th>
													<th scope="col" class="px-6 py-3">
														Start
													</th>
													<th scope="col" class="px-6 py-3 bg-gray-50">
														Destination
													</th>
													<th scope="col" class="px-6 py-3">
														Travel Duration (Minutes)
													</th>
													<th scope="col" class="px-6 py-3 bg-gray-50">
														Distance (Miles)
													</th>
													<th scope="col" class="px-6 py-3">
														Basic Economy
													</th>
													<th scope="col" class="px-6 py-3 bg-gray-50">
														Refundable
													</th>
													<th scope="col" class="px-6 py-3">
														Layovers
													</th>
													<th scope="col" class="px-6 py-3 bg-gray-50">
														Total Fare
													</th>
												</tr>
											</thead>

											<tbody>
												{flightInfo[0] && (
													<tr class="border-b border-gray-200">
														<td
															scope="row"
															class="px-6 py-4 whitespace-nowrap bg-gray-50"
														>
															{flightInfo[0].AirlineName}
														</td>
														<td class="px-6 py-4">
															{flightInfo[0].StartingAirport}
														</td>
														<td class="px-6 py-4 bg-gray-50">
															{flightInfo[0].DestinationAirport}
														</td>
														<td class="px-6 py-4">
															{flightInfo[0].TravelDuration}
														</td>
														<td class="px-6 py-4 bg-gray-50">
															{flightInfo[0].TravelDistance}
														</td>
														<td class="px-6 py-4">
															{flightInfo[0].isBasicEconomy.data[0] === 0
																? "No"
																: "Yes"}
														</td>
														<td class="px-6 py-4 bg-gray-50">
															{flightInfo[0].isRefundable.data[0] === 0
																? "No"
																: "Yes"}
														</td>
														<td class="px-6 py-4">{flightInfo[0].Segments}</td>
														<td class="px-6 py-4 bg-gray-50">
															{"$" + flightInfo[0].TotalFare}
														</td>
													</tr>
												)}
											</tbody>
										</table>
									</div>
									<div class="relative overflow-y-auto overflow-auto max-h-96 overflow-x-auto shadow-md sm:rounded-lg">
										Top 10 Recommended Movies:
										<table class="w-full text-sm text-left text-gray-500">
											<thead class="text-xs text-gray-700 uppercase">
												<tr>
													{headers &&
														headers.map((col, i) => (
															<th scope="col" class="px-6 py-3 bg-gray-50">
																{col}
																<div>
																	<select
																		id={"select" + i}
																		onChange={(e) => {
																			setGenre(i, e.target.value);
																			setTest(e.target);
																			resetRecs();
																		}}
																	>
																		<option value="">Genre:</option>
																		{allGenres.map((genre) => (
																			<option value={genre}>{genre}</option>
																		))}
																	</select>
																</div>
															</th>
														))}
												</tr>
											</thead>

											<tbody>
												{recommendedMovies &&
													recommendedMovies.map((rec, i) => (
														<tr class="border-b border-gray-200" key={i}>
															{rec.first && (
																<td class="px-6 py-4 bg-gray-50">
																	{rec.first}
																</td>
															)}
															{rec.second && (
																<td class="px-6 py-4">{rec.second}</td>
															)}
															{rec.third && (
																<td class="px-6 py-4 bg-gray-50">
																	{rec.third}
																</td>
															)}
															{rec.fourth && (
																<td class="px-6 py-4">{rec.fourth}</td>
															)}
															{rec.fifth && (
																<td class="px-6 py-4 bg-gray-50">
																	{rec.fifth}
																</td>
															)}
															{rec.sixth && (
																<td class="px-6 py-4">{rec.sixth}</td>
															)}
															{rec.seventh && (
																<td class="px-6 py-4 bg-gray-50">
																	{rec.seventh}
																</td>
															)}
														</tr>
													))}
											</tbody>
										</table>
									</div>
								</div>
								{/*footer*/}
								<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
									<button
										className="bg-blue-700 text-white hover:bg-blue-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => {
											handleClick(null);
											setFlightInfo([]);
											setRecommendedMovies([]);
											setGenres(["", "", "", "", "", "", ""]);
										}}
									>
										Done
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			)}
		</>
	);
};

export default FlightModal;
