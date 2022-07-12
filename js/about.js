"use strict";

const elList = document.querySelector(".hero-right-list")
const elBooksShowing = document.querySelector(".header-bottom-showing")
const elBooksResult = document.querySelector(".header-bottom-result")
const elInput = document.querySelector(".header-input")
const elModal = document.querySelector(".modal")
const elOverlay = document.querySelector(".overlay")
const elSortBtn = document.querySelector(".header-bottom-btn")
const elBookmarkList = document.querySelector(".hero-bookmark-list")
const elPagination = document.querySelector(".pagination")

let search = "hulk"
let page = 1;
let sort = "relevance"

const pagination = [];
let books = [];
const localStorageBookmark = JSON.parse(window.localStorage.getItem("bookmark"))
const bookmark = localStorageBookmark || []

const token = window.localStorage.getItem("token")

// if(!token){
//   window.location.replace("index.html")
// }

logout.addEventListener("click", () => {
  window.localStorage.removeItem("token")

  window.location.replace("index.html")
})

const renderBooks = function(array, htmlElement){
  elPagination.innerHTML = null;
  for(let i = 1; i <= pagination[pagination.length - 1]; i++){
    const paginationHtml = `
    <li class="page-item"><a class="page-link" href="#">${i}</a></li>
    `


    elPagination.insertAdjacentHTML("beforeend", paginationHtml)
  }

  array.forEach(item => {
    const listHtml = `
    <li class="hero-right-item">
    <img src="${item.volumeInfo.imageLinks.smallThumbnail}" alt="book">
    <div class="hero-right-list-wrapper">
      <h5 class="hero-right-list-heading">${item.volumeInfo.title}</h5>

      <p class="hero-right-list-desc">
        ${item.volumeInfo.authors}
      </p>

      <p class="hero-right-list-desc-year">
      ${item.volumeInfo.publishedDate}
      </p>

      <div class="hero-right-btn-wrapper d-flex justify-content-between">
        <button id = ${item.id} class="hero-right-list-bookmark border-0">
          Bookmark
        </button>
        <button href="#" id = ${item.id} class="hero-right-list-more-info border-0">
          More Info
        </button>
      </div>
      <a href="${item.volumeInfo.previewLink}" class="hero-right-list-read text-decoration-none" target="_blank">
        Read
      </a>
    </div>
  </li>
    `

    htmlElement.insertAdjacentHTML("beforeend", listHtml)
  })
}

