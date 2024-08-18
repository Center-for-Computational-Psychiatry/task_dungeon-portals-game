import { Dashboard } from '../classes/Dashboard.js';

describe('Dashboard', () => {
    let dashboard;
    const mockContext = {
        font: '',
        fillStyle: '',
        fillText: jest.fn(),
    };
    const mockCanvas = { width: 800, height: 600 };

    beforeEach(() => {
        dashboard = new Dashboard(10);
    });

    test('constructor initializes properties correctly', () => {
        expect(dashboard.points).toBe(0);
        expect(dashboard.round).toBe(1);
        expect(dashboard.totalRounds).toBe(10);
    });

    test('draw method calls context methods with correct arguments', () => {
        dashboard.draw(mockContext, mockCanvas);
        expect(mockContext.font).toBe('bold 20px Verdana');
        expect(mockContext.fillStyle).toBe('black');
        expect(mockContext.fillText).toHaveBeenCalledTimes(2);
    });

    test('updatePoints increases points when change is positive', () => {
        dashboard.updatePoints(50);
        dashboard.refresh();
        expect(dashboard.points).toBe(50);
    });

    test('updatePoints does not decrease points below zero', () => {
        dashboard.updatePoints(-10);
        dashboard.refresh();
        expect(dashboard.points).toBe(0);
    });

    test('refresh method resets change to zero', () => {
        dashboard.updatePoints(30);
        dashboard.refresh();
        expect(dashboard.change).toBe(0);
    });
});