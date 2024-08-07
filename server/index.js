import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3000);

let characters = [];

const items = {
  chair: {
    name: "Chair",
    size: [2, 2],
  },
  couch: {
    name: "Couch",
    size: [3, 2],
  },
};

const map = {
  size: [20, 10],
  gridDivision: 2,
  items: [
    { ...items.chair, gridPosition: [4, 4] },
    { ...items.chair, gridPosition: [4, 6], rotation: 2 },
    { ...items.couch, gridPosition: [10, 2], rotation: 0 },
  ],
};

const generateRandomPosition = () => {
  return [Math.random() * map.size[0], 0, Math.random() * map.size[1]];
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  });

  console.log("user connected");

  socket.emit("hello", {
    map,
    characters,
    id: socket.id,
  });

  io.emit("characters", characters);

  socket.on("move", (position) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    character.position = position;
    io.emit("characters", characters);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    characters = characters.filter((character) => character.id != socket.id);
    io.emit("characters", characters);
  });
});
