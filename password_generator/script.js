const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");  
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");


function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}
  

function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function getRandomInt(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNum(){
    return getRandomInt(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInt(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInt(65,91));
}

function generateSymbol(){
    const randNum = getRandomInt(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpperC = false;
    let hasLowerC = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpperC = true;
    if(lowercaseCheck.checked) hasLowerC = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if (hasUpperC && hasLowerC && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLowerC || hasUpperC) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
    
}

async function copycontent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{copyMsg.classList.remove("active");},2000);
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

function shufflePassword(array){
    // fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp; 
    }
    let str = "";
    array.forEach((el)=>(str+=el));
    return str; 
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("change",handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value){
        copycontent();
    }
})

generateBtn.addEventListener('click',()=>{
    if(checkCount<=0) return;

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numberCheck.checked){
    //     password += generateRandomNum();
    // }

    // if(symbolCheck.checked){
    //     password += symbolCheck();
    // }

    let funArr = [];

    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }

    if(numberCheck.checked){
        funArr.push(generateRandomNum);
    }

    if(symbolCheck.checked){
        funArr.push(generateSymbol);
    }

    for(let i=0 ; i<funArr.length;i++){
        password += funArr[i](); 
    }

    for(let i=0;i<passwordLength-funArr.length;i++){
        let randomint = getRandomInt(0,funArr.length);
        password += funArr[randomint]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password; 

    calcStrength();

});