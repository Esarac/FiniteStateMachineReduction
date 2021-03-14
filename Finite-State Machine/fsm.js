var numStates;
var numAlphabet;
var machine;
var table;

//Create Table
function createTable(){

    numStates = localStorage.getItem('numStates');
    numStates = parseInt(numStates, 10);
    numAlphabet = localStorage.getItem('numAlphabet');
    numAlphabet = parseInt(numAlphabet, 10);
    machine = localStorage.getItem('machine');
    table1 = document.getElementById("table1");

    //Create Table
    if(machine == "moore"){
        createMooreTable();
    }
    else if(machine =="mealy"){
        createMealyTable();
    }
}

function createMooreTable(){
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
}

function createMealyTable(){

}

//Generate Minimun Machine
function generateMinMachine(){
    if(verifyEmptyFields()){
        alert("fill the empty fields!");
    }

    //Create Table
    if(machine == "moore"){
        generateMinMooreMachine();
    }
    else if(machine =="mealy"){
        
    }
}

function generateMinMooreMachine(){
    
}

//Verify
function verifyEmptyFields(){//Verificar si estado existe, verificar que alphabeto no repetido y con valores (no se si colocarlo automatico)
    var empty = false;

    for(i = 1; i < numStates; i++){
        for(j = 0; j < (numAlphabet+1); j++){
            if(table1.rows[i].cells[j+1].childNodes[0].value == ""){
                empty = true;
            }
        }
    }
    
    return empty;
}
