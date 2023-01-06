

// bad code :(

const saved = JSON.parse(localStorage.getItem("saved"));
const bookmarks = document.querySelector(".bookmarks"),
btnSv = document.querySelector("button");
bookmarks.innerHTML = saved.join("");

if (bookmarks.innerHTML == "") {
  bookmarks.classList.add("noMv");
  bookmarks.innerHTML = `<p class="text-center display-4">No movies stored here 🙁</p>`;
} else {
  bookmarks.classList.remove("noMv");
  bookmarks.innerHTML = saved.join("");
  modal();
}

btnSv.addEventListener("click", () => {
  for (const el of document.querySelectorAll(".undefined")) {
    el.classList.toggle("col-6");
    el.classList.toggle("text-center");
  }
});

// hapus film
const rmvBtn = document.querySelector(".remove");
rmvBtn.addEventListener("click", () => {
  const mvTitle =
  rmvBtn.parentNode.previousElementSibling.children[2].children[2]
  .children[1];
  title = `<b class="text-warning"><i>  "${mvTitle.innerText}"  </i></b>`;
  Swal.fire({
    title: "Mingfo!",
    html: `<p class="text-light text-center">Do you really want to remove ${title} from bookmarks</p>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(87,92,223)",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const svd = JSON.parse(localStorage.getItem("saved"));
      console.log(
        rmvBtn.parentNode.previousElementSibling.children[0].dataset.idx
        );
        console.log(document.querySelector(".dataID").dataset.id);
        const mvId =
        rmvBtn.parentNode.previousElementSibling.children[0].dataset
        .idx,
        cards = document.querySelectorAll(".dataID");
        for (const i of cards) {
          if (i.dataset.id == mvId) {
            const index = svd.indexOf(i.parentNode.outerHTML);
            saved.splice(index, 1);
            localStorage.setItem("saved", JSON.stringify(saved));
            i.parentNode.remove();
          }
        }
        Swal.fire("Removed!", `<p class"text-center">"${title}<span class="text-light"> has been removed</span>.</p>`, "success");
    }
  });
});

// sortir film
function sortBy(action) {
  let sort = [];
  for (const c of saved) {
    sort.push(c);
  }
  let mv = action == "sort" ? sort.sort() : sort.sort().reverse();
  bookmarks.innerHTML = mv.join("");
  return modal();
}

const selector = document.querySelector("select");
selector.addEventListener("change", () => {
  const value = selector.value;
  // sortir A-Z
  if (value == 1) sortBy("sort");
  // sort Z-A
  if (value == 2) sortBy("reverse");
  // sort update
  if (value == 3) bookmarks.innerHTML = saved.join("");
});
