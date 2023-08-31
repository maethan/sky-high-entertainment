import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
const config = require("../config.json");

const Navbar = () => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [currUser, setCurrUser] = useState("")
	const [currUserInfo, setCurrUserInfo] = useState({})
	const page = window.location.pathname;
	const navigate = useNavigate()

	const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

	useEffect(() => {
		fetch(`http://${config.server_host}:${config.server_port}/get_current_user`, {
			method: "GET",
			credentials: "include",
		})
			.then((res) => res.text())
			.then((resText) => {
				if (resText === "") {
					navigate("/");
				} else {
					setCurrUser(resText);
					fetch(`http://${config.server_host}:${config.server_port}/get_user_info?username=${resText}`, {
						method: "GET",
						credentials: "include",
					}).then((userRes) => userRes.json())
						.then((userResJson) => {
							setCurrUserInfo(userResJson)
						});
				}
			});
	},[])

	const handleLogout = () => {
		fetch(`http://${config.server_host}:${config.server_port}/logout`, {
			method: "POST",
			credentials: "include",
		}).then((res) => {
			if (res.status === 200) {
				toast.success("Logged out!")
				navigate("/");
			}
		});
	};

	return (
		<nav class="bg-white border-gray-200">
			<div class="flex flex-wrap items-center justify-between mx-auto p-6">
				<a href="/" class="flex w-20 scale-[2.25] ml-20">
					<img src="/logo.png" alt="Sky-High Entertainment" />
				</a>
				<div
					class="items-center justify-between hidden w-full md:flex md:w-auto"
					id="mobile-menu-2"
				>
					<ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
						<li>
							<a
								href="/domestic"
								class={`${
									page === "/domestic" ? "text-mainBlue" : "text-gray-900"
								} block rounded hover:text-mainBlue`}
							>
								Domestic
							</a>
						</li>
						<li>
							<a
								href="/international"
								class={`${
									page === "/international" ? "text-mainBlue" : "text-gray-900"
								} block rounded hover:text-mainBlue`}
							>
								International
							</a>
						</li>
						<li>
							<a
								href="/airports"
								class={`${
									page === "/airports" ? "text-mainBlue" : "text-gray-900"
								} block rounded hover:text-mainBlue`}
							>
								Airports
							</a>
						</li>
						<li>
							<a
								href="/movies"
								class={`${
									page === "/movies" ? "text-mainBlue" : "text-gray-900"
								} block rounded hover:text-mainBlue`}
							>
								Movies
							</a>
						</li>
					</ul>
				</div>
				<div className="flex ">
					{currUserInfo.hasOwnProperty("profilePicture") && (
						<>
							<button type="button" onClick={toggleDropdown} class="flex text-sm rounded-full mr-6">
								<img class="w-8 h-8 rounded-full" src={`${currUserInfo.profilePicture}`} alt="user " />
							</button>
							<div class={`${showDropdown ? "opacity-100" : "opacity-0 hidden"} duration-150 absolute right-12 mt-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow`} id="user-dropdown">
								<div class="px-4 py-3">
									<span class="block text-sm text-gray-900 ">{currUser}</span>
								</div>
								<ul class="py-2 w-32" aria-labelledby="user-menu-button">
									<li>
										<a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
									</li>
									<li>
										<div onClick={() => handleLogout()} class="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</div>
									</li>
								</ul>
							</div>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
