$(document).ready(function() {
    const $guessInput = $('#guess-input');
    const $guessBtn = $('#guess-btn');
    const $restartBtn = $('#restart-btn');
    const $feedback = $('#game-feedback');
    const $attemptsDisplay = $('#attempts-count');

    let target = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    let isGameOver = false;

    $guessBtn.on('click', function() {
        if (isGameOver) return;

        let guess = parseInt($guessInput.val());

        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            $feedback.text('Please enter a number between 1 and 100.').css('color', 'red');
            return;
        }

        attempts++; 
        $attemptsDisplay.text('Attempts: ' + attempts);

        if (guess === target) {
            $feedback.text('Congratulations! It was ' + target).css('color', 'green');
            isGameOver = true;
            $guessInput.prop('disabled', true);
            $guessBtn.prop('disabled', true);
            $restartBtn.show(); 
        } else if (guess < target) {
            $feedback.text('Too low! Try higher.').css('color', 'orange');
        } else {
            $feedback.text('Too high! Try lower.').css('color', 'orange');
        }

        $guessInput.val(''); 
        $guessInput.focus();
    });

    $restartBtn.on('click', function() {
        target = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        isGameOver = false;
        $attemptsDisplay.text('Attempts: 0');
        $feedback.text('');
        $guessInput.prop('disabled', false);
        $guessBtn.prop('disabled', false);
        $guessInput.val('');
        $restartBtn.hide();
        $guessInput.focus();
    });
});