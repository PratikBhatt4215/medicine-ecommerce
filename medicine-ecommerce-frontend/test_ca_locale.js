const zones = ['Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney', 'Asia/Kolkata', 'America/New_York'];
const locale = 'en-CA';

console.log(`Testing ${locale} against diverse zones:\n`);

zones.forEach(zone => {
    const fmt = new Intl.DateTimeFormat(locale, {
        timeZone: zone,
        timeZoneName: 'short', 
    });
    console.log(`${zone}: ${fmt.format(new Date())}`);
});
