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

var final = 0;

const temp = document.getElementById("mini-error");
const popup = document.getElementById("popup");
const divpay = document.getElementById("divpay");

var isaRankedData = [];
var sippRankedData = [];
var jisaRankedData = [];
var directRankedData = [];
var rankedDatas = [isaRankedData, jisaRankedData, directRankedData, sippRankedData];

var c1 = false;
var c2 = false;
var c3 = false;
var c4 = false;

const header = document.getElementById("flexibleTitle");
let btns = header.getElementsByClassName("radioBtnHolder");
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    let current = document.getElementsByClassName("active");
    current[0].classList.toggle("active");
    this.classList.toggle("active");
    fillContent(rankedDatas[this.id], ["isa","jisa","direct","sipp"][this.id])
  });
}

const ISARadio = document.getElementById("ISARadio");
const JISARadio = document.getElementById("JISARadio");
const SIPPRadio = document.getElementById("SIPPRadio");
const directRadio = document.getElementById("directRadio");

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
  let valid;
  document.getElementById("er-1a").style.display = "none";
  document.getElementById("er-1b").style.display = "none";

  if (willInvest2.checked == true && willInvest.checked == true){
    valid = verifyInputs("both");
    
  } else if (willInvest.checked == true){
    valid = verifyInputs("funds");
    
  } else if (willInvest2.checked == true){
    valid = verifyInputs("shares");
    
  } else {
    valid = false;
    document.getElementById("er-1a").style.display = "flex";
    document.getElementById("er-1b").style.display = "flex";
  }

  let buttonsClicked = [];
  ISARadio.parentElement.style.display = "none";
  JISARadio.parentElement.style.display = "none";
  directRadio.parentElement.style.display = "none";
  SIPPRadio.parentElement.style.display = "none";

  c1 = c2 = c3 = c4 = false;
  if(isaBtn.checked){
    buttonsClicked.push(ISARadio);
    c1 = true;
  }

  if(jisaBtn.checked){
    buttonsClicked.push(JISARadio);
    c2 = true;
  }

  if(directBtn.checked){
    buttonsClicked.push(directRadio);
    c3 = true;
  }

  if(sippBtn.checked){
    buttonsClicked.push(SIPPRadio);
    c4 = true;
  }

  let current = document.getElementsByClassName("active");
  if(current[0]){
    current[0].classList.toggle("active");
  }

  if(buttonsClicked[0]){
    buttonsClicked[0].parentElement.classList.toggle("active")
  }
  buttonsClicked.forEach(function(el){
    el.parentElement.style.display = "block";
  })

  if(valid){
    let values = startSimulation();
    startRender(values);
  }
}

function startSimulation(){
  let years = parseInt( yearInput.value );
  let interestRate = parseInt( returnInput.value );
  interestRate = (interestRate+100)/100;
  document.getElementById("resultsSubtitle").innerHTML = `Simulation run over ${years} years`;
  
  let sharesTotal = parseInt( sharesInitial.value );
  let sharesMonthlyAddition = parseInt( sharesAddition.value);
  let sharesYearlyAddition = sharesMonthlyAddition * 12;
  let shareTrades = sharesTrades.value;
  let shareNumber = sharesNumber.value;
  let sharesTotals = [];

  if(willInvest2.checked){
    for (let i = 0; i < years; i++) {
      sharesTotal += sharesYearlyAddition;
      sharesTotal *= interestRate;
      sharesTotals.push(sharesTotal);
    }
  } else {
    sharesTotal = 0;
    sharesMonthlyAddition = 0;
    shareNumber = 0;
  }
  
  let fundsTotal = parseInt( fundsInitial.value );
  let fundsMonthlyAddition = parseInt( fundsAddition.value);
  let fundsYearlyAddition = fundsMonthlyAddition * 12;
  let fundTrades = fundsTrades.value;
  let fundNumber = fundsNumber.value;
  let fundsTotals = [];
  
  if(willInvest.checked){
    for (let i = 0; i < years; i++) {
      fundsTotal += fundsYearlyAddition;
      fundsTotal *= interestRate;
      fundsTotals.push(fundsTotal);
    }
  } else {
    fundsTotal = 0;
    fundsMonthlyAddition = 0;
    fundNumber = 0;
  }
  
  let values = [fundsInitial.value, fundNumber, fundsMonthlyAddition, fundTrades, sharesInitial.value, shareNumber, sharesMonthlyAddition, shareTrades];
  fullTotal = fundsTotal + sharesTotal;
  final = Math.round(fullTotal);
  document.getElementById("totalEarnedVal").innerHTML = "£"+Math.round(fullTotal).toLocaleString();

  if (willInvest2.checked == true && willInvest.checked == true){
    fillTable(values, "both");
  } else if (willInvest.checked == true){
    fillTable(values, "funds");
  } else if (willInvest2.checked == true){
    fillTable(values, "shares");
  }

  return simPlatforms(values, fundsTotals, sharesTotals, years);

  
  //console.log([years,interestRate,fundsTotal,fundsMonthlyAddition,sharesTotal,sharesMonthlyAddition]);
  
}

