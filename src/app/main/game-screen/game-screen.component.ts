import { Component, OnInit } from '@angular/core';
import { PokemonLoaderService } from '../pokemon-loader.service';
import { PokemonVm } from '../pokemon-vm';
import { PokemonQueue } from '../pokemon-queue';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnInit {

  idsOfUsedPokemon: number[] = [];
  activePokemon: PokemonVm | null = null;
  pokemonQueue: PokemonQueue = new PokemonQueue();

  constructor(private pokemonLoaderService: PokemonLoaderService) { }

  ngOnInit(): void {
    this.pokemonLoaderService.getPokemons(this.getRandomPokemonIds(5))
      .subscribe((pokemonVms) => {
        this.pokemonQueue.enqueueMany(pokemonVms);
        this.pokemonQueue.dequeue();
      });

    this.pokemonQueue.dequeue$.subscribe((pokemonVm) => {
      this.activePokemon = pokemonVm;
    });
  }

  private getRandomPokemonIds(amount: number): number[] {
    const min = 1;
    const max = 6;
    const randomPokemonIds: number[] = [];
    let randomNumber;
    for (let i = 0; i < amount; i++) {
      do {
        randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      } while(this.idsOfUsedPokemon.includes(randomNumber))
      randomPokemonIds.push(randomNumber);
      this.idsOfUsedPokemon.push(randomNumber);
    }
    return randomPokemonIds;
  }
}
