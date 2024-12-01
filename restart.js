document.addEventListener('DOMContentLoaded', () => {
    let high_score = localStorage.getItem('high_score');
    document.getElementById('high_score').innerText = high_score

    document.getElementById('clear-high-score').addEventListener('click', () => {
        removeHighScore();
    });
});

function restartGame() {
    window.location.href = 'game.html'; 
}

function removeHighScore() {
    localStorage.setItem('high_score', 0);
    document.getElementById('high_score').innerText = 0;
}