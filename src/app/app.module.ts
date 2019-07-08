import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SudokuComponent } from './sudoku/sudoku.component';
import {FormsModule} from '@angular/forms';
import { NqueensComponent } from './nqueens/nqueens.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { HomecomponentComponent } from './homecomponent/homecomponent.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    SudokuComponent,
    NqueensComponent,
    PagenotfoundComponent,
    HomecomponentComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
