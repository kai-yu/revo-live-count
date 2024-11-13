import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchLiveCount(location: string): Promise<number> {
    try {
        const response = await axios.get('https://revofitness.com.au/livemembercount/');
        const html = response.data;
        const $ = cheerio.load(html as string);

        return parseInt($(`div[data-location="${location}"] .live-count`).text().trim(), 10);
    } catch (error) {
        console.error('Error fetching live count:', error);

        return 0;
    }
}

fetchLiveCount('Noble Park');
