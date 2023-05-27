const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const dbpath = path.join(__dirname, "cricketTeam.db");
const sqlite3 = require("sqlite3");
app.use(express.json());
let db = null;

const intially = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (e) {
    Console, log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

intially();
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (Request, Response) => {
  const getteam = `
  SELECT
  *
  FROM 
  cricket_team;`;
  const team = await db.all(getteam);
  Response.send(
    team.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

app.post("/players/", async (Request, Response) => {
  const playerdetails = Request.body;
  const { playerName, jerseyNumber, role } = playerdetails;
  const player = `
    INSERT INTO 
    cricket_team(player_name,jersey_number,role)
    VALUES
    ('${playerName}',${jerseyNumber},'${role}');`;
  const dbresponse = await db.run(player);
  Response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (Request, Response) => {
  const { playerId } = Request.params;
  const player = `
    SELECT
    *
    FROM
    cricket_team
    WHERE 
    player_id=${playerId};`;
  const id = await db.get(player);
  Response.send(convertDbObjectToResponseObject(id));
});

app.put("/players/:playerId/", async (Request, Response) => {
  const { playerId } = Request.params;
  const playerdetails = Request.body;
  const { playerName, jerseyNumber, role } = playerdetails;
  const player = `
    UPDATE
    cricket_team
    SET
    player_name='${playerName}',
    jersey_number=${jerseyNumber},
    role='${role}'
    WHERE
    player_id=${playerId};`;
  await db.run(player);
  Response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (Request, Response) => {
  const { playerId } = Request.params;

  const deletedetails = `
    DELETE FROM 
    cricket_team
    WHERE
    player_id=${playerId};`;
  await db.run(deletedetails);
  Response.send("Player Removed");
});
module.exports = app;
