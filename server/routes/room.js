const express = require("express");
const roomRouter = express.Router();
const RoomController = require("../controllers/roomController");

roomRouter.get("/", RoomController.findRooms);
// roomRouter.get("/occupied", RoomController.findAllOccupied);
// roomRouter.get("/notOccupied", RoomController.findNotOccupied);
roomRouter.post("/", RoomController.addRoom);
roomRouter.get("/:id", RoomController.getRoomById);
roomRouter.put("/:id", RoomController.updateRoom);
roomRouter.patch("/:id", RoomController.updateStatus);
roomRouter.delete("/:id", RoomController.deleteRoom);


module.exports = roomRouter;