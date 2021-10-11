import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DatabaseService } from '../database/database.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends DatabaseService {

  constructor(protected plt: Platform,
              protected sqlitePorter: SQLitePorter,
              protected sqlite: SQLite,
              protected http: HttpClient) { 
    super( plt, sqlitePorter, sqlite, http );
  }

  guardarRoles( nombre ): Promise<any> {
    return this.isReady()
    .then(() => {
      return new Promise((resolve, reject) => {
       
        this.db.executeSql(
          'INSERT INTO Rol ( nombre) \
          VALUES (? )',
          [
            nombre
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

  //get roles item
  getRolesItem(): Promise<any> {
    return this.isReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          this.db.executeSql('SELECT * FROM Rol WHERE id_rol = ? ', 
          [ 
            1
          ]
          )
            .then((data) => {
              resolve(data.rows.length > 0 ? data.rows.item(0) : null);
            })
            .catch(error => alert('getOrdenItem(): ' + JSON.stringify(error)));
        });
      });
  }
  
}
