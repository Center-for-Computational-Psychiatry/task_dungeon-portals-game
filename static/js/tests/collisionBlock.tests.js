import { CollisionBlock } from '../data/CollisionBlock.js';

describe('CollisionBlock', () => {
    let collisionBlock;
    const mockContext = {
        fillStyle: '',
        fillRect: jest.fn(),
    };

    beforeEach(() => {
        collisionBlock = new CollisionBlock({ position: { x: 10, y: 20 } });
    });

    test('constructor initializes properties correctly', () => {
        expect(collisionBlock.position).toEqual({ x: 10, y: 20 });
        expect(collisionBlock.width).toBe(64);
        expect(collisionBlock.height).toBe(64);
    });

    test('draw method calls context methods with correct arguments', () => {
        collisionBlock.draw(mockContext);
        expect(mockContext.fillStyle).toBe('rgba(100, 100, 100, 0.5)');
        expect(mockContext.fillRect).toHaveBeenCalledWith(10, 20, 64, 64);
    });
});