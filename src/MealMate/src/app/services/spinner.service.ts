import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  isLoading$ = new Subject<boolean>();

  show(): void {
    // Emite un valor "true" a través del Subject "isLoading$"
    this.isLoading$.next(true);
  }

  hide(): void {
    // Emite un valor "false" a través del Subject "isLoading$"
    this.isLoading$.next(false);
  }
}
