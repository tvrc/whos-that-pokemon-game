import { Component, OnInit } from '@angular/core';
import { PokemonLoaderService } from './pokemon-loader.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private pokemonLoaderService: PokemonLoaderService) { }

  ngOnInit(): void {
  }

}
