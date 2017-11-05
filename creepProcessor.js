class CreepProcessor {
    constructor(creep, roomProcessor) {
        this.roomProcessor = roomProcessor;
        this.creep = creep;
    }

    process() {
        this.delegateJob();        
    }

    delegateJob() {
        console.log(`Delegating ${this.creep.memory.role} work to ${this.creep.name}...`);
        this[`${this.creep.memory.role}Task`]();
    }

    minerTask() {
        // Check if inventory full
        const isFull = _.sum(this.creep.carry) >= this.creep.carryCapacity;

        // If inventory full or already upgrading - upgrade
        if (isFull || this.creep.memory.upgrading) {
            this.creep.memory.upgrading = true;
            this.upgradeRoomController();
            return;
        }

        // Find free source
        if (!this.creep.memory.sourceId) {
            const source = this.roomProcessor.getFreeEnergySource();
    
            if (!source) {
                console.log(`No free source for ${this.creep.name}!`);
                return;
            }
    
            this.creep.memory.sourceId = source.id;
        }

        const source = Game.getObjectById(this.creep.memory.sourceId);

        const harvest = this.creep.harvest(source);
        if(harvest == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(source);
        }
    }

    upgradeRoomController() {
        const { controller } = this.roomProcessor.room;
        if(this.creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(controller);
        }

        if (this.creep.carry[RESOURCE_ENERGY] === 0) {
            this.creep.memory.upgrading = false;
        }
    }
};

module.exports = CreepProcessor;