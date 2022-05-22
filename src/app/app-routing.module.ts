import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotesComponent } from './components/notes/notes.component';
import { NoteFormComponent } from './components/note-form/note-form.component';
import { UserComponent } from './components/user/user.component';
import { UserFormComponent } from './components/user-form/user-form.component';


const routes: Routes = [
  // primeras tres rutas se dirigen a la lista de notas
  {path: '', component: NotesComponent},
  {path: 'index', component: NotesComponent},
  {path: 'notes', component: NotesComponent},
  // si se agrega un id a la ruta
  {path: 'note', component: NoteFormComponent},
  {path: 'user', component: UserFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
