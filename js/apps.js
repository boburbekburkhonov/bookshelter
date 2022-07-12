"use strict";

const elForm = document.querySelector(".login-page-form");
const elUsernameInput = document.querySelector(".login-page-username-input");
const elPasswordInput = document.querySelector(".login-page-password-input");
const elLabelErr = document.querySelector(".login-page-label-error");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const usernameInputValue = elUsernameInput.value;
  const passwordInputValue = elPasswordInput.value;

  elUsernameInput.value = null;
  elPasswordInput.value = null;

  fetch("https://reqres.in/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      email: usernameInputValue,
      password: passwordInputValue
    })
  }).then(res => res.json()).then(data => {
    if(data?.token){
      window.localStorage.setItem("token", data.token)

      window.location.replace("about.html")
    } else {
      const newDescErr = document.createElement("p");

      newDescErr.textContent = data.error;

      elLabelErr.classList.add("opacity");
      elLabelErr.style.opacity = 1
      newDescErr.style.margin = 0

      elLabelErr.innerHTML = null;

      elLabelErr.appendChild(newDescErr)
    }
  })
})