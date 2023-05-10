import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ObjetivoService } from 'src/app/services/objetivo.service';

@Component({
  selector: 'app-objetivo',
  templateUrl: './objetivo.component.html',
  styleUrls: ['./objetivo.component.css'],
})
export class ObjetivoComponent {
  user: any;

  constructor(
    private authService: AuthService,
    private objetivoService: ObjetivoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  seleccionarObjetivo(opcion: string) {
    this.objetivoService.seleccionarObjetivo(this.user, opcion).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/main']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
