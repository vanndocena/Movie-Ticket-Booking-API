const express = require('express'); // Import the Express library
const app = express(); // Create an Express application
const port = 3000; // Set the port number for the server

app.use(express.json()); // Allow the app to read JSON from the request body
app.use(express.static('public'));// Serve static files like HTML, CSS, images from 'public' folder

// List of movie objects with their info
const movies = [
  { id: 1, title: 'Avengers: Endgame', price: '₱750', seatsAvailable: 10, image: '/images/avengers.jpg' },
  { id: 2, title: 'The Dark Knight', price: '₱600', seatsAvailable: 5, image: '/images/dark_knight.jpg' },
  { id: 3, title: 'Spider-Man', price: '₱650', seatsAvailable: 10, image: '/images/spiderman.jpg' },
  { id: 4, title: 'Hello, Love, Again', price: '₱500', seatsAvailable: 8, image: '/images/helloloveagain.jpg' },
  { id: 5, title: 'Balota', price: '₱400', seatsAvailable: 3, image: '/images/balota.jpg' },
  { id: 6, title: 'Un/Happy For You', price: '₱450', seatsAvailable: 7, image: '/images/unhappyforyou.jpg' },
  { id: 7, title: 'Fast X', price: '₱700', seatsAvailable: 9, image: '/images/fastx.jpg' },
  { id: 8, title: 'Exhuma', price: '₱480', seatsAvailable: 4, image: '/images/exhuma.jpg' }
];


const bookings = []; // List to store all bookings

// Route to get all movies
app.get('/movies', (req, res) => {
  res.json(movies); // Send the movie list as JSON
});

// Route to book a ticket
app.post('/book', (req, res) => {
  const { movieId, customerName } = req.body; // Get movie ID and customer name from the request

  const movie = movies.find(m => m.id === parseInt(movieId)); // Find the movie by ID
  if (movie && movie.seatsAvailable > 0) { // Check if movie exists and seats are available
    movie.seatsAvailable--; // Decrease available seats by 1
    bookings.push({ movieId: movie.id, customerName }); // Add booking to the list
    res.json({ message: `Booked ${movie.title} for Customer: ${customerName}` }); // Send success message
  } else {
    res.status(400).json({ message: 'No seats available or movie not found' }); // Send error message
  }
});

// Route to get all bookings
app.get('/bookings', (req, res) => {
  res.json(bookings); // Send the bookings list as JSON
});

// Route to cancel a booking using movie ID
app.delete('/cancel/:id', (req, res) => {
  const { id } = req.params; // Get ID from the URL
  const movieId = parseInt(id); // Convert ID to number
  const bookingIndex = bookings.findIndex(b => b.movieId === movieId); // Find the booking in the list

  if (bookingIndex !== -1) { // If booking is found
    const booking = bookings.splice(bookingIndex, 1)[0]; // Remove booking from list
    const movie = movies.find(m => m.id === movieId); // Find the movie
    if (movie) movie.seatsAvailable++; // Increase available seats again

    res.json({ message: `Cancelled booking for ${booking.customerName} on ${movie.title}` }); // Send success message
  } else {
    res.status(404).json({ message: 'Booking not found' }); // Send error if booking not found
  }
});

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`); // Show message when server is running
});
