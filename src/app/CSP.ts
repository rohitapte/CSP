export class CSP{
  public numVars:number=0;
  public variables :string[] = [];
  public values:{[index:string]:Array<string>}={};
  public unaryFactors:{[index:string]:{[subindex:string]:number}}={};
  //public binaryFactors:{[index:string]:{[subindex:string]:number}}={};
  public binaryFactors:{[index:string]:{[subindex1:string]:{[subindex2:string]:{[subindex3:string]:number}}}}={};

  add_variable(varname:string,vardomain:Array<string>):void{
    if(varname in this.variables){
      alert("Variable "+varname+" already exists.");
    }else{
      this.numVars++;
      this.variables.push(varname);
      this.values[varname]=vardomain;
      this.unaryFactors[varname]=null;
      this.binaryFactors[varname]={};
    }
  }

  get_neighbors(variable:string){
    let sTemp=Object.keys(this.binaryFactors[variable]);
    return Object.keys(this.binaryFactors[variable]);
  }

  add_unary_factor(variable:string,factorFunc:(funcVar:string)=>boolean){
    let factor:{[index:string]:number}={};
    for(let val of this.values[variable])
      factor[val]=+factorFunc(val);
    if(this.unaryFactors[variable]==null){
      this.unaryFactors[variable]=factor;
    }else{
      let tempDict:{[subindex:string]:number}={}
      for(let val1 of Object.keys(factor))
        tempDict[val1]=this.unaryFactors[variable][val1]*factor[val1];
      this.unaryFactors[variable]=tempDict;
    }
  }

  add_binary_factor(var1:string,var2:string,factorFunc:(funcVar1:string,funcVar2:string)=>boolean){
    if(var1==var2){
      alert("[BinaryFactor]: You are adding a binary factor over the same variable "+var1);
    }else{
      let table1:{[index:string]:{[subindex:string]:number}}={};
      for(let val1 of this.values[var1]){
        let subtable:{[subindex:string]:number}={};
        for(let val2 of this.values[var2])
          subtable[val2]=+factorFunc(val1,val2);
        table1[val1]=subtable;
      }
      this.update_binary_factor_table(var1,var2,table1);
      let table2:{[index:string]:{[subindex:string]:number}}={};
      for(let val2 of this.values[var2]){
        let subtable:{[subindex:string]:number}={};
        for(let val1 of this.values[var1])
          subtable[val1]=+factorFunc(val1,val2);
        table2[val2]=subtable;
      }
      this.update_binary_factor_table(var2,var1,table2);

    }
  }

  update_binary_factor_table(var1:string,var2:string,table:{[index:string]:{[subindex:string]:number}}){
    if(!(var2 in this.binaryFactors[var1])){
      this.binaryFactors[var1][var2]=table;
    }else{
      let currentTable=this.binaryFactors[var1][var2];
      for(let i of Object.keys(table)){
        for(let j of Object.keys(table[i])) {
          if (i in currentTable && j in currentTable[i])
            currentTable[i][j]*=table[i][j];
          else
            alert("Error in update_binary_factor_table ");
        }
      }
    }
  }


}
