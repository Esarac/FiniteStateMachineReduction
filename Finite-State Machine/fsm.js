//Nodes
var stateTableTextBoxes = [];
var alphabetTextBoxes = [];
var outputTextBoxes = [];

//Global Methods
const generateInputTable = function(){
    var numStates = localStorage.getItem('numStates');
    numStates = parseInt(numStates, 10);

    var numAlphabet = localStorage.getItem('numAlphabet');
    numAlphabet = parseInt(numAlphabet, 10);

    var machine = localStorage.getItem('machine');

    //Create Table
    if(machine == "moore"){
        Moore.generateInitialTable(numStates, numAlphabet);
    }
    else if(machine =="mealy"){
        Mealy.generateInitialTable(numStates, numAlphabet);
    }
};

const generateOutputTable = function(){
    var machine = localStorage.getItem('machine');

    if(verifyEmptyFields()){
        alert("fill the empty fields!");
    }
    else{
        var mach = null;
        
        //Original
        if(machine == "moore"){
            mach = Moore.obtainMachine();
        }
        else if(machine =="mealy"){
            mach = Mealy.obtainMachine();
        }
        //...
        //Test
        // var alphabet = [1,2];
        // var stateTable = [[1,0],[2,3],[3,0],[4,1],[1,0],[4,4]];
        // var outputs = [2,0,1,0,1,1]
        // mach = new Moore(alphabet, stateTable, outputs);
        //...

        reduced = mach.createRuducedMachine();

        if(machine == "moore"){
            Moore.generateReducedTable(reduced);
        }
        else if(machine =="mealy"){
            Mealy.obtainMachine(reduced);
        }
    }
};

const verifyEmptyFields = function(){//Verificar si estado existe, verificar que alphabeto no repetido y con valores (no se si colocarlo automatico)
    var empty = false;

    //AlphabetTextBoxes
    for(i = 0; (i < alphabetTextBoxes.length) && (!empty); i++){
        if(stateTableTextBoxes[i].value == ""){
            empty = true;
        }
    }

    //StateTableTextBoxes
    for(i = 0; (i < stateTableTextBoxes.length) && (!empty); i++){
        for(j = 0; (j < stateTableTextBoxes[i].length) && (!empty); j++){
            if(stateTableTextBoxes[i][j].value == ""){
                empty = true;
            }
        }
    }
    
    return empty;
};

const arrayEquals = function(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
};

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//Machine
class Machine{
    constructor(alphabet, stateTable){
        if(new.target === Machine)
            throw new Error("Abstract class, can not be instantiated");
        this.alphabet = alphabet;
        this.stateTable = stateTable;
    }

    partitioning(partition) {
        var newPartition = [];

        while(!Machine.partitionEquals(partition, newPartition)){
            if(newPartition.length != 0){
                partition = newPartition.map((x) => x);
            }
            newPartition = [];

            for(var b = 0; b < partition.length; b++){
                var bfElement = partition[b][0];
    
                var originalBlock = [bfElement];
                var newBlock = [];
    
                for(var s = 1; s < partition[b].length; s++){
                    //console.log("Block "+b+": "+0+" vs "+s);
                    var bsElement = partition[b][s];
    
                    var sameBlock = true;
                    for(var a = 0; (a < this.stateTable[s].length) && sameBlock; a++){
                        var bfTransition = this.stateTable[bfElement][a];
                        var bsTransition = this.stateTable[bsElement][a];
                        
                        //console.log("~"+a+":");
                        //console.log(bfTransition);
                        //console.log(bsTransition);
                        if(!Machine.verifySameBlock(partition, bfTransition, bsTransition)){
                            sameBlock = false;
                        }
                    }
    
                    //console.log("sameBlock: "+sameBlock);
                    if(sameBlock){
                        originalBlock.push(bsElement);
                    }
                    else{
                        newBlock.push(bsElement);
                    }
                }
    
                newPartition.push(originalBlock);
                if(newBlock.length != 0){
                    newPartition.push(newBlock);
                }
            }

            
            //console.log("partition:");
            //console.log(partition);
            //console.log("newPartition:");
            //console.log(newPartition);
            //console.log("~~~~~~~~~~~~~~~~");
        }

        return partition;
    }

    floydWarshall(){
        var distances = [];

        for(var r = 0; r < this.stateTable.length; r++){
            var state = [];
            distances.push(state);
            for(var c = 0; c < this.stateTable.length; c++){
                var empty = false;
                if(c == r){
                    empty = true;
                }
                state.push(empty);
            }
        }

        for(var r = 0; r < this.stateTable.length; r++){
            for(var a = 0; a < this.stateTable[r].length; a++){
                var alpSta = this.stateTable[r][a];
                distances[r][alpSta] = true;
            }
        }

        for(var k = 0; k < distances.length; k++){
            for(var i = 0; i < distances.length; i++){
                for(var j = 0; j < distances.length; j++){
                    if(distances[i][k] && distances[k][j]){
                        distances[i][j] = true;
                    }
                }
            }
        }

        return distances;
    };

