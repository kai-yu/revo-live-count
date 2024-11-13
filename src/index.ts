import { scrape } from "./scraper";

export const JSON_FILE_PREFIX = 'out/live-counts';
export const TIMEZONE = 'Australia/Melbourne';
export const LOCATION = 'Noble Park';

export function dateToYmd(date: Date, timezone: string): string
{
    const formatter = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: timezone,
    });

    // Format date and split it into parts
    const [{ value: year }, , { value: month }, , { value: day }] = formatter.formatToParts(date);

    return `${year}-${month}-${day}`;
}

export async function main(): Promise<void>
{
    const date = new Date();
    const filePath = `${JSON_FILE_PREFIX}-${dateToYmd(date, TIMEZONE)}.json`;

    await scrape(LOCATION, filePath);
}

if (require.main === module)
{
    main();
}
