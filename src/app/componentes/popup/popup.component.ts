import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Popup } from '../../modelos/popup';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    NzModalModule,
  ],
  templateUrl: './popup.component.html',
})
export class PopupComponente {

  @Input()
  titulo: string;

  @Input()
  estado: Popup;

  @Output()
  estadoCambiado: EventEmitter<Popup>;

  constructor() {
    this.titulo = '';
    this.estado = new Popup();
    this.estadoCambiado = new EventEmitter<Popup>();
  }

  cancelar() {
    this.estado.estado = false;
    this.estado.metodo = 'cancelar';
    this.estadoCambiado.next(this.estado);
  }

  confirmar() {
    this.estado.estado = false;
    this.estado.metodo = 'ok';
    this.estadoCambiado.next(this.estado);
  }
}
