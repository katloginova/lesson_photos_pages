 'use strict';

 const PHOTOS_URL = 'https://jsonplaceholder.typicode.com/photos?_limit=1200';

 const photosElem = document.querySelector('#photos');
 const pagesElem = document.querySelector('#pages');
 const photoBigElem = document.querySelector('#photoBig');
 const bgShade = document.querySelector('#bgShade');

 const photoTemplate = document.querySelector('#photosTemplate').innerHTML;
 const pageTemplate = document.querySelector('#pagesTemplate').innerHTML;
 const photoBigTemplate = document.querySelector('#photoBigTemplate').innerHTML;

 const PAGE_CLASS = 'pages__item';
 const GALLERY_ITEM_CLASS = 'gallery__item';
 const BG_SHADE_CLASS = 'bg__shade';



 init();


 pagesElem.addEventListener('click', onPageClick);
 photosElem.addEventListener('click', onPhotoClick);
 bgShade.addEventListener('click', onBgShadeClick);


 function onPageClick(e) {
     if (e.target.classList.contains(PAGE_CLASS)) {
         reproducePhotos(e.target.dataset.page);
         savePageToStorage(e.target.dataset.page);
     }
 }

 function onPhotoClick(e) {
     if (e.target.classList.contains(GALLERY_ITEM_CLASS)) {
         reproduceBigPhoto(e.target.dataset.id);
         addClass(bgShade, 'show');
     }
 }

 function onBgShadeClick(e) {
     if (e.target.classList.contains(BG_SHADE_CLASS)) {
         removeClass(e.target, 'show');
         resetInnerHtml(photoBigElem);
     }
 }

 function init() {
     const pageInit = restorePageFromStorage();
     reproducePhotos(pageInit);
 }


 function getData(url) {
     return fetch(url).then((data) => data.json());
 }

 function reproducePhotos(page) {
     getData(PHOTOS_URL)
         .then((photos) => {
             const countPages = Math.ceil(photos.length / 50);

             renderPages(countPages);
             renderPhotos(photos, page);
         });
 }

 function reproduceBigPhoto(id) {
     getData(PHOTOS_URL)
         .then((photos) => {
             photos.forEach((photo) => {
                 if (photo.id == id) {
                     renderBigPhoto(photo);
                 }
             });
         });
 }


 function addClass(elem, className) {
     elem.classList.add(className);
 }

 function removeClass(elem, className) {
     elem.classList.remove(className);
 }

 function resetInnerHtml(elem) {
     elem.innerHTML = '';
 }


 function renderPages(pages) {
     resetInnerHtml(pagesElem);

     for (let i = 0; i < pages; i++) {
         const pageHtml = generatePageHtml(i + 1);

         pagesElem.insertAdjacentHTML('beforeend', pageHtml);
     }
 }

 function generatePageHtml(pageNumber) {
     return pageTemplate
         .replace('{{pageId}}', pageNumber)
         .replace('{{numberPage}}', pageNumber);
 }


 function renderPhotos(photos, page) {
     resetInnerHtml(photosElem);

     const pageMin = (page - 1) * 50;
     const pageMax = page * 50;

     for (let i = pageMin; i < pageMax; i++) {
         renderPhoto(photos[i]);
     }
 }

 function renderPhoto(photo) {
     const photoHtml = generatePhotoHtml(photo);

     photosElem.insertAdjacentHTML('beforeend', photoHtml);
 }

 function generatePhotoHtml(photo) {
     return photoTemplate
         .replace('{{id}}', photo.id)
         .replace('{{url}}', photo.thumbnailUrl)
         .replace('{{title}}', photo.title);
 }


 function renderBigPhoto(photo) {
     const photoBigHtml = generateBigPhotoHtml(photo);

     photoBigElem.insertAdjacentHTML('beforeend', photoBigHtml);
 }

 function generateBigPhotoHtml(photo) {
     return photoBigTemplate
         .replace('{{id}}', photo.id)
         .replace('{{urlBig}}', photo.url)
         .replace('{{title}}', photo.title);
 }


 function savePageToStorage(page) {
     localStorage.setItem('page', JSON.stringify(page));
 }

 function restorePageFromStorage() {
     const page = localStorage.getItem('page');

     if (page !== null) {
         return JSON.parse(page);
     } else {
         return 1;
     }
 }