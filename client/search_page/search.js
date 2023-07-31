const OptionGeneratorAPI = "http://localhost:8002/option?Attribute=";
const FilterResultAPI = "http://localhost:8002/filter_result";
const OptionSearchResultAPI = "http://localhost:8002/option_search_result";
//-----------------------------------
const SelectAllAPI="http://localhost:5000/getMedicineSource";//選取表四

//點選的篩選
class Filter {
    constructor() {
        this.sampleOptions = {};
        this.standarOptions = {};
    }

    addOption(tag, result, IsSample) {
        if(IsSample) this.sampleOptions[tag] = new Set(result);
        else  this.standarOptions[tag] = new Set(result);
           
    }

    filter(selectedTags) {
        const filteredResult = new Set();
        const sampleBtn = document.getElementById("sample-btn");
        const standarBtn = document.getElementById("standar-btn");
        
        selectedTags.forEach(tag => {  
            if (this.sampleOptions.hasOwnProperty(tag) && sampleBtn.clicked===true) {
                this.sampleOptions[tag].forEach(item => filteredResult.add(item));
            }
            if(this.standarOptions.hasOwnProperty(tag) && standarBtn.clicked===true){
                this.standarOptions[tag].forEach(item => filteredResult.add(item));
            }
        });
        return filteredResult;
    }
    filter_intersect(selectedTags){
        if (selectedTags.length === 0) return new Set(); // 當選定標籤為空時，返回空集合
        const sampleBtn = document.getElementById("sample-btn");
        const standarBtn = document.getElementById("standar-btn");
        let sampleIntersect = new Set();
        let standarIntersect = new Set();
        if(sampleBtn.clicked===true){
            sampleIntersect = new Set(this.sampleOptions[selectedTags[0]] || []);
            for (let i = 1; i < selectedTags.length; i++) {
                const tag = selectedTags[i];
                if (this.sampleOptions.hasOwnProperty(tag)) {
                    sampleIntersect = new Set(
                        [...sampleIntersect].filter((item) => this.sampleOptions[tag].has(item))
                    );
                } else {
                    // 若某個選定標籤不存在，則交集為空集合
                    //return new Set();
                    sampleIntersect = new Set();
                    break;
                }
            }
        }
        if(standarBtn.clicked===true){
            standarIntersect = new Set(this.standarOptions[selectedTags[0]] || []);
            for (let i = 1; i < selectedTags.length; i++) {
                const tag = selectedTags[i];
                if (this.standarOptions.hasOwnProperty(tag)) {
                    standarIntersect = new Set(
                        [...standarIntersect].filter((item) => this.standarOptions[tag].has(item))
                    );
                } else {
                    // 若某個選定標籤不存在，則交集為空集合
                    standarIntersect =  new Set();
                }
            }
        }
        let intersectionSet = new Set(sampleIntersect);
        for (const item of standarIntersect) {
            intersectionSet.add(item);
        }
  
        
        return intersectionSet;
    }
    

    show() {
        console.log("Current filter options:");
        console.log(this.sampleOptions);
    }
}

  
//處理查找
const optionState = {};
function toggleOption(optionId) {
    document.getElementById(optionId).clicked = !document.getElementById(optionId).clicked;
    optionState[optionId] = !optionState[optionId];
    updateStyle(optionId);
    // 進行篩選
    makeSearchContent();
}
function makeSearchContent(){
    const selectedTags = [];
    for (const optionId in optionState) {
        if (optionState[optionId] === true) {
            selectedTags.push(optionId);
        }
    }
    //取聯集或交集
    if(union_bool_state.union_bool){//交集
        result = filterObj.filter_intersect(selectedTags);
    }else{
        result = filterObj.filter(selectedTags);
    }
    console.log(result);
    parentDiv = document.getElementById("page-content");
    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }
    makeContent(result);//result是string
}

//處理甲醇等選項點擊後的變色
function updateStyle(optionId) {
    const optionElement = document.getElementById(optionId);
    optionElement.style.backgroundColor = optionElement.clicked ? 'gray' : 'rgb(228, 239, 239)';
    optionElement.style.color = optionElement.clicked ? 'white' : 'black';
}

