const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");
const movieResult = document.getElementById("movieResult");

const API_KEY = "YOUR_API_KEY";

searchBtn.addEventListener("click", searchMovie);

movieInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchMovie();
    }

});

async function searchMovie() {

    const movieName = movieInput.value.trim();

    if (movieName === "") {

        movieResult.innerHTML = `
            <div class="error">
                Please enter a movie name.
            </div>
        `;

        return;
    }

    try {

        movieResult.innerHTML = `
            <div class="loading">
                🎬 Searching for "${movieName}"...
            </div>
        `;

        searchBtn.disabled = true;
        searchBtn.textContent = "Searching...";

        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(movieName)}`
        );

        if (!response.ok) {
            throw new Error("Unable to connect to the movie service.");
        }

        const data = await response.json();

        if (data.Response === "False") {
            throw new Error(data.Error || "Movie not found.");
        }

        displayMovie(data);

    } catch (error) {

        movieResult.innerHTML = `
            <div class="error">
                ❌ ${error.message}
            </div>
        `;

    } finally {

        searchBtn.disabled = false;
        searchBtn.textContent = "Search";

    }

}

function displayMovie(data) {

    const poster =
        data.Poster !== "N/A"
            ? data.Poster
            : "https://placehold.co/300x450?text=No+Poster";

    movieResult.innerHTML = `

        <div class="movie-card">

            <div>
                <img
                    class="poster"
                    src="${poster}"
                    alt="${data.Title} poster"
                >
            </div>

            <div class="movie-info">

                <h2>${data.Title}</h2>

                <p class="year">
                    ${data.Year} • ${data.Rated} • ${data.Runtime}
                </p>

                <div class="rating">
                    <span>⭐ ${data.imdbRating}</span> / 10
                </div>

                <div class="details">
                    <span>${data.Genre}</span>
                    <span>🌍 ${data.Country}</span>
                    <span>🗣️ ${data.Language}</span>
                </div>

                <p class="plot">
                    ${data.Plot}
                </p>

                <div class="extra-info">

                    <p>
                        <strong>Director:</strong>
                        ${data.Director}
                    </p>

                    <p>
                        <strong>Actors:</strong>
                        ${data.Actors}
                    </p>

                    <p>
                        <strong>Writer:</strong>
                        ${data.Writer}
                    </p>

                    <p>
                        <strong>Awards:</strong>
                        ${data.Awards}
                    </p>

                    <p>
                        <strong>Box Office:</strong>
                        ${data.BoxOffice || "N/A"}
                    </p>

                </div>

            </div>

        </div>
    `;
}