    static partitionEquals(a, b){
        var eq = false;

        if(a.length == b.length){
            eq = true;

            for(var bl = 0; (bl < a.length) && eq; bl++){
                if(!arrayEquals(a[bl], b[bl])){
                    eq = false;
                }
            }
        }

        return eq;
    };

    static positionBlock(partition, element){
        var block;

        var run = true;
        for(var i = 0; (i < partition.length) && run; i++){
            for(var j = 0; (j < partition[i].length) && run; j++){
                if(partition[i][j] == element){
                    block = i;
                    run = false;
                }
            }
        }

        return block;
    };

    static verifySameBlock(partition, a, b){
        return Machine.positionBlock(partition, a) == Machine.positionBlock(partition, b);
    };

}

//Moore
class Moore extends Machine{

    constructor(alphabet, stateTable, outputs){
        super(alphabet, stateTable);
        this.outputs = outputs;
    }

    static generateInitialTable(numStates, numAlphabet){

        //Table
        var table = document.getElementById("table1");
        removeAllChildNodes(table);
        //...

        //Header
        var header = document.createElement("thead");
        table.appendChild(header);
        var headerRow = document.createElement("tr");//Row
        header.appendChild(headerRow);
    
        var h1 = document.createElement("th");//Text (States)
        h1.appendChild(document.createTextNode("States"));
        headerRow.appendChild(h1);
    
        for(var i = 0; i < numAlphabet; i++){
            var hi = document.createElement("th");//Label (Alphabet)
            headerRow.appendChild(hi);

            var alp = document.createElement("input");
            alp.setAttribute("value", String.fromCharCode(97+i));//~Value
            hi.appendChild(alp);

            alphabetTextBoxes.push(alp);//Add[AlphabetTextBoxes]
        }
        
        var hf = document.createElement("th");//Text (Output)
        hf.appendChild(document.createTextNode("Output"));
        headerRow.appendChild(hf);
        //...
    
        //Body
        var body = document.createElement("tbody");
        table.appendChild(body);

        for(var i = 0; i < numStates; i++){
            var sRow = document.createElement("tr");//Row
            body.appendChild(sRow);
    
            var sta = document.createElement("td");//Text (qi)
            sta.appendChild(document.createTextNode("q"+i));
            sRow.appendChild(sta);
    
            var stateLabels = [];//Add[StateTableTextboxes]
            stateTableTextBoxes.push(stateLabels);

            for(var j = 0; j < numAlphabet; j++){
                var alpStateCell = document.createElement("td");//Label (Alphabet State)
                sRow.appendChild(alpStateCell);
    
                var alpState = document.createElement("input");
                alpState.setAttribute("value", 0);//~Value
                alpState.setAttribute("type", "number");//~Type
                alpState.setAttribute("min", "0");//~Min
                alpState.setAttribute("max", numStates-1);//~Max
                alpStateCell.appendChild(alpState);

                stateLabels.push(alpState);//Add[StateTableTextboxes]
            }
    
            var outStateCell = document.createElement("td");//Label (Output State)
            sRow.appendChild(outStateCell);
    
            var outState = document.createElement("input");
            outState.setAttribute("value", 0);//~Value
            outStateCell.appendChild(outState);
            
            outputTextBoxes.push(outState);//Add[OutputTextboxes]
        }
        //...
    };

    static generateReducedTable(machine){

        //Table
        var table = document.getElementById("table2");
        removeAllChildNodes(table);
        //...

        //Header
        var header = document.createElement("thead");
        table.appendChild(header);
        var headerRow = document.createElement("tr");//Row
        header.appendChild(headerRow);
    
        var h1 = document.createElement("th");//Text (States)
        h1.appendChild(document.createTextNode("States"));
        headerRow.appendChild(h1);
    
        for(var i = 0; i < machine.alphabet.length; i++){
            var hi = document.createElement("th");//Text (Alphabet)
            hi.appendChild(document.createTextNode(machine.alphabet[i]));
            headerRow.appendChild(hi);
        }
        
        var hf = document.createElement("th");//Text (Output)
        hf.appendChild(document.createTextNode("Output"));
        headerRow.appendChild(hf);
        //...
    
        //Body
        var body = document.createElement("tbody");
        table.appendChild(body);

        for(var i = 0; i < machine.stateTable.length; i++){
            var sRow = document.createElement("tr");//Row
            body.appendChild(sRow);
    
            var sta = document.createElement("td");//Text (qi)
            sta.appendChild(document.createTextNode("q"+i));
            sRow.appendChild(sta);

            for(var j = 0; j < machine.alphabet.length; j++){
                var alpStateCell = document.createElement("td");//Text (Alphabet State)
                alpStateCell.appendChild(document.createTextNode(machine.stateTable[i][j]));
                sRow.appendChild(alpStateCell);
            }
    
            var outStateCell = document.createElement("td");//Text (Output State)
            outStateCell.appendChild(document.createTextNode(machine.outputs[i]));
            sRow.appendChild(outStateCell);
        }
        //...
    };