// 側拉式選單
const element = document.querySelector(".sidebar");
const sidebarWidth = window.getComputedStyle(element).width;//注意這傢伙是字串:(
    document.getElementById("page-content").style.marginRight=sidebarWidth;/*content初始設定收起*/
function openNav() {
    document.getElementById("mySidebar").style.right = "0"; /* 從右邊拉出 */
    document.getElementById("page-content").style.marginRight=sidebarWidth;/*content彈性移動*/
}

function closeNav() {
    document.getElementById("mySidebar").style.right = '-'+sidebarWidth; /* 隱藏回去 */
    document.getElementById("page-content").style.marginRight="0px";
}

let sidebarClose = false;

function opneORclose(){
    if(sidebarClose){
        sidebarClose = false;
        openNav();
    }else{
        sidebarClose = true;
        closeNav();
    }
}

///////三個條件按鈕事件處理//////
const Ex_cardName = document.getElementById('Ex_cardName');
const Cl_cardName = document.getElementById('Cl_cardName');
const Ch_cardName = document.getElementById('Ch_cardName');
const Math_cardName = document.getElementById('Math_cardName');
cardNames = [Ex_cardName, Cl_cardName, Ch_cardName, Math_cardName]

for (let i = 0; i < cardNames.length; i++) {
    const cardName = cardNames[i];
    setHoverStyle(cardName);
}

function DownExpand(expandId) {
    if(expandId===0){
        content = document.getElementById("Ex_subCardWrapper");
        btn = Ex_cardName
    }else if(expandId===1){
        content = document.getElementById("Cl_subCardWrapper");
        btn = Cl_cardName
    } else if(expandId===2){
        content = document.getElementById("Ch_subCardWrapper");
        btn = Ch_cardName
    } else if(expandId===3){
        content = document.getElementById("Math_subCardWrapper");
        btn = Math_cardName
    }

    if (btn.clicked) {
        content.style.display = 'none';// 隐藏内容
        btn.style.backgroundColor='rgb(228, 239, 239)';
        btn.style.color = 'black';
        btn.clicked = false;
    } else {
        content.style.display = 'flex'; // 显示内容
        btn.style.backgroundColor='gray';
        btn.style.color='white';
        btn.clicked = true;
    }    
}
////////三個條件的按鈕事件處理///////

////////處理數值輸入框設定//////
function adjustInputWidth(input) {
    const valueLength = input.value.length;
    const minWidth = 30; // 设置输入框的最小宽度
    const maxWidth = 150; // 设置输入框的最大宽度
    const charWidth = 15; // 设置一个字符的宽度（根据具体情况调整）

    // 根据输入的数字个数计算输入框的宽度
    const newWidth = Math.min(Math.max(valueLength * charWidth, minWidth), maxWidth);
    input.style.width = newWidth + "px";
}

////////數值獨立處理 按鈕部分///////
function input_toggle(comfirm_btn){
    if(state.comfirm_btn_bool==0){
        comfirm_btn.innerHTML="confirm";
        state.comfirm_btn_bool=1;
        state.tag_num="Null";
        state.result_num=[];
    }
    else {
        comfirm_btn.innerHTML="cancel";
        state.comfirm_btn_bool=0;
    }
}

let state = {//用來控制button
    comfirm_btn_bool: 1,
    tag_num:"Null",
    result_num:[]
};
////////數值獨立處理 按鈕部分///////



