import { Map } from './Map.js';
import { Player } from './Player.js';
import { GameTracker } from './GameTracker.js';
import * as gameModule from './index.js';

describe('Game Integration', () => {
    let map, player, gameTracker;

    beforeEach(() => {
        map = new Map('home', 'white');
        player = new Player({
            position: { x: 0, y: 0 },
            imageSrc: 'player.png',
            scale: 1,
            frameRate: 1,
        });
        gameTracker = new GameTracker();
        gameModule.setCurrentMap(map);
        gameModule.player = player;
        gameModule.gameTracker = gameTracker;
    });

    test('Player can move and interact with map elements', () => {
        map.init();
        player.position = { x: map.entrances[0].position.x, y: map.entrances[0].position.y };

        // Simulate player moving to dungeon entrance
        gameModule.handleKeyDown({ key: 'ArrowUp' });

        expect(gameModule.level).not.toBe(0); // Level should change
        expect(gameTracker.dungeonEntries).toContain(1); // Should track dungeon entry
    });

    test('Game cycle from start to end', () => {
        gameModule.startGame();
        expect(gameModule.gameStarted).toBe(true);

        // Simulate playing through rounds
        for (let i = 0; i < gameModule.totalRounds; i++) {
            gameModule.dashboard.round = i + 1;
            map.init();
            player.enterLevel(map, {});
            gameModule.dashboard.updatePoints(50);
        }

        gameModule.endGame();
        expect(gameModule.gameEnded).toBe(true);
        expect(gameTracker.exportToCSV()).toBeDefined();
    });
});