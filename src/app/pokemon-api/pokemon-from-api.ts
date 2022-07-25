export interface PokemonFromApi {
  id: number;
  name: string;
  sprites: {
    // Default sprite from game
    front_default: string;
    other: {
      "official-artwork": {
        // Official artwork
        front_default: string;
      }
    }
  }
}