function createValueItem(containerID) {
    const container = document.getElementById(containerID);
    // 创建<div class="ValueItem">元素
    const valueItem = document.createElement("div");
    valueItem.classList.add("ValueItem");
    valueItem.innerHTML = '：<input type="number" class="numberInput" id="numberInput1" oninput="adjustInputWidth(this)"> &le; x &le; <input type="number" class="numberInput" id="numberInput2" oninput="adjustInputWidth(this)">';
    const comfirm_btn=document.createElement('button');
    comfirm_btn.borderRadius="10px";
    comfirm_btn.backgroundColor="#3498db";
    comfirm_btn.innerHTML="confirm";
    comfirm_btn.setAttribute('id',`comfirm_btn_id`);
    //--------------------
    input_val1=document.getElementById("numberInput1");
    input_val2=document.getElementById("numberInput2");
    //--------------------
    
    comfirm_btn.onclick = function() {
        getInputValue(numberInput1, numberInput2); // 從前端拿到 numberInput1 和 numberInput2 作為參數
        correct_input_bool=getInputValue(numberInput1, numberInput2);
        if(correct_input_bool==0&&comfirm_btn.innerHTML=="confirm"){
            console.log("error");
        }
        else {
            console.log("toggle now");
            console.log(state.comfirm_btn_bool)
            input_toggle(comfirm_btn)
        }
        if(correct_input_bool){
            getSelectedOption(numberInput1, numberInput2,SelectAllAPI);//呼叫後端查詢並編碼
        }
    };
    container.appendChild(valueItem);
    container.appendChild(comfirm_btn);
}
createValueItem("Math_subCardWrapper");

Ex_subCardName = [['萃取溶劑',[]]];
Cl_subCardName = [['管柱條件_廠牌',[]], ['管柱條件_型號',[]]];
Ch_subCardName = [['層析條件_Mobile_phase_A',[]], ['層析條件_Mobile_phase_B',[]]];

/**
 * 對subCardName做forEach condition[0]取出該屬性數量>1的選項(至多?個選項)
 * 把condition[0]作為Attribute灌進/option中
 * 得到的ForEach element.`${condition[0]}`就要被push into condition[0]
 * 要注意如果element.`${condition[0]}`的型別type=number就直接push 1
*/

//從server接收資料然後印出來，接收的資料是一個整理好的table
function optionGenerator(subCardName, max){
    return new Promise((resolve, reject) => {
        // 在 A 函式內進行需要的工作
        // 假設這裡是一些非同步操作，例如呼叫 API 或是讀取檔案
        subCardName.forEach(function(condition){
            if(max!==0) url= OptionGeneratorAPI+condition[0]+`&max=${max}`;
            else url = OptionGeneratorAPI+condition[0];
            axios(url).then((res)=>{
                res.data.forEach(element => {
                    //options.push(element[condition[0]])
                    if(element[condition[0]]===null){//之後再改= =
                        if(condition[1].length>=1) condition[1][0]=1;
                        else condition[1].push(1);
                    }else{
                        condition[1].push(element[condition[0]]);
                    }
                });
            });
        });
        setTimeout(() => {
          console.log("Option generator function completed.");
          const result = subCardName; // 假設 A 函式的結果是 42
          resolve(result); // 將結果傳遞給 Promise
        }, 1000); // 假設 A 函式需要 1 秒完成
    });
}

// 創建篩選器
const filterObj = new Filter();
Promise.resolve(filterObj)//filter object要先生成，才能進行後續的篩選
.then(() => {
    // 在這裡執行接下來的操作
    // 確保在這個 .then() 中的程式碼會在 filterObj 被創建後執行
        optionGenerator(Ch_subCardName,0).then(result => {
            createSubCard('Ch_subCardWrapper',result);
        });
        optionGenerator(Ex_subCardName,0).then(result => {
            createSubCard('Ex_subCardWrapper',result);
        });
        optionGenerator(Cl_subCardName,0).then(result => {
            createSubCard('Cl_subCardWrapper',result);
        });
    })
.catch(err => {
    console.log(err);
});

