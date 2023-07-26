const OptionGeneratorAPI = "http://localhost:8002/option?Attribute=";
const FilterResultAPI = "http://localhost:8002/filter_result";
const OptionSearchResultAPI = "http://localhost:8002/option_search_result";
//-----------------------------------
const SelectAllAPI="http://localhost:5000/getMedicineSource";//選取表四

//點選的篩選
class Filter {
    constructor() {
        this.filterOptions = {};
    }

    addOption(tag, result) {
        this.filterOptions[tag] = new Set(result);
    }

    filter(selectedTags) {
        const filteredResult = new Set();
        selectedTags.forEach(tag => {
            if (this.filterOptions.hasOwnProperty(tag)) {
                this.filterOptions[tag].forEach(item => filteredResult.add(item));
            }
        });
        return filteredResult;
    }
    show() {
        console.log("Current filter options:");
        console.log(this.filterOptions);
    }
}

//處理查找
const optionState = {};
function toggleOption(optionId) {
    optionState[optionId] = !optionState[optionId];
    updateOptionStyle(optionId);
    // 進行篩選
    const selectedTags = [];
    for (const optionId in optionState) {
        if (optionState[optionId] === true) {
            selectedTags.push(optionId);
        }
    }
    const result = filterObj.filter(selectedTags);//另一個result
    console.log(result);
    parentDiv = document.getElementById("page-content");
    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }
    makeContent(result);//result是string
}

//處理甲醇等選項點擊後的變色
function updateOptionStyle(optionId) {
    const optionElement = document.getElementById(optionId);
    optionElement.style.backgroundColor = optionState[optionId] ? 'gray' : 'rgb(228, 239, 239)';
    optionElement.style.color = optionState[optionId] ? 'white' : 'black';
}

// 側拉式選單
const element = document.querySelector(".sidebar");

// 側拉式選單 
const sidebarWidth = window.getComputedStyle(element).width;//注意這傢伙是字串:(

function openNav() {
    document.getElementById("mySidebar").style.right = "0"; /* 從右邊拉出 */
    document.getElementById("page-content").style.marginRight=sidebarWidth;/*content彈性移動*/
}

function closeNav() {
    document.getElementById("mySidebar").style.right = '-'+sidebarWidth; /* 隱藏回去 */
    document.getElementById("page-content").style.marginRight="0px";
}

let sidebarClose = true;

function opneORclose(){
    if(sidebarClose){
        sidebarClose = false;
        openNav();
    }else{
        sidebarClose = true;
        closeNav();
    }
}

//頁面的連結
document.getElementById("med_name").setAttribute("href","../home_page/index.html");
document.getElementById("med_info").setAttribute("href",`../home_page/index.html`);
document.getElementById("med_ref").setAttribute("href", `../home_page/index.html`);


const Ex_cardName = document.getElementById('Ex_cardName');
const Cl_cardName = document.getElementById('Cl_cardName');
const Ch_cardName = document.getElementById('Ch_cardName');
const Math_cardName = document.getElementById('Math_cardName');
let downPage = [false, false, false, false];
cardNames = [Ex_cardName, Cl_cardName, Ch_cardName, Math_cardName]

for (let i = 0; i < cardNames.length; i++) {
    const cardName = cardNames[i];
    cardName.addEventListener('mouseover', function() {
        cardName.style.backgroundColor = 'rgb(91, 91, 95)';
        cardName.style.color = 'white';
    });

    cardName.addEventListener('mouseout', function() {
        if (downPage[i]) {
        cardName.style.backgroundColor = 'gray';
        cardName.style.color = 'white';
    } else {
        cardName.style.backgroundColor = 'rgb(228, 239, 239)';
        cardName.style.color = 'black';
        }
    });
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

    if (downPage[expandId]) {
        content.style.display = 'none';// 隐藏内容
        btn.style.backgroundColor='rgb(228, 239, 239)';
        btn.style.color = 'black';
        downPage[expandId]=false;
    } else {
        content.style.display = 'flex'; // 显示内容
        btn.style.backgroundColor='gray';
        btn.style.color='white';
        downPage[expandId]=true;
    }    
}
////////三個條件的按鈕事件處理///////

