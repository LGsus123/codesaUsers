import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/database/usuario.service';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {


  nombre_usuario: any;
  identifiacion: any;
  rol_usuario: any;
  estado: any;
  editable: any;

  roles: any[];
  estados: any[];

  item: any = {};
  nombres : any[];
  nomb: any;

  constructor( public usuarioDb: UsuarioService,
                public toastController: ToastController,
                private router: Router,
                private route: ActivatedRoute,
                private services: DatabaseService,
                private activatedRoute: ActivatedRoute,
                public alertController: AlertController,
                public navCtrl: NavController) { 

                  this.route.queryParams.subscribe(params => {
                    this.identifiacion = params['identifiacion'];
                    console.log('params: ', this.identifiacion);
                });

                activatedRoute.params.subscribe(data => {
                  this.editable = data.editable;
                });
                }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.roles = this.services.roles();
    this.estados = this.services.estados();

    this.getUsuarios()
      .then((lista) => {
        if(lista){
          
          this.item             = lista;
          this.nombre_usuario   = this.item.nombre_usuario;
          this.identifiacion    = this.item.identifiacion;
          this.rol_usuario      = this.item.rol_usuario;
          this.estado           = this.item.estado;
       
         }
        
      }).catch(error => console.log(error));
  }

  async getUsuarios() {
    return this.services.getInfoUsuarios( this.identifiacion );
  }


  registrarUsuario(item) {
    console.log ('Info usuario', item)
    this.usuarioDb.guardarUsuario(this.nombre_usuario, this.rol_usuario, this.estado)
      .then(() => {
        let mensaje = 'Se ha registrado al usuario ' + this.nombre_usuario
        this.toastCreate(mensaje);
        //this.router.navigate(['home']);
        this.navCtrl.navigateRoot(['home']);
      });
  }

  editarUsuario(item) {
    console.log ('Info usuario', item)
    this.usuarioDb.updateUsuario(this.nombre_usuario, this.rol_usuario, this.estado, this.identifiacion)
      .then(() => {
        let mensaje = 'Se ha actualizado al usuario ' + this.nombre_usuario
        this.toastCreate(mensaje);
        this.navCtrl.navigateRoot(['home']);
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

  salir(){
    let mensaje = 'Se ha cancelado el registro'
    this.toastCreate(mensaje);
    this.navCtrl.navigateRoot(['home']);
  }

  async validarNombre(item){

    console.log( this.nombre_usuario, this.identifiacion, this.rol_usuario, this.estado)

    this.services.getInfoUsuario()
    .then((data: any[]) => {
      this.nombres = data;

      if (this.nombres.find(x => x.nombre == this.nombre_usuario)) {
        this.presentAlert();
      } else{
        this.registrarUsuario(item);
      }
    });
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      subHeader: 'Nombre repetido',
      message: 'No se pueden guardar nombres repetidos!.',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  printText(event) {
    console.log( this.rol_usuario, this.nombre_usuario, this.estado)
  }

}
