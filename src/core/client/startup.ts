import * as alt from 'alt-client';
import * as native from 'natives';

alt.on('netOwnerChange', (animalEntity: alt.Entity, newOwner: alt.Player, oldOwner: alt.Player) => {
    alt.emitServerRaw('serverHunting:netOwnerChange', animalEntity.remoteID);
});

alt.on('playerWeaponShoot', (weaponHash: number, totalAmmo: number, ammoInClip: number) => {
    alt.emitServerRaw('serverHunting:weaponShot');
});

alt.on('keyup', (key: alt.KeyCode) => {
    if (key != 69) return;

    alt.emitServerRaw('serverHunting:pickupAnimal');
});

alt.onServer('clientHunting:setIntialStatus', async (animalPed: alt.Ped) => {
    await alt.Utils.waitFor(() => animalPed.isSpawned);

    native.setEntityAsMissionEntity(animalPed.scriptID, true, false);
    native.setPedCanRagdoll(animalPed.scriptID, false);
    native.taskSetBlockingOfNonTemporaryEvents(animalPed.scriptID, true);
    native.setBlockingOfNonTemporaryEvents(animalPed.scriptID, true);
    native.setPedFleeAttributes(animalPed.scriptID, 0, false);
    native.setPedCombatAttributes(animalPed.scriptID, 17, true);
    native.setPedSeeingRange(animalPed.scriptID, 0);
});

alt.onServer('clientHunting:setAnimalGrazing', async (animalPed: alt.Ped) => {
    let deerModel = alt.hash('a_c_deer');
    let boarModel = alt.hash('a_c_boar');

    await alt.Utils.waitFor(() => animalPed.isSpawned);

    native.clearPedTasks(animalPed);

    switch (animalPed.model) {
        case deerModel:
            native.taskStartScenarioInPlace(animalPed.scriptID, 'WORLD_DEER_GRAZING', -1, true);
            break;
        case boarModel: 
            native.taskStartScenarioInPlace(animalPed.scriptID, 'WORLD_BOAR_GRAZING', -1, true);
            break;
    }
});

alt.onServer('clientHunting:setAnimalWandering', async (animalPed: alt.Ped, randomCoords: alt.Vector2, coordsAngle: number) => {
    await alt.Utils.waitFor(() => animalPed.isSpawned);
    alt.FocusData.overrideFocus(animalPed.pos);

    let groundZ = native.getGroundZFor3dCoord(randomCoords.x, randomCoords.y, 100, 0, true, true);
    let numericGroundZ = groundZ[1];

    native.taskGoStraightToCoord(animalPed.scriptID, randomCoords.x, randomCoords.y, numericGroundZ, 1, 60000, coordsAngle, 0);
});

alt.onServer('clientHunting:setAnimalFleeing', async (animalPed: alt.Ped, fleeTarget: alt.Player, fleeDistance: number) => {
    await alt.Utils.waitFor(() => animalPed.isSpawned);

    native.taskSmartFleePed(animalPed, fleeTarget, fleeDistance, 10000, false, false);
});