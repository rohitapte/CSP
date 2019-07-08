import {CSP} from "./CSP";

export class BacktrackingSearch{
  public optimalAssignment={};
  public optimalWeight:number=0;
  public numOptimalAssignments:number = 0;
  public numAssignments:number = 0;
  public numOperations:number=0;
  public firstAssignmentNumOperations=0;
  public allAssignments=[];
  public csp:CSP=null;
  public mcv:boolean=false;
  public ac3:boolean=false;
  public domains:{[index:string]:Array<string>}={};

  reset_results(){
    this.optimalAssignment={};
    this.optimalWeight=0;
    this.numOptimalAssignments=0;
    this.numAssignments=0;
    this.numOperations=0;
    this.firstAssignmentNumOperations=0;
    this.allAssignments=[];
  }

  print_stats(){
    let isOptimal=Object.keys(this.optimalAssignment).length;
    if(isOptimal==0){
      console.log("No solution was found.");
    }else{
      console.log("Found "+this.numOptimalAssignments+" optimal assignments with weight "+this.optimalWeight+" in "+this.numOperations+" steps.");
      console.log("First Assignment took "+this.firstAssignmentNumOperations+" operations");
    }
    console.log(this.optimalAssignment);
  }

  get_delta_weight(assignment:{},variable:string,val:string):number{
    if(variable in assignment){
      console.log("Variable in assignment");
      return 0;
    }else{
      let w:number=1.0;
      if(this.csp.unaryFactors[variable]!=null){
        w*=this.csp.unaryFactors[variable][val];
        if(w==0)
          return w;
      }
      let sTemp=Object.keys(this.csp.binaryFactors[variable]);
      for(let var2 of sTemp){
        let factor=this.csp.binaryFactors[variable][var2];
        if(var2 in assignment){
          w*=factor[val][assignment[var2]];
          if(w==0)
            return w;
        }
      }
      return w;
    }
  }

  solve(csp:CSP,mcv:boolean,ac3:boolean){
    this.csp=csp;
    this.mcv=mcv;
    this.ac3=ac3;
    this.reset_results();
    this.domains={}
    for(let var1 of this.csp.variables)
      this.domains[var1]=this.csp.values[var1];

    this.backTrack({},0,1);
    //this.print_stats();
  }

  backTrack(assignment:{},numAssigned:number,weight:number){
    this.numOperations+=1;
    if(weight>0){
      if(numAssigned==this.csp.numVars){
        this.numAssignments+=1;
        let newAssignment={};
        for(let var1 of this.csp.variables)
          newAssignment[var1]=assignment[var1];
        this.allAssignments.push(newAssignment);
        if(Object.keys(this.optimalAssignment).length==0 || weight>=this.optimalWeight){
          if(weight==this.optimalWeight)
            this.numOptimalAssignments++;
          else
            this.numOptimalAssignments=1;
          this.optimalWeight=weight;
          this.optimalAssignment=newAssignment;
          if(this.firstAssignmentNumOperations==0)
            this.firstAssignmentNumOperations=this.numOperations;
        }
        return;
      }
      let var2=this.get_unassigned_variable(assignment);
      let ordered_values=this.domains[var2];

      if(this.ac3==false){
        for(let val1 of ordered_values){
          let deltaWeight=this.get_delta_weight(assignment,var2,Object(val1));
          if(deltaWeight>0){
            assignment[var2]=val1;
            this.backTrack(assignment,numAssigned+1,weight*deltaWeight);
            delete assignment[var2];
          }
        }
      }else{
        for(let val1 of ordered_values){
          let deltaWeight=this.get_delta_weight(assignment,var2,Object(val1));
          if(deltaWeight>0){
            assignment[var2]=val1;
            let localCopy= JSON.parse(JSON.stringify(this.domains));
            this.domains[var2]=[val1];
            this.arc_consistency_check(var2);
            this.backTrack(assignment,numAssigned+1,weight*deltaWeight);
            this.domains=localCopy;
            delete assignment[var2];
          }
        }
      }

    }else{
      console.log("weight must be more than zero "+weight);
    }
  }

  get_unassigned_variable(assignment:{}):string{
    if(this.mcv==false){
      for(let var2 of this.csp.variables) {
        if (!(var2 in assignment))
          return var2
      }
    }else{
      let leastConsistentVar=null;
      let leastCount=9999999;
      for(let var2 of this.csp.variables){
        if(!(var2 in assignment)){
          let ordered_values=this.domains[var2];
          let count_a=0;
          for(let val2 of ordered_values){
            let deltaWeight=this.get_delta_weight(assignment,var2,Object(val2));
            if(deltaWeight>0)
              count_a++;
          }
          if(count_a<leastCount){
            leastCount=count_a;
            leastConsistentVar=var2;
          }
        }
      }
      return leastConsistentVar;
    }
  }

  remove_inconsistency(i,j):boolean{
    let items_to_remove=[];
    for(let val1 of this.domains[i]){
      let bFound=false;
      for(let val2 of this.domains[j]){
        if(this.csp.binaryFactors[i][j][val1][val2]>0)
          bFound=true;
      }
      if(bFound==false)
        items_to_remove.push((val1));
    }
    if(items_to_remove.length>0){
      for(let item of items_to_remove) {
        let itemIndex=this.domains[i].indexOf(item,0);
        if(itemIndex>-1)
          this.domains[i].splice(itemIndex,1);
        else
          console.log("Index not found");
        //delete this.domains[i][item];

      }
      return true;
    }else
      return false;
  }

  arc_consistency_check(var2:string){
    let queue=[];
    for(let j of this.csp.get_neighbors(var2))
      queue.push([j,var2]);
    while(queue.length>0){
      let temp=queue.shift();
      if(this.remove_inconsistency(temp[0],temp[1])){
        for(let var_l of this.csp.get_neighbors(temp[0])){
          if(var_l!=temp[0])
            queue.push([var_l,temp[0]]);
        }
      }

    }
  }

}
