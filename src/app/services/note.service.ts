import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
const apiURL = environment.apiUrl;

export interface NotaInterface {
  fecha: string;
  id?: string;
  informacion: string;
  nombreCreador: string;
  titulo: string;
}


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  noteData: any;
  constructor(private http: HttpClient) { }


  // metodo utilizado para obtener la lista de notas de la base de datos
  getNotes() {
    return this.http.get(`${apiURL}/notes`, {observe: 'response'}).pipe(
      map((response: any) => {
        // se verifica la respuesta del servidor y se extrae el contenido del body
        if (response.status === 200) {
          return response.body.notas;
        }

      })
    );
  }

  createNote(nota: NotaInterface) {
    return this.http.post(`${apiURL}/notes/`, nota, {observe: 'response'}).pipe(
      map((response) => {
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  deleteNoteDB(id: string) {

    return this.http.delete(`${apiURL}/notes/${id}`, {observe: 'response'}).pipe(
      map((response: any) => {
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  updateNote(nota: NotaInterface) {
    return this.http.put(`${apiURL}/notes/${nota.id}`, nota, {observe: 'response'}).pipe(
      map((response: any) => {
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      })
    );
  }




  // funciones utilizadas como memoria temporal para poder transmitir
  // una nota que se desea editar al formulario correspondiente
  storeNote(noteData) {
    this.noteData = noteData;
  }

  retrieveNote() {
    return this.noteData;
  }

  deleteNote() {
    delete this.noteData;
  }
}
