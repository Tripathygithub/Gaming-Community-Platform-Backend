const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Initialize the database
let db;
(async () => {
  try {
    db = await open({
      filename: path.resolve(__dirname, './database.sqlite'),
      driver: sqlite3.Database,
    });
    console.log('Connected to the SQLite database.');
  } catch (error) {
    console.error('Error opening database:', error.message);
    process.exit(1); // Exit if database connection fails
  }
})();

async function fetchAllGames() {
  let query = 'SELECT * FROM games';
  let response = await db.all(query, []);
  return { games: response };
}

app.get('/games', async (req, res) => {
  try {
    let result = await fetchAllGames();
    if (result.games.length === 0)
      return res.status(404).json({ message: 'no games found' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchGameByGenre(genre) {
  let query = 'SELECT * FROM games WHERE genre=?';
  let response = await db.all(query, [genre]);
  return { games: response };
}
app.get('/games/genre/:genre', async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await fetchGameByGenre(genre);
    if (result.games.length === 0)
      return res.status(404).json({ message: 'no games found' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchgamesByPlatform(platform) {
  let query = 'SELECT * FROM games WHERE platform=?';
  let response = await db.all(query, [platform]);
  return { games: response };
}
app.get('/games/platform/:platform', async (req, res) => {
  try {
    let platform = req.params.platform;
    let result = await fetchgamesByPlatform(platform);
    if (result.games.length === 0)
      return res.status(404).json({ message: 'no games found' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortGamesByrating() {
  let query = 'SELECT * FROM games ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { games: response };
}

app.get('/games/sort-by-rating', async (req, res) => {
  try {
    let result = await sortGamesByrating();
    if (result.games.length === 0)
      return res.status(404).json({ message: 'no games found' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllPlayers() {
  let query = 'SELECT * FROM players';
  let response = await db.all(query, []);
  return { players: response };
}

app.get('/players', async (req, res) => {
  try {
    let result = await getAllPlayers();
    if (result.players.length === 0)
      return res.status(404).json({ message: 'no players found' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchPlayerByPlatform(platform) {
  let query = 'SELECT * FROM players WHERE platform=?';
  let response = await db.all(query, [platform]);
  return { players: response };
}
app.get('/players/platform/:platform', async (req, res) => {
  try {
    let platform = req.params.platform;
    let result = await fetchPlayerByPlatform(platform);
    if (result.players.length === 0)
      return res.status(404).json({ message: 'no players found' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortPlayersByrating() {
  let query = 'SELECT * FROM players ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { players: response };
}

app.get('/players/sort-by-rating', async (req, res) => {
  try {
    let result = await sortPlayersByrating();
    if (result.players.length === 0)
      return res.status(404).json({ message: 'no players found' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllTournaments() {
  let query = 'SELECT * FROM tournaments';
  let response = await db.all(query, []);
  return { tournaments: response };
}

app.get('/tournaments', async (req, res) => {
  try {
    let result = await getAllTournaments();
    if (result.tournaments.length === 0)
      return res.status(404).json({ message: 'no players found' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
// /tournaments/sort-by-prize-pool
async function sortTournamentsByPrizeTool() {
  let query = 'SELECT * FROM tournaments ORDER BY prizePool DESC';
  let response = await db.all(query, []);
  return { tournaments: response };
}

app.get('/tournaments/sort-by-prize-pool', async (req, res) => {
  try {
    let result = await sortTournamentsByPrizeTool();
    if (result.tournaments.length === 0)
      return res.status(404).json({ message: 'no tournaments found' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
