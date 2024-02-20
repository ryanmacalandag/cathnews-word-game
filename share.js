const shareFB = document.querySelector('#share-fb');

const thisURL = window.location.href;
const FBlink = "https://www.facebook.com/share.php?u=" + encodeURIComponent(thisURL);

shareFB.addEventListener('click', (e) => {
  window.open(FBlink);
})