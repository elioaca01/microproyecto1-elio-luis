document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const game = document.getElementById('game');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const playerNameInput = document.getElementById('playerName');
    const victoriesDisplay = document.getElementById('victories');
    const colorButtons = document.querySelectorAll('.color-button');

    let sequence = [];
    let playerSequence = [];
    let round = 0;
    let victories = localStorage.getItem('victories') ? parseInt(localStorage.getItem('victories')) : 0;

    victoriesDisplay.textContent = victories;

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);

    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.id;
            playerSequence.push(color);
            playSound(color);
            checkSequence();
        });
    });

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

    function resetGame() {
        game.style.display = 'none';
        menu.style.display = 'block';
    }

    function nextRound() {
        round++;
        playerSequence = [];
        const randomColor = getRandomColor();
        sequence.push(randomColor);
        playSequence();
    }

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

    function highlightButton(color) {
        const button = document.getElementById(color);
        button.style.opacity = '1';
        setTimeout(() => {
            button.style.opacity = '0.7';
        }, 500);
    }

    function playSound(color) {
        const audio = new Audio(`sounds/${color}.mp3`);
        audio.play();
    }

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

    function gameOver() {
        alert('Juego Terminado');
        resetGame();
    }

    function victory() {
        victories++;
        localStorage.setItem('victories', victories);
        victoriesDisplay.textContent = victories;
        alert('¡Felicidades! Has ganado.');
        resetGame();
    }

    function getRandomColor() {
        const colors = ['red', 'green', 'blue', 'yellow'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});