document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const game = document.getElementById('game');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const playerNameInput = document.getElementById('playerName');
    const victoriesDisplay = document.getElementById('victories');
    const colorButtons = document.querySelectorAll('.color-button');
    const instructionsButton = document.getElementById('instructions'); // Botón de instrucciones
    const modal = document.getElementById('instructionsModal'); // Modal de instrucciones
    const closeButton = document.querySelector('.close'); // Botón de cierre del modal

    let sequence = [];
    let playerSequence = [];
    let round = 0;
    let victories = localStorage.getItem('victories') ? parseInt(localStorage.getItem('victories')) : 0;

    victoriesDisplay.textContent = victories;

    // Evento para iniciar el juego
    startButton.addEventListener('click', startGame);

    // Evento para reiniciar el juego
    resetButton.addEventListener('click', resetGame);

    // Evento para mostrar las instrucciones
    instructionsButton.addEventListener('click', () => {
        modal.style.display = 'flex'; // Mostrar el modal
    });

    // Evento para cerrar el modal al hacer clic en la "X"
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Ocultar el modal
    });

    // Evento para cerrar el modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none'; // Ocultar el modal
        }
    });

    // Eventos para los botones de colores
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.id;
            playerSequence.push(color);
            playSound(color);
            checkSequence();
        });
    });

    // Función para iniciar el juego
    function startGame() {
        const playerName = playerNameInput.value.trim();
        if (playerName === '') {
            alert('Por favor, ingresa tu nombre.');
            return;
        }

        menu.style.display = 'none';
        game.style.display = 'block';
        sequence = [];
        playerSequence = [];
        round = 0;
        nextRound();
    }

    // Función para reiniciar el juego
    function resetGame() {
        game.style.display = 'none';
        menu.style.display = 'block';
    }

    // Función para avanzar a la siguiente ronda
    function nextRound() {
        round++;
        playerSequence = [];
        const randomColor = getRandomColor();
        sequence.push(randomColor);
        playSequence();
    }

    // Función para reproducir la secuencia de colores
    function playSequence() {
        let i = 0;
        const interval = setInterval(() => {
            const color = sequence[i];
            highlightButton(color);
            playSound(color);
            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
            }
        }, 1000);
    }

    // Función para resaltar un botón de color
    function highlightButton(color) {
        const button = document.getElementById(color);
        button.style.opacity = '1';
        setTimeout(() => {
            button.style.opacity = '0.7';
        }, 500);
    }

    // Función para reproducir un sonido
    function playSound(color) {
        const audio = new Audio(`sounds/${color}.mp3`);
        audio.play();
    }

    // Función para verificar la secuencia del jugador
    function checkSequence() {
        const index = playerSequence.length - 1;
        if (playerSequence[index] !== sequence[index]) {
            gameOver();
            return;
        }

        if (playerSequence.length === sequence.length) {
            if (round === 10) {
                victory();
            } else {
                setTimeout(nextRound, 1000);
            }
        }
    }

    // Función para manejar el fin del juego
    function gameOver() {
        alert('Juego Terminado');
        resetGame();
    }

    // Función para manejar la victoria
    function victory() {
        victories++;
        localStorage.setItem('victories', victories);
        victoriesDisplay.textContent = victories;
        alert('¡Felicidades! Has ganado.');
        resetGame();
    }

    // Función para obtener un color aleatorio
    function getRandomColor() {
        const colors = ['red', 'green', 'blue', 'yellow'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});