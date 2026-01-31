import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Router } from '@angular/router';
import { Actividades, ActividadesVista, Asistencia, Estados, GruposDeEdad, Lugares, Modalidades, ResumenAnual, ServicioResponsables, SubdirecionPertenece, TipoActividad, Usuarios } from '../interface/interfaces';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private api: AxiosInstance;
  public readonly baseUrl = 'https://www.hosptecpan.space/fad';
  // public readonly baseUrl = 'https://200.12.44.174/fad';
  // public readonly baseUrl = 'http://localhost:8001';
  public token: string | null = null;
  public username: string | null = null;
  public role: string | null = null;
  public servicioId: number | null = null;
  public subId: any | null = null;

  constructor(
    private router: Router,

  ) {



    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('access_token');

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        //console.log('🛰️ Interceptor ejecutado:', config);
        return config;
      },
      error => Promise.reject(error)
    );
  }

  /**
   * Inicia sesión con las credenciales del usuario.
   * @param username Usuario
   * @param password Contraseña
   */
  async login(username: string, password: string): Promise<void> {
    const response = await this.api.post('/auth/login', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const token = response.data.access_token;
    if (token) {
      localStorage.setItem('access_token', token);
      this.getCurrentUser();
    } else {
      throw new Error('No se recibió el token.');
    }
  }




  /**
 * Obtiene la información del usuario autenticado.
 */
  async getCurrentUser(): Promise<any> {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('🔒 No estás autenticado.');

    try {
      const response = await this.api.get('/auth/me');

      const { username, role, servicio_id } = response.data;

      // Guardamos valores en localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      localStorage.setItem('servicio_id', servicio_id.toString());

      // 🔹 Obtenemos subdirección asociada al servicio
      await this.getSub(servicio_id);

      // console.log('✅ Usuario autenticado:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Error al obtener usuario actual:', error);
      throw error;
    }
  }

  /**
   * Obtiene la subdirección a partir del servicio_id
   */
  async getSub(servicio_id: number): Promise<void> {
    try {
      const data = await this.getServiciosResponsables({ id: servicio_id });
      if (data && data.length > 0) {
        this.subId = data[0].subdireccion_id;
        localStorage.setItem('subId', this.subId);
        // console.log('📦 Subdirección almacenada:', this.subId);
      }
    } catch (error) {
      console.error('⚠️ Error obteniendo subdirección:', error);
    }
  }

  logOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('servicio_id');
    window.location.reload();


  }



  // ======= USERS =======

  async usuarioActual(): Promise<any> {
    try {
      const response = await this.api.get('/auth/me');
      // console.log('✅ Usuario autenticado:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Error al obtener usuario actual:', error);
      throw error;
    }
  }

  async getUsers(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<Usuarios[]>('/user/', {
        params: filtrosLimpiados
      });
      // console.log('👤 Usuarios obtenidos correctamente', response);
      return response.data;

    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      throw error;
    }
  }

  async createUser(user: any): Promise<any> {
    try {
      const response = await this.api.post('/user/crear', user,
        {
          headers: {
            'Content-Type': 'application/json', //
          },
        }
      );
      // console.log('👤 Usuario creado correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      throw error;
    }
  }

  async signup(user: any): Promise<any> {
    try {
      const response = await this.api.post('/user/registro', user,
        {
          headers: {
            'Content-Type': 'application/json', //
          },
        }
      );
      // console.log('👤 Usuario creado correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      throw error;
    }
  }

  async updateUser(userId: number, user: any): Promise<any> {
    try {
      const response = await this.api.put(
        `/user/actualizar/${userId}`,
        user,
        {
          headers: {
            'Content-Type': 'application/json', // 👈 Muy importante
          },
        }
      );
      // console.log('👤 Usuario actualizado correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      throw error;
    }
  }

  async deleteUser(userId: number | string): Promise<any> {
    try {
      const response = await this.api.delete(`/user/eliminar/${userId}`);
      // console.log('👤 Usuario eliminado correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
      throw error;
    }
  }

  // api.service.ts
  // ======= AuthGoogle =======
  async authGoogle(id_token: string): Promise<any> {
    try {
      const response = await this.api.post(
        '/auth/google',
        { id_token },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Error al autenticar con Google:', error);
      throw error;
    }
  }


  // ======= SERVICIOS RESPONSABLES =======

  async getServiciosResponsables(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<ServicioResponsables[]>('/servicios_responsables/', {
        params: filtrosLimpiados
      });
      // console.log('📝 Valores Obtenidos');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener datos:', error);
      throw error;
    }
  }

  async createServicioResponsable(data: any): Promise<any> {
    try {
      const response = await this.api.post(
        '/servicios_responsables/crear/', data,
        {
          headers: {
            'Content-Type': 'application/json', // 👈 Muy importante
          },
        }
      );
      // console.log('📝 creado correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear :', error);
      throw error;
    }
  }

  async updateServicioResponsable(dataId: number | string, data: any): Promise<any> {
    try {
      const response = await this.api.put(
        `/servicio_responsable/actualizar/${dataId}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json', // 👈 Muy importante
          },
        }
      );
      // console.log('📝 Actualización correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar:', error);
      throw error;
    }
  }

  // ======= SUBDIRECCIONES =======
  async getSubdirecciones(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<SubdirecionPertenece[]>('/subdireccion/', {
        params: filtrosLimpiados
      });
      // console.log('📝 Valores Obtenidos');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener datos:', error);
      throw error;
    }
  }

  // ======= ACTIVIDADES =======


  async getActividades(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<ActividadesVista[]>('/actividades/', {
        params: filtrosLimpiados
      });
      // console.log('📝 Actividades obtenidas correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener actividades:', error);
      throw error;
    }
  }

  async getActividad(id: number): Promise<ActividadesVista> {
    try {
      const response = await this.api.get<ActividadesVista[]>(`/actividades/?id=${id}`);
      // console.log('📝 Actividad obtenida correctamente:', response.data[0]);
      return response.data[0]; // porque es una lista filtrada por id
    } catch (error) {
      console.error('❌ Error al obtener actividad:', error);
      throw error;
    }
  }


  async createActividad(actividad: any): Promise<any> {
    try {
      const response = await this.api.post(
        '/actividad/crear/', actividad,
        {
          headers: {
            'Content-Type': 'application/json', // 👈 Muy importante
          },
        }
      );
      // console.log('📝 Actividad creada correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear actividad:', error);
      throw error;
    }
  }


  async updateActividad(actividadId: number | string, actividad: any): Promise<any> {
    try {
      const response = await this.api.put(
        `/actividad/actualizar/${actividadId}`,
        actividad,
        {
          headers: {
            'Content-Type': 'application/json', // 👈 Muy importante
          },
        }
      );
      // console.log('📝 Actividad actualizada correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar actividad:', error);
      throw error;
    }
  }


  async deleteActividad(actividadId: number | string): Promise<any> {
    try {
      const response = await this.api.delete(`/actividad/eliminar/${actividadId}`);
      // console.log('📝 Actividad eliminada correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar actividad:', error);
      throw error;
    }
  }



  async getReporteActividades(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get(`/reporte/vista`,
        {
          params: filtrosLimpiados
        }
      );
      // console.log('📊 Reporte de actividades obtenido correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener reporte de actividades:', error);
      throw error;
    }
  }

  // api tipo actividades
  async getTipoActividad(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<TipoActividad[]>('/tipos_actividad/', {
        params: filtrosLimpiados
      });
      // console.log('📝 Datos obtenidos correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener datos:', error);
      throw error;
    }
  }

  // api estados
  async getModalidades(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<Modalidades[]>('/modalidades/', {
        params: filtrosLimpiados
      });
      // console.log('📝 Datos obtenidos correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener datos:', error);
      throw error;
    }
  }

  // api modalidades
  async getEstados(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<Estados[]>('/estados/', {
        params: filtrosLimpiados
      });
      // console.log('📝 Datos obtenidos correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener datos:', error);
      throw error;
    }
  }


  // Reportes

  async getEjecucion(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get('/reporte/ejecucion', {
        params: filtrosLimpiados
      });
      // console.log('📊 Reporte de actividades obtenido correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener ejecución de actividades:', error);
      throw error;
    }
  }

  async getExcel(filtros: any): Promise<void> {
    try {
      const response = await this.api.get('/fad/reporte/excel', {
        params: limpiarParametros(filtros),
        responseType: 'blob',
        timeout: 30000
      });

      if (!response.data || response.data.size === 0) {
        throw new Error('Archivo vacío');
      }

      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_actividades_${Date.now()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);

      console.log('✅ Reporte Excel descargado');

    } catch (error: any) {
      const status = error.response?.status;

      if (status === 404) {
        alert('No hay datos para generar el reporte');
      } else if (status === 500) {
        alert('Error interno al generar el reporte');
      } else {
        alert('No se pudo descargar el archivo');
      }

      console.error('❌ Error al descargar Excel:', error);
    }
  }


  async getResumenAnual(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<ResumenAnual[]>('/reporte/resumen-anual'
        , {
          params: filtrosLimpiados
        });

      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener ejecución de actividades:', error);
      throw error;
    }
  }


  // ======= TOKEN (opcional) =======

  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.api.defaults.headers.common['Authorization'];
  }

  // Lugares
  async getLugaresRealizacion(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<Lugares[]>('/lugareRealizacion/'
        , {
          params: filtrosLimpiados
        });

      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener datos:', error);
      throw error;
    }
  }

  // Grupos de Edad
  async getGruposEdad(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<GruposDeEdad[]>('/gruposEdad/'
        , {
          params: filtrosLimpiados
        });

      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener datos:', error);
      throw error;
    }
  }

  //verificador de conflicto

  async verificar(filtros: any): Promise<any> {
    try {
      const filtrosLimpios = limpiarParametros(filtros);

      const response = await this.api.post(
        '/verificador/',
        {},   // 👈 body vacío (igual que tu curl)
        {
          params: filtrosLimpios,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      return response.data;

    } catch (error) {
      console.error('❌ Error al verificar:', error);
      throw error;
    }
  }

  //Asistencia

  async asistenciaLink(asistencia: any): Promise<any> {
    try {
      const response = await this.api.post(
        '/asistencia/', asistencia,
        {
          headers: {
            'Content-Type': 'application/json', // 👈 Muy importante
          },
        }
      );
      // console.log('📝 Actividad creada correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear actividad:', error);
      throw error;
    }
  }

  async listaAsistencia(filtros: any): Promise<any> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<Asistencia[]>('/asistencia/'
        , {
          params: filtrosLimpiados
        });

      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener datos:', error);
      throw error;
    }



  }
}

function limpiarParametros(filtros: any): any {
  const filtrosLimpiados: any = {};
  for (const key in filtros) {
    if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
      filtrosLimpiados[key] = filtros[key];
    }
  }
  return filtrosLimpiados;
}