    createRuducedMachine(){
        var partition = this.partition();

        //State Table
        var rStateTable = [];
        for(var b = 0; b < partition.length; b++){
            var lider = partition[b][0];

            var rStateRow = []
            for(var a = 0; a < this.alphabet.length; a++){
                var liderAlpValue = this.stateTable[lider][a];
                rStateRow.push(Machine.positionBlock(partition, liderAlpValue));
            }
            rStateTable.push(rStateRow);
        }

        //Outputs
        var rOutputs = [];
        for(var b = 0; b < partition.length; b++){
            var lider = partition[b][0];
            rOutputs.push(this.outputs[lider]);
        }

        return new Moore(this.alphabet, rStateTable, rOutputs);
    }

    partition(){
        //First Partition
        var partition = [];
        for(var s = 0; s < this.outputs.length; s++){
            var foundB = null;
            for(var b = 0; (b < partition.length) && (foundB == null); b++){
                if(this.outputs[s] == this.outputs[partition[b][0]]){
                    foundB = b;
                }
            }

            if(foundB == null){
                var newB = [s];
                partition.push(newB);
            }
            else{
                partition[foundB].push(s);
            }
        }

        //Iterative Partition
        partition = super.partitioning(partition, this.stateTable);

        //Delete Inaccessible Node
        var initStateDistances =  super.floydWarshall()[0];
        for(var s = 1; s < initStateDistances.length; s++){
            if(initStateDistances[s] == false){

                for(var b = 0; b < partition.length; b++){
                    for(var i = 0; i < partition[b].length; i++){
                        if(partition[b][i] == s){
                            partition[b].splice(i, 1);
                        }
                    }
                    if(partition[b].length == 0){
                        partition.splice(b, 1);
                    }
                }

            }
        }

        return partition;
    };

    static obtainMachine(){
        return new Moore(Moore.obtainAlphabet(), Moore.obtainStateTable(), Moore.obtainOutputs());
    };

    static obtainAlphabet(){
        var array = [];

        for(var c = 0; c < alphabetTextBoxes.length; c++){
            var value = alphabetTextBoxes[c].value;
            array.push(value);
        }

        return array;
    };

    static obtainStateTable(){
        var matrix = [];

        for(var r = 0; r < stateTableTextBoxes.length; r++){
            var state = [];
            matrix.push(state);
            for(var c = 0; c < stateTableTextBoxes[r].length; c++){
                var value = stateTableTextBoxes[r][c].value;
                state.push(value);
            }
        }
        
        return matrix;
    };

    static obtainOutputs(){
        var array = [];

        for(var r = 0; r < outputTextBoxes.length; r++){
            var value = outputTextBoxes[r].value;
            array.push(value);
        }

        return array;
    };

}

//Mealy
class Mealy extends Machine{

    constructor(alphabet, stateTable, outputs){
        super(alphabet, stateTable);
        this.outputs = outputs;
    }

    static generateInitialTable(numStates, numAlphabet){

    };

    static obtainMachine(){

    };

    generateReducedTable(){//No
        // var transitionMatrix = getInputStateMooreTransitionMatrix();
        
        // var outputArray = getInputStateMooreOutputArray();
        // var outputMatrix = createMooreOutputMatrix(transitionMatrix, outputArray);

        // var partition = [];
        // for(s = 0; s < outputArray.length; s++){
        //     var foundB = null;
        //     for(b = 0; (b < partition.length) && (foundB == null); b++){
        //         if(arrayEquals(outputMatrix[partition[b][0]], outputMatrix[s])){
        //             foundB = b;
        //         }
        //     }

        //     if(foundB == null){
        //         var newB = [s];
        //         partition.push(newB);
        //     }
        //     else{
        //         partition[foundB].push(s);
        //     }
        // }

        // var connectedMatrix =  floydWarshall(transitionMatrix);
    };

}