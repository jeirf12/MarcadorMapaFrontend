import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Marcadorservicio } from '../servicios/marcador.service';
import { Marcador } from '../modelos/marcador';
import { PopupComponente } from './popup/popup.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { GoogleMapsModule, MapGeocoder } from '@angular/google-maps';
import { Popup } from '../modelos/popup';
import { MostrarInformacionComponente } from './mostrarInformacion/mostrarInformacion.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    GoogleMapsModule,
    PopupComponente,
    MostrarInformacionComponente,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  estado: Popup;

  marcadores: Marcador[];

  marcadorSeleccionado: Marcador;

  nombre: string;

  descripcion: string;

  esEliminar: boolean;

  opcionesMapa: any;

  opcionesMarcador: any;

  esVer: boolean;

  esCrear: boolean;

  constructor(
    private marcadorServicio: Marcadorservicio,
    private mensajeServicio: NzMessageService,
    private geolocalizacionServicio: MapGeocoder,
  ) {
    this.estado = new Popup();
    this.marcadores = [];
    this.marcadorSeleccionado = new Marcador();
    this.nombre = '';
    this.descripcion = '';
    this.esEliminar = false;
    this.esVer = false;
    this.esCrear = false;
  }

  ngOnInit(): void {
    this.cargarMarcadores();
    this.opcionesMapa = {
      center: { lat: 2.43823, lng: -76.61316 },
      zoom: 10
    };
    this.opcionesMarcador = { draggable: false };
  }

  agregarMarcador(event: google.maps.MapMouseEvent) {
    let marcador = new Marcador();
    this.geolocalizacionServicio.geocode({ location: event.latLng }).subscribe({
      next: (resultado) => {
        if(resultado.status == 'OK') {
          marcador.nombre = resultado.results[0].formatted_address;
          marcador.descripcion = resultado.results[0].formatted_address;
          marcador.latitud = '' + event.latLng?.toJSON()['lat'];
          marcador.longitud = '' + event.latLng?.toJSON()['lng'];
          this.esCrear = true;
          this.seleccionarMarcador(marcador);
        }
      }
    });
  }

  mostrarInformacion(marcadorSeleccionado: Marcador, esVer: boolean) {
    this.marcadorSeleccionado = marcadorSeleccionado;
    this.esVer = esVer;
  }

  seleccionarMarcador(marcadorSeleccionado: Marcador, esEliminar: boolean = false) {
    this.marcadorSeleccionado = marcadorSeleccionado;
    this.nombre = marcadorSeleccionado.nombre;
    this.descripcion = marcadorSeleccionado.descripcion;
    this.estado.estado = true;
    this.esEliminar = esEliminar;
  }

  cambiarEstado(estado: Popup) {
    this.estado = estado;
    if(this.estado.metodo === 'ok' && this.esCrear && !this.esEliminar) this.guardarMarcador(this.marcadorSeleccionado);
    if(this.estado.metodo === 'ok' && !this.esCrear && !this.esEliminar) this.editarMarcador(this.marcadorSeleccionado, this.marcadorSeleccionado.id);
    else if(this.estado.metodo === 'ok' && !this.esCrear && this.esEliminar) this.eliminarMarcador(this.marcadorSeleccionado.id);
    else if(this.estado.metodo === 'cancelar' && !this.esCrear) this.mensajeServicio.info(`La ${this.esEliminar ? 'eliminación' : 'edición'} del marcador fue cancelado`);
    else if(this.estado.metodo === 'cancelar' && this.esCrear) this.mensajeServicio.info('No se ha guardado el marcador');
    this.resetearBanderas();
  }

  resetearBanderas() {
    this.esCrear = false;
    this.esEliminar = false;
    this.esVer = false;
  }

  cargarMarcadores() {
    this.marcadorServicio.obtenerMarcadores().subscribe({
      next: (marcadores) => {
        this.marcadores = marcadores;
      },
      error: (err) => {
        console.error('No se pudo cargar los marcadores');
      },
    });
  }

  guardarMarcador(marcador: Marcador) {
    if(this.nombre.trim() === '') {
      this.mensajeServicio.info('El nombre no puede ser vacío');
      return;
    }
    if(this.descripcion.trim() === '') {
      this.mensajeServicio.info('La descripción no puede ser vacío');
      return;
    }
    marcador.nombre = this.nombre;
    marcador.descripcion = this.descripcion;
    this.marcadorServicio.crearMarcador(marcador).subscribe({
      next: (marcador) => {
        this.marcadores.push(marcador);
        this.mensajeServicio.success('Se agregó el marcador');
      },
      error: (err) => {
        this.mensajeServicio.error('No se pudo guardar el marcador');
      }
    });
  }

  editarMarcador(marcador: Marcador, id: number) {
    if(this.nombre.trim() === '') {
      this.mensajeServicio.info('El nombre no puede ser vacío');
      return;
    }
    if(this.descripcion.trim() === '') {
      this.mensajeServicio.info('La descripción no puede ser vacío');
      return;
    }
    marcador.nombre = this.nombre;
    marcador.descripcion = this.descripcion;
    this.marcadorServicio.editarMarcador(marcador, id).subscribe({
      next: (marcador) => {
        this.mensajeServicio.success('El marcador ha sido editado correctamente!');
      },
      error: (err) => {
        this.mensajeServicio.error('No se pudo editar el marcador');
      }
    })
  }

  eliminarMarcador(id: number) {
    this.marcadorServicio.eliminarMarcador(id).subscribe({
      next: (respuesta) => {
        if(respuesta) {
          this.marcadores = this.marcadores.filter(marcador => marcador.id !== id);
          this.mensajeServicio.success('El marcador se ha eliminado correctamente');
        }
        else this.mensajeServicio.error('Lo sentimos, no se pudo eliminar el marcador');
      },
      error: (err) => {
        this.mensajeServicio.error('Lo sentimos, no se pudo eliminar el marcador');
      }
    });
  }
}
