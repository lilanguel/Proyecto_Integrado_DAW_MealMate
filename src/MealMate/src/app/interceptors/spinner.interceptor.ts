import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Muestra el spinner o indicador de carga utilizando el servicio "SpinnerService"
    this.spinnerService.show();

    // Intercepta la solicitud HTTP y pasa al siguiente interceptor en la cadena de interceptores
    // Retorna la respuesta observable de la solicitud HTTP
    return next.handle(req).pipe(
      // Al completarse la solicitud, se ejecuta la función "finalize" del operador "pipe"
      // Oculta el spinner o indicador de carga utilizando el servicio "SpinnerService"
      finalize(() => this.spinnerService.hide())
    );
  }
}
