import { GameTracker } from '../classes/GameTracker.js';

describe('GameTracker', () => {
    let gameTracker;

    beforeEach(() => {
        gameTracker = new GameTracker();
    });

    test('trackGameStart sets startTime', () => {
        gameTracker.trackGameStart();
        expect(gameTracker.startTime).toBeDefined();
    });

    test('trackRoundStart records round start time', () => {
        gameTracker.trackRoundStart(1);
        expect(gameTracker.roundStartTimes[1]).toBeDefined();
    });

    test('trackRoundEnd calculates round duration', () => {
        gameTracker.trackRoundStart(1);
        jest.advanceTimersByTime(5000);
        gameTracker.trackRoundEnd(1);
        expect(gameTracker.roundDurations[1]).toBeCloseTo(5, 0);
    });

    test('trackDungeonEntry records dungeon entry', () => {
        gameTracker.trackDungeonEntry(1);
        expect(gameTracker.dungeonEntries).toContain(1);
    });

    test('exportToCSV generates CSV string', () => {
        gameTracker.participantId = 'test123';
        gameTracker.trackGameStart();
        gameTracker.trackRoundStart(1);
        gameTracker.trackDungeonEntry(1);
        gameTracker.trackRoundEnd(1);
        const csv = gameTracker.exportToCSV();
        expect(csv).toContain('test123');
        expect(csv).toContain('Round 1');
    });
});