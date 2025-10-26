import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Router } from '@angular/router';
import { Actividades, ActividadesVista, Estados, Modalidades, ServicioResponsables, SubdirecionPertenece, TipoActividad, Usuarios } from '../interface/interfaces';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private api: AxiosInstance;
  public readonly baseUrl = 'https://hgtecpan.duckdns.org/fad';
  public token: string | null = null;
  public username: string | null = null;
  public role: string | null = null;

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
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (!token) {
      throw new Error('🔒 No estás autenticado.');
    }

    try {
      const response = await this.api.get('/auth/me', {
        headers: {
          usuario: username || '',
          rol: role || ''
        }
      });

      const { username: nombreUsuario, role: rolUsuario } = response.data;

      localStorage.setItem('username', nombreUsuario);
      localStorage.setItem('role', rolUsuario);
      //window.location.reload();

      console.log('✅ Usuario autenticado:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Error al obtener usuario actual:', error);
      throw error;
    }
  }

  logOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.reload();


  }

  // ======= USERS =======



  async getUsers(filtros: any): Promise<any> {
    try {
      const response = await this.api.get<Usuarios[]>('/user/', {
        params: filtros
      });
      // console.log('👤 Usuarios obtenidos correctamente', response);
      return response.data;

    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      throw error;
    }
  }

  async getUser(id: number): Promise<any> {
    try {
      const response = await this.api.get<Usuarios[]>(`/user/?id=${id}&skip=0&limit=1`);
      // console.log('👤 Usuarios obtenidos correctamente', response);
      return response.data;

    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error)
      throw error;
    }
  }

  async createUser(user: any): Promise<any> {
    try {
      const response = await this.api.post('/user/crear', user);
      // console.log('👤 Usuario creado correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      throw error;
    }
  }

  async updateUser(userId: number | string, user: any): Promise<any> {
    try {
      const response = await this.api.put(`/user/actualizar/${userId}`, user);
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
        `/servicios_responsables/actualizar/${dataId}`,
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

  async carteleraDelMes(): Promise<any> {
    try {
      const mesActual = new Date().getMonth() + 1;
      const response = await this.api.get(`/cartelera/${mesActual}`);
      // console.log('📝 Cartelera del mes obtenida correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener cartelera del mes:', error);
      throw error;
    }
  }

  async getReporteActividades(mes: number, anio: number): Promise<any> {
    try {
      const response = await this.api.get(`/reporte/vista?mes=${mes}&anio=${anio}`);
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


  async getEjecucionServicios(anio: number): Promise<any> {
    try {
      const response = await this.api.get('ejecucion_servicio?anio=' + anio);
      // console.log('📊 Reporte de actividades obtenido correctamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener ejecución de actividades:', error);
      throw error;
    }
  }

  async getEjecucion(anio: number): Promise<any> {
    try {
      const response = await this.api.get('ejecucion?anio=' + anio);
      // console.log('📊 Reporte de actividades obtenido correctamente');
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


