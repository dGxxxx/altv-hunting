import * as alt from 'alt-client';
import * as native from 'natives';

alt.onServer("clientHunting:preparePed", (animalPed: alt.Ped) => {
    native.setEntityAsMissionEntity(animalPed.scriptID, true, false);
    native.freezeEntityPosition(animalPed.scriptID, false);
    native.setPedCanRagdoll(animalPed.scriptID, false);
    native.taskSetBlockingOfNonTemporaryEvents(animalPed.scriptID, true);
    native.setBlockingOfNonTemporaryEvents(animalPed.scriptID, true);
    native.setPedFleeAttributes(animalPed.scriptID, 0, false);
    native.setPedCombatAttributes(animalPed.scriptID, 17, true);
    native.setEntityInvincible(animalPed.scriptID, false);
    native.setPedSeeingRange(animalPed.scriptID, 0);
    native.taskStartScenarioInPlace(animalPed.scriptID, 'WORLD_DEER_GRAZING', -1, true);
});

alt.on('netOwnerChange', (entity: alt.Entity, owner: alt.Player, oldOwner: alt.Player) => {
    alt.emitServerRaw('serverHunting:checkAnimalId', entity.remoteID);
});

alt.onServer('clientHunting:smartFlee', (animalPed: alt.Ped, fleeFrom: alt.Player) => {
    native.taskSmartFleePed(animalPed.scriptID, fleeFrom.scriptID, 30, 5000, false, false);
});

alt.on('playerWeaponShoot', () => {
    alt.emitServerRaw('serverHunting:weaponShoot');
});