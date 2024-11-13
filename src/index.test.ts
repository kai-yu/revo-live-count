import { main } from '.';
import { scrape } from './scraper';

jest.mock('./scraper', () => ({
    scrape: jest.fn(),
}));

describe('index.ts', () => {
    it('should call scrape function with location and file path', async () => {
        await main();

        expect(scrape).toHaveBeenCalledWith('Noble Park', 'live-counts.json');
        expect(scrape).toHaveBeenCalledTimes(1);
    });
});