function checkWrapper(){
  document.getElementById("er-2").style.display = "none";
  if(!isaBtn.checked && !jisaBtn.checked && !directBtn.checked && !sippBtn.checked){
    document.getElementById("er-2").style.display = "flex";
    return false;
  }
  return true;
}

function verifyInputs(group){
  let valid = checkWrapper();
  inputs = [fundsInitial, fundsAddition, fundsTrades, fundsNumber, sharesInitial, sharesAddition, sharesTrades, sharesNumber];

  inputStates = [];
  
  inputs.forEach(function(el){
    let val = parseInt(el.value);
    if(val < 0 || isNaN(val) || val==undefined){
      inputStates.push(0);
    } else {
      inputStates.push(1);
    }
  })
  
  document.querySelectorAll(".mini-error-symbol").forEach(function(el){
    el.remove();
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
      let par = inputs[i].parentElement.parentElement;
      par.appendChild(temp.content.cloneNode(true));
      valid = false;
    }
  }
  
  val = parseInt(returnInput.value)
  if(val < 0 || isNaN(val) || val == undefined){
    let par = returnInput.parentElement.parentElement;
    par.appendChild(temp.content.cloneNode(true));
    valid = false;
  }
  val = parseInt(YI.value)
  if(val < 0 || isNaN(val) || val == undefined){
    let par = YI.parentElement.parentElement;
    par.appendChild(temp.content.cloneNode(true));
    valid = false;
  }
  
  val = parseInt(document.getElementById("divpay").value)
  if(val < 0 || isNaN(val) || val == undefined || val>100){
    let par = document.getElementById("divpay").parentElement.parentElement;
    par.appendChild(temp.content.cloneNode(true));
    valid = false;
  }

  return valid;
}


const popupTitle = document.getElementById("title-content");
const popupContent = document.getElementById("popup-content");

function wrapperInfo(){
  usePopup()
  popupTitle.innerHTML = "Wrappers";
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
      document.getElementById(`tv${i}`).innerHTML = i%2==1 ? "£0" : 0;
    }
  if(tables=="both"){
    for(let i=1; i<9; i++){
      document.getElementById(`tv${i}`).innerHTML = i%2==1 ? "£"+parseInt(values[i-1]).toLocaleString() : parseInt(values[i-1]).toLocaleString();
    }
  } else if(tables=="shares"){
    for(let i=4; i<9; i++){
      document.getElementById(`tv${i}`).innerHTML = i%2==1 ? "£"+parseInt(values[i-1]).toLocaleString() : parseInt(values[i-1]).toLocaleString();
    }
  } else if(tables=="funds"){
    for(let i=1; i<5; i++){
      document.getElementById(`tv${i}`).innerHTML = i%2==1 ? "£"+parseInt(values[i-1]).toLocaleString() : parseInt(values[i-1]).toLocaleString();
    }
  }
}
// fundsInitial.value, fundNumber, fundsMonthlyAddition, fundTrades, sharesInitial.value, shareNumber, sharesMonthlyAddition, shareTrades
 

