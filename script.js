const cog = document.querySelector('.cog-button');
const drawer = document.querySelector('#drawer');
const darkToggle = document.querySelector('.dark-toggle');
const body = document.querySelector('body');
const inner = document.querySelector('#drawer-inner');

cog.addEventListener('click', (e) => {
  drawer.classList.toggle('open');
});

darkToggle.addEventListener('click', (e) => {
  body.classList.toggle('dark');
})

// logic-update branch