import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NotaInterface, NoteService } from '../../services/note.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit, OnDestroy {
  noteForm: FormGroup;
  today: string;
  listaNombres: [];
  noteToEdit: NotaInterface;


  constructor(private fb: FormBuilder,
              private userService: UserService,
              private noteService: NoteService,
              private router: Router) {



    this.noteToEdit = this.noteService.retrieveNote();
    // en caso de que se haya solicitado la edicion de una nota se ligan los valores
    // de la nota al formulario, en caso contrario se dejan vacios
    if (this.noteToEdit) {
      this.noteForm = fb.group({
        creador: [this.noteToEdit.nombreCreador, Validators.required],
        titulo: [this.noteToEdit.titulo, [Validators.required, Validators.maxLength(20)]],
        informacion: [this.noteToEdit.informacion, [Validators.required, Validators.maxLength(100)]],
        fecha: [ this.dateFormat(this.noteToEdit.fecha), Validators.required],
      });
    } else {
      this.noteForm = fb.group({
        creador: ['', Validators.required],
        titulo: ['', Validators.required],
        informacion: ['', Validators.required],
        fecha: ['', Validators.required],
      });
    }

    // se obtiene lista de usuarios para mostrarlos en el contenedor correspondiente
    this.userService.getUsers().subscribe(users => {
      this.listaNombres = users;
    });

  }

  ngOnInit(): void {
  }

  // cuando se cambie de vista, si habia un objeto en espera de edicion se elimina
  // del servicio
  ngOnDestroy() {
    this.noteService.deleteNote();
    delete this.noteToEdit;

  }


  guardarNota() {
    if (!this.noteForm.valid) {
      for (const control of Object.values(this.noteForm.controls)) {
        control.markAsTouched();
      }
      Swal.fire('Es necesario llenar todos los campos', '', 'warning');
    } else {
      // se guarda contenido de formulario en un objeto que sera enviado a la base de datos

      let nuevaNota: NotaInterface;
      nuevaNota = {
        titulo: this.noteForm.get('titulo').value,
        fecha: this.noteForm.get('fecha').value,
        informacion: this.noteForm.get('informacion').value,
        nombreCreador: this.noteForm.get('creador').value,
      };
      // si se solicito editar una nota se llama a la peticion para actualizar
      if (this.noteToEdit) {
        nuevaNota.id = this.noteToEdit.id;
        this.peticionActualizar(nuevaNota);
      } else {
        // se guarda el contenido de la nueva nota

        this.peticionGuardar(nuevaNota);
      }


    }
  }

  peticionActualizar(nota: NotaInterface) {

    this.noteService.updateNote(nota).subscribe((res) => {
      if (res) {
        Swal.fire('se ha actualizado la informacion de la nota!', '', 'success');
        this.router.navigate(['index']);
      } else {
        Swal.fire('No se pudo actualizar la nota', '', 'error');
      }
    });
  }

  peticionGuardar(nota: NotaInterface) {

    this.noteService.createNote(nota).subscribe((res) => {
      if (res) {
        Swal.fire('se ha guardado la nota!', '', 'success');
        this.router.navigate(['index']);
      } else {
        Swal.fire('No se pudo guardar la nota', '', 'error');
      }
    });
  }

  dateFormat(dateString: string) {

    const date = new Date(dateString.substring(0, 10) + ' ');

    const year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    // si el mes o dia tienen solo un digito se
    // agrega un cero al inicio
    month = ((month.length > 1) ? '' : '0') + month;

    day = ((day.length > 1) ? '' : '0') + day;
    return year + '-' + month + '-' + day;
  }








  // funciones utilizadas para validar que no se dejen vacios los campos
  creadorNoValido() {
    return this.noteForm.get('creador').invalid  && this.noteForm.get('titulo').touched;
  }

  tituloNoValido() {
    return this.noteForm.get('titulo').invalid && this.noteForm.get('titulo').touched;
  }

  infoNoValida() {
    return this.noteForm.get('informacion').invalid  && this.noteForm.get('informacion').touched;
  }

  fechaNoValida() {
    return this.noteForm.get('fecha').invalid  && this.noteForm.get('fecha').touched;
  }

}
