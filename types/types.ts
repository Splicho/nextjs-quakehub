// Define the Server type if it's not already defined elsewhere
export interface Server {
    addr: string;
    name: string;
    mapname: string;
    humans: number;
    maxplayers: number;
    country: {
        code: string;
        name: string;
        continent: string;
    };
    visibility: string;
    game: string;
    tags: string[];
    players: Player[];
    spectators: number;
}

export interface Player {
    name: string;
    duration: number;
    score: number;
    'plain-name': string;
}

export interface FiltersType {
    continent: string;
    showFullServers: boolean;
    showEmptyServers: boolean;
    showPrivateServers: boolean;
    game: string;
    tags: string[];
}

// You can add other shared types here as well