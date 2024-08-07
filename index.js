if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (error) => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}

const main = document.getElementById("main");
const results = document.getElementById("results");
const infoSection = document.getElementById("info");
const errorSection = document.getElementById("error");

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

const ffgArea = document.getElementById("fundFeeGraph");
const sfgArea = document.getElementById("shareFeeGraph")
var fundFeeGraph = createChart(ffgArea, [123,23,54], "Funds Fee");
var shareFeeGraph = createChart(sfgArea, [123,23,54], "Share Fee");

const portfolioGraphArea = document.getElementById("graph1");
var portfolioGraph = createChart(portfolioGraphArea, [0], "Portfolio Growth", "Total");

var isaRankedData = [];
var sippRankedData = [];
var jisaRankedData = [];
var directRankedData = [];
var rankedDatas = [isaRankedData, jisaRankedData, directRankedData, sippRankedData];

var c1 = false;
var c2 = false;
var c3 = false;
var c4 = false;

var currentlyActive = [{}, "Name", "Fixed Fee", {}];
var isMobile = false;

const header = document.getElementById("flexibleTitle");
let btns = header.getElementsByClassName("radioBtnHolder");
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    let current = document.getElementsByClassName("active");
    current[0].classList.toggle("active");
    this.classList.toggle("active");
    fillContent(rankedDatas[this.id], ["isa","jisa","direct","sipp"][this.id]);
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
    buttonsClicked[0].parentElement.classList.toggle("active");
  }
  buttonsClicked.forEach(function(el){
    el.parentElement.style.display = "block";
  })

  if(valid){
    let values = startSimulation();
    startRender(values);

    if(isMobile){
      results.style.display = "flex";
      document.getElementById("sidebar").style.display = "none";
      document.getElementById("backBtn").style.display = "block"
    }
  } else{
    results.style.display = "none";
    infoSection.style.display = "none";
    errorSection.style.display = "block";
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
      sharesTotals.push(Math.round(sharesTotal * 100) / 100);
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
      fundsTotals.push(Math.round(fundsTotal * 100) / 100);
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

  return simPlatforms(values, fundsTotals, sharesTotals, years, fullTotal>50000);

  
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
var clickable = true;

function wrapperInfo(){
  if(clickable){
    usePopup()
    popupTitle.innerHTML = "Wrappers";
    document.getElementById("pca").style.display = "block";
    document.getElementById("pcb").style.display = "none";
    document.getElementById("pcc").style.display = "none";
    document.getElementById("pcd").style.display = "none";
  }
}

function fundsInfo(){
  if(clickable){
  usePopup();
  popupTitle.innerHTML = "Funds Investment";
  document.getElementById("pca").style.display = "none";
  document.getElementById("pcb").style.display = "block";
  document.getElementById("pcc").style.display = "none";
  document.getElementById("pcd").style.display = "none";
  }
}

function sharesInfo(){
  if(clickable){
  usePopup();
  popupTitle.innerHTML = "Shares Investment";
  document.getElementById("pca").style.display = "none";
  document.getElementById("pcb").style.display = "none";
  document.getElementById("pcc").style.display = "block";
  document.getElementById("pcd").style.display = "none";
  }
}

function assumptionInfo(){
  if(clickable){
  usePopup();
  popupTitle.innerHTML = "Assumptions";
  document.getElementById("pca").style.display = "none";
  document.getElementById("pcb").style.display = "none";
  document.getElementById("pcc").style.display = "none";
  document.getElementById("pcd").style.display = "block";
  }
}

function usePopup(){
  clickable = false;
  popup.style.display = "block";
  main.classList.toggle("fadeOutClass");
}

function closePopup(){
  clickable = true;
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
 

async function simPlatforms(values, fundsTotals, sharesTotals, years, over50k){
  const computedData = [];
  const response = await fetch('./platforms.json');
  let rawData = await response.json();
  let newarr = [];

  for(let i=0; i<rawData.length; i++){
    if(rawData[i].Platform_Name=="Interactive Investor (Investor Essential)" && over50k){
      //II (I Essential) does not support accounts over £50k
    } else if (willInvest2.checked && willInvest.checked){
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
      charges = tieredFeeHandler(values, platform, fundsTotals, sharesTotals);
      currentPlatform.push(platform.Charge_Type);
      currentPlatform.push(charges);
    }
    computedData.push(currentPlatform);
  })
  
  portfolioGraph.destroy();

  if(fundsTotals.length!=0 && sharesTotals.length!=0){
    let sumarr = []
    for(let i=0; i<fundsTotals.length; i++){
      sumarr.push(fundsTotals[i]+sharesTotals[i])
    }
    portfolioGraph = createChart(portfolioGraphArea, sumarr, "Portfolio Growth", "Total");

  } else {
    if(fundsTotals.length!=0){
      portfolioGraph = createChart(portfolioGraphArea, fundsTotals, "Portfolio Growth", "Total");
    } else {
      portfolioGraph = createChart(portfolioGraphArea, sharesTotals, "Portfolio Growth", "Total");
    }
  }


  console.log(computedData);
  return computedData;
}

function fixedFeeHandler(years, platform, values, fundsTotals, sharesTotals, isSpecial){
  charges = {isa:[],jisa:[],direct:[],sipp:[]};
  let constCharge = [];

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
    charge = [];
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

        let max = band[2]
        if(max<curCharge){
          curCharge = max;
        }
        charge+=curCharge;
        return false;
      }
/*
      min = band[3]
      if(min>curCharge){
        curCharge = min;
      }
*/
      max = band[2]
      if(max<curCharge){
        curCharge = max;
      }
      charge+=curCharge;

      return true;
    })

    charges.push(Math.round(charge * 100) / 100);
  })
  return charges;
}

