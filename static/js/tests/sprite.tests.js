import { Sprite } from '../classes/Sprite.js';

describe('Sprite', () => {
    let sprite;
    const mockContext = {
        drawImage: jest.fn(),
    };

    beforeEach(() => {
        sprite = new Sprite({
            position: { x: 0, y: 0 },
            imageSrc: 'test.png',
            scale: 2,
            frameRate: 4,
            frameBuffer: 5,
        });
    });

    test('constructor initializes properties correctly', () => {
        expect(sprite.position).toEqual({ x: 0, y: 0 });
        expect(sprite.scale).toBe(2);
        expect(sprite.frameRate).toBe(4);
        expect(sprite.frameBuffer).toBe(5);
    });

    test('image onload sets loaded flag and calculates dimensions', () => {
        sprite.image.onload();
        expect(sprite.loaded).toBe(true);
        expect(sprite.width).toBeDefined();
        expect(sprite.height).toBeDefined();
        expect(sprite.displayWidth).toBeDefined();
        expect(sprite.displayHeight).toBeDefined();
    });

    test('draw method calls context.drawImage when loaded', () => {
        sprite.loaded = true;
        sprite.width = 100;
        sprite.height = 100;
        sprite.draw(mockContext);
        expect(mockContext.drawImage).toHaveBeenCalled();
    });

    test('updateFrames increments currentFrame', () => {
        sprite.autoplay = true;
        sprite.frameBuffer = 1;
        sprite.frameRate = 2;
        sprite.updateFrames();
        expect(sprite.currentFrame).toBe(1);
    });

    test('play method sets autoplay to true', () => {
        sprite.autoplay = false;
        sprite.play();
        expect(sprite.autoplay).toBe(true);
    });

    test('reset method resets autoplay and currentFrame', () => {
        sprite.autoplay = true;
        sprite.currentFrame = 2;
        sprite.reset();
        expect(sprite.autoplay).toBe(false);
        expect(sprite.currentFrame).toBe(0);
    });
});