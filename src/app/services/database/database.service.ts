import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LoadingController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  protected db: SQLiteObject;
  public limit = 20;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(
    protected plt: Platform,
    protected sqlitePorter: SQLitePorter,
    protected sqlite: SQLite,
    protected http: HttpClient) {
    this.plt.ready()
    .then( () => {
      this.sqlite.create({
        name: 'dataCtrlUsuarios.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.db = db;
        this.createTables().then( () => {
          this.dbReady.next(true);
        });
      })
      .catch(error => {
        console.log('Error on open or create database: ', error);
        alert(JSON.stringify(error));
      });
    });
  }

  async cargarInfo(){
    console.log('Cargando informacion')
  }

  createTables(): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.http.get('assets/seed.sql', { responseType: 'text' })
        .subscribe(sql => {
          this.sqlitePorter.importSqlToDb(this.db, sql)
            .then(_ => {
              console.log('Database Created');
              resolve(true);
            })
            .catch(e => {
              alert('Import DB: ' + e);
              reject(false);
            });
        });
    });
  }

  async clearTables(): Promise<any> {
    return new Promise((resolve, reject) => {
      const deleteRows = [];

      deleteRows.push(['DELETE FROM Rol', []]);
      deleteRows.push(['DELETE FROM Usuario', []]);

      this.db.sqlBatch(deleteRows)
      .then((result) => {
        resolve(true);
      })
      .catch(e => {
        alert('clearTables: ' + JSON.stringify(e));
        reject(false);
      });

    });
  }

  async getUsuarios(filtro = '', start = 0): Promise<any> {
    return this.isReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          let campos: any[] = ['%' + filtro + '%', '%' + filtro + '%', '%' + filtro + '%', '%' + filtro + '%'];
          campos.push(start);
          campos.push(this.limit); 
                    
      this.db.executeSql('SELECT Usuario.nombre AS nombre_usuario, Usuario.id_usuario AS identifiacion, Rol.nombre AS rol_usuario, Usuario.activo AS estado \
                          FROM Usuario \
                          LEFT JOIN Rol \
                          ON Rol.id_rol = Usuario.id_rol \
                          WHERE ( nombre_usuario LIKE ? OR identifiacion LIKE ? OR rol_usuario LIKE ? OR estado LIKE ? ) \
                          ORDER BY Usuario.nombre  LIMIT ?, ?',
                        campos ) 
            .then((data) => {
              const lista = [];
              for (let index = 0; index < data.rows.length; index++) {
                lista.push(data.rows.item(index));
              }
              resolve(lista);
            })
            .catch(error => alert('Select usuarios: ' + JSON.stringify(error)));
        });
      });
  }


  getInfoUsuarios(identifiacion): Promise<any> {
    return this.isReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          this.db.executeSql('SELECT Usuario.nombre AS nombre_usuario, Usuario.id_usuario AS identifiacion, Rol.id_rol AS rol_usuario, Usuario.activo AS estado \
          FROM Usuario \
          LEFT JOIN Rol \
          ON Rol.id_rol = Usuario.id_rol \
          WHERE id_usuario = ? ', 
          [ 
            identifiacion
          ]
          )
            .then((data) => {
              resolve(data.rows.length > 0 ? data.rows.item(0) : null);
            })
            .catch(error => alert('getInfoUsuarios(): ' + JSON.stringify(error)));
        });
      });
  }


  getInfoUsuario(): Promise<any> {
    return this.isReady()
    .then(() => {     
      return new Promise((resolve, reject) => {        
        this.db.executeSql('SELECT Usuario.nombre FROM Usuario',
          [ ]
          ).then((data) => {
            const lista = [];
            for (let index = 0; index < data.rows.length; index++) {
              lista.push(data.rows.item(index));
            }
            resolve(lista);
          })
          .catch(error => alert('miListaUsuarios: ' + JSON.stringify(error)));
      });
    });
  }

  isReady(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.dbReady.getValue()) { // if dbReady is true, resolve
        resolve( true );
      } else { // otherwise, wait to resolve until dbReady returns true
        this.dbReady.subscribe( (ready) => {
          if (ready) {
            resolve( true );
          }
        });
      }
    });
  }

  
  estados(){ //Uso Predio
    return [
      {
        id: '1',
        desc: 'ACTIVO'
      },
      {
        id: '2',
        desc: 'INACTIVO'
      },
    ];
  }

  roles(){ //Uso Predio
    return [
      {
        id: '1',
        desc: 'ADMINISTRADOR'
      },
      {
        id: '2',
        desc: 'AUDITOR'
      },
      {
        id: '3',
        desc: 'AUXILIAR'
      },
    ];
  }

}