function adjustInputWidth(input) {
    const valueLength = input.value.length;
    const minWidth = 30; // 设置输入框的最小宽度
    const maxWidth = 150; // 设置输入框的最大宽度
    const charWidth = 15; // 设置一个字符的宽度（根据具体情况调整）

    // 根据输入的数字个数计算输入框的宽度
    const newWidth = Math.min(Math.max(valueLength * charWidth, minWidth), maxWidth);
    input.style.width = newWidth + "px";
}

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

function createValueItem(containerID) {
    const container = document.getElementById(containerID);
    // 创建<div class="ValueItem">元素
    const valueItem = document.createElement("div");
    valueItem.classList.add("ValueItem");
    valueItem.innerHTML = '：<input type="number" class="numberInput" id="numberInput1" oninput="adjustInputWidth(this)"> &le; x &le; <input type="number" class="numberInput" id="numberInput2" oninput="adjustInputWidth(this)">';
    const comfirm_btn=document.createElement('button');
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
        options=[];
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
            console.log("A function completed.");
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
        // Promise.resolve(state.tag!=="Null").then(() => {
        //     filterObj.addOption(state.tag,state.result_num);
        //     console.log("append")
        // })
    })
.catch(err => {
    console.log(err);
});

// console.log(Ch_subCardName);
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
                findFilterResult(Item.id,element[0]);
                optionState[Item.id] = false;
                Item.onclick = function(){toggleOption(Item.id);};
                Item.addEventListener('mouseover', function() {
                    Item.style.backgroundColor = 'rgb(91, 91, 95)';
                    Item.style.color = 'white';
                });
                
                Item.addEventListener('mouseout', function() {
                    if(optionState[Item.id]===true){
                        Item.style.backgroundColor = 'gray';
                        Item.style.color = 'white';
                    }else{
                        Item.style.backgroundColor = 'rgb(228, 239, 239)';
                        Item.style.color = 'black';
                    }
                });
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
//   filterObj.addOption('tag1', [1, 2, 3]);//這裡在選項創建的時候就要去資料庫抓了
//   filterObj.addOption('tag2', [2, 3, 4]);
//   filterObj.addOption('tag3', [3, 4, 5]);
function findFilterResult(tag,parent){
    Attribute = tag.replace("option_", "")
    url = FilterResultAPI+"?parent="+parent+"&attr="+Attribute;
    axios(url).then((res)=>{
        filterObj.addOption(tag,res.data);
    });
    console.log("it is complete owo happy!");
}

function makeContent(result){//此result已經是選定出來的資料了
    console.log("content is making...");
    container = document.getElementById("page-content");
    for (const res of result){
        url = OptionSearchResultAPI + "?num=" + res;
        axios(url).then((res)=>{
            res.data.forEach(element=>{
                const div_card = document.createElement('div');
                div_card.classList.add("herb");
                div_card.setAttribute('id',`Card_${element.藥名}_${element.資料來源ID}_${element.樣品編號ID}`)
        
                const image = document.createElement('img');
                image.classList.add("herb-img");
                image.setAttribute('alt',`${element.藥名}_${element.資料來源ID}_${element.樣品編號ID}`);
                image.setAttribute('title',`${element.藥名}_${element.資料來源ID}_${element.樣品編號ID}`);
                image.src = `甘草1_1_1.png`;

                const title = document.createElement('p');
                title.innerHTML = `<font>${element.藥名}-${element.資料來源ID}-${element.樣品編號ID}</font>`;

                const link = document.createElement('a');
                link.href = `../leaf_page/leaf.html?herb_name=${element.藥名}&nameid=${element.藥材ID}&x=${element.資料來源ID}&y=${element.樣品編號ID}`
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
    console.log("選取的 ID：", optionId);
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
    console.log("here",data);
    console.log("result",state.result_num);
    filterObj.addOption(`comfirm_btn_id`,state.result_num);
    toggleOption(`comfirm_btn_id`);
    });
}