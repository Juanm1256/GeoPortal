import { AfterViewInit, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UsuariosService } from '../../servicios/usuarios.service';
import { RolesService } from '../../servicios/roles.service';
import { CapitalesDepartamentalesService } from '../../servicios/maps/capitales-departamentales.service';
import { CuencasService } from '../../servicios/maps/cuencas.service';
import { LimitesDepartamentalesService } from '../../servicios/maps/limites-departamentales.service';
import { LimitesMunicipalesService } from '../../servicios/maps/limites-municipales.service';
import { MercadosService } from '../../servicios/maps/mercados.service';
import { ProveedoralevinesService } from '../../servicios/maps/proveedoralevines.service';
import { ProveedoralimentosService } from '../../servicios/maps/proveedoralimentos.service';
import { ProveedorasistenciatecnicaService } from '../../servicios/maps/proveedorasistenciatecnica.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  totalUsuarios = 0;
  totalRoles = 0;
  totalCapas = 0;
  cantidadPorCapa: { nombre: string; cantidad: number }[] = [];
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  roles: any[] = [];
  ultimoUsuario: any;
  ultimaCapaActiva: any;
  private chartInstance: Chart | null = null;

  constructor(
    private usuarioService: UsuariosService,
    private rolesService: RolesService,
    private capDepService: CapitalesDepartamentalesService,
    private cuencasService: CuencasService,
    private limitesDepService: LimitesDepartamentalesService,
    private limitesMunService: LimitesMunicipalesService,
    private mercadosService: MercadosService,
    private proveedorAlevinesService: ProveedoralevinesService,
    private proveedorAlimentosService: ProveedoralimentosService,
    private proveedorAsistenciaService: ProveedorasistenciatecnicaService
  ) {}

  ngOnInit(): void {
    Chart.register(...registerables);
    this.obtenerTotales();
    this.obtenerCantidadPorCapa();
    this.obtenerUsuariosRoles();
  }

  ngAfterViewInit(): void {
    this.updateChart();
  }

  obtenerTotales() {
    forkJoin([
      this.usuarioService.ListarTodos(),
      this.rolesService.ListarTodos(),
      this.capDepService.listarTodos(),
      this.cuencasService.listarTodos(),
      this.limitesDepService.listarTodos(),
      this.limitesMunService.listarTodos(),
      this.mercadosService.listarTodos(),
      this.proveedorAlevinesService.listarTodos(),
      this.proveedorAlimentosService.listarTodos(),
      this.proveedorAsistenciaService.listarTodos()
    ]).subscribe(([usuarios, roles, ...capas]) => {
      this.totalUsuarios = usuarios.length;
      this.totalRoles = roles.length;
      this.totalCapas = capas.length;
      this.updateChart();
    });
  }

obtenerCantidadPorCapa() {
  forkJoin([
    this.capDepService.listarTodos(),
    this.cuencasService.listarTodos(),
    this.limitesDepService.listarTodos(),
    this.limitesMunService.listarTodos(),
    this.mercadosService.listarTodos(),
    this.proveedorAlevinesService.listarTodos(),
    this.proveedorAlimentosService.listarTodos(),
    this.proveedorAsistenciaService.listarTodos()
  ]).subscribe(([capDep, cuencas, limitesDep, limitesMun, mercados, alevines, alimentos, asistencia]) => {
    
    this.cantidadPorCapa = [
      { nombre: 'Capitales Departamentales', cantidad: capDep.length },
      { nombre: 'Cuencas', cantidad: cuencas.length },
      { nombre: 'Límites Departamentales', cantidad: limitesDep.length },
      { nombre: 'Límites Municipales', cantidad: limitesMun.length },
      { nombre: 'Mercados', cantidad: mercados.length },
      { nombre: 'Proveedores de Alevines', cantidad: alevines.length },
      { nombre: 'Proveedores de Alimentos', cantidad: alimentos.length },
      { nombre: 'Proveedores de Asistencia Técnica', cantidad: asistencia.length }
    ];
    
    this.updateChart();
  });
}

  obtenerUsuariosRoles() {
    forkJoin([
      this.usuarioService.ListarTodos(),
      this.rolesService.ListarTodos()
    ]).subscribe(([usuarios, roles]) => {
      this.usuarios = usuarios;
      this.roles = roles;
      this.usuariosFiltrados = usuarios;
      this.ultimoUsuario = usuarios[usuarios.length - 1];
    });
  }

  updateChart() {
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    if (!canvas) {
      //console.error('❌ No se encontró el canvas');
      return;
    }

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(canvas.getContext('2d')!, {
      type: 'pie',
      data: {
        labels: this.cantidadPorCapa.map(capa => capa.nombre),
        datasets: [{
          data: this.cantidadPorCapa.map(capa => capa.cantidad),
          backgroundColor: ['#FF5733', '#28A745', '#1399e1', '#FFC300']
        }]
      }
    });
  }
}
