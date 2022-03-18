import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() {}

  getComponents(): string[] {
    return Object.keys(environment.components).sort();
  }

  getInvestors(additional?: string): string[] {
    if (!!additional) {
      return [additional, ...environment.investors].sort();
    }

    return environment.investors.sort();
  }

  roundUp(n: number): number {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }
}
