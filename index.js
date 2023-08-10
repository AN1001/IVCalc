const main = document.getElementById("main");

const willInvest = document.getElementById("investChoice");
const investForm = document.getElementById("formContainer");
const willInvest2 = document.getElementById("investChoice2");
const investForm2 = document.getElementById("formContainer2");

const isaBtn = document.getElementById("isaBtn");
const jisaBtn = document.getElementById("jisaBtn");
const directBtn = document.getElementById("directBtn");
const sippBtn = document.getElementById("sippBtn");

const fundsInitial = document.getElementById("fundsInitial");
const fundsAddition = document.getElementById("fundsAddition");
const fundsTrades = document.getElementById("fundsTrades");
const fundsNumber = document.getElementById("fundsNumber");
const sharesInitial = document.getElementById("sharesInitial");
const sharesAddition = document.getElementById("sharesAddition");
const sharesTrades = document.getElementById("sharesTrades");
const sharesNumber = document.getElementById("sharesNumber");
const yearInput = document.getElementById("YI");
const returnInput = document.getElementById("returnInput");

const temp = document.getElementById("mini-error");
const popup = document.getElementById("popup");

function investBtnClick(){
  if (willInvest.checked == true){
    investForm.style.display = "block";
  } else {
    investForm.style.display = "none";
  }
}

function investBtnClick2(){
  if (willInvest2.checked == true){
    investForm2.style.display = "block";
  } else {
    investForm2.style.display = "none";
  }
}

function simulate() {
  let years = parseInt( yearInput.value );
  let interestRate = parseInt( returnInput.value );
  interestRate = (interestRate+100)/100;
  document.getElementById("resultsSubtitle").innerHTML = `Simulation run over ${years} years`
  
  let sharesTotal = parseInt( sharesInitial.value );
  let sharesMonthlyAddition = parseInt( sharesAddition.value);
  let sharesYearlyAddition = sharesMonthlyAddition * 12;
  let shareTrades = sharesTrades.value;
  let shareNumber = sharesNumber.value;
  let sharesTotals = [];

  for (let i = 0; i < years; i++) {
    sharesTotal += sharesYearlyAddition;
    sharesTotal *= interestRate;
    sharesTotals.push(sharesTotal);
  }
  
  let fundsTotal = parseInt( fundsInitial.value )
  let fundsMonthlyAddition = parseInt( fundsAddition.value)
  let fundsYearlyAddition = sharesMonthlyAddition * 12;
  let fundTrades = fundsTrades.value;
  let fundNumber = fundsNumber.value;
  let fundsTotals = [];
  
  let values = [fundsInitial.value, fundNumber, fundsMonthlyAddition, fundTrades, sharesInitial.value, shareNumber, sharesMonthlyAddition, shareTrades]

  for (let i = 0; i < years; i++) {
    fundsTotal += fundsYearlyAddition;
    fundsTotal *= interestRate;
    fundsTotals.push(fundsTotal);
  }
  
  fullTotal = fundsTotal + sharesTotal;

  
  //console.log([years,interestRate,fundsTotal,fundsMonthlyAddition,sharesTotal,sharesMonthlyAddition]);
  
  document.getElementById("er-1a").style.display = "none";
  document.getElementById("er-1b").style.display = "none";
  if (willInvest2.checked == true && willInvest.checked == true){
    verifyInputs("both");
    fillTable(values, "both")
    
  } else if (willInvest.checked == true){
    verifyInputs("funds");
    fillTable(values, "funds")
    
  } else if (willInvest2.checked == true){
    verifyInputs("shares");
    fillTable(values, "shares")
    
  } else {
    document.getElementById("er-1a").style.display = "flex";
    document.getElementById("er-1b").style.display = "flex";
  }
  
}

function checkWrapper(){
  document.getElementById("er-2").style.display = "none";
  if(!isaBtn.checked && !jisaBtn.checked && !directBtn.checked && !sippBtn.checked){
    document.getElementById("er-2").style.display = "flex";
    return false
  }
  return true
}