const getBooks = async function(){
  try{
    const request = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${page}&orderBy=${sort}`)

    const data = await request.json();
    books.push(...data.items)

    elBooksShowing.textContent = data.items.length;
    elBooksResult.textContent = data.totalItems;

    if(page <= 1){
      prevBtn.disabled = true
    } else {
      prevBtn.disabled = false
    }

    pagination.push(Math.round((data.totalItems / 10) / 2))

    if(Math.ceil(Math.round(data.totalItems / 10) / 2) < page){
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }

    if(data.items.length > 0){
      renderBooks(data.items, elList)
    }

  } catch (err){
    const errHeading = document.createElement("h2");

    alert(err.message)
    errHeading.textContent = "Topilmadi..."
    errHeading.setAttribute("class", "h1 text-danger")

    elList.appendChild(errHeading)
  }
}

getBooks()

// INPUT-SEARCH ------------------------------

elInput.addEventListener("change", () => {
  const inputValue = elInput.value;
  elInput.value = null;
  search = inputValue
  page = 1
  elList.innerHTML = null
  getBooks()
})

elSortBtn.addEventListener("click", () => {
  sort = "newest ";
  elList.innerHTML = null;
  getBooks()
})

prevBtn.addEventListener("click", () => {
  page -= 10;
  elList.innerHTML = null;
  getBooks()
})

nextBtn.addEventListener("click", () => {
  page += 10;
  elList.innerHTML = null;
  getBooks()
})

elPagination.addEventListener("click", (evt) => {
  const chosePaginationPage = evt.target.textContent * 10;
  page += chosePaginationPage;
  elList.innerHTML = null;
  getBooks();
})

// MODAL ------------------------------------

const renderModal = function(item, htmlElement){
  const htmlMoreInfo = `
  <div class="modal-top d-flex align-content-center justify-content-between">
  <h3 class="modal-text">${item.volumeInfo.title}</h3>
  <button class="close-modal"></button>
</div>

<div class="modal-center">
  <img src="${item.volumeInfo.imageLinks.smallThumbnail}" alt="book" width="228" height="300">
  <p class="modal-desc">${item.volumeInfo.description}</p>
</div>

<ul class="modal-list list-unstyled">
  <li class="modal-item d-flex align-items-center">
    <h4 class="modal-list-heading">Author : </h4>

    <p class="modal-list-desc">
    ${item.volumeInfo.authors}
    </p>
  </li>

  <li class="modal-item d-flex align-items-center">
    <h4 class="modal-list-heading">Published : </h4>

    <p class="modal-list-desc">
    ${item.volumeInfo.publishedDate}
    </p>
  </li>

  <li class="modal-item d-flex align-items-center">
    <h4 class="modal-list-heading">Publishers : </h4>

    <p class="modal-list-desc">
    ${item.volumeInfo.publisher}
    </p>
  </li>

  <li class="modal-item d-flex align-items-center">
    <h4 class="modal-list-heading">Categories : </h4>

    <p class="modal-list-desc">
      ${item.volumeInfo.categories}
    </p>
  </li>

  <li class="modal-item d-flex align-items-center">
    <h4 class="modal-list-heading">Pages Count : </h4>

    <p class="modal-list-desc">
    ${item.volumeInfo.pageCount}
    </p>
  </li>
</ul>

<div class="modal-btn-wrapper">
  <a class="modal-read text-decoration-none" href="${item.volumeInfo.previewLink}" target="_blank">Read</a>
</div>
  `

  htmlElement.insertAdjacentHTML("beforeend", htmlMoreInfo);item
}

elList.addEventListener("click", (evt) => {
  if(evt.target.matches(".hero-right-list-more-info")){
    const moreInfoId = evt.target.id;
    const findMoreInfo = books.find(item => item.id === moreInfoId)

    open()

    elModal.innerHTML = null;
    renderModal(findMoreInfo, elModal)
  }
})

elOverlay.addEventListener("click", close);

elModal.addEventListener("click", (evt) => {
  if(evt.target.matches(".close-modal")){
    close()
  }
})

document.addEventListener("keydown", (evt) => {
  if(evt.keyCode === 27){
    if(!elModal.classList.contains("d-none")){
      close()
    }
  }
})

function open(){
  elModal.classList.remove("d-none");
  elOverlay.classList.remove("d-none");
}

function close(){
  elModal.classList.add("d-none");
  elOverlay.classList.add("d-none");
}

// BOOKMARK ---------------------------------

const renderBookmark = function(arr, htmlElement){
  arr.forEach(item => {
    const htmlBookmark = `
    <li class="hero-bookmark-item d-flex align-items-center justify-content-between">
    <div class="hero-bookmark-text-wrapper">
      <h4 class="hero-bookmark-heading">
      ${item.volumeInfo.title}
      </h4>

      <p class="hero-bookmark-desc">
      ${item.volumeInfo.authors}
      </p>
    </div>

    <div class="hero-bookmark-btn-wrapper">
      <a href="${item.volumeInfo.previewLink}" target="_blank" class="hero-bookmark-read"></a>
      <button id = ${item.id} class="hero-bookmark-remove"></button>
    </div>
  </li>
    `

    htmlElement.insertAdjacentHTML("beforeend", htmlBookmark)
  })
}


renderBookmark(bookmark, elBookmarkList)

elList.addEventListener("click", (evt) => {
  if(evt.target.matches(".hero-right-list-bookmark")){
    const bookmarkId = evt.target.id;
    const findBookmark = books.find(item => item.id === bookmarkId);

    if(!bookmark.includes(findBookmark)){
      bookmark.push(findBookmark)
    }

    window.localStorage.setItem("bookmark", JSON.stringify(bookmark))

    elBookmarkList.innerHTML = null;
    renderBookmark(bookmark, elBookmarkList)
  }
})

elBookmarkList.addEventListener("click", (evt) => {
  if(evt.target.matches(".hero-bookmark-remove")){
    const removeId = evt.target.id;
    const findIndexBookmark = bookmark.findIndex(item => item.id === removeId);

    bookmark.splice(findIndexBookmark, 1);

    window.localStorage.setItem("bookmark", JSON.stringify(bookmark));

    if(bookmark.length < 1){
      window.localStorage.removeItem("bookmark")
    }

    elBookmarkList.innerHTML = null;
    renderBookmark(bookmark, elBookmarkList)
  }
})