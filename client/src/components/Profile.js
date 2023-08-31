import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { TextField } from "@mui/material";
import Navbar from './Navbar';
const config = require("../config.json");

const Profile = () => {
  const [currUserInfo, setCurrUserInfo] = useState({})
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [oldImageUrl, setOldImageUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const navigate = useNavigate();

  const handleChangeProfilePicture = () => {
    setShowProfileModal(!showProfileModal)
  }

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/get_current_user`, {
      method: "GET",
      credentials : 'include',
    }).then((res) => res.text())
      .then((resText) => {
        if (!resText) {
          navigate("/");
        } else {
          fetch(`http://${config.server_host}:${config.server_port}/get_user_info?username=${resText}`, {
            method: "GET",
            credentials : 'include',
          }).then((userRes) => userRes.json())
            .then((userResJson) => {
              setCurrUserInfo(userResJson)
              setOldImageUrl(userResJson.profilePicture)
            } 
          );
        }
    });
  }, []);

  const handleChangeUrl = () => {
    if (imageUrl.length > 0) {
      fetch(`http://${config.server_host}:${config.server_port}/update_profile_picture?username=${currUserInfo.username}&profilePicture=${imageUrl}`, {
        method: "POST",
        credentials : 'include',
      }).then((res) => res.text())
        .then((resText) => {
          setOldImageUrl(imageUrl)
          setImageUrl("")
          toast.success("Profile picture updated!")
      });
    } else {
      toast.error("Image URL must be filled")
    }
  }

  return (
    <>
    	<div className="sticky top-0 z-40">
        <Navbar />
      </div>
      <div className="w-fit mx-auto mt-4">
        <img onClick={() => handleChangeProfilePicture()} className="w-44 h-44 object-cover rounded-full hover:opacity-50 cursor-pointer" src={oldImageUrl}/>
      </div>
      <div className="text-center text-3xl font-semibold pt-2">{currUserInfo.username}</div>
      <div>
        <div>
          <div className="text-xl font-semibold ml-4">Favorite Movies</div>
            <div className="overflow-auto w-[96vw] py-2 mx-auto flex">
            {
              currUserInfo?.favoriteMovies?.map((movie) => {
                return (
                  <>
                    <div class="w-[28vw] bg-white border hover:scale-105 duration-150 border-gray-200 rounded-lg shadow m-2">
                      <img class="rounded-t h-[26vh] w-full" src={`https://image.tmdb.org/t/p/original/${movie.poster}`} alt="" />
                      <div class="px-4 py-2">
                        <h5 class="text-base hover:text-gray-600  font-semibold tracking-tight text-gray-900">{movie.name}</h5>
                        <div class="flex items-center py-1">
                          <svg aria-hidden="true" class={`w-5 h-5 ${movie.imdbScore >= 1 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          <svg aria-hidden="true" class={`w-5 h-5 ${movie.imdbScore >= 3 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          <svg aria-hidden="true" class={`w-5 h-5 ${movie.imdbScore >= 5 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          <svg aria-hidden="true" class={`w-5 h-5 ${movie.imdbScore >= 7 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          <svg aria-hidden="true" class={`w-5 h-5 ${movie.imdbScore >= 9 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          <p class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{movie?.imdbScore}/10</p>
                        </div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Runtime: {movie?.runtime}</p>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Budget: {movie?.budget}</p>
                      </div>
                    </div>
                  </>
                )
              })
            }
          </div>
        </div>
        <div>
          <div className="text-xl font-semibold ml-4 mb-2 mt-2">Favorite Airports</div>
          <div className="overflow-auto w-[96vw] mx-auto flex mb-8">
            {
              currUserInfo?.favoriteAirports?.map((airport) => {
                return (
                  <>
                    <div className="border border-1 w-[20vw] mr-4 rounded-sm py-2 px-4">
                      <div className="flex">
                        <span className="font-bold">{airport.airportCountry}</span> • {airport.airportCode}
                      </div>
                      <div>{airport.airportName}</div>
                    </div>
                  </>
                )
              })
            }
          </div>
        </div>
      </div>
      {showProfileModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="text-center w-full text-xl p-5 border-b border-solid border-slate-200 rounded-t">
                  Update Profile Picture
                </div>
                <div className="relative p-6 flex-auto">
                  <TextField
                    className="w-[24vw]"
                    color="primary"
                    id="outlined-required"
                    variant="outlined"
                    label="Image URL"
                    defaultValue=""
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {handleChangeUrl(); setShowProfileModal(false)}}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  )
}

export default Profile;
