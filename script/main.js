const brgManu = document.querySelector(".brg-manu");
const shBtn = document.getElementById("sh-btn");
const shContent = document.querySelector(".all-links");
const linkInput = document.querySelector(".shorten input");
const originalLink = document.querySelector(".link-content h4");
const regex = /https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i;

// Access Local Storage
if (window.localStorage.getItem("links")) {
  let LSArray = JSON.parse(window.localStorage.getItem("links"));
  getLink(LSArray);
}

// toggle active class in mobile screens
brgManu.onclick = function () {
  this.classList.toggle("active");
};

// shorten links with api
shBtn.addEventListener("click", () => {
  if (linkInput.value != "" && regex.test(linkInput.value)) {
    shortenedlink(linkInput.value);
  } else {
    alert("Please Type a vaild link!");
  }
});
// all Links
const allLinks = [];

function createLink(link, shLink) {
  // object related with the link
  let linkObj = {
    id: Date.now(),
    original: link,
    shortLink: shLink,
  };
  allLinks.push(linkObj);
  addToLS(allLinks);
}

function shortenedlink(link) {
  fetch(
    `https://www.shareaholic.com/v2/share/shorten_link?apikey=8943b7fd64cd8b1770ff5affa9a9437b&url=${link}&service[name]=tinyurl`
  )
    .then((response) => response.json())
    .then((res) => {
      createLink(link, res.data);
      getLink(allLinks);
    });
}

function getLink(allLinks) {
  shContent.innerHTML = "";
  allLinks.forEach((link) => {
    let content = `
    <div class="link-content" id="${link.id}">
    <h4>${link.original}</h4>
    <div class="sh-link">
    <p>${link.shortLink}</p>
    <button class="copy" onclick="copyLink(this)">Copy</button>
    <button class="delete">Delete</button>
    </div>
    </div>`;
    shContent.innerHTML += content;
    deleteLink();
  });
  linkInput.value = "";
}

// a function to copy shortened link
function copyLink(btn) {
  let originalText = btn.innerText;
  btn.innerText = "Copied!";
  btn.style.backgroundColor = "hsl(257, 27%, 26%)";
  navigator.clipboard.writeText(btn.previousElementSibling.innerText);
  setTimeout(() => {
    btn.innerText = originalText;
    btn.style.backgroundColor = "hsl(180, 66%, 49%)";
  }, 1000);
}
// Delete feature
function deleteLink() {
  const linkContent = document.querySelectorAll(".link-content");
  linkContent.forEach((cont) => {
    cont.addEventListener("click", function (e) {
      if (e.target.className == "delete") {
        delLinkObj(this);
        this.remove();
      }
    });
  });
}
function delLinkObj(linkCont) {
  let filtered = allLinks.filter((link) => link.id != linkCont.id);
  addToLS(filtered);
}
// localStorage features
function addToLS(arr) {
  window.localStorage.setItem("links", JSON.stringify(arr));
}
