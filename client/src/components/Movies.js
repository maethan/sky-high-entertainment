import React, { useEffect, useRef, useState } from 'react';
import { Slider } from '@mui/material';
import toast from 'react-hot-toast';
import Navbar from './Navbar';
const config = require('../config.json');

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState("");
  const [imdbScore, setimdbScore] = useState([0, 10]);
  const [budget, setBudget] = useState([0, 380000000]);
  const [runtime, setRuntime] = useState([0, 705]);
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("");
  const [company, setCompany] = useState("");
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");
  const [movieInModal, setMovieInModal] = useState({});
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [currentUserMovies, setCurrentUserMovies] = useState([])
  const page = useRef(0);

  const allLanguages = [
    "en","es","fr","it","ru","cs","ko","pl","de","ja","nl","te","sv","zh","hi","cn","no","is","ro","th","ab",
    "et","fi","el","ta","pt","ur","fa","da","tr","nb","xx","sl","pa","sr","sh","hu","lv","bn","uk","sq","he",
    "ml","mr","ar","ay","ms","ka","id","hr","bg","mk","bm","tl","ku","vi","ca","sk","uz","wo","lo","gl","bs",
    "fy","lt","eu","am","cy","eo","kk","qu","kn","iu","ne","bo","rw","jv","ps","ky","af","la","mt","hy","mn",
    "si","sm","lb","tg","zu",
  ]

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/getMovies?page=${page.current}&limit=15`)
    .then(res => res.json())
    .then(resJson => {
      setMovies(resJson)
      fetch(`http://${config.server_host}:${config.server_port}/get_current_user_movies`,{
        method: 'GET',
        credentials: 'include',
      })
      .then(res => res.json())
      .then(resJson => {
        setCurrentUserMovies(resJson)
      })
    })
  }, []);

  const toggleFilter = () => {
    setShowFilters(!showFilters);
  }

  const movieSearch = () => {
    page.current = 0;
    let genre1 = ""
    let genre2 = ""
    let genre3 = ""

    if (genres.length === 1) {
      genre1 = genres[0]
    }
    if (genres.length === 2) {
      genre1 = genres[0]
      genre2 = genres[1]
    }
    if (genres.length === 3) {
      genre1 = genres[0]
      genre2 = genres[1]
      genre3 = genres[2]
    }


    fetch(`http://${config.server_host}:${config.server_port}/movie_search?&minImdbScore=${imdbScore[0]}&maxImdbScore=${imdbScore[1]}&name=${filter}&minBudget=${budget[0] * 1000000}&maxBudget=${budget[1] * 1000000}&language=${language}&minRuntime=${runtime[0]}&maxRuntime=${runtime[1]}&page=${page.current + 1}&company=${company}&countries=${country}&genre1=${genre1}&genre2=${genre2}&genre3=${genre3}
    `)
    .then(res => res.json())
    .then(resJson => {
      page.current = 1;
      setMovies(resJson)
    })
  }

  const keyPress = (e) => {
    if (e.key === "Enter") {
      movieSearch()
    }
  }

  const loadMore = () => {
    page.current = page.current + 1;
    fetch(`http://${config.server_host}:${config.server_port}/movie_search?&minImdbScore=${imdbScore[0]}&maxImdbScore=${imdbScore[1]}&name=${filter}&minBudget=${budget[0] * 1000000}&maxBudget=${budget[1] * 1000000}&language=${language}&minRuntime=${runtime[0]}&maxRuntime=${runtime[1]}&page=${page.current + 1}&company=${company}&countries=${country}
    `)
    .then(res => res.json())
    .then(resJson => {
      if (resJson.length === 0) {
        toast.error("No more movies to load")
        return
      } else {
        const moviesCopy = [...resJson]
        setMovies(movies.concat(moviesCopy))
      }
    })
  }

  const addGenre = () => {
    document.getElementById('genres').value = ""
    if (genres.length === 3) {
      toast.error("You can only add 3 genres")
      return
    } else {
      if (genre === "") {
        toast.error("Genre cannot be empty")
        return
      } else if (genres.includes(genre)) {
        toast.error("Genre already added")
        return
      } else {
        setGenres([...genres, genre])
        setGenre("")
      }
    }
  }

  const genreEnter = (e) => {
    if (e.key === "Enter") {
      addGenre()
    }
  }

  const removeGenre = (e) => {
    const index = genres.indexOf(e)
    if (index > -1) {
      genres.splice(index, 1)
      setGenres([...genres])
    }
  }

  const addFavoriteMovie = (movie) => {
    fetch(`http://${config.server_host}:${config.server_port}/add_favorite_movie?name=${movie.name}&poster=${movie.poster}&runtime=${movie.runtime}&budget=${movie.budget}&imdbScore=${movie.imdbScore}`, {
      method: 'POST',
      credentials: 'include',
    })
    .then(res => res.json())
    .then(resJson => {
      console.log(resJson)
      setCurrentUserMovies(resJson.favoriteMovies)
    })
  }

  const removeFavoriteMovie = (movie) => {
    fetch(`http://${config.server_host}:${config.server_port}/remove_favorite_movie?name=${movie.name}`, {
      method: 'POST',
      credentials: 'include',
    })
    .then(res => res.json())
    .then(resJson => {
      setCurrentUserMovies(resJson.favoriteMovies)
    })
  }

  return (
    <>
    	<div className="sticky top-0 z-40">
        <Navbar />
      </div>
      <div className="px-32 pt-4">
        <div class="flex items-center mx-auto w-fit mb-4">
          <div class="relative w-fit">
            <input onKeyPress={(e) => keyPress(e)} id="filter" onChange={(e) => setFilter(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5" placeholder="Search Movies"/>
            <button type="button" onClick={() => toggleFilter()} class="absolute inset-y-0 right-0 hover:opacity-60 duration-100 flex items-center pr-3">
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{"display":"block", "height":14, "width":14, "fill":"currentColor"}} aria-hidden="true" role="presentation" focusable="false"><path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path></svg>
            </button>
          </div>
          <button type="button" onClick={() => movieSearch()} class="z-10 active:scale-95 duration-100 inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 ">
            <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>
        {
          showFilters && (
            <div className="mx-24 p-4 mb-4 border border-1 border-gray-300 rounded-lg">
              <div className="flex ">
                <div className="pr-2 w-[30%] mx-auto">
                  <div>imdb Score</div>
                  <Slider
                    value={imdbScore}
                    min={0}
                    max={10}
                    step={0.1}
                    onChange={(e, newValue) => setimdbScore(newValue)}
                    valueLabelDisplay='auto'
                    valueLabelFormat={value => <div>{value}</div>}
                  />
                </div>
                <div className="pl-2 pr-2 w-[30%] mx-auto">
                  <div>Budget (in millions)</div>
                  <Slider
                    value={budget}
                    min={0}
                    max={380}
                    step={1}
                    onChange={(e, newValue) => setBudget(newValue)}
                    valueLabelDisplay='auto'
                    valueLabelFormat={value => <div>{value}</div>}
                  />
                </div>
                <div className="pl-2 w-[30%] mx-auto">
                  <div>Runtime</div>
                  <Slider
                    value={runtime}
                    min={0}
                    max={705}
                    step={10}
                    onChange={(e, newValue) => setRuntime(newValue)}
                    valueLabelDisplay='auto'
                    valueLabelFormat={value => <div>{value}</div>}
                  />
                </div>
              </div>
              <div className="flex my-2">
                <div className="w-[48%] mx-auto">
                  <div>Country</div>
                  <input type="text" id="filter" onChange={(e) => setCountry(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5" placeholder="Search Country"/>
                </div>
                <div className="w-[48%] mx-auto">
                  <div>Company</div>
                  <input type="text" id="filter" onChange={(e) => setCompany(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5" placeholder="Search Company"/>
                </div>
              </div>
              <div className="flex my-3">
                <div className="w-[48%] mx-auto">
                  <div>Genres (up to 3)</div>
                  <div className="flex">
                    <input type="text" id="genres" onKeyPress={(e) => genreEnter(e)} onChange={(e) => setGenre(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5" placeholder="Add Genres"/>
                    <button type="button" onClick={() => addGenre()} class="z-10 active:scale-95 duration-100 inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 ">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="flex mt-3">
                  {
                    genres.map((genre) => (
                      <div className="bg-blue-600 py-1 px-2 mr-2 rounded-lg text-gray-100 flex">
                        {genre}
                        <button type="button" className="hover:text-gray-700" onClick={() => removeGenre(genre)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-slash-circle ml-2 mt-auto mb-auto" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z"/>
                          </svg>
                        </button>
                      </div>
                    )
                  )}
                  </div>
                </div>
                <div className="w-[48%] mx-auto mt-2">
                  <div>Language</div>
                  <div className="flex w-fit">
                    {
                      allLanguages.slice(0, 5).map((lang) => {
                        return (
                          <div class="flex items-center mr-4">
                            <button type="button" onClick={() => setLanguage(lang)} class={`${language === lang ? "bg-blue-600" : "bg-gray-300"} duration-150 w-4 h-4 text-blue-600 rounded`}>
                              { language === lang && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-check" viewBox="0 0 16 16">
                                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                </svg>
                              )}
                            </button>
                            <div className="ml-2 text-sm font-medium text-gray-900 ">{lang}</div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          )
        }
        <div className="grid grid-cols-5">
          {
            movies?.map((movie, index) => (
              <div onClick={() => {setMovieInModal(movie); setShowMovieModal(true)}} class="cursor-pointer max-w-sm bg-white border hover:scale-105 duration-150 border-gray-200 rounded-lg shadow m-2">
                <img class="rounded-t h-[30vh] w-full" src={`https://image.tmdb.org/t/p/original/${movie.poster}`} alt="" />
                <div class="px-4 py-2">
                  <h5 class="text-base hover:text-gray-600  w-fit font-semibold tracking-tight text-gray-900">{movie.name}</h5>
                  <div class="flex items-center py-1">
                    <svg aria-hidden="true" class={`w-5 h-5 ${movie.imdbScore >= 1 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" class={`w-5 h-5 ${movie.imdbScore >= 3 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" class={`w-5 h-5 ${movie.imdbScore >= 5 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" class={`w-5 h-5 ${movie.imdbScore >= 7 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" class={`w-5 h-5 ${movie.imdbScore >= 9 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <p class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{movie.imdbScore.toFixed(1)}/10</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <div className="w-fit mx-auto">
          <button type="button" onClick={() => loadMore()} class="mt-2 mb-10 ml-auto text-center text-white w-[20vw] bg-blue-500 hover:bg-blue-400 duration-150 hover:scale-105 active:scale-95 font-medium rounded-lg py-2.5">
              Load More
          </button>
        </div>
        {showMovieModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto mx-auto max-w-3xl">
                <div className="border-0 rounded shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex">
                    <div className="w-[18vw]">
                      <div className="text-center w-full text-xl py-3 px-2 rounded-t">
                        <a rel="noreferrer" target="_blank" className="hover:opacity-75" href={`https://www.imdb.com/title/${movieInModal.imdbID}`}>
                          {movieInModal.name}
                        </a>
                      </div>
                      <div className="mx-auto w-fit">
                        <img class="rounded h-[28vh] w-[14vw]" src={`https://image.tmdb.org/t/p/original/${movieInModal.poster}`} alt="" />
                      </div>
                      <div class="flex items-center py-1 mx-auto w-fit pt-2">
                        <svg aria-hidden="true" class={`w-5 h-5 ${movieInModal.imdbScore >= 1 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class={`w-5 h-5 ${movieInModal.imdbScore >= 3 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class={`w-5 h-5 ${movieInModal.imdbScore >= 5 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class={`w-5 h-5 ${movieInModal.imdbScore >= 7 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class={`w-5 h-5 ${movieInModal.imdbScore >= 9 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <p class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{movieInModal.imdbScore.toFixed(1)}/10</p>
                      </div>
                        {showMovieModal && !currentUserMovies.some(e => e.name ===  movieInModal.name) && (
                          <div onClick={() => addFavoriteMovie(movieInModal)} className="mx-auto w-fit mt-2 mb-2 hover:text-blue-600 hover:scale-105 cursor-pointer duration-150">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-bookmark-plus" viewBox="0 0 16 16">
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z"/>
                              </svg>  
                          </div>
                        )}
                        {showMovieModal && currentUserMovies.some(e => e.name === movieInModal.name) && (
                          <div onClick={() => removeFavoriteMovie(movieInModal)} className="mx-auto w-fit mt-2 mb-2 hover:text-blue-600 hover:scale-95 cursor-pointer duration-150">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-bookmark-x-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zM6.854 5.146a.5.5 0 1 0-.708.708L7.293 7 6.146 8.146a.5.5 0 1 0 .708.708L8 7.707l1.146 1.147a.5.5 0 1 0 .708-.708L8.707 7l1.147-1.146a.5.5 0 0 0-.708-.708L8 6.293 6.854 5.146z"/>
                              </svg> 
                          </div>
                        )}
                    </div>
                    <div className="w-[30vw]">
                      <div className="ml-auto cursor-pointer hover:opacity-50 w-fit pr-2 pt-2">
                        <svg onClick={() => {setShowMovieModal(false)}} className="ml-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                      </div>
                      <div className="relative pt-4 mb-4 pr-4">
                        <div>
                          Summary: {movieInModal.overview}
                        </div>
                        <div>
                          Budget: {movieInModal.budget}
                        </div>
                        <div>
                          Languages: {movieInModal.language}
                        </div>
                        <div>
                          Runtime: {movieInModal.runtime}
                        </div>
                        <div>
                          Companies: {movieInModal.companies}
                        </div>
                        <div>
                          Countries: {movieInModal.countries}
                        </div>
                        <div>
                          Genres: {movieInModal.genres}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </>
  )
}

export default Movies;