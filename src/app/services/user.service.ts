import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';


const apiURL = environment.apiUrl;

export interface UserInterface {
  nombre: string;
  id?: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {

  }

  getUsers() {
    return this.http.get(`${apiURL}/users`).pipe(
      map((response: any) => {
        console.log(response);
        // se extrae arreglo de usuarios de la respuesta
        return response.usuarios;
      }),
    );
  }

  createUser(user: UserInterface) {
    return this.http.post(`${apiURL}/users`, user, { observe: 'response'}).pipe(
      map((response) => {
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
