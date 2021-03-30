const container = document.querySelector(".container");
const loader = document.querySelector(".loader")
const shortenLinkForm = document.querySelector(".link-form")
const link = document.querySelector(".link");
const messege = document.querySelector(".messege")
const shortLinksContainer = document.querySelector(".shortened-links");
const shortItButton = document.querySelector(".shorten-it");
const shortenedLinkTemplate = document.querySelector("#shortened-link-template");
const hamburgerMenu = document.querySelector(".hamburger-menu")
const navBar = document.querySelector("nav");
let copyButtons;
let linkFetched = false;
let menuOpen = false;
shortenLinkForm.addEventListener("submit", linkShortener)


hamburgerMenu.addEventListener('click', () => {
    if(!menuOpen) {
      hamburgerMenu.classList.add('open');
      container.classList.add("active-nav");
      setTimeout( () => navBar.classList.add("show-nav"), 100);
      menuOpen = true;
    } else {
      hamburgerMenu.classList.remove('open');
      navBar.classList.remove("show-nav");
      setTimeout( () => container.classList.remove("active-nav"), 300)
      menuOpen = false;

    }
  });
  

// hamburgerMenu.addEventListener("click", (e) => {
//     hamburgerMenu.classList.toggle("clicked")

//     if (!container.classList.contains("active-nav")) {
//         container.classList.add("active-nav");
//         setTimeout( () => navBar.classList.add("show-nav"), 100)
//     } else {
//         navBar.classList.remove("show-nav");
//         setTimeout( () => container.classList.remove("active-nav"), 300) 
//     }
//   }
// )




function linkShortener(e) {
    e.preventDefault();
    validateLink();

    // if (link.value.trim() !== "") {
    //     messege.style.visibility = "hidden";
    //     link.style.border = "none";
    //     fetchLink();
    //     this.reset();
    // }

    setInterval( () => {
        if (linkFetched) {
            linkFetched = !linkFetched;
            copyButtons.forEach( btn => btn.addEventListener("click", copyLink) );
        }
    }, 100)
    
}


async function fetchLink() {

    // let newShortenedLink = document.importNode(shortenedLinkTemplate.content, true);
    // let shortLinkBox = newShortenedLink.querySelector(".short-link-container");
    // let enteredLink = newShortenedLink.querySelector(".entered-link");
    // let shortenedLink = newShortenedLink.querySelector(".shortened-link");
    

    showLoader();

    let response = await fetch(`https://api.shrtco.de/v2/shorten?url=${link.value}`);
    let jsonResponse = await response.json();

    hideLoader();
    console.log(jsonResponse)

    populateLink(jsonResponse)
    // if (jsonResponse.ok) {
    //     let originalLink = jsonResponse.result.original_link
    //     enteredLink.innerHTML = originalLink;
    //     stringTrimmer(originalLink, enteredLink);
    //     shortenedLink.innerHTML = jsonResponse.result.short_link;
    //     shortenedLink.setAttribute("href", jsonResponse.result.original_link);
    //     shortLinksContainer.append(newShortenedLink);
    //     copyButtons = document.querySelectorAll(".copy");
    //     linkFetched = !linkFetched;
    // } else {
    //     alert(jsonResponse.error)
    // }

}



// async function fetchLink() {
//     let response = await fetch(`https://api.shrtco.de/v2/shorten?url=${link.value}`);
//     let jsonResponse = await response.json();    
//     return jsonResponse;
// }


function populateLink(jsonResponse) {
    let newShortenedLink = document.importNode(shortenedLinkTemplate.content, true);
    let enteredLink = newShortenedLink.querySelector(".entered-link");
    let shortenedLink = newShortenedLink.querySelector(".shortened-link");
    
    if (jsonResponse.ok) {
        hideLoader();
        let originalLink = jsonResponse.result.original_link
        enteredLink.innerHTML = originalLink;
        stringTrimmer(originalLink, enteredLink);
        shortenedLink.innerHTML = jsonResponse.result.short_link;
        shortenedLink.setAttribute("href", jsonResponse.result.original_link);
        shortLinksContainer.append(newShortenedLink);
        copyButtons = document.querySelectorAll(".copy");
        linkFetched = !linkFetched;
    } else {
        alert(jsonResponse.error)
    }

}


function copyLink() {
    this.style.background = "hsl(257, 27%, 26%)";
    this.innerHTML = "Copied!"
    console.log(this.previousElementSibling.textContent)
    const el = document.createElement('textarea');
    el.value = this.previousElementSibling.textContent;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}


function validateLink() {
    if (link.value.trim() === "" || !link.value.includes(".")) {
        link.style.border = "2px solid hsl(0, 87%, 67%)";
        messege.style.visibility = "visible"
    } else {
        messege.style.visibility = "hidden";
        link.style.border = "none";
        fetchLink();
        shortenLinkForm.reset();
    }
 }

function showLoader() {
    container.classList.add("blur-background");
    loader.classList.remove("inactive")
    loader.classList.add("active");
} 

function hideLoader() {
    container.classList.remove("blur-background");
    loader.classList.add("inactive")
}

function stringTrimmer(str, enteredLink) {
    if (str.length > 30 && window.innerWidth < 500) {
        enteredLink.innerHTML = str.slice(0, 30) + "...";
    } else {
        enteredLink.innerHTML = str.slice(0, 60) + "...";
    }
}