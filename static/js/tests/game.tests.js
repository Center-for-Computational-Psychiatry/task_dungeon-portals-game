import * as gameModule from '../index.js';
import { jest } from '@jest/globals';

jest.mock('../classes/Map.js');
jest.mock('../classes/Player.js');
jest.mock('../classes/Dashboard.js');
jest.mock('../classes/GameTracker.js');

describe('Game Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('canvas is properly initialized', () => {
        expect(gameModule.canvas).toBeDefined();
        expect(gameModule.canvas.width).toBe(gameModule.homeWidth);
        expect(gameModule.canvas.height).toBe(gameModule.homeHeight);
    });

    test('startGame initializes game elements', () => {
        gameModule.startGame();
        expect(gameModule.maps[gameModule.level].init).toHaveBeenCalled();
    });

    test('setLevel updates the current level', () => {
        gameModule.setLevel(2);
        expect(gameModule.level).toBe(2);
    });

    test('endGame sets gameEnded flag and cancels animation', () => {
        const mockCancelAnimationFrame = jest.spyOn(window, 'cancelAnimationFrame');
        gameModule.endGame();
        expect(gameModule.gameEnded).toBe(true);
        expect(mockCancelAnimationFrame).toHaveBeenCalled();
    });
});