async function startRender(data){
  results.style.display = "flex"
  infoSection.style.display = "none"
  errorSection.style.display = "none"
  data = await data;

  isaRankedData = filterData(data, "isa" ).toSorted(getSorter("isa"));
  jisaRankedData = filterData(data, "jisa" ).toSorted(getSorter("jisa"));
  directRankedData = filterData(data, "direct" ).toSorted(getSorter("direct"));
  sippRankedData = filterData(data, "sipp").toSorted(getSorter("sipp"));

  rankedDatas = [isaRankedData, jisaRankedData, directRankedData, sippRankedData];
  console.log(rankedDatas)

  if(c1){fillContent(isaRankedData, "isa");
  } else if(c2){fillContent(jisaRankedData, "jisa");
  } else if(c3){fillContent(directRankedData, "direct");
  } else if(c4){fillContent(sippRankedData, "sipp");
  }
  
}

function getSorter(wrapper){
  return function(a, b){
    return getFees(a,wrapper) - getFees(b,wrapper)
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
  newBlock.getElementById("bbFee").innerHTML = "£"+parseInt(fee).toLocaleString();
  newBlock.getElementById("bbFeePerc").innerHTML = Math.round((fee/final)*10000)/100+"%";

  let capsule = document.createElement("div")
  capsule.appendChild(newBlock);
  blockHolder.appendChild(capsule);

  capsule.addEventListener("click",function() {
    currentlyActive = el;

    let blocks = blockHolder.getElementsByClassName("active2");
    if(blocks[0]){
      blocks[0].classList.toggle("active2");
    }

    this.firstElementChild.classList.toggle("active2");
    fillExtraData(currentlyActive, wrapper);
  })
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

  
  fillBlocks(data, wrapper);
  blockHolder.firstElementChild.firstElementChild.classList.toggle("active2");
  currentlyActive = data[0];
  fillExtraData(currentlyActive, wrapper);
}

const tierTemplate = document.getElementById("bandTemplate");
const fundsBand = document.getElementById("fundsBands")
const sharesBand = document.getElementById("sharesBands")

function fillExtraData(el, wrapper){
  resetExtraData();
  document.getElementById("ExT").innerHTML = `More On ${el[1]}`;
  if(el[0].Notes){
    document.getElementById("source").innerHTML = el[0].Notes;
  } else {
    document.getElementById("source").innerHTML = "No extra info";
  }
  
  let wrapperTo = {"isa":"Fee_ISA", "jisa":"Fee_JISA", "direct":"Fee_GIA", "sipp":"Fee_SIPP"}[wrapper];
  if(el[2] == "Fixed Fee" || (el[2] == "Fixed Fee Special" && wrapper!="sipp") ){
    document.getElementById("assumptionsTable2").style.display = "block";
    document.getElementById("barChart").style.display = "flex";
    document.getElementById("xz").style.display = "block";
    document.getElementById("fillerSec").style.display = "block";
    
    fillBarChart( [ el[0].Fee_ISA, el[0].Fee_JISA, el[0].Fee_GIA, el[0].Fee_SIPP ], el[2] == "Fixed Fee Special" );

    document.getElementById("e1").innerHTML = "£"+el[0][wrapperTo].toLocaleString();
    document.getElementById("e4").innerHTML = `Platform Charge For ${wrapper}`;
    document.getElementById("e2").innerHTML = yearInput.value;
    document.getElementById("e3").innerHTML = "£"+el[3][wrapper][1].toLocaleString();

    document.getElementById("etotal").innerHTML = "£"+parseInt( parseFloat(el[0][wrapperTo])*parseInt(yearInput.value)+parseFloat(el[3][wrapper][1])).toLocaleString();

  } else if(el[2] == "Tiered"){
    fundsBand.style.display = "block";
    sharesBand.style.display = "block";

    if(el[3][wrapper][0][1].length != 0){
      document.getElementById("g1").style.display = "block";
      fundFeeGraph.destroy();
      fundFeeGraph = createChart(ffgArea, el[3][wrapper][0][1], "Funds Fees", "Fee");
    }
    if(el[3][wrapper][0][2].length != 0){
      document.getElementById("g2").style.display = "block";
      shareFeeGraph.destroy();
      shareFeeGraph = createChart(sfgArea, el[3][wrapper][0][2], "Share Fees", "Fee");
    }
    
    let fundsTiers = el[0][wrapperTo].funds.charge;
    let sharesTiers = el[0][wrapperTo].shares.charge;

    let paras = document.getElementsByClassName("trueParent");

    while(paras[0]) {
      paras[0].parentNode.removeChild(paras[0]);
    }

    fundsTiers.forEach(function(tier){
      let tierEl = tierTemplate.content.cloneNode(true)
      tierEl.getElementById("f1").innerHTML = tier[1]+"%";
      if(tier[2]){
        tierEl.getElementById("f2").innerHTML = "Max: £"+tier[2].toLocaleString();
      } else {
        tierEl.getElementById("f2").innerHTML = "Max: None"
      }
      if(tier[3]){
        tierEl.getElementById("f3").innerHTML = "Min: £"+tier[3].toLocaleString();
      } else {
        tierEl.getElementById("f3").innerHTML = "Min: None"
      }
      tierEl.getElementById("f4").innerHTML = "Next £"+tier[0]

      fundsBand.appendChild(tierEl);
    })

    sharesTiers.forEach(function(tier){
      let tierEl = tierTemplate.content.cloneNode(true)
      tierEl.getElementById("f1").innerHTML = tier[1]+"%";
      if(tier[2]){
        tierEl.getElementById("f2").innerHTML = "Max: £"+tier[2].toLocaleString();
      } else {
        tierEl.getElementById("f2").innerHTML = "Max: None"
      }
      if(tier[3]){
        tierEl.getElementById("f3").innerHTML = "Min: £"+tier[3].toLocaleString();
      } else {
        tierEl.getElementById("f3").innerHTML = "Min: None"
      }
      tierEl.getElementById("f4").innerHTML = "Next £"+tier[0]

      sharesBand.appendChild(tierEl);
    })

    //createChart()

  }

  let shares = 0;
  let funds = 0;
  let sharesTPY = 0;
  let fundsTPY = 0;
  if(willInvest.checked){
    funds = fundsNumber.value;
    fundsTPY = fundsTrades.value;
  }
  if(willInvest2.checked){
    shares = sharesNumber.value;
    sharesTPY = sharesTrades.value;
  }

  if(el[0]["Supports_Shares"]=="Yes"){
    document.getElementById("tv31").innerHTML = "£"+el[0]["Share_Xn_Fee"].toLocaleString();
    document.getElementById("tv32").innerHTML = "£"+el[0]["Reg_Xn_Fee"].toLocaleString();
    document.getElementById("tv33").innerHTML = "£"+el[0]["Share_DivInvest"].toLocaleString();
  }

  if(el[0]["Support_Funds"]=="Yes"){
    document.getElementById("tv41").innerHTML = "£"+el[0]["Fund_Xn_Fee"].toLocaleString();
    document.getElementById("tv42").innerHTML = "£"+el[0]["Fund_Reg_Xn"].toLocaleString();
  }

  let sumA = (parseFloat(el[0]["Share_Xn_Fee"])*parseFloat(shares));
  document.getElementById("c1").innerHTML = `${shares} Shares`;
  document.getElementById("c2").innerHTML = `£${ parseFloat(el[0]["Share_Xn_Fee"]).toLocaleString() }`;
  document.getElementById("c3").innerHTML = `£${ sumA.toLocaleString() }`;

  let sumB = (parseFloat(el[0]["Fund_Xn_Fee"])*parseFloat(funds));
  document.getElementById("c4").innerHTML = `${funds} Funds`;
  document.getElementById("c5").innerHTML = `£${ parseFloat(el[0]["Fund_Xn_Fee"]).toLocaleString() }`;
  document.getElementById("c6").innerHTML = `£${ sumB.toLocaleString() }`;

  let sumC = (parseFloat(el[0]["Reg_Xn_Fee"])*parseInt(sharesTPY)*parseInt(yearInput.value));
  document.getElementById("c11").innerHTML = `£${el[0]["Reg_Xn_Fee"].toLocaleString()}/Share`;
  document.getElementById("c12").innerHTML = sharesTPY;
  document.getElementById("c13").innerHTML = yearInput.value;
  document.getElementById("c14").innerHTML = "£"+sumC.toLocaleString();


  let sumD = (parseFloat(el[0]["Fund_Reg_Xn"])*parseInt(fundsTPY)*parseInt(yearInput.value));
  document.getElementById("c15").innerHTML = `£${el[0]["Fund_Reg_Xn"].toLocaleString()}/Fund`;
  document.getElementById("c16").innerHTML = fundsTPY;
  document.getElementById("c17").innerHTML = yearInput.value;
  document.getElementById("c18").innerHTML = "£"+sumD.toLocaleString();

  document.getElementById("total1").innerHTML = "£"+(sumA+sumB+sumC+sumD).toLocaleString();

}

const maxBarHeight = 180;
function fillBarChart(wrappers, isSpecial){
  resetBarChart();
  document.getElementById("tv21").innerHTML = "£"+wrappers[0].toLocaleString();
  document.getElementById("tv22").innerHTML = "£"+wrappers[1].toLocaleString();
  document.getElementById("tv23").innerHTML = "£"+wrappers[2].toLocaleString();

  if(!isSpecial){
    document.getElementById("tv24").innerHTML = "£"+wrappers[3].toLocaleString();
  } else {
    document.getElementById("tv24").innerHTML = "Check Extra Info"
  }

  curMax = 0;
  wrappers.forEach(function(el){
    if(el>curMax){
      curMax = el;
    }
  })
  
  let ratio = maxBarHeight/curMax;
  if(ratio*wrappers[0] || wrappers[0]==0){
    document.getElementById("isaBar").style.height = `${ratio*wrappers[0]}px`;
  } else {
    document.getElementById("isaBar").style.height = "20px";
    document.getElementById("isaBar").style.background = "rgb(66, 27, 42)";
    document.getElementById("isaBar").style.outline = "1px solid rgb(255, 43, 128)";

  }
  if(ratio*wrappers[1] || wrappers[1]==0){
    document.getElementById("jisaBar").style.height = `${ratio*wrappers[1]}px`;
  } else {
    document.getElementById("jisaBar").style.height = "20px";
    document.getElementById("jisaBar").style.background = "rgb(66, 27, 42)";
    document.getElementById("jisaBar").style.outline = "1px solid rgb(255, 43, 128)";

  }
  if(ratio*wrappers[2] || wrappers[2]==0){
    document.getElementById("directBar").style.height = `${ratio*wrappers[2]}px`;
  } else {
    document.getElementById("directBar").style.height = "20px";
    document.getElementById("directBar").style.background = "rgb(66, 27, 42)";
    document.getElementById("directBar").style.outline = "1px solid rgb(255, 43, 128)";

  }
  if(ratio*wrappers[3] || wrappers[3]==0){
    document.getElementById("sippBar").style.height = `${ratio*wrappers[3]}px`;
  } else {
    document.getElementById("sippBar").style.height = "20px";
    document.getElementById("sippBar").style.background = "rgb(66, 27, 42)";
    document.getElementById("sippBar").style.outline = "1px solid rgb(255, 43, 128)";

  }
}

function resetBarChart(){
  ["isaBar", "jisaBar", "directBar", "sippBar"].forEach(function(barTag){
    document.getElementById(barTag).style.background = "rgb(27, 42, 66)";
    document.getElementById(barTag).style.outline = "1px solid rgb(43, 128, 225)";
  })
}

const extraDataZone = document.getElementById("broker-info");
function resetExtraData(){
  document.querySelectorAll(".exDEl").forEach(function(el){
    el.style.display = "none";
  })

  document.getElementById("tv31").innerHTML = "£NA";
  document.getElementById("tv32").innerHTML = "£NA";
  document.getElementById("tv33").innerHTML = "£NA";
  document.getElementById("tv41").innerHTML = "£NA";
  document.getElementById("tv42").innerHTML = "£NA";
}


function createChart(area, data, name, tag){
  var ctx = area.getContext('2d');
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({length:data.length},(v,k)=>`Year ${k+1}`),
      // Information about the dataset
      datasets: [{
        label: tag,
        backgroundColor: '#1c1c1c',
        borderColor: 'yellowgreen',
        data: data,
        fill: false
      }]
    },

    options: {
      layout: {
        padding: 10,
      },
      legend: {
        position: 'none',
      },
      title: {
        display: true,
        text: name
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          ticks: {
            display: false
          }
        }],
        yAxes: [
          {
            ticks: {
              callback: (label, index, labels) => {
                return "£"+parseInt(label).toLocaleString();
              }
            }
          }
        ]
      }
    }
  });

  return chart

}



