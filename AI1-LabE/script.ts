// Przechowywanie stanu aplikacji
const appState = {
    currentStyle: "",
    styles: {
        style1: "pliki_css/page1.css",
        style2: "pliki_css/page2.css",
        style3: "pliki_css/page3.css"
    } as Record<string, string>,
};

// Funkcja zmieniająca styl
function changeStyle(newStyle: string) {
    const head = document.head;
    const oldLink = document.querySelector('link[data-dynamic="true"]');

    // Usunięcie starego stylu
    if (oldLink) {
        head.removeChild(oldLink);
    }

    // Dodanie nowego stylu
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = newStyle;
    link.setAttribute("data-dynamic", "true");
    head.appendChild(link);

    // Aktualizacja stanu
    appState.currentStyle = newStyle;
}

// Podłączenie zdarzeń do przycisków
document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("nav");
    if (!nav) {
        console.error("Element <nav> nie został znaleziony!");
        return;
    }

    // Iteracja po kluczach w appState.styles
    Object.keys(appState.styles).forEach((styleKey) => {
        const button = document.createElement("button");
        button.textContent = `Styl ${styleKey}`;
        button.setAttribute("data-style", styleKey);

        // Dodaj nasłuchiwanie na kliknięcie
        button.addEventListener("click", () => {
            const stylePath = appState.styles[styleKey];
            if (stylePath) {
                changeStyle(stylePath);
            }
        });

        // Dodaj przycisk do <nav>
        nav.appendChild(button);
    });
});
