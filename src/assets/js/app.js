const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});


function goToHome() {
  let baseUrl = window.location.origin;

  // If on GitHub Pages (moazmorsh.github.io), ensure correct project path
  if (baseUrl.includes("moazmorsh.github.io")) {
    baseUrl += "/pharmacy-website-project";
  }

  window.location.href = baseUrl + "/index.html";
}