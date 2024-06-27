import { Component, Input } from '@angular/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Marcador } from '../../modelos/marcador';

@Component({
  selector: 'app-mostrarinformacion',
  standalone: true,
  imports: [
    NzToolTipModule,
  ],
  templateUrl: './mostrarInformacion.component.html'
})
export class MostrarInformacionComponente {

  @Input()
  visible: boolean;

  @Input()
  marcador: Marcador;

  constructor() {
    this.visible = false;
    this.marcador = new Marcador();
  }
}
