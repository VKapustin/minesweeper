import Greed from '../script/grid';

describe('Verify map', () => {
    const greed = new Greed(9, 9, 10);

    test('Map is created', () => {
        expect(greed.map.length).toEqual(9);
        expect(greed.map[0].length).toEqual(9);
        expect(greed.mines.length).toEqual(10);
    });

    test('Mine are populated', () => {
        expect(greed.mines.length).toEqual(10);
    });
});

describe('Map manipulation', () => {
    const greed = new Greed(3, 3, 1);

    test('Add flag', () => {
        const mine = greed.mines[0];
        greed.addRemoveFlag(mine);
        expect(greed.flags.length).toEqual(1);
        expect(greed.flags[0]).toEqual(mine);
    });

    test('Remove flag', () => {
        const mine = greed.mines[0];
        greed.addRemoveFlag(mine, true);
        expect(greed.flags.length).toEqual(0);
    })
});