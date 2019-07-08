import { Component, OnInit } from '@angular/core';
import {sudokuDataObject} from './sudoku.dataobject';
import {until} from 'selenium-webdriver';
import {CSP} from '../CSP';
import {BacktrackingSearch} from '../BacktrackingSearch'

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})
export class SudokuComponent implements OnInit {
  gridLength:number=9;
  gridWidth:number=9;
  sudokuGrid: sudokuDataObject[][]=[
    [new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),],
    [new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),],
    [new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),],
    [new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),],
    [new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),],
    [new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),],
    [new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),],
    [new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),],
    [new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell2'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),new sudokuDataObject(null,true,'cell1'),],
  ];
  statusMessage:string="Fill grid to solve.";

  constructor() { }

  ngOnInit() {
  }

  resetGrid(){
    this.updateStyles();
    for(let i=0;i<this.gridLength;i++){
      for(let j=0;j<this.gridWidth;j++){
        this.sudokuGrid[i][j].gridValue=null;
        this.sudokuGrid[i][j].userInput=true;
      }
    }
    this.statusMessage="Fill grid to solve.";
  }

  updateStyles(){
    for(let i=0;i<this.gridLength;i++){
      for(let j=0;j<this.gridWidth;j++){
        this.sudokuGrid[i][j].isValid=true;
        this.sudokuGrid[i][j].gridClass=this.sudokuGrid[i][j].gridClass.replace('Error','');
        if(this.sudokuGrid[i][j].gridValue==null)
          this.sudokuGrid[i][j].userInput=false;
        else
          this.sudokuGrid[i][j].userInput=true;
      }
    }
  }

  generateNumberHash(){
    let numberCheck=new Map()
      .set('1',0)
      .set('2',0)
      .set('3',0)
      .set('4',0)
      .set('5',0)
      .set('6',0)
      .set('7',0)
      .set('8',0)
      .set('9',0);
    return numberCheck;
  }

  validateGrid(){
    this.updateStyles();
    let gridValid:boolean=true;
    //check rows
    for(let i=0;i<this.gridLength;i++){
      let numberCheck=this.generateNumberHash();
      for(let j=0;j<this.gridWidth;j++){
        if(this.sudokuGrid[i][j].gridValue!=null){
          numberCheck.set(''+this.sudokuGrid[i][j].gridValue,numberCheck.get(''+this.sudokuGrid[i][j].gridValue)+1);
        }
      }
      for(let item of numberCheck.values()){
        if(item>1){
          gridValid=false;
          for(let j=0;j<this.gridWidth;j++) {
            this.sudokuGrid[i][j].isValid = false;
            this.sudokuGrid[i][j].gridClass=this.sudokuGrid[i][j].gridClass.replace('Error', '')+'Error';
          }
        }
      }
    }
    //check columns
    for(let j=0;j<this.gridWidth;j++){
      let numberCheck=this.generateNumberHash();
      for(let i=0;i<this.gridLength;i++){
        if(this.sudokuGrid[i][j].gridValue!=null){
          numberCheck.set(''+this.sudokuGrid[i][j].gridValue,numberCheck.get(''+this.sudokuGrid[i][j].gridValue)+1);
        }
      }
      for(let item of numberCheck.values()){
        if(item>1){
          gridValid=false;
          for(let i=0;i<this.gridLength;i++) {
            this.sudokuGrid[i][j].isValid = false;
            this.sudokuGrid[i][j].gridClass=this.sudokuGrid[i][j].gridClass.replace('Error', '')+'Error';
          }
        }
      }
    }
    //check each box
    let numberCheck=this.generateNumberHash();
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        if(this.sudokuGrid[i][j].gridValue!=null){
          numberCheck.set(''+this.sudokuGrid[i][j].gridValue,numberCheck.get(''+this.sudokuGrid[i][j].gridValue)+1);
        }
      }
    }
    for(let item of numberCheck.values()){
      if(item>1){
        gridValid=false;
        for(let i=0;i<3;i++){
          for(let j=0;j<3;j++) {
            this.sudokuGrid[i][j].isValid = false;
            this.sudokuGrid[i][j].gridClass = this.sudokuGrid[i][j].gridClass.replace('Error', '') + 'Error';
          }
        }
      }
    }
    numberCheck=this.generateNumberHash();
    for(let i=0;i<3;i++){
      for(let j=3;j<6;j++){
        if(this.sudokuGrid[i][j].gridValue!=null){
          numberCheck.set(''+this.sudokuGrid[i][j].gridValue,numberCheck.get(''+this.sudokuGrid[i][j].gridValue)+1);
        }
      }
    }
    for(let item of numberCheck.values()){
      if(item>1){
        gridValid=false;
        for(let i=0;i<3;i++){
          for(let j=3;j<6;j++) {
            this.sudokuGrid[i][j].isValid = false;
            this.sudokuGrid[i][j].gridClass = this.sudokuGrid[i][j].gridClass.replace('Error', '') + 'Error';
          }
        }
      }
    }
    numberCheck=this.generateNumberHash();
    for(let i=0;i<3;i++){
      for(let j=6;j<9;j++){
        if(this.sudokuGrid[i][j].gridValue!=null){
          numberCheck.set(''+this.sudokuGrid[i][j].gridValue,numberCheck.get(''+this.sudokuGrid[i][j].gridValue)+1);
        }
      }
    }
    for(let item of numberCheck.values()){
      if(item>1){
        gridValid=false;
        for(let i=0;i<3;i++){
          for(let j=6;j<9;j++) {
            this.sudokuGrid[i][j].isValid = false;
            this.sudokuGrid[i][j].gridClass = this.sudokuGrid[i][j].gridClass.replace('Error', '') + 'Error';
          }
        }
      }
    }
    numberCheck=this.generateNumberHash();
    for(let i=3;i<6;i++){
      for(let j=0;j<3;j++){
        if(this.sudokuGrid[i][j].gridValue!=null){
          numberCheck.set(''+this.sudokuGrid[i][j].gridValue,numberCheck.get(''+this.sudokuGrid[i][j].gridValue)+1);
        }
      }
    }
    for(let item of numberCheck.values()){
      if(item>1){
        gridValid=false;
        for(let i=3;i<6;i++){
          for(let j=0;j<3;j++) {
            this.sudokuGrid[i][j].isValid = false;
            this.sudokuGrid[i][j].gridClass = this.sudokuGrid[i][j].gridClass.replace('Error', '') + 'Error';
          }
        }
      }
    }
    numberCheck=this.generateNumberHash();
    for(let i=3;i<6;i++){
      for(let j=3;j<6;j++){
        if(this.sudokuGrid[i][j].gridValue!=null){
          numberCheck.set(''+this.sudokuGrid[i][j].gridValue,numberCheck.get(''+this.sudokuGrid[i][j].gridValue)+1);
        }
      }
    }
    for(let item of numberCheck.values()){
      if(item>1){
        gridValid=false;
        for(let i=3;i<6;i++){
          for(let j=3;j<6;j++) {
            this.sudokuGrid[i][j].isValid = false;
            this.sudokuGrid[i][j].gridClass = this.sudokuGrid[i][j].gridClass.replace('Error', '') + 'Error';
          }
        }
      }
    }
    numberCheck=this.generateNumberHash();
    for(let i=3;i<6;i++){
      for(let j=6;j<9;j++){
        if(this.sudokuGrid[i][j].gridValue!=null){
          numberCheck.set(''+this.sudokuGrid[i][j].gridValue,numberCheck.get(''+this.sudokuGrid[i][j].gridValue)+1);
        }
      }
    }
    for(let item of numberCheck.values()){
      if(item>1){
        gridValid=false;
        for(let i=3;i<6;i++){
          for(let j=6;j<9;j++) {
            this.sudokuGrid[i][j].isValid = false;
            this.sudokuGrid[i][j].gridClass = this.sudokuGrid[i][j].gridClass.replace('Error', '') + 'Error';
          }
        }
      }
    }
    numberCheck=this.generateNumberHash();
    for(let i=6;i<9;i++){
      for(let j=0;j<3;j++){
        if(this.sudokuGrid[i][j].gridValue!=null){
          numberCheck.set(''+this.sudokuGrid[i][j].gridValue,numberCheck.get(''+this.sudokuGrid[i][j].gridValue)+1);
        }
      }
    }
    for(let item of numberCheck.values()){
      if(item>1){
        gridValid=false;
        for(let i=6;i<9;i++){
          for(let j=0;j<3;j++) {
            this.sudokuGrid[i][j].isValid = false;
            this.sudokuGrid[i][j].gridClass = this.sudokuGrid[i][j].gridClass.replace('Error', '') + 'Error';
          }
        }
      }
    }
    numberCheck=this.generateNumberHash();
    for(let i=6;i<9;i++){
      for(let j=3;j<6;j++){
        if(this.sudokuGrid[i][j].gridValue!=null){
          numberCheck.set(''+this.sudokuGrid[i][j].gridValue,numberCheck.get(''+this.sudokuGrid[i][j].gridValue)+1);
        }
      }
    }
    for(let item of numberCheck.values()){
      if(item>1){
        gridValid=false;
        for(let i=6;i<9;i++){
          for(let j=3;j<6;j++) {
            this.sudokuGrid[i][j].isValid = false;
            this.sudokuGrid[i][j].gridClass = this.sudokuGrid[i][j].gridClass.replace('Error', '') + 'Error';
          }
        }
      }
    }
    numberCheck=this.generateNumberHash();
    for(let i=6;i<9;i++){
      for(let j=6;j<9;j++){
        if(this.sudokuGrid[i][j].gridValue!=null){
          numberCheck.set(''+this.sudokuGrid[i][j].gridValue,numberCheck.get(''+this.sudokuGrid[i][j].gridValue)+1);
        }
      }
    }
    for(let item of numberCheck.values()){
      if(item>1){
        gridValid=false;
        for(let i=6;i<9;i++){
          for(let j=6;j<9;j++) {
            this.sudokuGrid[i][j].isValid = false;
            this.sudokuGrid[i][j].gridClass = this.sudokuGrid[i][j].gridClass.replace('Error', '') + 'Error';
          }
        }
      }
    }
    let allEmpty=true;
    for(let i=0;i<this.sudokuGrid.length;i++){
      for(let j=0;j<this.sudokuGrid.length;j++){
        if(this.sudokuGrid[i][j].gridValue!=null)
          allEmpty=false;
      }
    }
    if(allEmpty)
      gridValid=false;
    return gridValid;
  }

  assign_sudoku_factors(items:string[],csp:CSP){
    while(items.length>0){
      let var1=items.pop();
      for(let var2 of items){
        csp.add_binary_factor(var1,var2,function (x, y) { return (+x) != (+y);});
      }
    }
  }

  create_sudoku_csp(inputGrid:number[][]):CSP{
    let csp:CSP=new CSP();
    let variables:string[]=[];
    for(let i=0;i<inputGrid.length;i++){
      for(let j=0;j<inputGrid.length;j++)
        variables.push('x'+(i+1)+(j+1));
    }
    for(let i=0;i<variables.length;i++){
      let domain=Array<string>()
      for(let j=0;j<inputGrid.length;j++)
        domain.push(""+(j+1));
      csp.add_variable(variables[i],domain);
    }
    for(let i=1;i<=inputGrid.length;i++){
      for(let j=1;j<=inputGrid.length;j++){
        let var_col_1='x'+i+j;
        let var_row_1='x'+j+i;
        for(let k=(j+1);k<=inputGrid.length;k++){
          let var_col_2='x'+i+k;
          let var_row_2='x'+k+i;
          csp.add_binary_factor(var_row_1,var_row_2,(x: string,y: string): boolean => { return (+x)!=(+y);})
          csp.add_binary_factor(var_col_1,var_col_2,(x: string,y: string): boolean => { return (+x)!=(+y);})
        }
      }
    }
    let items:string[]=[];
    for(let i=1;i<4;i++){
      for(let j=1;j<4;j++){
        items.push('x'+i+j);
      }
    }
    this.assign_sudoku_factors(items,csp);
    for(let i=1;i<4;i++){
      for(let j=4;j<7;j++){
        items.push('x'+i+j);
      }
    }
    this.assign_sudoku_factors(items,csp);
    for(let i=1;i<4;i++){
      for(let j=7;j<10;j++){
        items.push('x'+i+j);
      }
    }
    this.assign_sudoku_factors(items,csp);

    for(let i=4;i<7;i++){
      for(let j=1;j<4;j++){
        items.push('x'+i+j);
      }
    }
    this.assign_sudoku_factors(items,csp);
    for(let i=4;i<7;i++){
      for(let j=4;j<7;j++){
        items.push('x'+i+j);
      }
    }
    this.assign_sudoku_factors(items,csp);
    for(let i=4;i<7;i++){
      for(let j=7;j<10;j++){
        items.push('x'+i+j);
      }
    }
    this.assign_sudoku_factors(items,csp);

    for(let i=7;i<10;i++){
      for(let j=1;j<4;j++){
        items.push('x'+i+j);
      }
    }
    this.assign_sudoku_factors(items,csp);
    for(let i=7;i<10;i++){
      for(let j=4;j<7;j++){
        items.push('x'+i+j);
      }
    }
    this.assign_sudoku_factors(items,csp);
    for(let i=7;i<10;i++){
      for(let j=7;j<10;j++){
        items.push('x'+i+j);
      }
    }
    this.assign_sudoku_factors(items,csp);

    for(let i=0;i<inputGrid.length;i++){
      for(let j=0;j<inputGrid[i].length;j++){
        if(inputGrid[i][j]!=0)
          csp.add_unary_factor('x'+(i+1)+(j+1),function (x) { return (+x) == inputGrid[i][j]; })
      }
    }

    return csp;
  }

  solveGrid(){
    let gridStatus:boolean=this.validateGrid();
    if(gridStatus==false)
    {
      this.statusMessage="Invalid puzzle. Fix the items in red and hit Solve again.";
    }else{
      this.statusMessage="Solving...";
      let inputGrid:number[][]=[
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,6,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],];
      for(let i=0;i<inputGrid.length;i++){
        for(let j=0;j<inputGrid.length;j++){
          if(this.sudokuGrid[i][j].userInput==true)
            inputGrid[i][j]=+(this.sudokuGrid[i][j].gridValue);
        }
      }
      let csp=this.create_sudoku_csp(inputGrid);
      let solver:BacktrackingSearch=new BacktrackingSearch();
      solver.solve(csp,true,true);
      if(solver.numOptimalAssignments==0)
        this.statusMessage="No solutions found.";
      else
        this.statusMessage="Found "+solver.numOptimalAssignments+" optimal assignments with weight "+solver.optimalWeight+" in "+solver.numOperations+" steps. First Assignment took "+solver.firstAssignmentNumOperations+" operations";
      for(let item of Object.keys(solver.optimalAssignment)){
        //console.log(item,solver.optimalAssignment[item]);
        this.sudokuGrid[+(item[1])-1][+(item[2])-1].gridValue=solver.optimalAssignment[item];
      }

    }
  }

  generateEasy(){
    this.resetGrid();
    this.sudokuGrid[0][0].gridValue=1;
    this.sudokuGrid[0][1].gridValue=2;
    this.sudokuGrid[0][2].gridValue=3;
    this.sudokuGrid[0][3].gridValue=4;
    this.sudokuGrid[0][5].gridValue=9;
    this.sudokuGrid[0][7].gridValue=6;
    this.sudokuGrid[1][2].gridValue=5;
    this.sudokuGrid[1][5].gridValue=3;
    this.sudokuGrid[1][8].gridValue=9;
    this.sudokuGrid[2][1].gridValue=7;
    this.sudokuGrid[2][6].gridValue=2;
    this.sudokuGrid[2][7].gridValue=3;
    this.sudokuGrid[3][0].gridValue=5;
    this.sudokuGrid[3][2].gridValue=6;
    this.sudokuGrid[3][4].gridValue=4;
    this.sudokuGrid[3][5].gridValue=7;
    this.sudokuGrid[3][8].gridValue=3;
    this.sudokuGrid[5][0].gridValue=8;
    this.sudokuGrid[5][3].gridValue=5;
    this.sudokuGrid[5][4].gridValue=3;
    this.sudokuGrid[5][6].gridValue=7;
    this.sudokuGrid[5][8].gridValue=1;
    this.sudokuGrid[6][1].gridValue=8;
    this.sudokuGrid[6][2].gridValue=7;
    this.sudokuGrid[6][7].gridValue=1;
    this.sudokuGrid[7][0].gridValue=6;
    this.sudokuGrid[7][3].gridValue=7;
    this.sudokuGrid[7][6].gridValue=3;
    this.sudokuGrid[8][1].gridValue=1;
    this.sudokuGrid[8][3].gridValue=8;
    this.sudokuGrid[8][5].gridValue=2;
    this.sudokuGrid[8][6].gridValue=9;
    this.sudokuGrid[8][7].gridValue=5;
    this.sudokuGrid[8][8].gridValue=7;
    this.validateGrid();
  }
  generateMedium(){
    this.resetGrid();
    this.sudokuGrid[0][4].gridValue=3;
    this.sudokuGrid[0][6].gridValue=2;
    this.sudokuGrid[0][8].gridValue=5;
    this.sudokuGrid[1][1].gridValue=3;
    this.sudokuGrid[1][6].gridValue=6;
    this.sudokuGrid[2][0].gridValue=1;
    this.sudokuGrid[2][3].gridValue=6;
    this.sudokuGrid[2][6].gridValue=3;
    this.sudokuGrid[3][1].gridValue=5;
    this.sudokuGrid[3][3].gridValue=4;
    this.sudokuGrid[3][4].gridValue=6;
    this.sudokuGrid[3][8].gridValue=9;
    this.sudokuGrid[4][1].gridValue=9;
    this.sudokuGrid[4][3].gridValue=2;
    this.sudokuGrid[4][5].gridValue=5;
    this.sudokuGrid[4][7].gridValue=1;
    this.sudokuGrid[5][0].gridValue=2;
    this.sudokuGrid[5][4].gridValue=8;
    this.sudokuGrid[5][5].gridValue=1;
    this.sudokuGrid[5][7].gridValue=3;
    this.sudokuGrid[6][2].gridValue=5;
    this.sudokuGrid[6][5].gridValue=4;
    this.sudokuGrid[6][8].gridValue=2;
    this.sudokuGrid[7][2].gridValue=6;
    this.sudokuGrid[7][7].gridValue=7;
    this.sudokuGrid[8][0].gridValue=3;
    this.sudokuGrid[8][2].gridValue=8;
    this.sudokuGrid[8][4].gridValue=2;
    this.validateGrid();
  }
  generateHard(){
    this.resetGrid();
    this.sudokuGrid[0][0].gridValue=3;
    this.sudokuGrid[0][3].gridValue=1;
    this.sudokuGrid[0][4].gridValue=6;
    this.sudokuGrid[1][1].gridValue=9;
    this.sudokuGrid[1][2].gridValue=8;
    this.sudokuGrid[1][5].gridValue=5;
    this.sudokuGrid[2][5].gridValue=8;
    this.sudokuGrid[2][6].gridValue=2;
    this.sudokuGrid[2][7].gridValue=5;
    this.sudokuGrid[3][0].gridValue=4;
    this.sudokuGrid[3][3].gridValue=6;
    this.sudokuGrid[3][6].gridValue=1;
    this.sudokuGrid[3][7].gridValue=8;
    this.sudokuGrid[5][1].gridValue=2;
    this.sudokuGrid[5][2].gridValue=6;
    this.sudokuGrid[5][5].gridValue=7;
    this.sudokuGrid[5][8].gridValue=3;
    this.sudokuGrid[6][1].gridValue=1;
    this.sudokuGrid[6][2].gridValue=7;
    this.sudokuGrid[6][3].gridValue=8;
    this.sudokuGrid[7][3].gridValue=2;
    this.sudokuGrid[7][6].gridValue=9;
    this.sudokuGrid[7][7].gridValue=6;
    this.sudokuGrid[8][4].gridValue=1;
    this.sudokuGrid[8][5].gridValue=4;
    this.sudokuGrid[8][8].gridValue=8;
    this.validateGrid();
  }
  generateEvil(){
    this.resetGrid();
    this.sudokuGrid[0][2].gridValue=6;
    this.sudokuGrid[0][5].gridValue=7;
    this.sudokuGrid[0][8].gridValue=9;
    this.sudokuGrid[1][3].gridValue=3;
    this.sudokuGrid[1][4].gridValue=4;
    this.sudokuGrid[2][2].gridValue=3;
    this.sudokuGrid[2][6].gridValue=6;
    this.sudokuGrid[2][7].gridValue=5;
    this.sudokuGrid[3][0].gridValue=3;
    this.sudokuGrid[3][5].gridValue=4;
    this.sudokuGrid[3][7].gridValue=1;
    this.sudokuGrid[4][1].gridValue=2;
    this.sudokuGrid[4][4].gridValue=6;
    this.sudokuGrid[4][7].gridValue=8;
    this.sudokuGrid[5][1].gridValue=7;
    this.sudokuGrid[5][3].gridValue=1;
    this.sudokuGrid[5][8].gridValue=3;
    this.sudokuGrid[6][1].gridValue=9;
    this.sudokuGrid[6][2].gridValue=7;
    this.sudokuGrid[6][6].gridValue=2;
    this.sudokuGrid[7][4].gridValue=3;
    this.sudokuGrid[7][5].gridValue=1;
    this.sudokuGrid[8][0].gridValue=4;
    this.sudokuGrid[8][3].gridValue=2;
    this.sudokuGrid[8][6].gridValue=8;
    this.validateGrid();
  }
  generateToughest(){
    this.resetGrid();
    this.sudokuGrid[0][0].gridValue=8;
    this.sudokuGrid[1][2].gridValue=3;
    this.sudokuGrid[1][3].gridValue=6;
    this.sudokuGrid[2][1].gridValue=7;
    this.sudokuGrid[2][4].gridValue=9;
    this.sudokuGrid[2][6].gridValue=2;
    this.sudokuGrid[3][1].gridValue=5;
    this.sudokuGrid[3][5].gridValue=7;
    this.sudokuGrid[4][4].gridValue=4;
    this.sudokuGrid[4][5].gridValue=5;
    this.sudokuGrid[4][6].gridValue=7;
    this.sudokuGrid[5][3].gridValue=1;
    this.sudokuGrid[5][7].gridValue=3;
    this.sudokuGrid[6][2].gridValue=1;
    this.sudokuGrid[6][7].gridValue=6;
    this.sudokuGrid[6][8].gridValue=8;
    this.sudokuGrid[7][2].gridValue=8;
    this.sudokuGrid[7][3].gridValue=5;
    this.sudokuGrid[7][7].gridValue=1;
    this.sudokuGrid[8][1].gridValue=9;
    this.sudokuGrid[8][6].gridValue=4;
    this.validateGrid();
  }


}
