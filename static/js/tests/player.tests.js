import { Player } from './Player.js';

describe('Player', () => {
    let player;

    beforeEach(() => {
        player = new Player({
            position: { x: 0, y: 0 },
            imageSrc: 'player.png',
            scale: 1,
            frameRate: 1,
        });
    });

    test('constructor initializes player properties', () => {
        expect(player.position).toEqual({ x: 0, y: 0 });
        expect(player.velocity).toEqual({ x: 0, y: 0 });
        expect(player.gravity).toBeDefined();
    });

    test('update method applies gravity and checks collisions', () => {
        const mockCollisionBlocks = [];
        player.checkHorizontalCollisions = jest.fn();
        player.checkVerticalCollisions = jest.fn();
        player.update(mockCollisionBlocks);
        expect(player.checkHorizontalCollisions).toHaveBeenCalled();
        expect(player.checkVerticalCollisions).toHaveBeenCalled();
    });

    test('handleInput updates player state based on keys', () => {
        const mockKeys = {
            ArrowLeft: { pressed: true },
            ArrowRight: { pressed: false },
        };
        player.switchSprite = jest.fn();
        player.handleInput(mockKeys);
        expect(player.switchSprite).toHaveBeenCalledWith('runLeft');
        expect(player.velocity.x).toBeLessThan(0);
    });

    test('enterLevel method transitions player to new level', () => {
        const mockMap = { init: jest.fn() };
        const mockOverlay = { opacity: 0 };
        player.enterLevel(mockMap, mockOverlay);
        expect(mockMap.init).toHaveBeenCalled();
        expect(player.switchSprite).toHaveBeenCalledWith('emergeFromPortal');
    });
});