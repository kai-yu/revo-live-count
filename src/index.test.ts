import { fetchLiveCount } from './index';
import axios from 'axios';

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
