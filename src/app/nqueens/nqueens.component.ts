import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {CSP} from '../CSP';
import {BacktrackingSearch} from '../BacktrackingSearch';

@Component({
  selector: 'app-nqueens',
  templateUrl: './nqueens.component.html',
  styleUrls: ['./nqueens.component.css']
})
export class NqueensComponent implements OnInit,AfterContentChecked {
  numQueens:number=4;
  queensGrid:string[][]=new Array<Array<string>>();
  status:string="Waiting...";
  solutions:string[]=[];
  selectedIndex=-1;

  constructor() { }

  ngOnInit() {
    this.initializeQueensGrid();
  }

  ngAfterContentChecked(): void {
    if(this.selectedIndex>-1)
      this.showSolution(this.selectedIndex);
  }

  initializeQueensGrid(){
    this.queensGrid=new Array<Array<string>>();
    for(let i=0;i<this.numQueens;i++){
      let row:Array<string>=new Array<string>();
      for(let j=0;j<this.numQueens;j++)
        row.push("");
      this.queensGrid.push(row);
    }
  }

  getTableClass(row:number,col:number){
    if(this.numQueens%2==0){
      if((row+col)%2==0)
        return "cell_white;"
      else
        return "cell_dark";
    }else{
      if((row+col)%2==0)
        return "cell_dark"
      else
        return "cell_white;";
    }
  }

  solveNQueens(){
    this.status="Solving";
    this.selectedIndex=-1;
    this.initializeQueensGrid();
    let csp:CSP=this.create_nqueens_csp();
    let solver:BacktrackingSearch=new BacktrackingSearch();
    solver.solve(csp,false,false);
    if(solver.allAssignments.length==0)
      this.status="No solutions found";
    else {
      this.status = "Found " + solver.numOptimalAssignments + " optimal assignments with weight " + solver.optimalWeight + " in " + solver.numOperations + " steps.";
      this.selectedIndex=0;
    }
    this.solutions=[];
    for(let item of solver.allAssignments){
      let sTemp='';
      for(let dictKeys of Object.keys(item)){
        sTemp+=item[dictKeys]+" ";
      }
      this.solutions.push(sTemp.trim());
    }
  }

  create_nqueens_csp():CSP{
    let n=this.numQueens;
    let csp:CSP=new CSP();
    let variables:string[]=[];
    for(let i=0;i<n;i++)
      variables.push("x"+(i+1));
    for(let i=0;i<variables.length;i++){
      let domain=Array<string>()
      for(let j=0;j<n;j++)
        domain.push(i+","+j);
      csp.add_variable(variables[i],domain);
    }
    for(let i=0;i<variables.length;i++){
      for(let j=0;j<variables.length;j++){
        if(i!=j){
          csp.add_binary_factor(variables[i],variables[j], (x: string,y: string): boolean => { return (+x[2])!=(+y[2]); })
          csp.add_binary_factor(variables[i],variables[j], (x: string,y: string): boolean => { return (+x[0])-(+x[2])!=(+y[0])-(+y[2]); })
          csp.add_binary_factor(variables[i],variables[j], (x: string,y: string): boolean => { return (+x[0])+(+x[2])!=(+y[0])+(+y[2]); })
        }
      }
    }
    return csp;
  }

  showSolution(itemIndex:number){
    this.selectedIndex=itemIndex;
    for(let i=0;i<this.numQueens;i++){
      for(let j=0;j<this.numQueens;j++)
        this.queensGrid[i][j]='';
    }
    for(let item of this.solutions[itemIndex].split(' ')){
      let coords=item.split(',');
      this.queensGrid[+coords[0]][+coords[1]]='Q';
    }
  }
}
