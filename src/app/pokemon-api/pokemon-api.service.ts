import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonFromApi } from './pokemon-from-api';

@Injectable()
export class PokemonApiService {
  constructor(private httpClient: HttpClient) {
  }

  getPokemon(pokemonNumber: number): Observable<PokemonFromApi> {
    return this.httpClient.get<PokemonFromApi>(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`);
  }
}
