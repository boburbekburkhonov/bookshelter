"use strict";

const elList = document.querySelector(".hero-right-list")
const elListTemplate = document.querySelector(".list-template").content
const elModalTemplate = document.querySelector(".modal-template").content
const elBooksShowing = document.querySelector(".header-bottom-showing")
const elBooksResult = document.querySelector(".header-bottom-result")
const elBooksPage = document.querySelector(".header-bottom-page")
const elInput = document.querySelector(".header-input")
const elModal = document.querySelector(".modal")
const elOverlay = document.querySelector(".overlay")
const elSortBtn = document.querySelector(".header-bottom-btn")
const elBookmarkList = document.querySelector(".hero-bookmark-list")
const elPagination = document.querySelector(".pagination")

let search = "python"
let page = 1;
let sort = "relevance"

const pagination = [];
let books = [];
const localStorageBookmark = JSON.parse(window.localStorage.getItem("bookmark"))
const bookmark = localStorageBookmark || []

// TOKEN-LOGOUT ----------------------------
const token = window.localStorage.getItem("token")

if(!token){
  window.location.replace("index.html")
}

logout.addEventListener("click", () => {
  window.localStorage.removeItem("token")

  window.location.replace("index.html")
})

// ------------------------------------------

const renderBooks = function(array, htmlElement){
  elPagination.innerHTML = null;

  for(let i = 0; i <= pagination[pagination.length - 1]; i++){
    const paginationHtml = `
    <li class="page-item"><a class="page-link" href="#">${i}</a></li>
    `

    elPagination.insertAdjacentHTML("beforeend", paginationHtml)
  }

  const fragmentbooks = document.createDocumentFragment();

  array.forEach(item => {
    const cloneFragmentBooks = elListTemplate.cloneNode(true);

    if(item.volumeInfo.imageLinks.smallThumbnail){
      cloneFragmentBooks.querySelector(".hero-right-list-img").src = item.volumeInfo.imageLinks.smallThumbnail
    } else {
      cloneFragmentBooks.querySelector(".hero-right-list-img").src = "No Img"
    }
    cloneFragmentBooks.querySelector(".hero-right-list-heading").textContent = item.volumeInfo.title
    if(item.volumeInfo.authors){
      cloneFragmentBooks.querySelector(".hero-right-list-desc").textContent = item.volumeInfo.authors
    } else {
      cloneFragmentBooks.querySelector(".hero-right-list-desc").textContent = "No author"
    }

    cloneFragmentBooks.querySelector(".hero-right-list-desc-year").textContent = item.volumeInfo.publishedDate
    cloneFragmentBooks.querySelector(".hero-right-list-bookmark").id = item.id
    cloneFragmentBooks.querySelector(".hero-right-list-more-info").id = item.id
    cloneFragmentBooks.querySelector(".hero-right-list-read").href = item.volumeInfo.previewLink;


    fragmentbooks.appendChild(cloneFragmentBooks)
  })
  htmlElement.appendChild(fragmentbooks)
}

// FETCH --------------------------------

const getBooks = async function(){
  try{
    const request = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${page}&orderBy=${sort}`)

    const requestPagination = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=61&orderBy=${sort}`)

    const data = await request.json();
    const dataPagination = await requestPagination.json()

    books.push(...data.items)

    elBooksShowing.textContent = data.items.length;

    if(dataPagination.totalItems < 100){
      elBooksResult.textContent = 0;
    }else {
      elBooksResult.textContent = dataPagination.totalItems;
    }

    if(page <= 1){
      prevBtn.disabled = true
    } else {
      prevBtn.disabled = false
    }

    pagination.push(Math.floor((dataPagination.totalItems / 10) / 10))

    if(Math.floor(dataPagination.totalItems / 10) < page + 10){
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }

    if(data.items.length > 0){
      renderBooks(data.items, elList)
    }

  } catch (err){
    const errHeading = document.createElement("h2");

    elBooksShowing.textContent = 0;
    elBooksResult.textContent = 0;

    if(page <= 1){
      prevBtn.disabled = true
    } else {
      prevBtn.disabled = false
    }

    if(Math.floor(page / 10) === pagination[pagination.length - 1]){
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }

    alert(err.message);
    errHeading.textContent = "Uzr boshqa pagelardan qidirib ko'ring, agar boshqa pagelarda ham bo'lmasa bunday ma'lumotni topolmadik..."
    errHeading.setAttribute("class", "h1 text-danger")

    elList.innerHTML = null;
    elList.appendChild(errHeading)
  }
}

getBooks()

// // INPUT-SEARCH ------------------------------

elInput.addEventListener("change", () => {
  const inputValue = elInput.value;
  elInput.value = null;
  search = inputValue
  page = 1;
  elList.innerHTML = null
  getBooks()
})

// SORT-BTN -----------------------------------------

elSortBtn.addEventListener("click", () => {
  sort = "newest ";
  elList.innerHTML = null;
  getBooks()
})

// PAGINATION -----------------------------------------

prevBtn.addEventListener("click", () => {
  page -= 10;
  elBooksPage.textContent = Math.round(page / 10);
  elList.innerHTML = null;
  getBooks()
})

nextBtn.addEventListener("click", () => {
  page += 10;
  elBooksPage.textContent = Math.round(page / 10);
  elList.innerHTML = null;
  getBooks()
})

elPagination.addEventListener("click", (evt) => {
  const chosePaginationPage = evt.target.textContent * 10;
  page = 1;
  page += chosePaginationPage;
  elBooksPage.textContent = Math.round(page / 10);
  elList.innerHTML = null;
  getBooks();
})

// // MODAL ------------------------------------

const renderModal = function(item, htmlElement){
  const fragmentModal = document.createDocumentFragment();

  const cloneFragmentModal = elModalTemplate.cloneNode(true);

  cloneFragmentModal.querySelector(".modal-text").textContent = item.volumeInfo.title;
  cloneFragmentModal.querySelector(".modal-img").src = item.volumeInfo.imageLinks.smallThumbnail;
  cloneFragmentModal.querySelector(".modal-desc").textContent = item.volumeInfo.description

  if(item.volumeInfo.authors){
    cloneFragmentModal.querySelector(".author").textContent = item.volumeInfo.authors
  } else {
    cloneFragmentModal.querySelector(".author").textContent = "No Author"
  }

  if(item.volumeInfo.publishedDate){
    cloneFragmentModal.querySelector(".published").textContent = item.volumeInfo.publishedDate
  } else {
    cloneFragmentModal.querySelector(".published").textContent =  "No Published"
  }

  if(item.volumeInfo.publisher){
    cloneFragmentModal.querySelector(".publishers").textContent = item.volumeInfo.publisher
  } else {
    cloneFragmentModal.querySelector(".publishers").textContent = "No Publishers"
  }

  if(item.volumeInfo.categories){
    cloneFragmentModal.querySelector(".categories").textContent = item.volumeInfo.categories
  } else {
    cloneFragmentModal.querySelector(".categories").textContent = "No Categories"
  }

  if(item.volumeInfo.pageCount){
    cloneFragmentModal.querySelector(".pages-count").textContent = item.volumeInfo.pageCount
  } else {
    cloneFragmentModal.querySelector(".pages-count").textContent = "No Page-Count"
  }

  cloneFragmentModal.querySelector(".modal-read").href = item.volumeInfo.previewLink



  fragmentModal.appendChild(cloneFragmentModal)
  htmlElement.appendChild(fragmentModal);
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

// // BOOKMARK ---------------------------------

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
