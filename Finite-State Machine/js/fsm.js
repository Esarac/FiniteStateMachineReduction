const ALP_ERROR = "Alphabet error";
const STT_ERROR = "State transition error";
const OUT_ERROR = "Output error";

//Ui
/**
 * All the user interface methods.
 */
const Ui = (function(){

    //Constants
    //~Attributes
    const STATES = "States";
    const OUTPUTS = "Outputs";

    //~Nodes
    const INITIAL_TABLE = "table1";
    const FINAL_TABLE = "table2";

    //Nodes
    var machine;

    //~Nodes
    var stateTableTextBoxes = [];
    var alphabetTextBoxes = [];
    var outputTextBoxes = [];

    //General
    /**
     * Generate the initial HTML table.
     */
    const generateInitialTable = function(){
        var numStates = localStorage.getItem('numStates');
        numStates = parseInt(numStates, 10);
    
        var numAlphabet = localStorage.getItem('numAlphabet');
        numAlphabet = parseInt(numAlphabet, 10);
    
        machine = localStorage.getItem('machine');
    
        //Create Table
        if(machine == "moore"){
            mooreGenerateInitialTable(numStates, numAlphabet);
        }
        else if(machine =="mealy"){
            mealyGenerateInitialTable(numStates, numAlphabet);
        }
    };

    /**
     * Generate the final HTML table (Reduced machine).
     */
    const generateFinalTable = function(){
        try{
            var mach = null;
            
            // Original
            if(machine == "moore"){
                mach = new Moore(obtainInitialAlphabet(), obtainInitialStateTable(), mooreObtainInitialOutputs());
            }
            else if(machine =="mealy"){
                mach = new Mealy(obtainInitialAlphabet(), obtainInitialStateTable(), mealyObtainInitialOutputs());
            }
            // ...
            // Test
            //~Moore
            // var alphabet = [1,2];
            // var stateTable = [[1,0],[2,3],[3,0],[4,1],[1,0],[4,4]];
            // var outputs = [2,0,1,0,1,1]
            // mach = new Moore(alphabet, stateTable, outputs);
            //~Mealy
            // var alphabet = [1,2];
            // var stateTable = [[1,0],[2,3],[3,0],[4,1],[1,0],[4,4]];
            // var outputs = [[0,2],[1,0],[0,2],[1,0],[0,2],[1,1]];
            // mach = new Mealy(alphabet, stateTable, outputs);
            // ...
    
            reduced = mach.createReducedMachine();
    
            if(reduced instanceof Moore){
                mooreGenerateFinalTable(reduced);
            }
            else if(reduced instanceof Mealy){
                mealyGenerateFinalTable(reduced);
            }
        }
        catch(err){
            alert(err.message);
        }
    };

    /**
     * Get the alphabet values from the initial table. Also, store the AlphabetTextBoxes from the HTML.
     * @returns {Array} Alphabet(Array of strings)
     */
    const obtainInitialAlphabet = function(){
        var array = [];

        for(var c = 0; c < alphabetTextBoxes.length; c++){
            var value = alphabetTextBoxes[c].value;
            array.push(value);
        }

        return array;
    };

    /**
     * Get the transition table values from the initial table. Also, store the StateTableTextBoxes from the HTML.
     * @returns {Matrix} Transition Table(Matrix[state][alphabet] of numbers)
     */
    const obtainInitialStateTable = function(){
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
    
    /**
     * Remove all the children of a HTML node.
     * @param {Node} parent 
     */
    const removeAllChildNodes = function(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    //Moore
    /**
     * Generate the moore initial HTML table.
     * @param {Number} numStates 
     * @param {Number} numAlphabet 
     */
    const mooreGenerateInitialTable = function(numStates, numAlphabet){

        //Table
        var table = document.getElementById(INITIAL_TABLE);
        removeAllChildNodes(table);
        //...

        //Header
        var header = document.createElement("thead");
        table.appendChild(header);
        var headerRow = document.createElement("tr");//Row
        header.appendChild(headerRow);
    
        var h1 = document.createElement("th");//Text (States)
        h1.appendChild(document.createTextNode(STATES));
        headerRow.appendChild(h1);
    
        alphabetTextBoxes = [];
        for(var i = 0; i < numAlphabet; i++){
            var hi = document.createElement("th");//Label (Alphabet)
            headerRow.appendChild(hi);

            var alp = document.createElement("input");
            alp.setAttribute("value", String.fromCharCode(97+i));//~Value
            hi.appendChild(alp);

            alphabetTextBoxes.push(alp);//Add[AlphabetTextBoxes]
        }
        
        var hf = document.createElement("th");//Text (Output)
        hf.appendChild(document.createTextNode(OUTPUTS));
        headerRow.appendChild(hf);
        //...
    
        //Body
        var body = document.createElement("tbody");
        table.appendChild(body);

        stateTableTextBoxes = [];
        outputTextBoxes = [];
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

    /**
     * Generate the moore final HTML table.
     * @param {Moore} machine 
     */
    const mooreGenerateFinalTable = function(machine){

        //Table
        var table = document.getElementById(FINAL_TABLE);
        removeAllChildNodes(table);
        //...

        //Header
        var header = document.createElement("thead");
        table.appendChild(header);
        var headerRow = document.createElement("tr");//Row
        header.appendChild(headerRow);
    
        var h1 = document.createElement("th");//Text (States)
        h1.appendChild(document.createTextNode(STATES));
        headerRow.appendChild(h1);
    
        for(var i = 0; i < machine.alphabet.length; i++){
            var hi = document.createElement("th");//Text (Alphabet)
            hi.appendChild(document.createTextNode(machine.alphabet[i]));
            headerRow.appendChild(hi);
        }
        
        var hf = document.createElement("th");//Text (Output)
        hf.appendChild(document.createTextNode(OUTPUTS));
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

    /**
     * Get the output values from the initial table. Also, store the OutputTextBoxes from the HTML.
     * @returns {Array} Outputs(Array of strings)
     */
    const mooreObtainInitialOutputs = function(){
        var array = [];

        for(var r = 0; r < outputTextBoxes.length; r++){
            var value = outputTextBoxes[r].value;
            array.push(value);
        }

        return array;
    };
    
    //Mealy
    /**
     * Generate the mealy initial HTML table.
     * @param {Number} numStates 
     * @param {Number} numAlphabet 
     */
    const mealyGenerateInitialTable = function(numStates, numAlphabet){
        //Table
        var table = document.getElementById(INITIAL_TABLE);
        removeAllChildNodes(table);
        //...

        //Header
        var header = document.createElement("thead");
        table.appendChild(header);
        var headerRow = document.createElement("tr");//Row
        header.appendChild(headerRow);
    
        var h1 = document.createElement("th");//Text (States)
        h1.appendChild(document.createTextNode(STATES));
        headerRow.appendChild(h1);
    
        alphabetTextBoxes = [];
        for(var i = 0; i < numAlphabet; i++){
            var hi = document.createElement("th");//Label (Alphabet)
            headerRow.appendChild(hi);

            var alp = document.createElement("input");
            alp.setAttribute("value", String.fromCharCode(97+i));//~Value
            hi.appendChild(alp);

            alphabetTextBoxes.push(alp);//Add[AlphabetTextBoxes]
        }
        //...

        //Body
        var body = document.createElement("tbody");
        table.appendChild(body);

        stateTableTextBoxes = [];
        outputTextBoxes = [];
        for(var i = 0; i < numStates; i++){
            var sRow = document.createElement("tr");//Row
            body.appendChild(sRow);
    
            var sta = document.createElement("td");//Text (qi)
            sta.appendChild(document.createTextNode("q"+i));
            sRow.appendChild(sta);
    
            var stateLabels = [];//Add[StateTableTextboxes]
            stateTableTextBoxes.push(stateLabels);

            var sOutputLabels = [];//Add[OutputTextBoxes]
            outputTextBoxes.push(sOutputLabels);

            for(var j = 0; j < numAlphabet; j++){
                var alpCell = document.createElement("td");
                sRow.appendChild(alpCell);
    
                //StateTransition
                var alpState = document.createElement("input");//Label (Alphabet State)
                alpState.setAttribute("value", 0);//~Value
                alpState.setAttribute("type", "number");//~Type
                alpState.setAttribute("min", "0");//~Min
                alpState.setAttribute("max", numStates-1);//~Max
                alpCell.appendChild(alpState);

                stateLabels.push(alpState);//Add[StateTableTextboxes]
                //...

                //Output
                var alpOutput = document.createElement("input");// Label (Alphabet Output)
                alpOutput.setAttribute("value", 0);//~Value
                alpCell.appendChild(alpOutput);

                sOutputLabels.push(alpOutput);//Add[OutputTextboxes]
                //...
            }
        }
        //...
    };

    /**
     * Generate the mealy final HTML table.
     * @param {Moore} machine 
     */
    const mealyGenerateFinalTable = function(machine){
        //Table
        var table = document.getElementById(FINAL_TABLE);
        removeAllChildNodes(table);
        //...

        //Header
        var header = document.createElement("thead");
        table.appendChild(header);
        var headerRow = document.createElement("tr");//Row
        header.appendChild(headerRow);
    
        var h1 = document.createElement("th");//Text (States)
        h1.appendChild(document.createTextNode(STATES));
        headerRow.appendChild(h1);
    
        for(var i = 0; i < machine.alphabet.length; i++){
            var hi = document.createElement("th");//Text (Alphabet)
            hi.appendChild(document.createTextNode(machine.alphabet[i]));
            headerRow.appendChild(hi);
        }
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
                var alpStateCell = document.createElement("td");//Text (Alphabet State, Output)
                alpStateCell.appendChild(document.createTextNode((machine.stateTable[i][j])+","+(machine.outputs[i][j])));
                sRow.appendChild(alpStateCell);
            }
        }
        //...
    };
    
    /**
     * Get the output values from the initial table. Also, store the OutputTextBoxes from the HTML.
     * @returns {Matrix} Outputs(Matrix[state][alphabet] of strings)
     */
    const mealyObtainInitialOutputs = function(){
        var matrix = [];

        for(var r = 0; r < outputTextBoxes.length; r++){
            var state = [];
            matrix.push(state);
            for(var c = 0; c < outputTextBoxes[r].length; c++){
                var value = outputTextBoxes[r][c].value;
                state.push(value);
            }
        }

        return matrix;
    }

    //Public
    return {
        generateInitialTable : generateInitialTable,
        generateFinalTable : generateFinalTable
    };

})();

//Util
/**
 * All the utility methods.
 */
const Util = (function(){

    //Methods
    /**
     * Check the equality of two arrays.
     * @param {Array} a 
     * @param {Array} b 
     * @returns {Boolean}
     */
    const arrayEquals = function(a, b) {
        return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
    };

    /**
     * Check the equality of two partitions.
     * @param {Array} a - Partition (Array of Blocks)
     * @param {Array} b - Partition (Array of Blocks)
     * @returns {Boolean}
     */
    const partitionEquals = function(a, b){
        var eq = false;

        if(a.length == b.length){
            eq = true;

            for(var bl = 0; (bl < a.length) && eq; bl++){
                if(!Util.arrayEquals(a[bl], b[bl])){
                    eq = false;
                }
            }
        }

        return eq;
    };

    /**
     * Returns the block number of the current state.
     * @param {Array} partition - Partition (Array of Blocks)
     * @param {Number} element - State
     * @returns {Number}
     */
    const positionBlock = function(partition, element){
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

    /**
     * Check if to states are in the same block.
     * @param {Array} partition - Partition (Array of Blocks)
     * @param {Number} a - State
     * @param {Number} b - State
     * @returns {Boolean}
     */
    const verifySameBlock = function(partition, a, b){
        return Util.positionBlock(partition, a) == Util.positionBlock(partition, b);
    };

    //Public
    return {
        arrayEquals : arrayEquals,
        partitionEquals : partitionEquals,
        positionBlock : positionBlock,
        verifySameBlock : verifySameBlock
    };

})();

//Machine
/**
 * Abstract class representing a Finite-State Machine.
 */
class Machine{

    /**
     * Machine constructor.
     * @param {Array} alphabet - Alphabet(Array of strings)
     * @param {Matrix} stateTable - Transition Table(Matrix[state][alphabet] of numbers)
     */
    constructor(alphabet, stateTable){
        if(new.target === Machine)
            throw new Error("Abstract class, can not be instantiated");
        if(!Machine.verifyAlphabet(alphabet))
            throw new Error(ALP_ERROR);
        if(!Machine.verifyStateTable(stateTable))
            throw new Error(STT_ERROR);
        this.alphabet = alphabet;
        this.stateTable = stateTable;
    };

    /**
     * Make the step 2 and 3 of the partitioning algorithm and eliminate the unreachable states from the initial state.
     * @param {Array} partition - Partition (Array of Blocks)
     * @returns {Array} Partition (Array of Blocks)
     */
    partitioning(partition) {
        var newPartition = [];

        while(!Util.partitionEquals(partition, newPartition)){
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
                        if(!Util.verifySameBlock(partition, bfTransition, bsTransition)){
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

            
            // console.log("partition:");
            // console.log(partition);
            // console.log("newPartition:");
            // console.log(newPartition);
            // console.log("~~~~~~~~~~~~~~~~");
        }

        //Delete Inaccessible Node
        var initStateDistances =  this.floydWarshall()[0];
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

    /**
     * Generate a table that shows if from an initial state is reachable another state.
     * @returns Matrix[initial state][final state] of booleans
     */
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

    /**
     * Check if the alphabet: Is not empty, don't have lambda symbols and don't have repeated symbols.
     * @param {Array} alphabet - Alphabet(Array of strings)
     * @returns {Boolean}
     */
    static verifyAlphabet(alphabet){
        //Not empty
        var empty = (alphabet.length <= 0);

        //Elements not empty
        var eEmpty = false;

        for(var i = 0; (i < alphabet.length) && !eEmpty; i++){
            eEmpty = (alphabet[i] === "");
        }

        //Repeated
        var repeated = false;
        for(var i = 0; (i < alphabet.length) && !repeated; i++){
            for(var j = i+1; (j < alphabet.length) && !repeated; j++){
                repeated = (alphabet[i].valueOf() == alphabet[j].valueOf());
            }
        }

        return !empty && !eEmpty && !repeated;
    }

    /**
     * Check if the transition table: Is not empty and have integer numbers on the expected range.
     * @param {Matrix} stateTable - Transition Table(Matrix[state][alphabet] of numbers)
     * @returns {Boolean}
     */
    static verifyStateTable(stateTable){
        //Not empty
        var empty = (stateTable.length <= 0);

        //Elements in range, integer and not empty
        var incorrectElement = false;

        for(var i = 0; (i < stateTable.length) && !incorrectElement; i++){
            for(var j = 0; (j < stateTable[i].length) && !incorrectElement; j++){
                incorrectElement = ( (0 > stateTable[i][j]) || (stateTable[i][j] >= stateTable.length) )
                || (stateTable[i][j] % 1 != 0)
                || (stateTable[i][j] === "");
            }
        }

        return !empty && !incorrectElement;
    }

}

//Moore
/**
 * Class representing a Moore Finite-State Machine.
 */
class Moore extends Machine{

    /**
     * Moore constructor.
     * @param {Array} alphabet - Alphabet(Array of strings)
     * @param {Matrix} stateTable - Transition Table(Matrix[state][alphabet] of numbers)
     * @param {Array} outputs - Outputs(Array of strings)
     */
    constructor(alphabet, stateTable, outputs){
        if(!Moore.verifyOutput(outputs))
            throw new Error(OUT_ERROR);
        super(alphabet, stateTable);
        this.outputs = outputs;
    };

    /**
     * Generate the reduced machine of the current finite-state machine.
     * @returns {Moore}
     */
    createReducedMachine(){
        var partition = this.partition();

        //State Table
        var rStateTable = [];
        for(var b = 0; b < partition.length; b++){
            var lider = partition[b][0];

            var rStateRow = []
            for(var a = 0; a < this.alphabet.length; a++){
                var liderAlpValue = this.stateTable[lider][a];
                rStateRow.push(Util.positionBlock(partition, liderAlpValue));
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
    };

    /**
     * Make the step 1, 2 and 3 of the partitioning algorithm and eliminate the unreachable states from the initial state.
     * @returns {Array} Partition (Array of Blocks)
     */
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
        partition = super.partitioning(partition);

        return partition;
    };

    /**
     * Check if the outputs aren't lambda.
     * @param {Array} outputs - Outputs(Array of strings)
     * @returns {Boolean}
     */
    static verifyOutput(outputs){
        //Elements not empty
        var eEmpty = false;

        for(var i = 0; (i < outputs.length) && !eEmpty; i++){
            eEmpty = (outputs[i] === "");
        }

        return !eEmpty;
    }

}

//Mealy
/**
 * Class representing a Mealy Finite-State Machine.
 */
class Mealy extends Machine{

    /**
     * Mealy constructor.
     * @param {Array} alphabet - Alphabet(Array of strings)
     * @param {Matrix} stateTable - Transition Table(Matrix[state][alphabet] of numbers)
     * @param {Matrix} outputs - Outputs(Matrix[state][alphabet] of strings)
     */
    constructor(alphabet, stateTable, outputs){
        if(!Mealy.verifyOutput(outputs)){
            throw new Error(OUT_ERROR);
        }
        super(alphabet, stateTable);
        this.outputs = outputs;
    };

    /**
     * Generate the reduced machine of the current finite-state machine.
     * @returns {Mealy}
     */
    createReducedMachine(){
        var partition = this.partition();

        //State Table
        var rStateTable = [];
        for(var b = 0; b < partition.length; b++){
            var lider = partition[b][0];

            var rStateRow = []
            for(var a = 0; a < this.alphabet.length; a++){
                var liderAlpValue = this.stateTable[lider][a];
                rStateRow.push(Util.positionBlock(partition, liderAlpValue));
            }
            rStateTable.push(rStateRow);
        }

        //Outputs
        var rOutputs = [];
        for(var b = 0; b < partition.length; b++){
            var lider = partition[b][0];

            var rStateRow = []
            for(var a = 0; a < this.alphabet.length; a++){
                rStateRow.push(this.outputs[lider][a]);
            }
            rOutputs.push(rStateRow);
        }

        return new Mealy(this.alphabet, rStateTable, rOutputs);
    };

    /**
     * Make the step 1, 2 and 3 of the partitioning algorithm and eliminate the unreachable states from the initial state.
     * @returns {Array} Partition (Array of Blocks)
     */
    partition(){
        //First Partition
        var partition = [];
        for(var s = 0; s < this.outputs.length; s++){
            var foundB = null;
            for(var b = 0; (b < partition.length) && (foundB == null); b++){
                var equalOut = true;

                for(var a = 0; (a < this.outputs.length) && (equalOut); a++){
                    if(this.outputs[s][a] != this.outputs[partition[b][0]][a]){
                        equalOut = false;
                    }
                }

                if(equalOut){
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
        partition = super.partitioning(partition);

        return partition;
    };

    /**
     * Check if the outputs aren't lambda.
     * @param {Array} outputs - Outputs(Array of strings)
     * @returns {Boolean}
     */
    static verifyOutput(outputs){
        //Elements not empty
        var eEmpty = false;

        for(var i = 0; (i < outputs.length) && !eEmpty; i++){
            for(var j = 0; (j < outputs[i].length) && !eEmpty; j++){
                eEmpty = (outputs[i][j] === "");
            }
        }

        return !eEmpty;
    }

}