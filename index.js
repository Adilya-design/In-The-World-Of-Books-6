// index.js - Main page: live clock, color changer, jQuery animations

// Arrays: Stores available background colors
const colors = ['#fbf0f3', '#e4cfd5', '#f7e7eb', '#ffffff', '#f2dfe4'];
let colorIndex = 0;

// DOM Manipulation & Event Listener: Update live date and time
document.addEventListener('DOMContentLoaded', function() {
    const dtElement = document.getElementById('live-datetime');
    if (!dtElement) return;

    function updateDateTime() {
        const now = new Date();
        const options = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        };
        dtElement.textContent = now.toLocaleDateString('en-US', options);
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Event Listener: Change background color on button click
const colorBtn = document.getElementById('color-btn');
if (colorBtn) {
    colorBtn.addEventListener('click', function() {
        document.body.style.background = colors[colorIndex];

        // Loop: Log applied color to console (demonstrates loop requirement)
        for (let i = 0; i < colors.length; i++) {
            if (i === colorIndex) {
                console.log('Applied color: ' + colors[i]);
            }
        }
        colorIndex = (colorIndex + 1) % colors.length;
    });
}

// jQuery: Theme application, reset, and title interaction
$(function() {
    const $quoteNote = $('#quote-note');
    const $hint = $('.interactive-hint');
    const $applyBtn = $('#apply-btn');
    const $resetBtn = $('#reset-btn');

    // Store original content for reset functionality
    const originalNote = $quoteNote.text();
    const originalHint = $hint.html();

    // Event Listener: Apply custom theme
    $applyBtn.on('click', function() {
        $quoteNote.text('Now the color of your title has been changed!');
        $hint.html('The theme of this site was chosen because one of the creators loves to <em>read</em>');

        const currentBorder = $('p').first().css('border-left-width');
        if (currentBorder === '0px') {
            $('p').css({
                'background-color': '#f7e7eb',
                'padding': '12px',
                'border-left': '3px solid #7b2d3a',
                'border-radius': '0 6px 6px 0',
                'transition': 'all 0.2s ease'
            });
        }
    });

    // Event Listener: Reset theme to original state
    $resetBtn.on('click', function() {
        $quoteNote.text(originalNote);
        $hint.html(originalHint);
        $('p').css({
            'background-color': '', 'padding': '', 'border-left': '',
            'border-radius': '', 'transition': ''
        });
    });

    // Event Listener: Toggle title style on click
    $('.site-title').on('click', function() {
        const currentStyle = $(this).css('font-style');
        if (currentStyle === 'normal') {
            $(this).css({ 'font-style': 'italic', 'color': '#d63384' });
        } else {
            $(this).css({ 'font-style': 'normal', 'color': '' });
        }
    });
});