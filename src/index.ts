import { scrape } from "./scraper";

export async function main(): Promise<void>
{
    await scrape('Noble Park', 'live-counts.json');
}

if (require.main === module)
{
    main();
}
