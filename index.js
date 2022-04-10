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


function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }
  
  const movies = ["Star Wars","Captain Marvel","Matrix","Man on Fire"];
  
  autocomplete(document.getElementById("input-field"), movies);