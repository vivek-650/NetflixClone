//variable

const apikey = "68245556cb7f1065539728b56c3b5f5b";
const baseurl = "https://api.themoviedb.org/3";
const imgpath = "https://images.tmdb.org/t/p/original";
// const ytapi = "AIzaSyA_MjLdy64e44UY9p9BZIBPxPZ_yn_IOEM";
const apipath = {
    
    fetchAllCategories: `${baseurl}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) =>`${baseurl}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending: `${baseurl}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYt: (query)=> `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyBuLfwK6uP-OdqmWxA3fyRl3wmc1m0IAjs`

}


// boot of the app

function init() {
    fetchTrendingMovies();
    fetchandbuildAllsection();
    function fetchTrendingMovies(){
        fetchAndbuildMoviesSection(apipath.fetchTrending,'Trending Now')
        .then(list=>{
            const randomIndex = parseInt(Math.random() * list.length);
            buildBannerSection(list[randomIndex]);
        }).catch(err =>{
            console.error(err);
        });

    }
}

function buildBannerSection(movie){
    const bannerCont=document.getElementById('banner');
    bannerCont.style.backgroundImage = `url('${imgpath}${movie.backdrop_path}')`;

    const div = document.createElement('div');
    div.innerHTML = `
            <h2 class="banner-title">${movie.title}</h2>
            <h5 class="banner-title2">Trending in movies | Released - ${movie.release_date} </h5>
            <p class="banner-dis">${movie.overview && movie.overview.length > 150 ? movie.overview.slice(0,150).trim()+ '...':movie.overview}</p>
            <div class="banner-buttons">
                <button class="play-button"><i class='bx bx-play'></i>Play</button>
                <button class="more-button"><i class='bx bx-info-circle' ></i>More Info</button>
            </div>
        `;
    div.className = "banner";
    bannerCont.append(div);
}

function fetchandbuildAllsection(){
    fetch(apipath.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if(Array.isArray(categories) && categories.length){
            categories.forEach(category => {
                fetchAndbuildMoviesSection(
                    apipath.fetchMoviesList(category.id),
                    category.name
                ); 
            });
        }
        // console.table(movies);
    })
    .catch(err => console.error(err));
}
function fetchAndbuildMoviesSection(fetchurl, categoryName){
    console.log(fetchurl, categoryName);
    return fetch(fetchurl)
    .then(res => res.json())
    .then(res => {
        console.table(res.results);

        const movies = res.results;
        if(Array.isArray(movies) && movies.length){
            buildMoviesSection(movies,categoryName);
        }
        return movies;
    })
    .catch(err => console.error(err))
}

function buildMoviesSection(list, categoryName){
    console.log(list, categoryName);

    const moviescont= document.getElementById('movies-container');
    const moviesHTML=list.map(item =>{
        return `
        <div class="movie-card">
            <img class="movies-item" src="${imgpath}${item.backdrop_path}" onclick="searchMovieTrailer('${item.title}')">
            <img class="movies-ite" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Netflix_2015_N_logo.svg/330px-Netflix_2015_N_logo.svg.png?20221130064001">
            <div class="movie-title">
                <p class="t">${item.title}</p>
            </div>
        </div>
        `;
    }).join('');

    const moviesSectionHTML = `
    <div class="movies-section">
        <h2 class="movies-section-heading">${categoryName}<span class="explore-nudeg">Explore more ></span></h2>
        <div class="movies-row">
            ${moviesHTML}
        </div>
    </div>
    `
    console.log(moviesSectionHTML);

    const div = document.createElement('div');
    div.className = "movies-section"
    div.innerHTML = moviesSectionHTML;

    moviescont.append(div);
}
function searchMovieTrailer(movieName){
    if(!movieName) return;

    fetch(apipath.searchOnYt(movieName))
    .then(res => res.json())
    .then(res =>{
        const bestResult = res.items[0];
        const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`
        console.log(youtubeUrl);
        window.open(youtubeUrl,'_blank');

    })
    .catch(err => console.log(err));
}
window.addEventListener('load',function() {

    init();


    window.addEventListener('scroll', function(){

        const header = document.getElementById('header');
        if(window.scrollY >= 8) header.classList.add('black')
        else header.classList.remove('black');
    })
})
