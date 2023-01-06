// menyimpan film ke bookmark
let bookmark = JSON.parse(localStorage.getItem("saved")) || [],
    btnSave = document.querySelector(".save");
btnSave.addEventListener("click", () => {
  const mvSave = btnSave.parentNode.previousElementSibling.children[2];
  const saved = {
    id : btnSave.parentNode.previousElementSibling.children[0].dataset.idx,
    img : mvSave.children[1].src,
    title : mvSave.children[1].nextElementSibling.children[1].innerHTML
  }
  console.log(saved.id);
  const savedMv = card('', saved.img, saved.title,'', null, saved.id);
  
  //hapus isi aray duplikat
  bookmark.push(savedMv);
  const remvDup = bookmark.filter((e,i) => {
    return bookmark.indexOf(e) === i;
  });
  remvDup.reverse();
  localStorage.setItem("saved", JSON.stringify(remvDup));
  
  // sweetalert saat mengklik tombol save
  Swal.fire({
    icon: 'success',
    title: '<b class="text-light">Saved!</b>',
    html: `<p class="text-light">"<i cla><b>${saved.title}"</b></i> are stored on the <a href="../bookmarks/index.html" class="text-light fw-bolder">bookmark</a> page</p>`,
    showConfirmButton: true,
    timer: 3500
  })
})