async function simPlatforms(values, fundsTotals, sharesTotals, years){
  const computedData = [];
  const response = await fetch('./platforms.json');
  let rawData = await response.json();
  let newarr = [];

  for(let i=0; i<rawData.length; i++){
    if (willInvest2.checked && willInvest.checked){
      if(rawData[i]["Support_Funds"] == "Yes" && rawData[i]["Supports_Shares"] == "Yes"){
        newarr.push(rawData[i]);
      }
    } else if (willInvest.checked){
      if(rawData[i]["Support_Funds"] == "Yes"){
        newarr.push(rawData[i]);
      }
    } else if (willInvest2.checked){
      if(rawData[i]["Supports_Shares"] == "Yes"){
        newarr.push(rawData[i]);
      }
    }
  }
  
  rawData = newarr;

  rawData.forEach(function(platform){
    let currentPlatform = [platform, platform.Platform_Name];

    if(platform.Charge_Type == "Fixed Fee" || platform.Charge_Type == "Fixed Fee Special"){
      charges = fixedFeeHandler(years, platform, values, fundsTotals, sharesTotals, platform.Charge_Type == "Fixed Fee Special");
      currentPlatform.push(platform.Charge_Type);
      currentPlatform.push(charges);
    } else if(platform.Charge_Type == "Tiered"){
      charges = tieredFeeHandler(values, platform, fundsTotals, sharesTotals)
      currentPlatform.push(platform.Charge_Type);
      currentPlatform.push(charges);
    }
    computedData.push(currentPlatform);
  })
  
  console.log(computedData);
  return computedData;
}

function fixedFeeHandler(years, platform, values, fundsTotals, sharesTotals, isSpecial){
  charges = {isa:[],jisa:[],direct:[],sipp:[]};
  let constCharge = [];

  divRe = platform["Share_DivInvest"] * Math.floor(values[5]*(divpay.value/100)) * years
  constCharge.push(divRe);

  //initial buy in = cost * funds/shares held
  charge = platform["Share_Xn_Fee"]*values[5];
  constCharge.push(charge);
  charge = platform["Reg_Xn_Fee"]*values[7]*years;
  constCharge.push(charge);

  //Xn fee * trades per year * years
  charge = platform["Fund_Reg_Xn"]*values[3]*years;
  constCharge.push(charge);
  charge = platform["Fund_Xn_Fee"]*values[1];
  constCharge.push(charge);


  
  //regcharge(Xns), divre, yearly cost, buy-in funds, buy-in shares, Xn funds, Xn shares, total
  //cost = years*platform fee
  if(isaBtn.checked){
    thisCharge = [];
    charge = years*platform["Fee_ISA"];
    thisCharge.push(charge);
    thisCharge = thisCharge.concat(constCharge);
    thisCharge.push(thisCharge.reduce((partialSum, a) => partialSum + a, 0));

    charges.isa = thisCharge;
  }
  if(jisaBtn.checked){
    thisCharge = [];
    charge = years*platform["Fee_JISA"];
    thisCharge.push(charge);
    thisCharge = thisCharge.concat(constCharge);
    thisCharge.push(thisCharge.reduce((partialSum, a) => partialSum + a, 0));

    charges.jisa = thisCharge;
  }
  if(directBtn.checked){
    thisCharge = [];
    charge = years*platform["Fee_GIA"];
    thisCharge.push(charge);
    thisCharge = thisCharge.concat(constCharge);
    thisCharge.push(thisCharge.reduce((partialSum, a) => partialSum + a, 0));

    charges.direct = thisCharge;
  }
  if(sippBtn.checked && !isSpecial){
    thisCharge = [];
    charge = years*platform["Fee_SIPP"]+years*platform["Additional_SIPP_Fee"];
    thisCharge.push(charge);
    thisCharge = thisCharge.concat(constCharge);
    thisCharge.push(thisCharge.reduce((partialSum, a) => partialSum + a, 0));

    charges.sipp = thisCharge;
  } else if(sippBtn.checked && isSpecial){
    charge = []
    if (willInvest.checked && willInvest2.checked){
      for(let i=0; i<fundsTotals.length; i++){
        if(fundsTotals[i]+sharesTotals[i]<50000){
          charge.push(90+platform["Additional_SIPP_Fee"]);
        } else {
          charge.push(180+platform["Additional_SIPP_Fee"]);
        }
      }
    } else if (willInvest2.checked){
      sharesTotals.forEach(function(el){
        if(el<50000){
          charge.push(90+platform["Additional_SIPP_Fee"]);
        } else {
          charge.push(180+platform["Additional_SIPP_Fee"]);
        }
      })
    } else if (willInvest.checked){
      fundsTotals.forEach(function(el){
        if(el<50000){
          charge.push(90+platform["Additional_SIPP_Fee"]);
        } else {
          charge.push(180+platform["Additional_SIPP_Fee"]);
        }
      })
    }

    thisCharge = [];
    
    thisCharge.push(charge);
    thisCharge = thisCharge.concat(constCharge);
    thisCharge.push(charge.reduce((partialSum, a) => partialSum + a, 0) + constCharge.reduce((partialSum, a) => partialSum + a, 0));
    charges.sipp = thisCharge;
  }

  return charges;
}
// [fundsInitial.value, fundNumber, fundsMonthlyAddition, fundTrades, sharesInitial.value, shareNumber, sharesMonthlyAddition, shareTrades];

