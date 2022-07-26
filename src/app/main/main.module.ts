import { NgModule } from '@angular/core';
import { PokemonApiModule } from '../pokemon-api/pokemon-api.module';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { GameScreenComponent } from './game-screen/game-screen.component';
import { MainRoutingModule } from './main-routing.module';
import { PokemonLoaderService } from './pokemon-loader.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MainComponent,
    GameScreenComponent
  ],
  imports: [
    MainRoutingModule,
    CommonModule,
    PokemonApiModule,
    ReactiveFormsModule,
  ],
  exports: [
    MainComponent
  ],
  providers: [
    PokemonLoaderService
  ]
})
export class MainModule { }
