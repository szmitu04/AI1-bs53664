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
                // Dodanie markera z informacją o lokalizacji i współrzędnych
                L.marker([latitude, longitude]).addTo(map)
                    .bindPopup(`Twoja lokalizacja:<br>Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`)
                    .openPopup();
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
   

    // tu robie raster i dziele na puzzle
    function downloadMap() {
        new Notification("CZEKAJ!", {
            body: "Generuje obraz rastrowy"
        });
        console.log("Rozpoczęto generowanie obrazu mapy");
        clearPuzzleBoard(); // Czyszczenie planszy przed załadowaniem nowej mapy

        // Używamy leafletImage do generowania obrazu mapy
        leafletImage(map, function(err, canvas) {
            if (err) {
                console.error("Błąd podczas generowania obrazu mapy:", err);
                return;
            }

            //alert("generowanie rastru");
            
            console.log("Obraz mapy został wygenerowany");
            const rasterCanvas = document.getElementById("RasterCanvas");
            const ctx = rasterCanvas.getContext("2d");
            ctx.clearRect(0, 0, rasterCanvas.width, rasterCanvas.height);
            ctx.drawImage(canvas, 0, 0, rasterCanvas.width, rasterCanvas.height);

            // Podział mapy na 16 puzzli
            const pieceSize = rasterCanvas.width / 4;
            const puzzlePieces = [];

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
                    puzzlePieces.push(pieceCanvas);
                }
            }

            shuffleArray(puzzlePieces); // Mieszanie puzzli

            const puzzleContainer = document.getElementById("pomieszanePuzzle");
            puzzleContainer.innerHTML = ''; // Czyszczenie kontenera puzzli
            puzzlePieces.forEach(piece => puzzleContainer.appendChild(piece));

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
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
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
        let licznik = 0;

        pieces.forEach((piece, index) => {
            if (piece.id !== `piece-${index}`) {

                isCompleted = false;
            }
            
                licznik = licznik + 1
            
        });

        if (isCompleted && licznik === 16 && Notification.permission === "granted") {
            console.log("Puzzle poprawnie ułożone");
            new Notification("Gratulacje!", {
                body: "Ułożyłeś wszystkie puzzle poprawnie!"
                
            });
           
        } else if (isCompleted && licznik === 16) {
            console.log("Puzzle poprawnie ułożone");
            alert("Gratulacje! Ułożyłeś wszystkie puzzle poprawnie!");
        }
    }
});
