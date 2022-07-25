import { PokemonApiService } from '../pokemon-api/pokemon-api.service';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { PokemonVm } from './pokemon-vm';
import { PokemonFromApi } from '../pokemon-api/pokemon-from-api';

@Injectable()
export class PokemonLoaderService {

  constructor(private pokemonApiService: PokemonApiService) {
  }

  getPokemon(pokemonNumber: number): Observable<PokemonVm> {
    const pokemonFromStorage: PokemonVm | null = this.loadFromStorage(pokemonNumber);
    if (pokemonFromStorage) {
      console.log(`Pokemon loaded from storage { id: ${pokemonFromStorage.id} name: ${pokemonFromStorage.name} }`);
      return of(pokemonFromStorage);
    } else {
      return this.pokemonApiService.getPokemon(pokemonNumber)
        .pipe(
          map((pokemonFromApi) => this.pokemonFromApiToVm(pokemonFromApi)),
          tap((pokemonVm) => {
            console.log(`Pokemon loaded from API { id: ${pokemonVm.id} name: ${pokemonVm.name} }`);
            this.saveToStorage(pokemonVm);
          })
        );
    }
  }

  private pokemonFromApiToVm(pokemonFromApi: PokemonFromApi): PokemonVm {
    return {
      id: pokemonFromApi.id,
      name: pokemonFromApi.name,
      imageUrl: pokemonFromApi.sprites.other['official-artwork'].front_default
    }
  }

  private loadFromStorage(pokemonNumber: number): PokemonVm | null {
    const itemFromStorage = localStorage.getItem(this.pokemonStorageKey(pokemonNumber));
    return itemFromStorage ? JSON.parse(itemFromStorage) as PokemonVm : null;
  }

  private saveToStorage(pokemonVm: PokemonVm): void {
    localStorage.setItem(this.pokemonStorageKey(pokemonVm.id), JSON.stringify(pokemonVm));
  }

  private pokemonStorageKey(pokemonNumber: number): string {
    return `wtpg_pokemon_${pokemonNumber}`;
  }
}
