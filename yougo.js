`use strict`;

document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelectorAll('.js-accordion-title');

  for (let i = 0; i < title.length; i++) {
    let titleEach = title[i];
    let content = titleEach.nextElementSibling;
    titleEach.addEventListener('click', () => {
      titleEach.classList.toggle('is-active');
      content.classList.toggle('is-open');
    });
  }
});


  //スマホ操作時のナビゲーション
  document.querySelector('#hamburger').addEventListener('click', () => {
    const nav = document.querySelector('.sp-nav');
    nav.classList.toggle('toggle');
  });

  document.querySelector('.close').addEventListener('click', () =>  {
    const nav = document.querySelector('.sp-nav');
    nav.classList.toggle('toggle');
  });

