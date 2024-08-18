import { Map } from '../classes/Map.js';
import { Sprite } from '../classes/Sprite.js';
import { Player } from '../classes/Player.js';
import { GameTracker } from '../classes/GameTracker.js';
import { Dashboard } from '../classes/Dashboard.js';
import { CollisionBlock } from '../classes/CollisionBlock.js';
import * as gameModule from '../index.js';

describe('Game Integration', () => {
    let map, player, gameTracker, sprite, collisionBlock, dashboard;
    const mockContext = {
        drawImage: jest.fn(),
        fillRect: jest.fn(),
        fillText: jest.fn(),
    };
    const mockCanvas = { width: 800, height: 600 };

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

        sprite = new Sprite({
            position: { x: 0, y: 0 },
            imageSrc: 'test-image.png',
        });
        collisionBlock = new CollisionBlock({ position: { x: 100, y: 100 } });
        dashboard = new Dashboard(10);
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

    test('Sprite can be drawn without interfering with CollisionBlock', () => {
        sprite.loaded = true;
        sprite.draw(mockContext);
        collisionBlock.draw(mockContext);
        expect(mockContext.drawImage).toHaveBeenCalled();
        expect(mockContext.fillRect).toHaveBeenCalled();
    });

    test('Dashboard updates correctly after sprite movement', () => {
        sprite.position.x += 50;
        dashboard.updatePoints(10);
        dashboard.refresh();
        dashboard.draw(mockContext, mockCanvas);
        expect(dashboard.points).toBe(10);
        expect(mockContext.fillText).toHaveBeenCalledTimes(2);
    });
});