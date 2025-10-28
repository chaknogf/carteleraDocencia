import { mes, actividad, Estado, Meses } from './../interface/enum';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { Actividades, ActividadesVista, Detalles, Estados, Metadatos, Modalidades, PersonaResponsable, ServicioResponsables, SubdirecionPertenece, TipoActividad } from './../interface/interfaces';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from "../navs/navbar/navbar.component";
import { IconService } from '../service/icon.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { info } from 'console';
import { infoIcons } from '../shared/icons/icons';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent]
})
export class FormularioComponent implements OnInit, OnChanges {

  public enEdicion: boolean = false;
  public mesActividad: number = 0;
  public subdirecciones: SubdirecionPertenece[] = [];
  public serviciosResponsables: ServicioResponsables[] = [];
  public subRH: ServicioResponsables[] = [];
  public subGerencia: ServicioResponsables[] = [];
  public subMedica: ServicioResponsables[] = [];
  public subTecnica: ServicioResponsables[] = [];
  public subEnfermeria: ServicioResponsables[] = [];
  public direccion: ServicioResponsables[] = [];
  public modalidades: Modalidades[] = [];
  public estados: Estados[] = [];
  public tipoActividades: TipoActividad[] = [];
  encargado: string = '';
  jefe: string = '';
  localServicioId: number = 0;
  localSub = 0;
  role: string = '';

  meses: Meses[] = mes;

  detalle: Detalles = {
    link: '',
    duracion: '',
    grupo_dirigido: '',
    lugar: '',
    contenido: '',
    asistencia: 0,
    inasistencia: 0,
    excelente: 0,
    bueno: 0,
    regular: 0,
    deficiente: 0,
    fecha_entrega_informe: '',
    mes: 0,
    nota: ''
  };

  metadato: Metadatos = {
    user: '',
    registro: ''
  };

  persona_responsable: PersonaResponsable = {
    nombre: '',
    puesto: ''
  };

  actividad: Actividades = {
    id: 0,
    tema: '',
    actividad_id: 0,
    servicio_id: this.localServicioId,
    subdireccion_id: this.localSub,
    modalidad_id: 0,
    estado_id: 1,
    mes_id: 0,
    persona_responsable: {
      r0: this.persona_responsable
    },
    detalles: this.detalle,
    metadatos: this.metadato,
    tiempo_aproximado: '',
    fecha_programada: ''
  };

  options: { nombre: string; descripcion: string; ruta: string; icon: string }[] = [];

  private sanitizarSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
  // iconos
  icons: { [key: string]: any } = {};

