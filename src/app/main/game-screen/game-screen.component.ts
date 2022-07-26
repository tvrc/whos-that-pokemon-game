import { Component, OnInit } from '@angular/core';
import { PokemonLoaderService } from '../pokemon-loader.service';
import { PokemonVm } from '../pokemon-vm';
import { PokemonQueue } from '../pokemon-queue';
import { FormControl } from '@angular/forms';
import { delay, filter, finalize, mergeMap, takeWhile, tap, timer } from 'rxjs';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnInit {

  loadedPokemonQueue: PokemonQueue = new PokemonQueue();
  idsOfLoadedPokemon: number[] = [];
  minIdOfPokemonToLoad = 1;
  maxIdOfPokemonToLoad = 16;
  activePokemon: PokemonVm | null = null;
  allActivePokemon: PokemonVm[] = [];
  pokemonNameControl: FormControl<string | null> = new FormControl<string | null>(null);
  secondsLeft = 20;

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
     * Timer
     */
    timer(1000, 1000).pipe(
      tap(() => --this.secondsLeft),
      takeWhile(() => this.secondsLeft > 0),
      finalize(() => {
        this.pokemonNameControl.setValue(null, {emitEvent: false});
        this.pokemonNameControl.disable({ emitEvent: false });
      })
    ).subscribe();

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
        randomNumber = Math.floor(Math.random() * (this.maxIdOfPokemonToLoad - this.minIdOfPokemonToLoad + 1)) + this.minIdOfPokemonToLoad;
      } while(this.idsOfLoadedPokemon.includes(randomNumber))
      if (randomNumber === this.minIdOfPokemonToLoad) {
        this.minIdOfPokemonToLoad = randomNumber + 1;
      } else if (randomNumber === this.maxIdOfPokemonToLoad) {
        this.maxIdOfPokemonToLoad = randomNumber - 1;
      }
      randomPokemonIds.push(randomNumber);
      this.idsOfLoadedPokemon.push(randomNumber);
    }
    return randomPokemonIds;
  }
}
