const cardss = document.querySelectorAll(".cardx"),
      bckBtn = document.querySelector(".back"),
      dscvr = document.querySelector(".discovery"),
      btn = document.querySelector(".btnx"),
      res = document.querySelector(".search-result");
     

console.log(document.URL)
// menambahkan pilihan genre ke halaman Discovery
async function genres() {
  const [id ,name] = await getGenre();
  let i = 0, num = 0, j = 180;
  for(const g of name) {
    discover.innerHTML += `
      <button class="border-0 text-start gnre py-4 text-md-center fw-bolder rounded-3 px-2 text-dark" data-id="${id[i++]}" style="background: hsl(${j+=10},100%,80%);">
        <img src="../img/icon/${num++}.png" width="20">
        <span>${g == "Science Fiction" ? "Sc-Fi" : g}</span>
      </button>`;
  }
}
genres();


// jika salah satu genre di-klik
discover.addEventListener("click", e => {
  if(e.target.classList.contains("gnre")) {
    searchRes.innerHTML = "";
    discover.classList.add("d-none");
    const id = e.target.dataset.id;
    fetch(DISCOVER_URL + '&with_genres=' + id + '&page')
    .then(res => res.json())
    .then(res => {
      localStorage.setItem("pagesRes", JSON.stringify([res.total_pages, res.total_results]));
      console.log(res);
      mvGnre(res, e.target.children[1].innerText);
      pagination(res.total_pages, id)
      pgs(res.total_pages, id);
    });
  }
});

function pgs(total, id) {
  pages.addEventListener("click", e => {
    if(e.target.classList.contains("next")) {
       pages.innerHTML = pagination(--total, id);
    }
    if(e.target.classList.contains("prev")) {
       pages.innerHTML = pagination(++total, id);
    }
  })
}

async function mvGnre(data, gnr) {
  await cardDOM(data.results, searchRes, null);
  cardss.forEach(i => i.classList.remove("col-6"));
  bckBtn.classList.remove("d-none");
  btn.classList.add("d-none");
  modal();
  let gName = document.querySelector(".key b");
  document.querySelector(".gs").classList.toggle("d-none");
  gName.innerText = gnr;
  gName.classList.toggle("d-none");
  pages.classList.toggle("d-none");
}


// button kembali
bckBtn.addEventListener("click", () => {
  document.querySelectorAll(".gnrex").forEach(e => e.classList.toggle("d-none"));
  document.querySelector(".gs").classList.toggle("d-none");
  let gName = document.querySelector(".key b");
  gName.classList.toggle("d-none");
  pages.classList.toggle("d-none");
  bckBtn.classList.add("d-none");
  btn.classList.remove("d-none");
  num = 1;
  dscvr.classList.remove("d-none");
  res.innerHTML = "";
});

// tampilan gebre menjadi fullWidth jika di-klik
btn.addEventListener("click", () => {
  btn.classList.toggle("btn-blue");
  const gnrs = document.querySelectorAll(".gnre");
  gnrs.forEach(i => {
    i.classList.toggle("fullWidth");
  });
});