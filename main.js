const RoomProcessor = require('./roomProcessor');
const CreepProcessor = require('./creepProcessor');

module.exports.loop = () => {
    const rooms = _.keys(Game.rooms).map(roomName => Game.rooms[roomName]);

    rooms.map(room => {
        const roomProcessor = new RoomProcessor(room);

        //Stage 1
        roomProcessor.process();

        const creeps = roomProcessor.getMyCreeps();
        creeps.map(creep => {
            const creepProcessor = new CreepProcessor(creep, roomProcessor);
            creepProcessor.process();
        })
    });;
};
