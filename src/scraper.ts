import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

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

interface LiveCount {
    location: string;
    timestamp: string;
    count: number;
}

export function saveLiveCount(location: string, count: number, filePath: string): void {
    console.log('Saving live count:', count);

    // Melbourne timestamp
    const timestamp = new Date().toLocaleString('en-AU', {
        timeZone: 'Australia/Melbourne',
    });

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]');
    }

    const liveCount: LiveCount = {
        location,
        timestamp,
        count,
    };
    const data = fs.readFileSync(filePath, 'utf-8');
    const liveCounts = JSON.parse(data);

    liveCounts.push(liveCount);

    fs.writeFileSync(filePath, JSON.stringify(liveCounts, null, 2));
}

export async function scrape(location: string, filePath: string): Promise<void> {
    console.log('Fetching live count for:', location);

    await fetchLiveCount(location)
        .then((count) => saveLiveCount(location, count, filePath));
}
