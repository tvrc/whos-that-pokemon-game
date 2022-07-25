import { PokemonVm } from './pokemon-vm';
import { BehaviorSubject, Observable } from 'rxjs';

export class PokemonQueue {

  private queue: PokemonVm[] = [];
  private dequeueSubject: BehaviorSubject<PokemonVm | null> = new BehaviorSubject<PokemonVm | null>(null);
  public dequeue$: Observable<PokemonVm | null> = this.dequeueSubject.asObservable();

  enqueue(pokemonVm: PokemonVm): void {
    this.queue.push(pokemonVm);
  }

  enqueueMany(pokemonVms: PokemonVm[]): void {
    this.queue.push(...pokemonVms);
  }

  dequeue(): void {
    const pokemonVm = this.queue.shift();
    if (pokemonVm) {
      this.dequeueSubject.next(pokemonVm);
    } else {
      throw new Error('PokemonQueue: trying to dequeue empty queue');
    }
  }

  size(): number {
    return this.queue.length;
  }

  reset(): void {
    this.queue = [];
  }
}
