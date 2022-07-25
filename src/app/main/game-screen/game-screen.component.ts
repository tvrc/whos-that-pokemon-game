import { Component, OnInit } from '@angular/core';
import { PokemonLoaderService } from '../pokemon-loader.service';
import { PokemonVm } from '../pokemon-vm';
import { PokemonQueue } from '../pokemon-queue';
import { FormControl } from '@angular/forms';
import { delay, filter, mergeMap, tap } from 'rxjs';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnInit {

  loadedPokemonQueue: PokemonQueue = new PokemonQueue();
  idsOfLoadedPokemon: number[] = [];
  minLoadedPokemonId = 1;
  maxLoadedPokemonId = 16;
  activePokemon: PokemonVm | null = null;
  allActivePokemon: PokemonVm[] = [];
  pokemonNameControl: FormControl<string | null> = new FormControl<string | null>(null);

  constructor(private pokemonLoaderService: PokemonLoaderService) { }

  ngOnInit(): void {
    /**
     * Load several Pokemon, enqueue them and dequeue first
     */
    this.pokemonLoaderService.getPokemons(this.getRandomUnusedPokemonIds(8))
      .subscribe((pokemonVms) => {
        this.loadedPokemonQueue.enqueueMany(pokemonVms);
        this.loadedPokemonQueue.dequeue();
      });

    /**
     * Listen to dequeue operation.
     * If occurs:
     * - make dequeued Pokemon active
     * - push it to array with all active Pokemon
     * - if queue has small amount of Pokemon left, load and enqueue more Pokemon
     */
    this.loadedPokemonQueue.dequeue$
      .pipe(
        tap((pokemonVm) => {
          this.activePokemon = pokemonVm;
          if (pokemonVm) {
            this.allActivePokemon.push(pokemonVm);
          }
        }),
        filter(() => this.loadedPokemonQueue.size() <= 4),
        mergeMap(() => this.pokemonLoaderService.getPokemons(this.getRandomUnusedPokemonIds(4))),
        tap((pokemonVms) => this.loadedPokemonQueue.enqueueMany(pokemonVms))
      )
      .subscribe();

    /**
     * Listen to form control changes:
     * If occurs:
     * - check if entry value is the same as active Pokemon name
     * - dequeue Pokemon
     * - clear form control
     */
    this.pokemonNameControl.valueChanges
      .pipe(
        filter((value) => {
          return Boolean(value) && value?.toLowerCase() === this.activePokemon?.name;
        }),
        delay(100),
        tap(() => {
          this.loadedPokemonQueue.dequeue();
          this.pokemonNameControl.setValue(null, { emitEvent: false });
        })
      )
      .subscribe();
  }

  private getRandomUnusedPokemonIds(amount: number): number[] {
    const randomPokemonIds: number[] = [];
    let randomNumber;
    for (let i = 0; i < amount; i++) {
      do {
        randomNumber = Math.floor(Math.random() * (this.maxLoadedPokemonId - this.minLoadedPokemonId + 1)) + this.minLoadedPokemonId;
      } while(this.idsOfLoadedPokemon.includes(randomNumber))
      if (randomNumber === this.minLoadedPokemonId) {
        this.minLoadedPokemonId = randomNumber + 1;
      } else if (randomNumber === this.maxLoadedPokemonId) {
        this.maxLoadedPokemonId = randomNumber - 1;
      }
      randomPokemonIds.push(randomNumber);
      this.idsOfLoadedPokemon.push(randomNumber);
    }
    return randomPokemonIds;
  }
}
