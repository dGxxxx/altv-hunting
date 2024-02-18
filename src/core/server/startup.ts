import * as alt from 'alt-server';

const fleeDuration = 3000;
const animalSpawnPoints: alt.Vector3 [] = [
    new alt.Vector3(-1725.521, 4699.659, 33.80555),
    new alt.Vector3(-1690.836, 4682.494, 24.47228),
    new alt.Vector3(-1661.219, 4650.042, 26.12522),
    new alt.Vector3(-1613.11, 4632.693, 46.37965),
    new alt.Vector3(-1569.1, 4688.946, 48.04772),
    new alt.Vector3(-1549.585, 4766.055, 60.47577),
    new alt.Vector3(-1461.021, 4702.999, 39.26906),
    new alt.Vector3(-1397.87, 4637.824, 72.12587),
    new alt.Vector3(-617.851, 5762.557, 31.45378),
    new alt.Vector3(-613.3984, 5863.435, 22.00531),
    new alt.Vector3(-512.6949, 5940.441, 34.46115),
    new alt.Vector3(-363.9753, 5921.967, 43.97315),
    new alt.Vector3(-384.0528, 5866.263, 49.28809),
    new alt.Vector3(-374.6584, 5798.462, 62.83068),
    new alt.Vector3(-448.7513, 5565.69, 71.9878),
    new alt.Vector3(-551.2087, 5167.825, 97.50465),
    new alt.Vector3(-603.5089, 5154.867, 110.1652),
    new alt.Vector3(-711.7279, 5149.544, 114.7229),
    new alt.Vector3(-711.3442, 5075.649, 138.9036),
    new alt.Vector3(-672.9759, 5042.516, 152.8032),
    new alt.Vector3(-661.6283, 4974.586, 172.7258),
    new alt.Vector3(-600.277, 4918.438, 176.7214),
    new alt.Vector3(-588.3793, 4889.981, 181.3767),
    new alt.Vector3(-549.8376, 4838.274, 183.2239),
    new alt.Vector3(-478.639, 4831.655, 209.2594),
    new alt.Vector3(-399.3954, 4865.303, 203.7752),
    new alt.Vector3(-411.9441, 4946.082, 177.4535),
    new alt.Vector3(-414.8653, 5074.294, 149.0627)
];

let animalList: Animal [] = [];

const enum AnimalStatus {
    Wandering,
    Fleeing,
    Grazing
};

const enum AnimalType {
    Deer = "a_c_deer",
    Boar = "a_c_boar"
};

class Animal {
    animalPed: alt.Ped;
    animalSpawn: alt.Vector3;
    animalStatus: AnimalStatus;
    animalType: AnimalType;

    constructor(spawnPosition: alt.Vector3, animalType: AnimalType) {
        this.animalPed = new alt.Ped(animalType, spawnPosition, new alt.Vector3(0, 0, 0));
        this.animalSpawn = spawnPosition;
        this.animalStatus = AnimalStatus.Wandering;
        this.animalType = animalType;
    };

    public setInitialStatus() {
        this.animalPed.netOwner.emitRaw('clientHunting:setIntialStatus', this.animalPed);
        this.setAnimalStatus();
    };

    private setAnimalStatus() {
        switch (this.animalStatus) {
            case AnimalStatus.Grazing:
                this.animalPed.netOwner.emitRaw('clientHunting:setAnimalGrazing', this.animalPed);
                break;
            case AnimalStatus.Wandering:
                this.animalPed.netOwner.emitRaw('clientHunting:setAnimalWandering', this.animalPed, this.animalSpawn);
                break;
            case AnimalStatus.Fleeing:
                // this.animalPed.netOwner.emitRaw('clientHunting:setAnimalFleeing', this.animalPed);
                break;
        }
    }

    public setFleeing(fromEntity: alt.Player) {
        this.animalStatus = AnimalStatus.Fleeing;
    };

    public setWandering() {
        this.animalStatus = AnimalStatus.Wandering;
    };

    public setGrazing() {
        this.animalStatus = AnimalStatus.Grazing;
    };
};

alt.on('resourceStart', () => {
    let isDeer = true;
    
    animalSpawnPoints.forEach(animalPosition => {
        let animalObj = new Animal(animalPosition, isDeer ? AnimalType.Deer : AnimalType.Boar);
        animalList.push(animalObj);

        isDeer = !isDeer;
    });
});

alt.on('playerConnect', (player: alt.Player) => {
    player.model = 'mp_m_freemode_01';
    player.spawn(-1725.521, 4699.659, 33.80555, 0);
    player.giveWeapon('weapon_pistol', 100, true);
});

alt.onClient('serverHunting:netOwnerChange', (player: alt.Player, remoteId: number) => {
    let foundAnimal = animalList.find(x => x.animalPed.id == remoteId);
    if (foundAnimal == null || foundAnimal == undefined) return;

    foundAnimal.setInitialStatus();
});
