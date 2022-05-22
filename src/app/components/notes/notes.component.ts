import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { NoteService, NotaInterface } from '../../services/note.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  noteArray: NotaInterface[];
  constructor(private router: Router, private noteService: NoteService) {

  }

  ngOnInit(): void {

    // obtencion de notas de la base de datos
    this.noteService.getNotes().subscribe((notas) => {
      this.noteArray = notas;
    });
  }

  // metodo para guardar contenido de la nota y posteriormente
  // cambiar la ruta al formulario para editar
  editarNota(index: number) {
    this.noteService.storeNote(this.noteArray[index]);
    this.router.navigate(['note']);
  }


  eliminarNota(index: number) {
    Swal.fire({
      title: 'Esta seguro de borrar esta nota?',
      showDenyButton: true,
      icon: 'warning',
      showConfirmButton: false,
      showCancelButton: true,
      denyButtonText: `Borrar definitivamente`,
    }).then((result) => {
      // se hace la operacion con el boton deny solo por estetica
      if (result.isDenied) {
        // llamado a la base de datos para eliminar registro
        const id = this.noteArray[index].id;
        this.noteService.deleteNoteDB(id).subscribe((res) => {
          if (res){
            Swal.fire('se ha eliminado la nota!', '', 'success');
          } else {
            Swal.fire('algo salio mal', '', 'error');
          }
        });
        // se elimina nota de la lista de elementos interna y tambien
        // en el html
        this.noteArray.splice(index, 1);

      }
    });
  }

}
