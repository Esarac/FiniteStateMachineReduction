const Index = (function(){
    const ERROR = "Invalid values";

    //Methods
    const getValues = function(){
        //Get Values
        var numStates = document.getElementById("states").value;
        var numAlphabet = document.getElementById("alphabet").value;
        var machine = document.querySelector('input[name=machine]:checked').value;
        
        //Pass Page
        if(verifyValues(numStates, numAlphabet, machine)){
            localStorage.setItem('numStates', numStates);
            localStorage.setItem('numAlphabet', numAlphabet);
            localStorage.setItem('machine', machine);
            window.document.location = './fsm.html';
        }
        else{
            alert(ERROR);
        }
        
    };

    const verifyValues = function(numStates, numAlphabet, machine){
        var ns = (numStates > 0) && (numStates % 1 == 0);
        var na = (numAlphabet > 0) && (numAlphabet % 1 == 0);
        var m = (machine == "moore") || (machine == "mealy");
        return ns && na && m;
    }

    //Public Values
    return {
        getValues : getValues
    };
})();
