import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/database/database.service';
import { LoadingController } from '@ionic/angular';
import { RolesService } from '../services/database/roles.service';
import { EventsService } from '../services/event/events.service';
import { IonInfiniteScroll, IonItemSliding } from '@ionic/angular';
import { UsuarioService } from '../services/database/usuario.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit  {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  roles: boolean = false;
  usuarios: any[];
  nombre_usuario: any;
  identifiacion: any;
  rol_usuario: any;
  estado: any;

  searchTerm: any;

  constructor(
    public loadingController: LoadingController,
    public router: Router,
    public alertController: AlertController ,
    public DB: DatabaseService,
    public rolesDb: RolesService,
    public toastController: ToastController,
    private event: EventsService,
    public usuarioService: UsuarioService
  ) { 
    setTimeout( () =>
    this.event.getObservable()
    .subscribe( data => {
      console.log(data);

      if (data.refresh) {
        console.log('Refreshing...');
        this.cargarUsuarios();
      }
    }), 50);
  }


  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ngOnInit() {
    this.iniciarApp();
    this.cargarUsuarios();   
  }

  ionViewWillEnter(){

    this.event.publish({
      refresh: true
    });
    
    //Se muestra u oculta la opcion de crear roles
    this.getRoles()
    .then((lista) => {
      if (lista) {
        this.roles = true;
      }
    }).catch(error => console.log(error));
  }

  getRoles(filtro = '', start = 0) {
    return this.rolesDb.getRolesItem();
  }

  async iniciarApp() {
       this.DB.cargarInfo()
  }

  cargarUsuarios() {
    this.usuarios = [];
    this.getUsuarios()
      .then(async (data) => {
        this.usuarios = data;
      });
  }

  async getUsuarios(filtro = '', start = 0) {
    return this.DB.getUsuarios(filtro, start);
  }

  async crearUsuario() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      message: 'Desea crear un <strong>nuevo usuario</strong>?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelado');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.router.navigate(['usuario', 0]);
          }
        }
      ]
    });
    await alert.present();
  }

  crearRoles(){
    console.log ('Info usuario')
    this.rolesDb.guardarRoles('ADMINISTRADOR');
    this.rolesDb.guardarRoles('AUDITOR');
    this.rolesDb.guardarRoles('AUXILIAR')
      .then(() => {
        this.roles = true;
        let mensaje = 'Se han registrado los roles exitosamente ';
        this.toastCreate(mensaje);
        this.router.navigate(['home'], { queryParams: { } });
      });
  }

  async toastCreate(mensaje) {
    //this.db.updateEstado(item.id_orden, 1, 0);
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  // on load more
  loadData(event) {
    setTimeout(() => {
      this.getUsuarios(this.searchTerm, this.usuarios.length)
        .then(async (data) => {
          for (const item of data) {
            this.usuarios.push(item);
          }

          if (data.length < this.DB.limit) {
            event.target.disabled = true;
          }
        });
      event.target.complete();
    }, 500);
  }

  
  // On Search
  getItems(event) {
    const val = event.target.value;
    this.searchTerm = val;
    console.log('SARCH: ', val)

    this.getUsuarios(val, 0)
      .then(async (data) => {
        this.usuarios = data;
      });
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  async eliminar(item, i){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      message: '¿Desea <strong>eliminar</strong>  este Usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelado');
          }
        }, {
          text: 'Confirmar',
          handler: async( ) => {
           await this.eliminarUsuario(item, i);
           console.log( this.usuarios )
           
            this.usuarios = [];
            console.log( this.usuarios )
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarUsuario(item, i){    
    this.usuarioService.eliminarUsuario(item.identifiacion)
    .then(() => {
      let mensaje = 'Se ha eliminado el usuario!'
      this.toastCreate(mensaje);
      this.usuarios.splice(i, 1);
    }).catch(error => {
    })
  }

  async editar(item){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      message: '¿Desea <strong>editar</strong>  este Usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelado');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.router.navigate(['usuario', 1], { queryParams: { identifiacion: item.identifiacion } });
          }
        }
      ]
    });
    await alert.present();
  }
}
