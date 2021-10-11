import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DatabaseService } from '../database/database.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends DatabaseService  {


  constructor(protected plt: Platform,
              protected sqlitePorter: SQLitePorter,
              protected sqlite: SQLite,
              protected http: HttpClient,
              public DB: DatabaseService) { 
    super( plt, sqlitePorter, sqlite, http );
  }

 
  guardarUsuario( nombre,  rol, activo ): Promise<any> {
    return this.isReady()
    .then(() => {
      return new Promise((resolve, reject) => {
       
        this.db.executeSql(
          'INSERT INTO Usuario ( nombre, id_rol, activo ) \
          VALUES (?, ?, ? )',
          [
            nombre,
            rol,
            activo
          ]
        )
          .then((result) => {
            resolve(true);
          })
          .catch(e => {
            alert('Error al guardar usuario: ' + JSON.stringify(e));
            reject(false);
          });
      });
    });
  }

async eliminarUsuario(id_usuario): Promise<any> {
    return this.isReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          this.db.executeSql(
            'DELETE FROM Usuario WHERE id_usuario = ?',
            [id_usuario]
          )
            .then((result) => {
              resolve(true);
            })
            .catch(e => {
              alert('Error al borrar usuario: ' + JSON.stringify(e));
              reject(false);
            });
        });
      });
  }

  async updateUsuario( nombre, rol, activo, id_usuario ): Promise<any> {
    return this.isReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          this.db.executeSql('UPDATE Usuario SET nombre = ?, id_rol = ?, activo = ? WHERE id_usuario = ?',
            [
              nombre,              
              rol,
              activo,
              id_usuario

            ])
            .then((data) => {
              resolve(true);
            })
            .catch(error => alert('updateUsuario: ' + JSON.stringify(error)));
        });
      });

  }
  
}
