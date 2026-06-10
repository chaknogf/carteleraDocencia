import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { ActividadesVista, ListaActividades } from '../interface/interfaces';

@Injectable({ providedIn: 'root' })
export class ActividadesService {
  private api: AxiosInstance;
  private readonly baseUrl = 'https://www.htecpan.com/fad';

  constructor() {
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
        return config;
      },
      error => Promise.reject(error)
    );
  }

  async getActividades(filtros: any): Promise<ListaActividades> {
    try {
      const filtrosLimpiados = limpiarParametros(filtros);
      const response = await this.api.get<ListaActividades>('/actividades/', {
        params: filtrosLimpiados
      });
      return response.data; // { total: number, actividades: ActividadesVista[] }
    } catch (error) {
      console.error('❌ Error al obtener actividades:', error);
      throw error;
    }
  }

  async listar(filtros: any): Promise<ListaActividades | ActividadesVista[]> {
    const filtrosLimpios = limpiarParametros(filtros);
    const response = await this.api.get<ListaActividades | ActividadesVista[]>('/actividades/', {
      params: filtrosLimpios
    });
    return response.data;
  }

  async obtenerPorId(id: number): Promise<ActividadesVista | undefined> {
    const data = await this.listar({ id });
    if (Array.isArray(data)) return data[0];
    return data.actividades?.[0];
  }

  async crear(actividad: any): Promise<any> {
    const response = await this.api.post('/actividad/crear/', actividad, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  }

  async actualizar(id: number | string, actividad: any): Promise<any> {
    const response = await this.api.put(`/actividad/actualizar/${id}`, actividad, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  }

  async eliminar(id: number | string): Promise<any> {
    const response = await this.api.delete(`/actividad/eliminar/${id}`);
    return response.data;
  }

  async reporteVista(filtros: any): Promise<any> {
    const filtrosLimpios = limpiarParametros(filtros);
    const response = await this.api.get('/reporte/vista', { params: filtrosLimpios });
    return response.data;
  }

  async ejecucion(filtros: any): Promise<any> {
    const filtrosLimpios = limpiarParametros(filtros);
    const response = await this.api.get('/reporte/ejecucion', { params: filtrosLimpios });
    return response.data;
  }

  async resumenAnual(filtros: any): Promise<any> {
    const filtrosLimpios = limpiarParametros(filtros);
    const response = await this.api.get<ActividadesVista[]>('/reporte/resumen-anual', {
      params: filtrosLimpios
    });
    return response.data;
  }

  async verificar(filtros: any): Promise<any> {
    const filtrosLimpios = limpiarParametros(filtros);
    const response = await this.api.post('/verificador/', {}, {
      params: filtrosLimpios,
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  }
}

function limpiarParametros(filtros: any): any {
  const limpios: any = {};
  for (const key in filtros) {
    if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
      limpios[key] = filtros[key];
    }
  }
  return limpios;
}