function tieredFeeHandler(values, platform, fundsTotals, sharesTotals){
  charges = {isa:[],jisa:[],direct:[],sipp:[]};

  if(isaBtn.checked){
    charges.isa.push(tieredSim(platform, fundsTotals, sharesTotals, "Fee_ISA", values));
  }

  if(jisaBtn.checked){
    charges.jisa.push(tieredSim(platform, fundsTotals, sharesTotals, "Fee_JISA", values));
  }

  if(directBtn.checked){
    charges.direct.push(tieredSim(platform, fundsTotals, sharesTotals, "Fee_GIA", values));
  }

  if(sippBtn.checked){
    charges.sipp.push(tieredSim(platform, fundsTotals, sharesTotals, "Fee_SIPP", values));
  }

  return charges;
}

function tieredSim(platform, fundsTotals, sharesTotals, type, values){
  let charges = [];
  let constCharge = [];
  let years = fundsTotals.length || sharesTotals.length;

  divRe = platform["Share_DivInvest"] * Math.floor(values[5]*(divpay.value/100)) * years;
  constCharge.push(divRe);

  //initial buy in = cost * funds/shares held
  charge = platform["Share_Xn_Fee"]*values[5];
  constCharge.push(charge);
  charge = platform["Reg_Xn_Fee"]*values[7]*years;
  constCharge.push(charge);

  //Xn fee * trades per year * years
  charge = platform["Fund_Reg_Xn"]*values[3]*years;
  constCharge.push(charge);
  charge = platform["Fund_Xn_Fee"]*values[1];
  constCharge.push(charge);

  if(type == "Fee_SIPP"){
    constCharge.push(years*platform["Additional_SIPP_Fee"]);
  }

  charges.push(constCharge)
  charges.push(tieredLoop(fundsTotals, type, "funds", platform));
  charges.push(tieredLoop(sharesTotals, type, "shares", platform));

  //reinvest, sharexn, initialshare buy-in, fundxn, initial fund buy-in, (Additional SIPP fees)
  //fundcharges,
  //sharecharges
  return charges
}

