import { Component, OnInit } from '@angular/core';
import { PokemonLoaderService } from '../pokemon-loader.service';
import { PokemonVm } from '../pokemon-vm';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnInit {

  idsOfUsedPokemon: number[] = [];
  activePokemon: PokemonVm | null = null;

  constructor(private pokemonLoaderService: PokemonLoaderService) { }

  ngOnInit(): void {
    this.pokemonLoaderService.getPokemons(this.getRandomPokemonIds(5))
      .subscribe((pokemonVms) => {
        console.log(pokemonVms);
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
