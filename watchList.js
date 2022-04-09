const resultsContainer = document.getElementById("results")
const removeFromWatchList = document.getElementsByClassName("removeFromWatchList")
const currentLocalStorage = JSON.parse(localStorage.getItem("watchlist"))

renderLocalStorage(currentLocalStorage)

function renderLocalStorage(movies) {
    const NOMOVIESTEMPLATE = `
            <div class="placeholder">
                <p>Your watchlist is looking a little empty...</>
                <div class="placeholder-link">
                    <a href="index.html"><div></div></a>
                    <p>Let’s add some movies!</p>
                </div>
            </div>
        `
    resultsContainer.innerHTML = ""
    if (movies) {
        if(movies.length > 0) {
            movies.map(movie => resultsContainer.innerHTML += movie) 
        } else {
            resultsContainer.innerHTML = NOMOVIESTEMPLATE
        }
    } else {
        resultsContainer.innerHTML = NOMOVIESTEMPLATE
    }
    
    addEvents()
}

function addEvents() {    
    Object.values(removeFromWatchList).map((movie, inx) => movie.addEventListener("click", () => {
    confirmationMessageAnimation()
    const newarr = JSON.parse(localStorage.getItem("watchlist")).filter((movie2, inx2) => inx !== inx2)
    localStorage.setItem("watchlist", JSON.stringify(newarr))
    renderLocalStorage(JSON.parse(localStorage.getItem("watchlist")))
    }))
    
     function confirmationMessageAnimation() {
        const movieAddedConfirmation = document.createElement("p")
            movieAddedConfirmation.classList.add("confirmation")
            movieAddedConfirmation.textContent = "Removed!"
            document.body.appendChild(movieAddedConfirmation)
            setTimeout(() => {
                movieAddedConfirmation.remove()
            }, 400)
    }
}