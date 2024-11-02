document.addEventListener("DOMContentLoaded", () => {
    // Inicjalizacja mapy Leaflet
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Funkcja pobierająca lokalizację użytkownika i ustawiająca marker na mapie
    function showUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 13);
                L.marker([latitude, longitude]).addTo(map)
                    .bindPopup("Twoja lokalizacja").openPopup();
            });
        } else {
            alert("Geolokalizacja nie jest wspierana w tej przeglądarce.");
        }
    }

    document.getElementById("myLocationBtn").addEventListener("click", showUserLocation);

    // Zgoda na powiadomienia
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Funkcja eksportująca mapę do Canvas i dzieląca na puzzle
    function downloadMap() {
        clearPuzzleBoard(); // Czyszczenie planszy przed załadowaniem nowej mapy

        html2canvas(document.getElementById("map")).then(canvas => {
            const rasterCanvas = document.getElementById("RasterCanvas");
            const ctx = rasterCanvas.getContext("2d");
            ctx.clearRect(0, 0, rasterCanvas.width, rasterCanvas.height);
            ctx.drawImage(canvas, 0, 0, rasterCanvas.width, rasterCanvas.height);

            // Podział mapy na 16 puzzli
            const pieceSize = rasterCanvas.width / 4;
            const puzzlePieces = [];//tu idą puzzle przed mieszaniem
            //const puzzleContainer = document.getElementById("pomieszanePuzzle");
            //puzzleContainer.innerHTML = '';

            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    const pieceCanvas = document.createElement("canvas");
                    pieceCanvas.width = pieceSize;
                    pieceCanvas.height = pieceSize;
                    const pieceCtx = pieceCanvas.getContext("2d");
                    pieceCtx.drawImage(rasterCanvas, x * pieceSize, y * pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);
                    pieceCanvas.classList.add("puzzlePiece");
                    pieceCanvas.setAttribute("draggable", true);
                    pieceCanvas.id = `piece-${y * 4 + x}`;
                    puzzlePieces.push(pieceCanvas); // Dodawanie puzzla do tablicy                }
            }
        }
            shuffleArray(puzzlePieces);
// Dodawanie pomieszanych puzzli do kontenera
            const puzzleContainer = document.getElementById("pomieszanePuzzle");
            puzzleContainer.innerHTML = ''; // Wyczyść kontener

            puzzlePieces.forEach(piece => {
                puzzleContainer.appendChild(piece); // Dodaj pomieszane puzzle do kontenera
            });

            addDragAndDrop();
        });
    }

    document.getElementById("downloadMapBtn").addEventListener("click", downloadMap);

    // Funkcja do czyszczenia planszy
    function clearPuzzleBoard() {
        const puzzleBoard = document.getElementById("ukladanka");
        puzzleBoard.querySelectorAll("div").forEach(cell => cell.innerHTML = "");
    }
           // Funkcja mieszająca elementy tablicy
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Losowy indeks
            [array[i], array[j]] = [array[j], array[i]]; // Zamień elementy
        }
    }
    // Funkcja Drag & Drop
    function addDragAndDrop() {
        const puzzlePieces = document.querySelectorAll(".puzzlePiece");
        const dropZones = document.querySelectorAll("#ukladanka > div");

        puzzlePieces.forEach(piece => {
            piece.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text/plain", event.target.id);
            });
        });

        dropZones.forEach((dropZone) => {
            dropZone.addEventListener("dragover", (event) => event.preventDefault());
            dropZone.addEventListener("drop", (event) => {
                event.preventDefault();
                const pieceId = event.dataTransfer.getData("text/plain");
                const piece = document.getElementById(pieceId);

                if (!dropZone.hasChildNodes()) {
                    dropZone.appendChild(piece);
                    checkPuzzleCompletion();
                }
            });
        });
    }

    // Sprawdzanie poprawności ułożenia puzzli i powiadomienie
    function checkPuzzleCompletion() {
        const pieces = document.querySelectorAll("#ukladanka .puzzlePiece");
        let isCompleted = true;
        let counter = 0;

        pieces.forEach((piece, index) => {
            if (piece.id !== `piece-${index}`) {
                isCompleted = false;
            }
            counter = counter + 1;

        });

        if (isCompleted && counter === 16 && Notification.permission === "granted") {
            new Notification("Gratulacje!", {
                body: "Ułożyłeś wszystkie puzzle poprawnie!"
            });
        } else if (isCompleted && counter === 16) {
            alert("Gratulacje! Ułożyłeś wszystkie puzzle poprawnie!");
        }
    }
});
