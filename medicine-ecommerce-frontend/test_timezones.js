const zones = ['Asia/Kolkata', 'America/New_York', 'Europe/London', 'America/Anchorage'];
const locales = ['en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN'];

console.log('Testing Intl.DateTimeFormat timezone abbreviations:\n');

zones.forEach(zone => {
    console.log(`TIMEZONE: ${zone}`);
    locales.forEach(locale => {
        const fmt = new Intl.DateTimeFormat(locale, {
            timeZone: zone,
            timeZoneName: 'short',
        });
        console.log(`  ${locale}: ${fmt.format(new Date())}`);
    });
    console.log('');
});
