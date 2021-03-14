const Menu = (function(){
    //Methods
    const getValues = function(){
        //Get Values
        var numStates = document.getElementById("numStates").value;
        var numAlphabet = document.getElementById("numAlphabet").value;
        var machine = document.querySelector('input[name=machine]:checked').value;
        
        //Pass Page
        localStorage.setItem('numStates', numStates);
        localStorage.setItem('numAlphabet', numAlphabet);
        localStorage.setItem('machine', machine);
        window.document.location = './fsm.html';
    };

    //Public Values
    return {
        getValues : getValues
    };
})();
