const inputField = document.getElementById("input-field")
const searchButton = document.getElementById("search-button")
const resultsContainer = document.getElementById("results")
const addToWatchList = document.getElementsByClassName("addToWatchList")

searchButton.addEventListener("click", searchMovies)

function searchMovies() {
    resultsContainer.innerHTML = "Loading movies..."
    fetch(`https://www.omdbapi.com/?apikey=324df79f&s=${inputField.value}`)
    .then(res => {
      if (!res.ok) {
          throw new Error("Data not available right now")
      }  
      return res.json()
    })
    .then(data => {
        if (!data.Search) {
            getMovies(false)
        } else {
            getMovies(data.Search)
        }
    })
    .catch(error => console.log(error))
}

function getMovies(results) {
    let dataForMainContainer = ""
    if (results) {
        // render results in results container
        addSynopsisToMovies(results)
    } else {
        dataForMainContainer = `<p class="no-movies-found-message">Unable to find what you’re looking for. Please try another search.</p>`
        resultsContainer.innerHTML = dataForMainContainer
    }
}

async function addSynopsisToMovies(results) {
    let resultsWithSynopsis = []
    for (let i = 0; i<results.length; i++) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=324df79f&i=${results[i].imdbID}`)
        const data = await res.json()
        resultsWithSynopsis.push(data)
    }   

    renderMovies(resultsWithSynopsis)
}

function renderMovies(movies) {
    resultsContainer.innerHTML = ""
    const newMovies = [...movies]
    const moviesObjectDataForTemplate = []
    let htmlOfMoviesForMainContainer = []
    for(let i = 0; i<newMovies.length; i++) {
        const movieData = {
            Poster: newMovies[i].Poster,
            Title: newMovies[i].Title,
            Value: newMovies[i].Ratings[0].Value,
            Runtime: newMovies[i].Runtime,
            Genre: newMovies[i].Genre,
            Plot: newMovies[i].Plot,
        }
        htmlOfMoviesForMainContainer.push(createMovieTemplate(movieData, true))
        moviesObjectDataForTemplate.push(movieData)
    }
    
    function createMovieTemplate(movie, isAddToWatchlistButton) {
        return (
            `
            <div class="movie-container">
                <div class="image-container">
                    <img src="${movie.Poster === "N/A" ? "noimage.jpg" : movie.Poster}"/>
                </div>
                <div class="movie-data">
                    <div class="movie-title-container">
                        <h2>${movie.Title}</h2>
                        <span>⭐</span>
                        <p>${movie.Value}</p>                
                    </div>
                    <div class="movie-info-container">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <div class="watchlist">
                            <div class="${isAddToWatchlistButton ? "addToWatchList add" : "removeFromWatchList remove"}"></div>
                            <p>Watchlist</p>
                        </div>
                    </div>
                    <p class="movie-plot">${movie.Plot}</p>                
                </div>
            </div>
            <hr/>
        `
        )
    }
    
    htmlOfMoviesForMainContainer.map(movie => resultsContainer.innerHTML += movie)
        
    Object.values(addToWatchList).map((movie, inx) => {
        movie.addEventListener("click", () => {
            confirmationMessageAnimation()
            localStorage.setItem("watchlist", JSON.stringify([createMovieTemplate(moviesObjectDataForTemplate[inx], false), ...JSON.parse(localStorage.getItem("watchlist")) || []]))
        })
    })  
    
    function confirmationMessageAnimation() {
        const movieAddedConfirmation = document.createElement("p")
            movieAddedConfirmation.classList.add("confirmation")
            movieAddedConfirmation.textContent = "Added!"
            document.body.appendChild(movieAddedConfirmation)
            setTimeout(() => {
                movieAddedConfirmation.remove()
            }, 400)
    }
}