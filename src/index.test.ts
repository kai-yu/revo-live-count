import { dateToYmd, JSON_FILE_PREFIX, LOCATION, main, TIMEZONE } from '.';
import { scrape } from './scraper';

jest.mock('./scraper', () => ({
    scrape: jest.fn(),
}));

describe('dateToYmd', () => {
    it('should return the date in Y-m-d format', () => {
        const date = new Date('2021-01-01T00:00:00');
        const timezone = 'Australia/Melbourne';

        expect(dateToYmd(date, timezone)).toBe('2021-01-01');
    });

    it('should return the date in Y-m-d format for a different timezone', () => {
        const date = new Date('2021-01-01T00:00:00');
        const timezone = 'America/New_York';

        expect(dateToYmd(date, timezone)).toBe('2020-12-31');
    });
});

describe('index.ts', () => {
    it('should call scrape function with location and file path with date', async () => {
        const date = new Date('2021-01-01T00:00:00');
        jest.useFakeTimers().setSystemTime(date.getTime());

        await main();

        expect(scrape).toHaveBeenCalledWith(
            LOCATION,
            `${JSON_FILE_PREFIX}-${dateToYmd(date, 'Australia/Melbourne')}.json`,
        );
        expect(scrape).toHaveBeenCalledTimes(1);
    });
});
