import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserService, UserInterface } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;
  listaUsuarios: UserInterface[] = [];


  constructor(private fb: FormBuilder, private userService: UserService) {
    // se utiliza formbuilder para tener mas control sobre el formulario
    // de manera programatica
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  ngOnInit(): void {
    // se cargan usuarios para que sean utilizados en la lista de la vista
    this.userService.getUsers().subscribe((userList: any) => {
      this.listaUsuarios = userList;
      console.log(this.listaUsuarios);
    });
  }

  // funcion utilizada como apoyo para mostrar errores en el html
  // cuando el campo se deje vacio una vez que se ha tocado
  nombreNoValido() {
    return this.userForm.get('nombre').invalid && this.userForm.get('nombre').touched;
  }



  guardarRegistro() {
    // se valida si el contenido del formulario es valido
    // de no ser asi se marcan todos los campos que se encuentren vacios
    // como tocados para mostrar el html con el error
    if (!this.userForm.valid) {
      for (const control of Object.values(this.userForm.controls)) {
        control.markAsTouched();
        Swal.fire('Es necesario llenar el campo de nombre', '', 'warning');
      }
    } else {
      const nuevoUsuario = { nombre: this.userForm.get('nombre').value};
      const validacion = this.listaUsuarios.filter( (usuario) => usuario.nombre === nuevoUsuario.nombre);
      if (validacion.length === 0) {
        this.userService.createUser(nuevoUsuario ).subscribe((response) => {
          if (response) {
            Swal.fire('Se ha agregado nombre a la lista', '', 'success');
            this.listaUsuarios.push(nuevoUsuario);
          } else {
            Swal.fire('error al insertar registro', '', 'error');
          }
        });
      } else {
        Swal.fire('Ya existe un usuario con ese nombre', '', 'warning');

      }
    }
  }


}