function createSubCard(containerID, Names){
    const container = document.getElementById(containerID);
    Names.forEach(function(element){
        const subCard = document.createElement('div');
        
        const cardName = document.createElement('div');
        cardName.classList.add('cardName');
        cardName.textContent = element[0];

        const ItemsWrapper = document.createElement('div');
        ItemsWrapper.classList.add('ChoiceItemsWrapper');
        ItemsWrapper.id = element[0]+"_ItemsWrapper";
        
        for (let i = 0; i < element[1].length; i++){
            ele = element[1][i];
            if (typeof ele === 'number') {//創一個輸入框，並且這個itemNames的array項目只有一個
                // createValueItem(ItemsWrapper.id)
                // const valueItem = document.createElement("div");
                // valueItem.classList.add("ValueItem");
                // valueItem.innerHTML = '：<input type="number" class="numberInput" oninput="adjustInputWidth(this)"> &le; x &le; <input type="number" class="numberInput" oninput="adjustInputWidth(this)">';
                // ItemsWrapper.appendChild(valueItem);//輸入數值被獨立出來了
                break;
            } else {//對多個名稱選項創ChoiceItem
                const Item = document.createElement('div');
                Item.classList.add('ChoiceItem');
                Item.textContent = ele;
                Item.id = "option_"+ele;
                findFilterResult(Item.id,element[0], true);
                findFilterResult(Item.id,element[0], false);//生成standar result
                optionState[Item.id] = false;
                Item.clicked = false;
                Item.onclick = function(){toggleOption(Item.id);};
                setHoverStyle(Item);
                ItemsWrapper.appendChild(Item);
            }
        }
        subCard.appendChild(cardName);
        subCard.appendChild(ItemsWrapper);
        container.appendChild(subCard);
    });
    filterObj.show();
}

  // 添加選項tag與結果
function findFilterResult(tag,parent, IsSample){
    Attribute = tag.replace("option_", "")
    if(IsSample){
        url = FilterResultAPI+"?tbName=樣品數據表"+"&parent="+parent+"&attr="+Attribute;
        axios(url).then((res)=>{
            filterObj.addOption(tag,res.data,IsSample);
        });
    }else{
        url = FilterResultAPI+"?tbName=標準品數據表"+"&parent="+parent+"&attr="+Attribute;
        axios(url).then((res)=>{
            filterObj.addOption(tag,res.data,IsSample);
        });
    }
    
}

function makeContent(result){//此result已經是選定出來的資料了
    console.log("content is making...");
    container = document.getElementById("page-content");
    for (const res of result){
        url = OptionSearchResultAPI + "?num=" + res;
        axios(url).then((res)=>{
            //const element = res.data;
            res.data.forEach(element=>{
                const div_card = document.createElement('div');
                div_card.classList.add("herb");
                //div_card.setAttribute('id',`Card_${element.藥名}_${element.資料來源ID}_${element.樣品編號ID}`)
        
                const image = document.createElement('img');
                image.classList.add("herb-img");
                const title = document.createElement('p');
                const link = document.createElement('a');
                if(element.source==="sample"){
                    image.setAttribute('alt',`${element.藥名}_${element.資料來源ID}_${element.樣品編號ID}`);
                    image.setAttribute('title',`${element.藥名}_${element.資料來源ID}_${element.樣品編號ID}`);
                    image.src = `甘草1_1_1.png`;
                    title.innerHTML = `<font>${element.藥名}-${element.資料來源ID}-${element.樣品編號ID}</font>`;
                    link.href = `../leaf_page/leaf.html?herb_name=${element.藥名}&nameid=${element.藥材ID}&x=${element.資料來源ID}&y=${element.樣品編號ID}`
                }else if(element.source==="standar"){
                    image.setAttribute('alt',`${element.標準品名稱}_${element.標準品編號ID}`);
                    image.setAttribute('title',`${element.標準品名稱}_${element.標準品編號ID}`);
                    image.src = `甘草1_1_1.png`;
                    title.innerHTML = `<font>${element.標準品名稱}_${element.標準品編號ID}</font>`;
                    link.href = `../leaf_page/leaf.html?herb_name=${"甘草"}&nameid=${1}&x=${1}&y=${1}`//尚須更改standar page才能修改這裡
                }else console.log("source error the source is "+element);
                

                
                link.appendChild(image);
                div_card.appendChild(link);
                div_card.appendChild(title);
                container.appendChild(div_card);
            });
        });
    }
}

//-----------------------------------------------------
function getInputValue(input_object1,input_object2){
    //console.log("Hi me!",input_object1.value," ",input_object2.value);
    if(input_object1.value==="" || input_object2.value==="")correct_input_bool=0
    else correct_input_bool=1
    return correct_input_bool;
}

