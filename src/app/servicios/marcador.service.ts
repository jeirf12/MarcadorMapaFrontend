import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { entorno } from '../../global/entorno';
import { Marcador } from '../modelos/marcador';

@Injectable({
  providedIn: 'root',
})
export class Marcadorservicio {
  private urlBase: string;

  constructor(
    private http: HttpClient
  ) {
    this.urlBase = entorno.marcador;
  }

  obtenerMarcadores() {
    return this.http.get<Marcador[]>(this.urlBase);
  }

  crearMarcador(
    marcador: Marcador
  ) {
    return this.http.post<Marcador>(this.urlBase, marcador);
  }

  editarMarcador(
    marcador: Marcador,
    id: number
  ) {
    return this.http.put<Marcador>(this.urlBase + '?id=' + id, marcador)
  }

  eliminarMarcador(
    id: number
  ) {
    return this.http.delete<boolean>(this.urlBase + '/' + id);
  }
}
