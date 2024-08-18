import { bindEventListeners, handleKeyDown, handleKeyUp } from './eventListeners.js';
import * as gameModule from './index.js';

jest.mock('./index.js', () => ({
    gameStarted: false,
    currentScreen: 0,
    incrementCurrentScreen: jest.fn(),
    displayInstructions: jest.fn(),
    setGameStarted: jest.fn(),
    startGame: jest.fn(),
    player: { preventInput: false },
    keys: { ArrowLeft: { pressed: false }, ArrowRight: { pressed: false } },
}));

describe('Event Listeners', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('bindEventListeners adds event listeners', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        bindEventListeners();
        expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    test('handleKeyDown progresses through instruction screens', () => {
        handleKeyDown({ key: 'Enter' });
        expect(gameModule.incrementCurrentScreen).toHaveBeenCalled();
        expect(gameModule.displayInstructions).toHaveBeenCalled();
    });

    test('handleKeyDown starts game after instructions', () => {
        gameModule.currentScreen = gameModule.totalScreens;
        handleKeyDown({ key: 'Enter' });
        expect(gameModule.setGameStarted).toHaveBeenCalledWith(true);
        expect(gameModule.startGame).toHaveBeenCalled();
    });

    test('handleKeyUp updates key states', () => {
        gameModule.gameStarted = true;
        handleKeyUp({ key: 'ArrowLeft' });
        expect(gameModule.keys.ArrowLeft.pressed).toBe(false);
    });
});