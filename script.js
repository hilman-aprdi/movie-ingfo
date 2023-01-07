const nav = document.querySelector(".navbar"),
      time = document.querySelector(".time"),
      keywords = document.querySelector(".keywords"),
      kywrd = document.querySelector(".k-word"),
      overflow = document.querySelectorAll(".flex-nowrap"),
      btn = document.querySelector(".btnx"),
      slide = document.querySelector(".slide"),
      scHstry = JSON.parse(localStorage.getItem("history"));

// hilangkan navbar saat posisi halaman di atas
function onTop() {
   window.scrollY <= 100 ?
      nav.style.bottom = "-10vh":
      nav.style.bottom = "0";
}

// menampilkan ucapan selamat siang/malam
function now() {
   const date = new Date(),
         hours = date.getHours();
   if (hours > 17 || hours >= 0) waktu = "Evening 🌙";
   if (hours > 4 && hours <= 10) waktu = "Morning ☀️";
   if (hours > 11 && hours <= 17) waktu = "Afternoon ☀️";
   return waktu;
}
time.innerText = now();   


// fetching film dengan genre action, animasi & horor
const getMovies = url => fetch(url).then(res => res.json());
Promise.all([
   getMovies(ACTION_URL),
   getMovies(ANIMATION_URL),
   getMovies(HOROR_URL),
   getMovies(TRENDING_URL),
])
   .then(res => {
       return res
       .map(i => i.results
       .filter(j => j.vote_average >= 5));
   })
   .then(res => {
      const genre = [action, animation, horor, trending];
      for(let i = 0; i < res.length; i++) {
        cardDOM(res[i], genre[i], null);
      }
      modal();
   });

// search history
for(const s of scHstry) {
   keywords.innerHTML += `
   <div class="d-flex align-items-center justify-content-between px-2 my-3">
      <p class="keyword m-0">${s}</p>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle me-2" viewBox="0 0 16 16" style="transform: scale(2);">
         <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
         <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
   </div>`;
}


//  event untuk history pencarian
keywords.addEventListener("click", async e => {
   if(e.target.tagName == "P") {
      kywrd.value = e.target.innerText;
      searchRes.innerHTML = "";
      // jika salah satu history pencarian di-klik
      showMovies(await fetch(SEARCH_URL + e.target.innerText)
         .then(res => res.json()), "");
   }
   
   let hstry = JSON.parse(localStorage.getItem("history"));
   
   // menghapus history pencarian
   function removeScHistory(tag, action) {
      if(e.target.tagName == tag) {
         const kValue = e.target.previousElementSibling.innerText;
         const index = hstry.indexOf(kValue);
         hstry.splice(index, 1);
         localStorage.setItem("history", JSON.stringify(hstry));
         action.remove();
      }
   }
   removeScHistory("svg", e.target.parentNode);
   removeScHistory("path", e.target.parentNode.parentNode);

});


// wrapping film on/off
btn.addEventListener("click", () => { 
   btn.classList.toggle("btn-blue");
   slide.classList.toggle("opacity-0");
   for(const i of overflow) {
      i.classList.toggle("flex-nowrap");
   }
});


