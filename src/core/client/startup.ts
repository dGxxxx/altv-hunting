import * as alt from 'alt-client';
import * as native from 'natives';

alt.on('netOwnerChange', (animalEntity: alt.Entity, newOwner: alt.Player, oldOwner: alt.Player) => {
    alt.emitServerRaw('serverHunting:netOwnerChange', animalEntity.remoteID);
});

alt.onServer('clientHunting:setIntialStatus', (animalPed: alt.Ped) => {
    native.setEntityAsMissionEntity(animalPed.scriptID, true, false);
    native.freezeEntityPosition(animalPed.scriptID, false);
    native.setPedCanRagdoll(animalPed.scriptID, false);
    native.taskSetBlockingOfNonTemporaryEvents(animalPed.scriptID, true);
    native.setBlockingOfNonTemporaryEvents(animalPed.scriptID, true);
    native.setPedFleeAttributes(animalPed.scriptID, 0, false);
    native.setPedCombatAttributes(animalPed.scriptID, 17, true);
    native.setEntityInvincible(animalPed.scriptID, false);
    native.setPedSeeingRange(animalPed.scriptID, 0);
});

alt.onServer('clientHunting:setAnimalGrazing', (animalPed: alt.Ped) => {
    native.taskStartScenarioInPlace(animalPed.scriptID, 'WORLD_DEER_GRAZING', -1, true);
});

alt.onServer('clientHunting:setAnimalWandering', (animalPed: alt.Ped, animalSpawnPosition: alt.Vector3) => {
    native.taskWanderInArea(animalPed.scriptID, animalSpawnPosition.x, animalSpawnPosition.y, animalSpawnPosition.z, 5.0, 0, 0);
});

alt.onServer('clientHunting:setAnimalFleeing', (animalPed: alt.Ped) => {
    native.taskStartScenarioInPlace(animalPed.scriptID, 'WORLD_DEER_GRAZING', -1, true);
});