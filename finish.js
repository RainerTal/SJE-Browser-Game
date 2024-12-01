document.addEventListener('DOMContentLoaded', () => {
   let score = localStorage.getItem('score')

    // Näitab skoori id="score" all
    document.getElementById('score').innerText = score;
});

function restartGame() {
    window.location.href = 'game.html'; 
}
