import { fetchLiveCount, saveLiveCount } from './index';
import axios from 'axios';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

describe('fetchLiveCount', () => {
    it('should fetch the Noble Park live count', async () => {
        // spy on axios response
        const axiosGetSpy = jest.spyOn(axios, 'get');
        const location = 'Noble Park';
        axiosGetSpy.mockResolvedValue({
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { url: 'https://revofitness.com.au/livemembercount/' },
            data: `
        <div data-location="${location}">
          <span class="live-count">123</span>
        </div>
        `,
        });

        const count = await fetchLiveCount(location);

        expect(count).toBe(123);
    });

    it('should return 0 on error', async () => {
        // spy on axios response
        const axiosGetSpy = jest.spyOn(axios, 'get');
        const location = 'Noble Park';
        axiosGetSpy.mockRejectedValue('error');

        const count = await fetchLiveCount(location);

        expect(count).toBe(0);
    });
});

describe('saveLiveCount', () => {
    let filePath = '';

    beforeEach(() => {
        filePath = path.join(__dirname, `live-count-${randomUUID()}.test.json`);
    });

    afterEach(() => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });

    it('should save the live count to a non existing file', async () => {
        // spy on console.log
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        // spy on fs.writeFileSync
        const fsWriteFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

        const location = 'Noble Park';
        const count = 123;

        await saveLiveCount(location, count, filePath);

        expect(consoleLogSpy).toHaveBeenCalledWith('Saving live count:', count);
        expect(fsWriteFileSyncSpy).toHaveBeenCalledWith(
            expect.stringMatching(filePath),
            expect.stringMatching(/"count": 123/),
        );
    });

    it('should save the live count to an existing file', async () => {
        // spy on console.log
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        // spy on fs.writeFileSync
        const fsWriteFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

        const location = 'Noble Park';
        const count = 123;

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]');
        }

        await saveLiveCount(location, count, filePath);

        expect(consoleLogSpy).toHaveBeenCalledWith('Saving live count:', count);
        expect(fsWriteFileSyncSpy).toHaveBeenCalledWith(
            expect.stringMatching(filePath),
            expect.stringMatching(/"count": 123/),
        );
    });

    it('should save the live count to an existing file with existing data', async () => {
        // spy on console.log
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        // spy on fs.writeFileSync
        const fsWriteFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

        const location = 'Noble Park';
        const count = 123;

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]');
        }

        const liveCount = {
            location: 'Melbourne',
            timestamp: '2021-01-01T00:00:00',
            count: 100,
        };
        fs.writeFileSync(filePath, JSON.stringify([liveCount]));

        await saveLiveCount(location, count, filePath);

        expect(consoleLogSpy).toHaveBeenCalledWith('Saving live count:', count);
        expect(fsWriteFileSyncSpy).toHaveBeenCalledWith(
            expect.stringMatching(filePath),
            expect.stringMatching(/"count": 123/),
        );
    });
});
