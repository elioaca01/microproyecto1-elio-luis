document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const game = document.getElementById('game');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const playerNameInput = document.getElementById('playerName');
    const colorButtons = document.querySelectorAll('.color-button');
    const instructionsButton = document.getElementById('instructions'); // Botón de instrucciones
    const modal = document.getElementById('instructionsModal'); // Modal de instrucciones
    const closeButton = document.querySelector('.close'); // Botón de cierre del modal
    

    let sequence = [];
    let playerSequence = [];
    let round = 0;
    let savedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    const resultadosDiv = document.getElementById('results');


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

    function savePlayer(name, rounds) {
        const newPlayer = {
          name: name,
          rounds: rounds
        };

        let savePlayers = JSON.parse(localStorage.getItem('players')) || [];
        savePlayers.push(newPlayer);
        localStorage.setItem('players', JSON.stringify(savePlayers));
      }

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

        localStorage.setItem('name',playerName)
        menu.style.display = 'none';
        game.style.display = 'block';
        sequence = [];
        playerSequence = [];
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
        localStorage.setItem('rounds', JSON.stringify(round));
        playerSequence = [];
        const randomColor = getRandomColor();
        sequence.push(randomColor);
        playSequence();
    }


   
    async function playSequence() {
        for (let i = 0; i < sequence.length; i++) {
            const color = sequence[i];
            highlightButton(color);
            await playSound(color); 
            await new Promise(resolve => setTimeout(resolve, 500)); // Espera 500ms entre cada color
        }
    }

    // Función para resaltar un botón de color
    function highlightButton(color) {
        const button = document.getElementById(color);
        button.style.opacity = '1';
        setTimeout(() => {
            button.style.opacity = '0.7';
        }, 500);
    }

    async function playSound(color) {
        return new Promise(resolve => {
            const audio = new Audio(`sounds/${color}.mp3`);
            audio.addEventListener('ended', resolve); 
            audio.play();
        });
    }

    // Función para verificar la secuencia del jugador
    function checkSequence() {
        const index = playerSequence.length - 1;
        if (playerSequence[index] !== sequence[index]) {
            gameOver();
            return;
        }

        if (playerSequence.length === sequence.length) {
            if (round === 50) {
                victory();
            } else {
                setTimeout(nextRound, 1000);
            }
        }
    }


    // Función para manejar el fin del juego
    function gameOver() {
        alert('Juego Terminado');
        savePlayer(localStorage.getItem('name'), localStorage.getItem('rounds'));
        savedPlayers = JSON.parse(localStorage.getItem('players'))
        localStorage.setItem('rounds', 0);
        round = 0;
        getResults();
        resetGame();
    }

    function getResults() {
        results.innerHTML = ''; // Limpiamos los resultados antes de mostrarlos
        savedPlayers.forEach(player => {
            const jugadorDiv = document.createElement('div');
            jugadorDiv.textContent = `Nombre: ${player.name}, Rondas: ${player.rounds}`;
            resultadosDiv.appendChild(jugadorDiv);
        });
    }

    // Función para obtener un color aleatorio
    function getRandomColor() {
        const colors = ['red', 'green', 'blue', 'yellow'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});