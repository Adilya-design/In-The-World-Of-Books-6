$(function() {
  
  // Data Database: Contains data for books to sort dynamically on this page
  // Added "anchor" property to each item to handle page redirection links properly
  const books = [
    { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", genre: "Fantasy", year: 1997, rating: 4.6, img: "images/Harry Potter and the Philosopher's Stone.jfif", anchor: "fantasy" },
    { title: "Percy Jackson and the Lightning Thief", author: "Rick Riordan", genre: "Fantasy", year: 2005, rating: 4.0, img: "images/70978477.jpg", anchor: "fantasy" },
    { title: "And Then There Were None", author: "Agatha Christie", genre: "Detective", year: 1939, rating: 4.4, img: "images/018eda52-fa37-7086-a4c0-0325d1d99090.jpg", anchor: "detective" },
    { title: "Murder on the Orient Express", author: "Agatha Christie", genre: "Detective", year: 1934, rating: 4.0, img: "images/48188e5f4d6969175cce1b35d485c083.jpg", anchor: "detective" },
    { title: "The Love Hypothesis", author: "Ali Hazelwood", genre: "Romance", year: 2021, rating: 3.5, img: "images/The Love Hypothesis.jfif", anchor: "romance" },
    { title: "The Notebook", author: "Nicholas Sparks", genre: "Romance", year: 1996, rating: 2.6, img: "images/the-notebook.jpg", anchor: "romance" },
    { title: "Pride and Prejudice", author: "Jane Austen", genre: "Classic", year: 1813, rating: 4.5, img: "images/6945733700.jpg", anchor: "classic" },
    { title: "Little Women", author: "Louisa M. Alcott", genre: "Classic", year: 1868, rating: 4.0, img: "images/little-women-159.jpg", anchor: "classic" }
  ];

  // Function: Processes the array and renders book cards into specific genre containers
  function renderBooksByGenre() {
    books.forEach(book => {
      // Create HTML structure for each book card (Added a functional redirection button inside card-body)
      const cardHTML = `
        <div class="col book-card-item" style="display: none;">
          <div class="card h-100 border-0 book-card-inner">
            <div class="book-cover-wrapper text-center">
              <span class="badge bg-danger rating-badge">${book.rating}</span>
              <img src="${book.img}" alt="${book.title}" class="img-fluid book-genre-cover">
            </div>
            <div class="card-body d-flex flex-column">
              <h6 class="fw-bold mb-1">${book.title}</h6>
              <p class="small text-muted mb-0">${book.author}</p>
              <p class="small text-muted mb-2">${book.year}</p>
              <a href="books.html#${book.anchor}" class="btn btn-sm btn-outline-danger mt-auto">Read Details</a>
            </div>
          </div>
        </div>
      `;

      // Conditional Statements (If-Else): Sort and append layout into correct genre section
      if (book.genre === "Fantasy") {
        $('#fantasy-container').append(cardHTML);
      } else if (book.genre === "Detective") {
        $('#detective-container').append(cardHTML);
      } else if (book.genre === "Romance") {
        $('#romance-container').append(cardHTML);
      } else if (book.genre === "Classic") {
        $('#classic-container').append(cardHTML);
      }
    });

    // jQuery FX: Smoothly fades in all generated book items initially
    $('.book-card-item').fadeIn(1500);
  }

  // Initial call to sort books on page load
  renderBooksByGenre();


  // Event Handling (Click): Toggles visibility of genre rows (Accordion effect)
  $('.genre-divider').on('click', function() {
      // Find the next element (the row of books) and toggle it
      $(this).next('.row').slideToggle('slow');
      
      // Neutral design: Update text feedback inside divider
      const $iconText = $(this).find('.genre-icon');
      if ($(this).next('.row').is(':visible')) {
        $iconText.text('Click to collapse');
      } else {
        $iconText.text('Click to expand');
      }
  });

  // Event Handling (Neutral Hover State): Adjusts opacity on mouse hover (no borders added)
  // Using event delegation because book covers are injected dynamically
  $(document).on('mouseenter', '.book-genre-cover', function() {
      // Demonstration of .fadeTo effect chaining for subtle feedback
      $(this).fadeTo('fast', 0.8);
  }).on('mouseleave', '.book-genre-cover', function() {
      // Resetting opacity to normal state
      $(this).fadeTo('fast', 1.0);
  });

});