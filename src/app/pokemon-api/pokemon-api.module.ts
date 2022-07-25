import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PokemonApiService } from './pokemon-api.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    PokemonApiService
  ]
})
export class PokemonApiModule {
}
