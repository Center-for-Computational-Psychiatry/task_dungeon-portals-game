import { Map } from './classes/Map.js';
import { Sprite } from './classes/Sprite.js';

jest.mock('./Sprite.js');

describe('Map', () => {
    let map;

    beforeEach(() => {
        map = new Map('home', 'white');
    });

    test('constructor initializes map properties', () => {
        expect(map.type).toBe('home');
        expect(map.color).toBe('white');
    });

    test('init sets up home map', () => {
        map.init();
        expect(map.entrances.length).toBeGreaterThan(0);
        expect(map.doors.length).toBe(0);
        expect(map.exit).toBeNull();
    });

    test('init sets up dungeon map', () => {
        map = new Map('dungeon', 'purple', {}, 50);
        map.init();
        expect(map.entrances.length).toBe(0);
        expect(map.doors.length).toBeGreaterThan(0);
        expect(map.exit).toBeInstanceOf(Sprite);
    });

    test('draw calls necessary drawing methods', () => {
        const mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
        };
        map.drawBackground = jest.fn();
        map.draw(mockContext);
        expect(map.drawBackground).toHaveBeenCalled();
    });
});