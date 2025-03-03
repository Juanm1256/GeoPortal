import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { firstValueFrom, forkJoin, Subscription } from 'rxjs';
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
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../servicios/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  isDarkMode: boolean = false;
  themeSubscription!: Subscription;
  isLoading = true;
  totalUsuarios = 0;
  totalRoles = 0;
  totalCapas = 0;
  cantidadPorCapa: { nombre: string; cantidad: number }[] = [];
  usuarios: any[] = [];
  roles: any[] = [];
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
    private proveedorAsistenciaService: ProveedorasistenciatecnicaService,
    private themeService: ThemeService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      Chart.register(...registerables);
      
      this.themeSubscription = this.themeService.isDarkMode$.subscribe(
        isDark => this.isDarkMode = isDark
      );

      await this.cargarDatos();
    } catch (error) {
      // console.error('Error en la inicialización:', error);
      this.isLoading = false;
    }
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      await this.actualizarGrafico();
    } catch (error) {
      // console.error('Error al inicializar la vista:', error);
    }
  }

  async cargarDatos(): Promise<void> {
    try {
      const [
        usuarios,
        roles,
        capitalesDep,
        cuencas,
        limitesDep,
        limitesMun,
        mercados,
        proveedoresAlevines,
        proveedoresAlimentos,
        proveedoresAsistencia
      ] = await firstValueFrom(forkJoin([
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
      ]));

      this.procesarDatos(
        usuarios,
        roles,
        [
          capitalesDep,
          cuencas,
          limitesDep,
          limitesMun,
          mercados,
          proveedoresAlevines,
          proveedoresAlimentos,
          proveedoresAsistencia
        ]
      );
    } catch (error) {
      // console.error('Error al cargar los datos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private procesarDatos(usuarios: any[], roles: any[], capas: any[]): void {
    this.totalUsuarios = usuarios.length;
    this.totalRoles = roles.length;
    this.totalCapas = capas.length;

    this.cantidadPorCapa = [
      { nombre: 'Capitales Departamentales', cantidad: capas[0].length },
      { nombre: 'Cuencas', cantidad: capas[1].length },
      { nombre: 'Límites Departamentales', cantidad: capas[2].length },
      { nombre: 'Límites Municipales', cantidad: capas[3].length },
      { nombre: 'Mercados', cantidad: capas[4].length },
      { nombre: 'Proveedores de Alevines', cantidad: capas[5].length },
      { nombre: 'Proveedores de Alimentos', cantidad: capas[6].length },
      { nombre: 'Proveedores de Asistencia Técnica', cantidad: capas[7].length }
    ];

    this.usuarios = usuarios;
    this.roles = roles;
  }


  private async actualizarGrafico(): Promise<void> {
    if (!this.chartCanvas?.nativeElement) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.actualizarGrafico();
    }

    try {
      const canvas = this.chartCanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas.');
      }

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      this.chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.cantidadPorCapa.map(capa => capa.nombre),
          datasets: [{
            data: this.cantidadPorCapa.map(capa => capa.cantidad),
            backgroundColor: [
              '#FF5733', '#28A745', '#1399e1', '#FFC300',
              '#8E44AD', '#3498DB', '#E74C3C', '#2ECC71'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } catch (error) {
    }
  }
}
