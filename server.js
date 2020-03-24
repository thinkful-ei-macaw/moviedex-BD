/* eslint-disable semi */
require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const moviedex = require('./moviedex.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(function validateBearerToken(req, res, next) {
  const bearerToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  
  if (!bearerToken || bearerToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request'});
  }

  next();
});

function getMovie(req, res) {
  const genre = req.query.genre
  const country = req.query.country
  const avgVote = parseFloat(req.query.avg_vote)

  let response = moviedex

  if (genre) {
    response = response.filter(movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }
  if (country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(country.toLowerCase()));
  }
  if (avgVote) {
    response = response.filter( movie =>
      movie.avg_vote >= avgVote)
  }
  res.json(response);
}

app.get('/movie', getMovie)

const PORT=8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})