function verifyInputs(group){
  let valid = checkWrapper()
  inputs = [fundsInitial, fundsAddition, fundsTrades, fundsNumber, sharesInitial, sharesAddition, sharesTrades, sharesNumber]
  inputStates = []
  
  inputs.forEach(function(el){
    let val = parseInt(el.value)
    if(val < 0 || isNaN(val) || val==undefined){
      inputStates.push(0)
    } else {
      inputStates.push(1)
    }
  })
  
  document.querySelectorAll(".mini-error-symbol").forEach(function(el){
    el.remove()
  })
  
  if(group == "both"){
    var start = 0;
    var end = 8;
  } else if(group == "funds"){
    var start = 0;
    var end = 4;
  } else if(group == "shares"){
    var start = 4;
    var end = 8;
  }
  
  for(let i=start; i<end; i++){
    if(inputStates[i]==0){
      let par = inputs[i].parentElement.parentElement
      par.appendChild(temp.content.cloneNode(true))
      valid = false
    }
  }
  
  val = parseInt(returnInput.value)
  if(val < 0 || isNaN(val) || val == undefined){
    let par = returnInput.parentElement.parentElement
    par.appendChild(temp.content.cloneNode(true))
    valid = false
  }
  val = parseInt(YI.value)
  if(val < 0 || isNaN(val) || val == undefined){
    let par = YI.parentElement.parentElement
    par.appendChild(temp.content.cloneNode(true))
    valid = false
  }
  
  return valid
}


const popupTitle = document.getElementById("title-content")
const popupContent = document.getElementById("popup-content")

function wrapperInfo(){
  usePopup()
  popupTitle.innerHTML = "Wrappers"
  document.getElementById("pca").style.display = "block";
  document.getElementById("pcb").style.display = "none";
  document.getElementById("pcc").style.display = "none";
  document.getElementById("pcd").style.display = "none";
}

function fundsInfo(){
  usePopup();
  popupTitle.innerHTML = "Funds Investment";
  document.getElementById("pca").style.display = "none";
  document.getElementById("pcb").style.display = "block";
  document.getElementById("pcc").style.display = "none";
  document.getElementById("pcd").style.display = "none";
}

function sharesInfo(){
  usePopup();
  popupTitle.innerHTML = "Shares Investment";
  document.getElementById("pca").style.display = "none";
  document.getElementById("pcb").style.display = "none";
  document.getElementById("pcc").style.display = "block";
  document.getElementById("pcd").style.display = "none";
}

function assumptionInfo(){
  usePopup();
  popupTitle.innerHTML = "Assumptions";
  document.getElementById("pca").style.display = "none";
  document.getElementById("pcb").style.display = "none";
  document.getElementById("pcc").style.display = "none";
  document.getElementById("pcd").style.display = "block";
}

function usePopup(){
  popup.style.display = "block";
  main.classList.toggle("fadeOutClass");
}

function closePopup(){
  popup.style.display = "none";
  main.classList.toggle("fadeOutClass");
}

function fillTable(values, tables){
  for(let i=1; i<9; i++){
      document.getElementById(`tv${i}`).innerHTML = i%2==1 ? "£0" : 0
    }
  if(tables=="both"){
    for(let i=1; i<9; i++){
      document.getElementById(`tv${i}`).innerHTML = i%2==1 ? "£"+values[i-1] : values[i-1]
    }
  } else if(tables=="shares"){
    for(let i=4; i<9; i++){
      document.getElementById(`tv${i}`).innerHTML = i%2==1 ? "£"+values[i-1] : values[i-1]
    }
  } else if(tables=="funds"){
    for(let i=1; i<5; i++){
      document.getElementById(`tv${i}`).innerHTML = i%2==1 ? "£"+values[i-1] : values[i-1]
    }
  }
}