  infoIcons: SafeHtml = infoIcons;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private iconService: IconService,
    private sanitizer: DomSanitizer,
  ) {
    this.icons = {
      infoico: this.sanitizarSvg(infoIcons)
    }
  }


  ngOnChanges(): void {
    this.onServicioSeleccionado()
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.localServicioId = Number(localStorage.getItem('servicio_id')) || 0;
    this.localSub = Number(localStorage.getItem('subId')) || 0;
    this.actividad.servicio_id = this.localServicioId;
    this.actividad.subdireccion_id = this.localSub;
    this.onServicioSeleccionado();


    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.api.getActividad(id)
          .then((data) => {
            this.actividad = data;
            this.actividad.detalles = this.actividad.detalles || {};
            this.actividad.detalles.nota = this.actividad.detalles.nota || '';
            this.detalle = this.actividad.detalles;

            this.enEdicion = true;
            // console.log('✅ Actividad cargada para edición');
            // console.log('Actividad a editar:', this.actividad.detalles.nota);
          })
          .catch((error) => {
            console.error('❌ Error al cargar actividad para edición:', error);
          });
      } else {
        console.warn('⚠️ ID inválido en la URL:', idParam);
      }
    } else {
      // Para nuevo registro, inicializamos detalle y metadato
      this.actividad.detalles = this.detalle;
      this.actividad.metadatos = this.metadato;
    }
    this.listarSubdirecciones();
    this.listarServicios();
    this.listarTipoActividad();
    this.listarModalidades();
    this.listarEstados();

    // console.log(this.actividad)

  }





  prepararActividadPayload(actividad: any, esActualizacion = false): any {
    const detallesObj = {
      asistencia: actividad.detalles?.asistencia ?? 0,
      inasistencia: actividad.detalles?.inasistencia ?? 0,
      excelente: actividad.detalles?.excelente ?? 0,
      bueno: actividad.detalles?.bueno ?? 0,
      regular: actividad.detalles?.regular ?? 0,
      deficiente: actividad.detalles?.deficiente ?? 0,
      mes: actividad.detalles?.mes ?? actividad.mes_id ?? 0,
      nota: actividad.detalles?.nota ?? '',
    };

    const metadatosObj = {
      user: actividad.metadatos?.user || 'sistema',
      registro: actividad.metadatos?.registro || new Date().toISOString(),
    };

    const payload: any = {
      tema: actividad.tema?.trim() || '',
      actividad_id: actividad.actividad_id,
      servicio_id: actividad.servicio_id,
      subdireccion_id: actividad.subdireccion_id,
      modalidad_id: actividad.modalidad_id,
      estado_id: actividad.estado_id,
      mes_id: actividad.mes_id,
      persona_responsable: actividad.persona_responsable || {},
      tiempo_aproximado: actividad.tiempo_aproximado || '',
      fecha_programada: actividad.fecha_programada || '',
      // 👇 enviar como objeto, NO string
      detalles: detallesObj,
      metadatos: metadatosObj,
    };

    if (esActualizacion && actividad.id) {
      payload.id = actividad.id;
    }

    return payload;
  }
  volver(): void {
    this.router.navigate(['tabla']);
  }



  agregar(): void {
    // Serializamos correctamente el payload
    const payload = this.prepararActividadPayload(this.actividad);

    this.api.createActividad(payload)
      .then(() => {
        // console.log('✅ Actividad creada correctamente');
        this.router.navigate(['tabla']);
      })
      .catch((error) => {
        console.error('❌ Error al crear actividad:', error, payload);
      });
  }

  async actualizar(): Promise<void> {
    const payload = this.prepararActividadPayload(this.actividad, true);

    try {
      await this.api.updateActividad(this.actividad.id, payload);
      this.router.navigate(['tabla']);
    } catch (error) {
      console.error('❌ Error al actualizar actividad:', error);
      // console.log('Payload enviado:', payload);
    }
  }

  guardar(): void {
    // console.log('Datos a guardar:', this.actividad);
    this.enEdicion ? this.actualizar() : this.agregar();
  }

  agregarResponsable(): void {
    const keys = Object.keys(this.actividad.persona_responsable || {});
    // Inicializa si aún no existe
    if (!this.actividad.persona_responsable) {
      this.actividad.persona_responsable = {};
    }
    const nuevoKey = 'r' + keys.length;
    // Solo agrega la nueva clave sin sobrescribir las existentes
    this.actividad.persona_responsable[nuevoKey] = { nombre: '', puesto: '' };
  }

  removerResponsable(key: string): void {
    const total = Object.keys(this.actividad.persona_responsable).length;
    if (total > 1) {
      // Copia los responsables existentes antes de eliminar para evitar mutaciones inesperadas
      // this.actividad.persona_responsable = { ...this.actividad.persona_responsable };
      delete this.actividad.persona_responsable[key];
    }
  }


  // Asegúrese de ejecutar esto después de cargar `actividad.fechas_a_desarrollar`
  actualizarMes(fechaStr: string) {
    const fecha = new Date(fechaStr);
    this.detalle.mes = fecha.getMonth() + 1;
  }

  ngAfterViewInit() {
    document.addEventListener('mousemove', (e) => {
      document.body.style.setProperty('--mouse-x', e.clientX + 'px');
      document.body.style.setProperty('--mouse-y', e.clientY + 'px');
    });
  }


  async listarSubdirecciones(): Promise<void> {
    const filt = { limit: 30, skip: 0 };
    try {
      this.subdirecciones = await this.api.getSubdirecciones(filt);
      // console.log('Subdirecciones cargadas:', this.subdirecciones);
    } catch (error) {
      console.error('Error al listar subdirecciones:', error);
    }
  }

  // Función que se llama al cambiar la subdirección

  async listarServicios(): Promise<void> {
    try {
      // this.serviciosResponsables = await this.api.getServiciosResponsables({});
      this.subRH = await this.api.getServiciosResponsables({ sub: 6 });
      this.subGerencia = await this.api.getServiciosResponsables({ sub: 5 });
      this.subTecnica = await this.api.getServiciosResponsables({ sub: 4 });
      this.subMedica = await this.api.getServiciosResponsables({ sub: 3 });
      this.subEnfermeria = await this.api.getServiciosResponsables({ sub: 2 });
      this.direccion = await this.api.getServiciosResponsables({ sub: 1 });


    } catch (error) {
      console.error('Error al listar servicios:', error);
    }
  }

  async listarTipoActividad(): Promise<void> {
    try {
      this.tipoActividades = await this.api.getTipoActividad({});
    } catch (error) {
      console.error('Error al listar tipos de actividad:', error);
    }
  }

  async listarEstados(): Promise<void> {
    try {
      this.estados = await this.api.getEstados({});
    } catch (error) {
      console.error('Error al listar estados:', error);
    }
  }

  async listarModalidades(): Promise<void> {
    try {
      this.modalidades = await this.api.getModalidades({});
    } catch (error) {
      console.error('Error al listar modalidades:', error);
    }
  }

  onSubdireccionChange(subId: number): void {
    this.actividad.servicio_id = 0; // reinicia selección de servicio
  }


  async onServicioSeleccionado(): Promise<void> {
    try {
      // Asegúrate de que this.localServicioId sea un número
      const id = Number(this.actividad.servicio_id);
      if (!id) {
        console.warn('⚠️ No hay servicio seleccionado.');
        return;
      }

      // Esperar la respuesta del servicio
      const data = await this.api.getServiciosResponsables({ id });

      if (data && data.length > 0) {
        const servicio = data[0];
        this.encargado = servicio.encargado_servicio || '';
        this.jefe = servicio.jefe_inmediato || '';
        // console.log('✅ Datos del servicio:', servicio);
      } else {
        console.warn('⚠️ No se encontró información para el servicio con id:', id);
        this.encargado = '';
        this.jefe = '';
      }

    } catch (error) {
      console.error('❌ Error al obtener servicio:', error);
    }
  }

  getJefes() {

  }


  mostrarServicios = false;
  mostrarActividad = false;
  mostrarDetalle = false;

  toggleServicios(): void {
    this.mostrarServicios = !this.mostrarServicios;
  }

  toggleActividad(): void {
    this.mostrarActividad = !this.mostrarActividad;
  }

  toggleDetalle(): void {
    this.mostrarDetalle = !this.mostrarDetalle;
  }

}
