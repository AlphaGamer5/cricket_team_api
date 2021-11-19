const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());

let db = null;

const initializeDbandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log(`Server Started at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log({ error: error.message });
    process.exit(1);
  }
};

// Starting the Server and connecting to Database
initializeDbandServer();

// Getting list of all players
app.get("/players", async (req, res) => {
  const query = `
        SELECT * FROM cricket_team
    `;

  const players = await db.all(query);

  res.send(players);
});

// Adding a player to Database
app.post("/players", async (req, res) => {
  try {
    const { playerName, jerseyNumber, role } = req.body;
    console.log(playerName, jerseyNumber, role);
    const query = `INSERT INTO cricket_team(player_name, jersey_number, role) VALUES('${playerName}',${jerseyNumber},'${role}');`;
    const player = await db.run(query);
    res.send("Player Added to Team");
  } catch (error) {
    console.log(error);
  }
});

// Getting a player with id
app.get("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const query = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`;
  const player = await db.get(query);
  res.send(player);
});

// Updating a player with id
app.put("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const { playerName, jerseyNumber, role } = req.body;
  const query = `
    UPDATE cricket_team
    SET 
        player_name = '${playerName}',
        jersey_number = ${jerseyNumber},
        role = '${role}'
    WHERE
        player_id = ${playerId}
    ;`;

  const player = await db.run(query);
  res.send("Player Details Updated");
});

// Delete a player
app.delete("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const query = `
        DELETE FROM cricket_team
        WHERE player_id = ${playerId}
    ;`;
  const player = await db.run(query);
  res.send("Player Removed");
});
module.exports = app;
