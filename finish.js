function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
document.addEventListener('DOMContentLoaded', () => {
    //Eraldab URL -ist scorei
    const urlParams = new URLSearchParams(window.location.search);
    const score = urlParams.get('score');

    // Näitab skoori id="score" all
    if (score !== null) {
        document.getElementById('score').innerText = score;
    }

    const highScore = getCookie('high_score');
    if (highScore) {
        document.getElementById('high_score').innerText = highScore; // Näitab high scorei
    }
});

function playAgain() {
    window.location.href = 'game.html'; 
}
