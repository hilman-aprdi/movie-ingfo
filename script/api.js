

// bad code ಥ_ಥ
// by @imhilman_

// TMDB 
const BASE_URL = 'https://api.themoviedb.org/3/',
      API_KEY = 'api_key=2d13c03c2a126542089965b267a2c45d',
      DETAILS_URL = BASE_URL + 'movie/253406?' + API_KEY,
      TRENDING_URL = BASE_URL + 'trending/movie/week?' + API_KEY,
      DISCOVER_URL = BASE_URL + 'discover/movie?' + API_KEY,
      SEARCH_URL = BASE_URL + 'search/movie?' + API_KEY + '&query=',
      GENRE_URL = BASE_URL + 'genre/movie/list?' + API_KEY,
      ACTION_URL = BASE_URL + 'discover/movie?' + API_KEY + '&with_genres=28&page=14',
      ANIMATION_URL = BASE_URL + 'discover/movie?' + API_KEY + '&with_genres=16&page=2',
      HOROR_URL = BASE_URL + 'discover/movie?' + API_KEY + '&with_genres=27&page=3',
      IMG_URL = 'https://image.tmdb.org/t/p/w500/';
  
  
// selectors 
let searchRes = document.querySelector(".search-result"),
    keyword = document.querySelector(".k-word"),
    trending = document.querySelector(".trending"),
    action = document.querySelector(".action"),
    animation = document.querySelector(".animation"),
    horor = document.querySelector(".horor"),
    discover = document.querySelector(".discovery"),
    pages = document.querySelector(".pagination");


async function getSearch() {
  let hstory = JSON.parse(localStorage.getItem("history")) || [] ;
  // search history
  hstory.push(keyword.value);
  hstory.reverse();
  localStorage.setItem("history", JSON.stringify(hstory));
  
  searchRes.innerHTML = "";
  
  // fetching untuk mendapatkan data film dari hasil pencarian dengan keyword
  const result = await fetch(SEARCH_URL + keyword.value)
          .then(res => res.json());
  // tampilkan hasil film 
  showMovies(result);
}



// fetching untuk mendapatkan genre film 
async function getGenre() {
  return fetch(GENRE_URL).then(async res => {
    const g = await res.json();
    // mapping id dan nama genre menjadi 2 array
    return [
      g.genres.map(i => i.id),
      g.genres.map(i => i.name)
    ];
  })
}


// menampilkan film hasil search ke layar
async function showMovies(data, gnre, mvs) {
  localStorage.setItem("pagesRes", JSON.stringify([data.total_pages,  data.total_results]));
  mvs = "localStorage";
  searchRes.innerHTML = '';
  const [ids, name] = await getGenre();
  for (const mv of data.results) {
    const title = mv.title.length < 15 ? mv.title : mv.title.slice(0, 20) + "  . . .";
    // ambil index array pertama dari genre_ids
    const mvID = mv.genre_ids[0];
    // mencari index ke x dari value/element mvID pada array ids
    const mvIndex = ids.indexOf(mvID);
    // tampilkan jika film mempunyai poster
    if (true) searchRes.innerHTML += card(mv.release_date, IMG_URL + mv.poster_path, title, name[mvIndex] !== undefined ? name[mvIndex] : "—", mv.vote_average, mv.id, mvs);
  }
  modal();
  
  const result = [];
  document.querySelectorAll(".localStorage").forEach(i => {
    result.push(i.innerHTML);
  });
  
  const carsds = {
    movies: result,
    res: `Result for <b>"${keyword.value}"</b>`,
    total: data.total_results
  };
  localStorage.setItem("cards", JSON.stringify(carsds));
  
  let currentUrl = "http://localhost:8158/discovery/index.html#";
  alert(document.URL);
  if(document.URL == currentUrl) {
    gnre.innerHTML = result.join("");
  } else {
    fetch("discovery/index.html")
    .then(res => {
      res.status == 404 ?
      location.replace("../searchResult/index.html"):
      location.replace("searchResult/index.html");
    });
  }
  
}


// card generator
function card(...rest) {
   return `<div class="${rest[2]} col-6 col-md-3 ${rest[6]} overflow-hidden d-flex align-items-stretch pt-1">
      <div class="col-6 w-100 cardx col-md-3 width mb-4 d-flex align-items-stretch dataID" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-id="${rest[5]}" id="card">
         <div class="card poster overflow-hidden bg-dark p-2">
         <span class="release">${rest[0]}</span>
         <img src="${rest[1]}" class="card-img-top">
            <div class="card-body text-light d-flex flex-column justify-content-between px-0 py-3">
               <img src="${rest[1]}" class="poster-bg">
               <h1 class="title lead text-light fs-6 m-0 mb-2 fw-bolder">${rest[2]}</h1>
               <p class="lead gnrex fs-6 m-0 fw-light">${rest[3] == null ? "" : rest[3]}</p>
               <span class="m-0 fw-light">${rest[4]  == null ? "" : ("⭐" + rest[4] + "/10")}</span>
            </div>
         </div>
      </div>
   </div>`;
}


// buat nampilin ke layar biar gk ngulang dari awal lagi
async function cardDOM(...rest) {
   for (const mv of rest[0]) {
      const title = mv.title.length < 15 ? mv.title : mv.title.slice(0, 20) + "  . . .";
      rest[1].innerHTML += card(mv.release_date, IMG_URL + mv.poster_path, title, rest[2], mv.vote_average.toFixed(1), mv.id);
  }
}


