

let counter = 0;

function counterfn(){
    console.log(counter);
    counter++;
    
}

setTimeout(counterfn,1000)
counterfn();