document.getElementById("backBtn").addEventListener("click", function(){
  results.style.display = "none";
  document.getElementById("sidebar").style.display = "block";
  this.style.display = "none";
})

const assumptionsTable = document.getElementById("assumptionsTable")
const brokerInfo = document.getElementById("broker-info")
if(window.innerWidth<=1010){
  isMobile = true;
  mobileChange();
}

function mobileChange(){
  results.style.display = "flex"


  let scale = Math.min( (window.innerWidth-10)/(510+10), 1 );
  mgt = -(assumptionsTable.clientHeight - assumptionsTable.clientHeight*scale) + 20;
  assumptionsTable.style.transform = `scale(${scale})`;
  

  brokerInfo.style.transform = `scale(${scale})`;
  

  document.getElementById("flexibleTitle").style.marginTop = mgt+"px";


  results.style.display = "none";
}

function toggleLightMode(){
  document.documentElement.classList.toggle("invertCol");
}

/* 
,
{
   "Platform_Name": "Bestinvest",
   "ChoiceOfInvestments": "Regular",
   "Support_Funds": "Yes",
   "Supports_Shares": "Yes",
   "Charge_Type": "Tiered",
   "Supports": "GIA,ISA,SIPP,JISA",
   "Fee_GIA": {"shares":{"charge":[[250000,0.40],[500000,0.20],[1000000,0.10],["Infinity",0]]},"funds":{"charge":[[250000,0.40,120],[500000,0.20],[1000000,0.10],["Infinity",0]]}},
   "Fee_ISA": {"shares":{"charge":[[250000,0.40],[500000,0.20],[1000000,0.10],["Infinity",0]]},"funds":{"charge":[[250000,0.40],[500000,0.20],[1000000,0.10],["Infinity",0]]}},
   "Fee_SIPP": {"shares":{"charge":[[250000,0.40],[500000,0.20],[1000000,0.10],["Infinity",0]]},"funds":{"charge":[[250000,0.40,null,120],[500000,0.20],[1000000,0.10],["Infinity",0]]}},
   "Additional_SIPP_Fee": 0,
   "Fee_JISA": {"shares":{"charge":[[250000,0.40,120],[500000,0.20,90],[1000000,0.10],["Infinity",0]]},"funds":{"charge":[[250000,0.40,120],[500000,0.20,90],[1000000,0.10],["Infinity",0]]}},
   "Fund_Xn_Fee": 0,
   "Fund_Reg_Xn": 0,
   "Share_DivInvest": 0,
   "Share_Xn_Fee": 4.95,
   "Reg_Xn_Fee": 0
 }
*/

//Created by Arnav Nagpure