// modal film
function modal() {
   document.querySelectorAll(".dataID").forEach(i => {
      i.addEventListener("click", async () => {
         const details = await fetch(BASE_URL + `movie/${i.dataset.id}?` + API_KEY).then(res => res.json());
         
         return fetch(`${BASE_URL}/movie/${i.dataset.id}/videos?${API_KEY}`).then(res => res.json()).then(async res => {
            const trailer = res.results.filter(i => i.type == "Trailer" || i.type == "Clip");
            let iframe = "";
            for (const videos of trailer) {
               iframe += `
               <div class="col-12 mb-5 video">
                  <p class="mt-3 mt-md-5 fs-5">${videos.name}</p>
                  <iframe allow="fullscreen" width="100" src="https://www.youtube.com/embed/${videos.key}"></iframe>
                  <hr/>
               </div>`;
            }
            
            // looping genre film
            let genres = [];
            for (const g of details.genres) {
               genres.push(g.name);
            }
            
            // hitung durasi film
            const hours = Math.floor(details.runtime / 60);
            const minute = details.runtime % 60;
            const runtime = `${hours}hr ${minute}min`;
            
            // masukan info detail film ke dalam modal-body 
            document.querySelector(".modal-body").innerHTML = `
            <p class="d-none" data-idx="${i.dataset.id}"><p>
            <img class="absolute" src="${IMG_URL + details.poster_path}">
            <div class="row justify-content-center g-0">
               <img class="backdrop" src="${IMG_URL + details.backdrop_path}">
               <img class="poster m-0" src="${IMG_URL + details.poster_path}">
               <div class="movie-details px-md-5 row flex-md-row gy-5">
                  <hr>
                  <h1 class="col-12 text-center display-4 fw-bolder mb-3">${details.title}</h1>
                  <div class="col-md-5 text-center text-md-start">
                     <span class="fw-bolder b-btm fs-5 text-center text-md-start">Release date</span>
                     <br>${details.release_date}
                  </div>
                  <div class="col-md-8">
                     <span class="fw-bolder d-block b-btm text-center text-md-start fs-5">Overview</span>
                     <br><span class="d-block text-center text-md-start">${details.overview}</span>
                  </div>
                  <div class="col-6  text-center text-md-start col-md-3">
                     <span class="fw-bolder b-btm fs-5">Genres</span>
                     <br>${genres.join(", ")}
                  </div>
                  <div class="col-6 text-center text-md-start col-md-2 offset-md-1">
                     <span class="fw-bolder b-btm fs-5">IMDb</span>
                     <br>⭐${details.vote_average.toFixed(1)}/10
                  </div>
                  <div class="col-6 text-center text-md-start col-md-3">
                     <span class="fw-bolder b-btm fs-5">Runtime</span>
                     <br>${runtime}
                  </div>
                  <div class="col-6 text-center text-md-start col-md-3">
                     <span class="fw-bolder b-btm fs-5">Status</span>
                     <br>${details.status}
                  </div>
                  <hr>
                  <div class="col-12 mt-5">
                     <p class="fs-2 fw-bolder mb-3 text-md-center">Videos</p>
                     <div class="row align-items-center">
                        ${!iframe ? '<b class="text-center p-5">Video Not Available</b>' : iframe}
                     <div>
                  </div>
               </div>
            </div>`;
         });
      });
   });
}


// next page
let num = 1;
async function nextPage(query, up, id) {
  up == 0 ? num-- : num++;
  let page = `&page=${num}`,
      dscvryUrl = "http://localhost:8158/discovery/index.html", result,
      currentUrl = document.URL;
 console.log(page);
  currentUrl == dscvryUrl || currentUrl == 'http://localhost:8158/discovery/index.html#' ?
      result = await fetch(DISCOVER_URL + '&with_genres=' + id + page)
                 .then(res => res.json()) :
      result = await fetch(SEARCH_URL + query + page)
                 .then(res => res.json()) ;
  
  await showMovies(result, searchRes);
  document.querySelectorAll(".col-6").forEach(e => e.classList.remove("w-100"));
  document.querySelectorAll(".gnrex").forEach(e => e.classList.toggle("d-none"));
  modal();
}


// pagination
function pagination(totPages, id) {
  let title = document.querySelector(".key b").innerText, query,
      isNum = num == 1 ? "d-none" : "d-block",
      total = JSON.parse(localStorage.getItem("pagesRes"));
  title.includes('"') ?
     query = title.slice(1, -1) :
     query = title;
  pages.innerHTML = `
    <section aria-label="Page navigation example text-center5">
      <ul class="pagination pt-3">
        <li class="page-item ${isNum}"><a class="page-link prev" href="#" onclick="nextPage('${query}', 0, ${id})">Previous</a></li>
        <li class="page-item m-auto"><a class="page-link next" href="#" onclick="nextPage('${query}', 1, ${id})">Next</a></li>
      </ul>
      <div class="pb-5">
        <p class="text-light text-center">Total pages : <b>${totPages == undefined ? total[0] : totPages}</b></p>
      </div>
    </section>`;
    console.log(totPages)
  const next = document.querySelector(".next");
  total <= 20 || totPages <= 1 ? next.remove() : '';
  return pages.innerHTML;
}



// menghentikan video ketika meng-close modal
function stopVideos() {
  let videos = document.querySelectorAll(".video");
  for(const v of videos) {
    v.children[1].remove();
  }
}


function back_Button() {
  history.pushState(null, null);
  window.addEventListener('popstate', () => {
    stopVideos();
    const modal = document.querySelector('.show');
    if (true) {
      const close = modal.querySelector('.btn-secondary');
      close.click();
      history.pushState(null, null);
    }
  });
}
back_Button();
