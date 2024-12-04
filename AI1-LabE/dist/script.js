/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


// Przechowywanie stanu aplikacji
var appState = {
  currentStyle: "",
  styles: {
    style1: "pliki_css/page1.css",
    style2: "pliki_css/page2.css",
    style3: "pliki_css/page3.css"
  }
};
// Funkcja zmieniająca styl
function changeStyle(newStyle) {
  var head = document.head;
  var oldLink = document.querySelector('link[data-dynamic="true"]');
  // Usunięcie starego stylu
  if (oldLink) {
    head.removeChild(oldLink);
  }
  // Dodanie nowego stylu
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = newStyle;
  link.setAttribute("data-dynamic", "true");
  head.appendChild(link);
  // Aktualizacja stanu
  appState.currentStyle = newStyle;
}
// Podłączenie zdarzeń do przycisków
document.addEventListener("DOMContentLoaded", function () {
  var nav = document.querySelector("nav");
  if (!nav) {
    console.error("Element <nav> nie został znaleziony!");
    return;
  }
  // Iteracja po kluczach w appState.styles
  Object.keys(appState.styles).forEach(function (styleKey) {
    var button = document.createElement("button");
    button.textContent = "Styl ".concat(styleKey);
    button.setAttribute("data-style", styleKey);
    // Dodaj nasłuchiwanie na kliknięcie
    button.addEventListener("click", function () {
      var stylePath = appState.styles[styleKey];
      if (stylePath) {
        changeStyle(stylePath);
      }
    });
    // Dodaj przycisk do <nav>
    nav.appendChild(button);
  });
});
/******/ })()
;