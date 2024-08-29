import { NextResponse } from 'next/server';

// Use environment variables for API keys
const IP_GEOCODING_API_URL = `https://ipinfo.io/{IP_ADDRESS}/json?token=${process.env.IPINFO_API_KEY}`;

async function getCountryCodeFromIP(ip: string): Promise<string | null> {
  try {
    const response = await fetch(IP_GEOCODING_API_URL.replace('{IP_ADDRESS}', ip));
    const data = await response.json();
    return data.country || null;
  } catch (error) {
    console.error('Error resolving IP to country code:', error);
    return null;
  }
}

export async function GET() {
  try {
    const steamApiKey = process.env.STEAM_API_KEY;
    if (!steamApiKey) {
      return NextResponse.json({ error: 'Steam API key is not set in environment variables' }, { status: 500 });
    }

    const url = `https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${steamApiKey}&filter=appid%5C282440&limit=10`;
    console.log('Request URL:', url);

    const response = await fetch(url);
    const responseBody = await response.text(); // Log response as text for detailed inspection
    console.log('Raw API response body:', responseBody);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch server list from Steam API', details: responseBody }, { status: response.status });
    }

    const data = JSON.parse(responseBody); // Attempt to parse the response body
    console.log('Parsed API response data:', data);

    // Check and access the nested structure
    if (!data.response || !Array.isArray(data.response.servers)) {
      return NextResponse.json({ error: 'Unexpected data structure', details: data }, { status: 500 });
    }

    // Enrich server data with country codes
    const serversWithCountryCodes = await Promise.all(
      data.response.servers.map(async (server: any) => {
        const countryCode = await getCountryCodeFromIP(server.addr.split(':')[0]);
        return {
          ...server,
          countryCode: countryCode ? countryCode.toLowerCase() : 'unknown',
        };
      })
    );

    return NextResponse.json(serversWithCountryCodes);
  } catch (error) {
    console.error('Error fetching server list:', error);
    return NextResponse.json({ error: 'Failed to fetch servers', details: (error as Error).message }, { status: 500 });
  }
}
