const MAX_CREEPS_PER_SOURCE = 2;

class RoomProcessor {
    constructor(room) {
        this.room = room;
    }

    process() {
        console.log(`Processing ${this.room.name}`);

        const freeSource = this.getFreeEnergySource();

        if (freeSource) {
            console.log('Building new miner...');
            this.buildMiner(Math.floor(Math.random() * 10000));
        }
    }
    
    getMyCreeps() {
        return this.room.find(FIND_CREEPS).filter(c => c.my);
    }

    getMyCreepsByRole(role) {
        return this.getMyCreeps().filter(c => c.memory.role === role);
    }

    getEnergySources() {
        if (_.isEmpty(this.room.memory.sources)) {
            this.room.memory.sources = this.room.find(FIND_SOURCES);
        }
        return this.room.memory.sources;
    }

    getFreeEnergySource() {
        const sources = this.getEnergySources();
        const creeps = this.getMyCreepsByRole('miner');

        const freeSources = sources.filter(s => creeps.filter(c => c.memory.sourceId === s.id).length < MAX_CREEPS_PER_SOURCE);

        console.log(freeSources.length);

        return freeSources.length > 0 ? freeSources[0] : false;
    }

    buildMiner(name) {
        const spawn = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], `Miner${name}`, {
            memory: {
                role: 'miner',
                room: this.room.name
            }
        });

        console.log(spawn);
    }
};

module.exports = RoomProcessor;