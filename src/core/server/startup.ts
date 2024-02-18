import * as alt from 'alt-server';

alt.on('playerConnect', handlePlayerConnect);

let animalList: alt.Ped[] = [];

const enum AnimalStatus {
    Wandering,
    Fleeing
};

function handlePlayerConnect(player: alt.Player) {
    player.model = 'mp_m_freemode_01';
    player.spawn(870.01, 5158.01, 452.54, 0);
    player.giveWeapon('weapon_pistol', 100, true);
};

function spawnAnimals(): void {
    let firstAnimal = new alt.Ped('a_c_deer', new alt.Vector3(870.01, 5158.01, 452.54), new alt.Vector3(0, 0, 0));
    animalList.push(firstAnimal);
};

spawnAnimals();

alt.onClient('serverHunting:checkAnimalId', (player: alt.Player, remoteId: number) => {
    let foundAnimal = animalList.find(x => x.id == remoteId);
    if (foundAnimal == null) return;

    foundAnimal.netOwner.emitRaw('clientHunting:preparePed', foundAnimal);
    foundAnimal.setMeta("currentAction", AnimalStatus.Wandering);
});

alt.onClient('serverHunting:weaponShoot', (player: alt.Player) => {
    for (let index = 0; index < animalList.length; index++) {
        const animalPed = animalList[index];
        
        let posDistance = animalPed.pos.distanceTo(player.pos);
        if (posDistance > 30) continue;

        animalPed.netOwner.emitRaw('clientHunting:smartFlee', animalPed, player);
        animalPed.setMeta("currentAction", AnimalStatus.Fleeing);
    }
});

alt.on('weaponDamage', (source: alt.Player, target: alt.Entity, weaponHash: number, damage: number, offset: alt.Vector3, bodyPart: alt.BodyPart) => {
    if (target.netOwner == null) return;
    
    let foundAnimal = animalList.find(x => x.id == target.id);

    if (foundAnimal == null) return;

    let currentAction = foundAnimal.getMeta("currentAction") as AnimalStatus;
    
    if (currentAction == AnimalStatus.Fleeing) return;
    if (foundAnimal.health === 0) return;

    target.netOwner.emitRaw('clientHunting:smartFlee', foundAnimal, source);
    target.setMeta("currentAction", AnimalStatus.Fleeing);
});