//-----------------------------------------------------
function getSelectedOption(upper_limit,lower_limit,SelectAllAPI) {
    const selectElement = document.getElementById("selectOption");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const optionId = selectedOption.id;
    const optionText = selectedOption.text;
    //console.log("選取的 ID：", optionId);
    const optionValue = selectedOption.value;
    get_Num_Data(optionId,upper_limit,lower_limit,SelectAllAPI);
}
//---------------篩選符合條件的對象----------------
function get_Num_Data(target_attr,lower_limit,upper_limit,url){ axios(url).then((res)=>{
    const upper_int = parseInt(upper_limit.value);
    const lower_int = parseInt(lower_limit.value);
    var data = res.data.filter(item => {
        const attrValue = parseInt(item[target_attr]);
        if(attrValue >= lower_int&& attrValue <= upper_int){
            return attrValue;
        }
    });
    //const valuesArray = `${data.藥材ID.toString().padStart(2, '0')}${data.資料來源ID.toString().padStart(3, '0')}${data.樣品編號ID.toString().padStart(3, '0')}`;
    data.forEach(element => {
        state.result_num.push(`${element.藥材ID.toString().padStart(2, '0')}${element.資料來源ID.toString().padStart(3, '0')}${element.樣品編號ID.toString().padStart(3, '0')}`);
    });
    med_ID=data.map(item => item['藥材ID']);
    info_ID=data.map(item => item['資料來源ID']);
    sample_ID=data.map(item => item['樣品編號ID']);
    //console.log("here",data);
    //console.log("result",state.result_num);
    filterObj.addOption(`comfirm_btn_id`,state.result_num, true);
    toggleOption(`comfirm_btn_id`);
    });
}
//-----------用來記錄目前是取交集還是聯集-------------
let union_bool_state={
    union_bool:1 //預設是取聯集，
}
function union_toggle(){
    if(union_bool_state.union_bool){
        union_bool_state.union_bool=0;
        makeSearchContent();
    }
    else{
        union_bool_state.union_bool=1;
        makeSearchContent();
    }
}
//-------------------------------------------------
/////Reset button/////
const resetBtn = document.getElementById("reset-btn");
resetBtn.onclick = function(){ resetOptionState(optionState);}

function resetOptionState(optionState) {
    for (const key in optionState) {
      if (optionState.hasOwnProperty(key)) {
        optionState[key] = false;
      }
    }
    const elements = document.getElementsByClassName("ChoiceItem");
    for (let i = 0; i < elements.length; i++) {
        elements[i].clicked = false;
        elements[i].style.backgroundColor = "rgb(228, 239, 239)";
        elements[i].style.color = "black";
    }
    if(state.comfirm_btn_bool===0){
        document.getElementById("comfirm_btn_id").onclick();
    }
    makeSearchContent();
}
setHoverStyle(resetBtn);
/**
 * @param obj get it from document.getElementByID(your_id)
 * through obj.clicked control its mouseout color
 */

function setHoverStyle(obj){

    obj.addEventListener('mouseover', function() {
        obj.style.backgroundColor = 'rgb(91, 91, 95)';
        obj.style.color = 'white';
    });
        
    obj.addEventListener('mouseout', function() {
        if (obj.clicked) {
            obj.style.backgroundColor = 'gray';
            obj.style.color = 'white';
        } else {
            obj.style.backgroundColor = 'rgb(228, 239, 239)';
            obj.style.color = 'black';
        }
    });  
}
sampleBtn = document.getElementById("sample-btn");
sampleORstandar("sample-btn");//初始化他為clicked
sampleBtn.onclick = function(){sampleORstandar(sampleBtn.id);}
setHoverStyle(sampleBtn);

standarBtn = document.getElementById("standar-btn");
standarBtn.clicked=false;
standarBtn.onclick = function(){sampleORstandar(standarBtn.id);}
setHoverStyle(standarBtn);

function sampleORstandar(ssId) {
    document.getElementById(ssId).clicked = document.getElementById(ssId).clicked? false:true;
    if (sampleBtn.clicked!==true && standarBtn.clicked!==true) {
        sampleBtn.clicked = true;
        standarBtn.clicked= false;
    }
    updateStyle("sample-btn");
    updateStyle("standar-btn");

    makeSearchContent();
}

