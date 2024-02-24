# 🦌 alt:V Hunting

Preview: https://streamable.com/3jix8s


## Features:
- Allow the player to hunt animals naturally spawning.
- Animals will run away from the players when players get close.
- Animals will run away when guns are shot nearby.
- Make animals wander around without using `taskWanderInArea`.

### Known Problems:
- The running animation of the animal may be weird sometimes. There is nothing that can be done as far as I know to solve this problem.

### To Do:
- Optimisations for some server-side intervals.
- Test sync with more players. 

## Information:
- This is not a drag and drop system. There are still changes that you have to make for this system to work for your server. This is more of a template / idea of how a hunting system can be created.
- This was only tested using 2 players.
- This system was created using: [Typescript Boilerplate for alt:V](https://github.com/Stuyk/altv-typescript)

## Running the system:

```sh
npm install
```

```sh
npm run update
```

```sh
npm run dev
```

To close the server use: `CTRL + C` in the terminal.

### Contact:
- Discord: _dgx
