
const Fsm = (function(){
    //Variables
        //Attributes
    var numStates;
    var numAlphabet;
    var machine;
        //Nodes
    var table1;

    //Methods
    //~Generate
    const generateInputTable = function(){
        numStates = localStorage.getItem('numStates');
        numStates = parseInt(numStates, 10);
        numAlphabet = localStorage.getItem('numAlphabet');
        numAlphabet = parseInt(numAlphabet, 10);
        machine = localStorage.getItem('machine');
        table1 = document.getElementById("table1");
    
        //Create Table
        if(machine == "moore"){
            generateInputMooreTable();
        }
        else if(machine =="mealy"){
            generateInputMealyTable();
        }
    };

    const generateInputMooreTable = function(){
        //First Row (Header)
        var header = document.createElement("tr");//Row
        table1.appendChild(header);
    
        var h1 = document.createElement("th");//Text (States)
        h1.appendChild(document.createTextNode("States"));
        header.appendChild(h1);
    
        for(i = 0; i < numAlphabet; i++){
            var hi = document.createElement("th");//Label (Alphabet)
            header.appendChild(hi);
    
            var alp = document.createElement("input");
            alp.setAttribute("value", String.fromCharCode(97+i));//~Value
            hi.appendChild(alp);
        }
        
        var hf = document.createElement("th");//Text (Output)
        hf.appendChild(document.createTextNode("Output"));
        header.appendChild(hf);
    
        //Other Rows
        for(i = 0; i < numStates; i++){
            var sRow = document.createElement("tr");//Row
            table1.appendChild(sRow);
    
            var sta = document.createElement("td");//Text (qi)
            sta.appendChild(document.createTextNode("q"+i));
            sRow.appendChild(sta);
    
            for(j = 0; j < numAlphabet; j++){
                var alpStateCell = document.createElement("td");//Label (Alphabet State)
                sRow.appendChild(alpStateCell);
    
                var alpState = document.createElement("input");
                alpState.setAttribute("value", 0);//~Value
                alpState.setAttribute("type", "number");//~Type
                alpState.setAttribute("min", "0");//~Min
                alpState.setAttribute("max", numStates-1);//~Max
                alpStateCell.appendChild(alpState);
            }
    
            var outStateCell = document.createElement("td");//Label (Output State)
            sRow.appendChild(outStateCell);
    
            var outState = document.createElement("input");
            outState.setAttribute("value", 0);//~Value
            outStateCell.appendChild(outState); 
        }
    };

    const generateInputMealyTable = function(){

    };

    const generateOutputTable = function(){
        if(verifyEmptyFields()){
            alert("fill the empty fields!");
        }
        else{
            
            //Create Table
            if(machine == "moore"){
                generateOutputMooreTable();
            }
            else if(machine =="mealy"){
                generateOutputMealyTable();
            }
        }
    };

    const generateOutputMooreTable = function(){
        var transitionMatrix = getInputStateMooreTransitionMatrix();
        
        var outputArray = getInputStateMooreOutputArray();
        var outputMatrix = createMooreOutputMatrix(transitionMatrix, outputArray);

        var partition = [];
        for(s = 0; s < outputArray.length; s++){
            var foundB = null;
            for(b = 0; (b < partition.length) && (foundB == null); b++){
                if(arrayEquals(outputMatrix[partition[b][0]], outputMatrix[s])){
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

        console.log(partition);

        var connectedMatrix =  floydWarshall(transitionMatrix);
    };

    const generateOutputMealyTable = function(){
        
    };

    //~Get
    const getInputStateMooreTransitionMatrix = function(){
        var matrix = [];

        for(r = 1; r < (numStates+1); r++){
            var state = [];
            matrix.push(state);
            for(c = 1; c < (numAlphabet+1); c++){
                var value = table1.rows[r].cells[c].childNodes[0].value;
                state.push(value);
            }
        }
        
        return matrix;
    };

    const getInputStateMooreOutputArray = function(){
        var array = [];

        for(r = 1; r < (numStates+1); r++){
            var value = table1.rows[r].cells[numAlphabet+1].childNodes[0].value;
            array.push(value);
        }

        return array;
    };


    //~Create
    const createMooreOutputMatrix = function(transitionMatrix, outputArray){
        var matrix = [];

        for(r = 0; r < transitionMatrix.length; r++){
            var state = [];
            matrix.push(state);
            for(c = 0; c < transitionMatrix[r].length; c++){
                var value = outputArray[transitionMatrix[r][c]];
                state.push(value);
            }
        }
        
        return matrix;
    };

    const floydWarshall = function(stateTable){
        var distances = [];

        for(r = 0; r < stateTable.length; r++){
            var state = [];
            distances.push(state);
            for(c = 0; c < stateTable.length; c++){
                var empty = false;
                if(c == r){
                    empty = true;
                }
                state.push(empty);
            }
        }

        for(r = 0; r < stateTable.length; r++){
            for(a = 0; a < stateTable[r].length; a++){
                var alpSta = stateTable[r][a];
                distances[r][alpSta] = true;
            }
        }

        for(k = 0; k < distances.length; k++){
            for(i = 0; i < distances.length; i++){
                for(j = 0; j < distances.length; j++){
                    if(distances[i][k] && distances[k][j]){
                        distances[i][j] = true;
                    }
                }
            }
        }

        return distances;
    };

    //~NPD
    const verifyEmptyFields = function(){//Verificar si estado existe, verificar que alphabeto no repetido y con valores (no se si colocarlo automatico)
        var empty = false;
    
        for(i = 1; i < (numStates+1); i++){
            for(j = 1; j < (numAlphabet+2); j++){
                if(table1.rows[i].cells[j].childNodes[0].value == ""){
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
    }
      

    //Public Values
    return{
        generateInputTable : generateInputTable,
        generateOutputTable : generateOutputTable
    };
})();