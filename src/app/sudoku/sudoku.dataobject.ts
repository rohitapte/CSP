export class sudokuDataObject{
  public gridValue:number;
  public userInput:boolean;
  public gridClass:string;
  public isValid:boolean;

  constructor(gridValue:number,userInput:boolean,gridClass:string){
    this.gridValue=gridValue;
    this.userInput=userInput;
    this.gridClass=gridClass;
    this.isValid=true;
  }
}
