import { useEffect, useState } from "react";
import FlightModal from "../components/FlightModal";
import Navbar from "./Navbar";

const config = require("../config.json");

const Home = () => {
	const [flightSearch, setFlightSearch] = useState([]);
	const [selectedFlightID, setFlightID] = useState(null);
	const [mediocre, setMediocre] = useState([]);

	// useEffect(() => {
	// 	fetch(`http://${config.server_host}:${config.server_port}/get_phl_flights`)
	// 		.then((res) => res.json())
	// 		.then((resJson) => {
	// 			setFlightSearch(resJson);
	// 		});

	// 	fetch(`http://${config.server_host}:${config.server_port}/mediocre_movies`)
	// 		.then((res) => res.json())
	// 		.then((resJson) => {
	// 			setMediocre(resJson);
	// 		});
	// }, []);

	const handleClick = (num) => {
		setFlightID(num);
	};

	return (
		<>
			<div className="relative overflow-hidden bg-white">
				<div className="mx-auto max-w-7xl">
					<div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
						<svg
							className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white lg:block"
							fill="currentColor"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
							aria-hidden="true"
						>
							<polygon points="50,0 100,0 50,100 0,100" />
						</svg>

						<main className="mx-auto mt-10 max-w-7xl px-6 sm:mt-12 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
							<div className="sm:text-center lg:text-left">
								<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-5xl">
									<span className="block">Sky-High Entertainment:</span>{" "}
									<span className="block text-mainBlue">
										Find Your Perfect Flight and In-Flight Movie
									</span>
								</h1>
								<p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg font-light md:mt-5 lg:mx-0">
									Welcome to Sky-High Entertainment, your ultimate flight
									companion! Our app recommends flights that match your
									preferences and also suggests the perfect movie to watch
									during your journey. Elevate your travel experience with
									customized flight recommendations and curated movie
									suggestions, tailored to your unique tastes. Travel in comfort
									and style with Sky-High Entertainment.
								</p>
								<div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
									<div className="rounded-md shadow">
										<a
											href="/login"
											className="flex w-full items-center justify-center rounded-md border border-transparent bg-mainBlue px-8 py-3 text-base font-medium text-white hover:bg-darkBlue md:py-4 md:px-10 md:text-lg"
										>
											Login
										</a>
									</div>
									<div className="mt-3 sm:mt-0 sm:ml-3">
										<a
											href="/signup"
											className="flex w-full items-center justify-center rounded-md border border-transparent bg-mainPeach px-8 py-3 text-base font-medium text-white hover:bg-darkPeach md:py-4 md:px-10 md:text-lg"
										>
											Signup
										</a>
									</div>
								</div>
							</div>
						</main>
					</div>
				</div>
				<div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
					<img
						className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
						src="/personwatchingmovie.jpg"
						alt=""
					/>
				</div>
			</div>
			<div className="m-12">
				<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-xl md:text-3xl">
					Recommended Cheap Trips from Philadelphia
				</h1>
				<ul
					role="list"
					className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8"
				>
					{flightSearch.map((item) => (
						<li
							className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow cursor-pointer hover:bg-gray-50"
							onClick={() => handleClick(item.FlightID)}
						>
							<div className="flex w-full items-center justify-between space-x-6 p-6">
								<div className="flex-1 truncate">
									<div className="flex items-center space-x-3">
										<h3 className="truncate text-sm font-medium text-gray-900">
											{item.City}
										</h3>
										<span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
											Nonstop
										</span>
									</div>
									<p className="mt-1 truncate text-sm text-gray-500">
										{item.AirlineName}
									</p>
								</div>
							</div>
							<div>
								<div className="-mt-px flex divide-x divide-gray-200">
									<div className="flex w-0 flex-1">
										<div
											href="/"
											className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700"
										>
											<span className="ml-3">
												{Math.floor(item.TravelDuration / 60)} hr{" "}
												{item.TravelDuration % 60} min
											</span>
										</div>
									</div>
									<div className="-ml-px flex w-0 flex-1">
										<div
											href="/"
											className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700"
										>
											<span className="ml-3">${item.LowestFare}</span>
										</div>
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
			<div className="m-12">
				<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-xl md:text-3xl">
					Cheap Flight + Mediocre Movie Recommendations
				</h1>
				{mediocre.map((item) => (
					<div
						className="flex flex-col items-center justify-center"
						onClick={() => handleClick(item.flight)}
					>
						{item.flight}, {item.newname}
					</div>
				))}
			</div>
			<FlightModal flightID={selectedFlightID} handleClick={handleClick} />
		</>
	);
};

export default Home;