function tieredLoop(typeTotals, type, heldType, platform){
  let charges = [];
  typeTotals.forEach(function(val){
    let charge = 0;
    cur = val;
    platform[type][heldType]["charge"].every(function(band){
      let curCharge = 0;
      if(cur-band[0]>=0){
        curCharge+=band[0]*(band[1]/100);
        cur = cur-band[0];
      } else {
        curCharge+=cur*(band[1]/100);
        charge+=curCharge;
        return false;
      }

      if(band[2]>curCharge){
        curCharge = band[2];
      }
      if(band[3]<curCharge){
        curCharge = band[3];
      }
      charge+=curCharge;

      return true;
    })

    charges.push(charge);
  })
  return charges;
}

async function startRender(data){
  data = await data;
  
  isaRankedData = filterData(data.toSorted(getSorter("isa")), "isa" );
  jisaRankedData = filterData(data.toSorted(getSorter("jisa")), "jisa" );
  directRankedData = filterData(data.toSorted(getSorter("direct")), "direct" );
  sippRankedData = filterData(data.toSorted(getSorter("sipp")), "sipp");

  rankedDatas = [isaRankedData, jisaRankedData, directRankedData, sippRankedData];

  if(c1){fillContent(isaRankedData, "isa");
  } else if(c2){fillContent(jisaRankedData, "jisa");
  } else if(c3){fillContent(directRankedData, "direct");
  } else if(c4){fillContent(sippRankedData, "sipp");
  }
  
}

function getSorter(wrapper){
  return function(a, b){
    if(getFees(a,wrapper) < getFees(b,wrapper)){
      return -1;
    } else {
      return 1;
    }
  }
}

function filterData(data, wrapper){
  let newarr = []
  data.forEach(function(el){
    let check = getFees(el, wrapper);
    if(check != undefined && !isNaN(check)){
      newarr.push(el)
    }
  })
  return newarr
}

function getFees(el, wrapper){
  if(el[2]=="Fixed Fee" || el[2]=="Fixed Fee Special"){
    return el[3][wrapper][6]
  } else if (el[2]=="Tiered"){
    currentSum = 0;
    if(el[3][wrapper][0]){
      (el[3][wrapper][0]).forEach(function(arr){
        currentSum+=arr.reduce((partialSum, a) => partialSum + a, 0);
      })
    } else {
      return undefined;
    }
    
    return currentSum;
  }
}

const blockTemplate = document.getElementById("broker-block-template");
const blockHolder = document.getElementById("broker-blocks-holder");
function addBlock(el, wrapper){
  let newBlock = blockTemplate.content.cloneNode(true);
  newBlock.getElementById("bbName").innerHTML = el[1];
  let finalVal = 0;

  let fee = getFees(el, wrapper);

  newBlock.getElementById("bbFinalVal").innerHTML = "£"+(parseInt(final) - parseInt(fee)).toLocaleString();
  newBlock.getElementById("bbFee").innerHTML = "£"+fee.toLocaleString();
  newBlock.getElementById("bbFeePerc").innerHTML = Math.round((fee/final)*10000)/100+"%";

  blockHolder.appendChild(newBlock);
}

const lowestPlatformVal = document.getElementById("lowestPlatformVal");
const lowestChargeVal = document.getElementById("lowestChargeVal");

function fillBlocks(data, wrapper){
  while (blockHolder.lastElementChild) {
    blockHolder.removeChild(blockHolder.lastElementChild);
  }

  data.forEach(function(el){
    addBlock(el, wrapper);
  })
}

function fillContent(data, wrapper){
  let string = data[0][1];
  let length = 18;
  let trimmedString = string.length > length ? string.substring(0, length - 3) + "..." : string.substring(0, length); 
  lowestPlatformVal.innerHTML = trimmedString;
  lowestChargeVal.innerHTML = "£"+parseInt(getFees(data[0], wrapper)).toLocaleString();

  if(c1){fillBlocks(data, "isa");
  } else if(c2){fillBlocks(data, "jisa");
  } else if(c3){fillBlocks(data, "direct");
  } else if(c4){fillBlocks(data, "sipp");
  }
}

