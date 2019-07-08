import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NqueensComponent} from './nqueens/nqueens.component';
import {SudokuComponent} from './sudoku/sudoku.component';
import {HomecomponentComponent} from './homecomponent/homecomponent.component';
import {PagenotfoundComponent} from './pagenotfound/pagenotfound.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomecomponentComponent},
  { path: 'nqueens', component: NqueensComponent},
  { path: 'sudoku', component: SudokuComponent},
  { path: 'not-found', component: PagenotfoundComponent},
  { path: '**', redirectTo: '/not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
