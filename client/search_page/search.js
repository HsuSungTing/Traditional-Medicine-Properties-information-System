
const OptionGeneratorAPI = "http://localhost:8002/option?Attribute=";
const FindOthersResultAPI="http://localhost:8002/FindOtherResult";
const FilterResultAPI = "http://localhost:8002/filter_result";
const OptionSearchResultAPI = "http://localhost:8002/option_search_result";
//-----------------------------------
const SelectAllSampleAPI="http://localhost:5000/getMedicineSource";//選取表四
const SelectAllStandardAPI="http://localhost:5000/getStandardSource";//選取表五

//點選的篩選
class Filter {
    constructor() {//local端的資料表，就是他
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
const optionState = {};//紀錄目前有誰被選起來
function toggleOption(optionId) {
    document.getElementById(optionId).clicked = !document.getElementById(optionId).clicked;
    optionState[optionId] = !optionState[optionId];
    updateStyle(optionId);
    // 進行篩選
    makeSearchContent();
}

function makeSearchContent(){//在這裡會分辨現在被選到的tag需要輸出標準品或樣品
    const selectedTags = [];
    for (const optionId in optionState) {
        if (optionState[optionId] === true) {
            selectedTags.push(optionId);
        }
    }
    //取聯集或交集
    console.log("目前selectedTags:",selectedTags);
    if(union_bool_state.union_bool){//交集
        result = filterObj.filter_intersect(selectedTags);
    }else{
        result = filterObj.filter(selectedTags);
    }
    
    console.log("makeSearchContent()中的:",result);
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
        btn.style.backgroundColor='rgb(228, 241, 241)';
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

////////數值獨立處理 按鈕部分///////
function input_toggle(comfirm_btn,num_input_array){
    if(state.comfirm_btn_bool==0){
        comfirm_btn.innerHTML="確定";
        comfirm_btn.style.backgroundColor = "rgb(170, 170, 170)";
        comfirm_btn.style.color="#ffffff"
        state.comfirm_btn_bool=1;
        state.result_num=[];
        num_input_array.forEach(element => {
            element.removeAttribute('disabled');
        });
    }
    else {
        comfirm_btn.innerHTML="取消";
        comfirm_btn.style.color="white"
        comfirm_btn.style.backgroundColor = "gray";
        state.comfirm_btn_bool=0;
        num_input_array.forEach(element => {
            element.setAttribute('disabled', 'true');
        });
        
    }
}


let state = {//用來控制confrim button
    comfirm_btn_bool: 1,
    result_num:[]
};

//////控制confirm btn顏色/////////////
////只好把confirnbtn變成全域變數//////
const comfirm_btn = document.getElementById('comfirm_btn_id');

comfirm_btn.addEventListener('mouseover', function () {
    addHover_comfirm(comfirm_btn);
});

comfirm_btn.addEventListener('mouseout', function () {
    removeHover_comfirm(comfirm_btn);
});

function addHover_comfirm(comfirm_btn) {
    comfirm_btn.style.backgroundColor = "rgb(91, 91, 95)";
}

function removeHover_comfirm(comfirm_btn) {
    if(state.comfirm_btn_bool==1){
        comfirm_btn.style.backgroundColor = "rgb(170, 170, 170)";
    }
    else{
        comfirm_btn.style.backgroundColor ="gray";
    }
}
////////數值獨立處理 按鈕部分///////

function createValueItem(containerID) {
    let num_input_array = Array.from(document.getElementsByClassName("numberInput"));
    const container = document.getElementById(containerID);
    const comfirm_btn=document.getElementById('comfirm_btn_id');
    //----逐個檢查每個屬性是否有輸入----------------
    length_val1=document.getElementById("Input_length_1");
    length_val2=document.getElementById("Input_length_2");
    width_val1=document.getElementById("Input_width_1");
    width_val2=document.getElementById("Input_width_2");
    radius_val1=document.getElementById("Input_radius_1");
    radius_val2=document.getElementById("Input_radius_2");
    temp_val1=document.getElementById("Input_temp_1");
    temp_val2=document.getElementById("Input_temp_2");
    wave_val1=document.getElementById("Input_wave_1");
    wave_val2=document.getElementById("Input_wave_2");
    //--------------------
    comfirm_btn.onclick = function() {
        let at_least_one_bool = 0;
        function checkAndExecute() {
            if (at_least_one_bool === 0 && state.comfirm_btn_bool === 1) {
                console.log("error");
            } 
            else {
                input_toggle(comfirm_btn,num_input_array);
            }
            if (at_least_one_bool) {
                console.log("有進來");
                makeSearchContent();
            }
        }
    
        function processOption(value1, value2, label) {
            return new Promise((resolve, reject) => {
                if (getInputValue(value1, value2)) {
                    getSelectedOption(value1, value2, label)
                        .then(() => {
                            at_least_one_bool = 1;
                            resolve();
                        })
                        .catch(error => {
                            console.error("Error while processing option:", error);
                            reject(); // 這裡使用reject處理錯誤
                        });
                } else {
                    resolve();
                }
            });
        }
        let promises = [
            processOption(length_val1, length_val2, "SS_col_length"),
            processOption(width_val1, width_val2, "SS_col_width"),
            processOption(radius_val1, radius_val2, "SS_col_particle_size"),
            processOption(temp_val1, temp_val2, "SS_col_temperature"),
            processOption(wave_val1, wave_val2, "SS_ch_detect_wavelength"),
        ];
    
        Promise.all(promises)
            .then(() => {
                // 在這裡確保所有 get_Num_Data 完成後，再執行 checkAndExecute();
                // 可以在這裡加上需要的延遲時間，以確保所有非同步操作完成
                setTimeout(() => {
                    checkAndExecute();//不只要promise，還不要太快執行，等0.5秒
                }, 500); // 假設這裡等待1秒後再執行 makeSearchContent
            })
            .catch(error => {
                console.error("Error in Promise.all:", error);
            });
    };
    container.appendChild(comfirm_btn);
}

createValueItem("Math_subCardWrapper");
Ex_subCardName = [['SS_extract',[]], ['SS_base',[]]];
Cl_subCardName = [['SS_col_brand',[]], ['SS_col_type',[]]];
Ch_subCardName = [['SS_ch_mobileA',[]], ['SS_ch_mobileB',[]]];

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
                    if(element[condition[0]]===null || element[condition[0]]===""){//之後再改= =
                        // if(condition[1].length>=1) condition[1][0]=1;
                        // else condition[1].push(1);
                    }else{
                        condition[1].push(element[condition[0]]);
                    }
                });
            });
            //----------------------
        });
        setTimeout(() => {
            console.log("Option generator function completed.");
            for(let i=0;i<subCardName.length;i++){
                subCardName[i][1].push("others");
            }
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

//--------中文對應-----
let attr_to_chinese={}
attr_to_chinese["SS_extract"]="萃取溶劑";
attr_to_chinese["SS_base"]="基原";
attr_to_chinese["SS_col_brand"]="管柱廠牌";
attr_to_chinese["SS_col_type"]="管柱型號";
attr_to_chinese["SS_ch_mobileA"]="Mobile Phase A";
attr_to_chinese["SS_ch_mobileB"]="Mobile Phase B";

function createSubCard(containerID, Names){
    const container = document.getElementById(containerID);
    Names.forEach(function(element){
        const subCard = document.createElement('div');
        
        const cardName = document.createElement('div');
        cardName.classList.add('cardName');
        cardName.textContent=attr_to_chinese[element[0]];

        const ItemsWrapper = document.createElement('div');
        ItemsWrapper.classList.add('ChoiceItemsWrapper');
        ItemsWrapper.id = element[0]+"_ItemsWrapper";
        for (let i = 0; i < element[1].length; i++){
            ele = element[1][i];
            const Item = document.createElement('div');
            Item.classList.add('ChoiceItem');
            Item.textContent = ele;
            Item.id = "option_"+element[0]+"_"+ele;//for diff element[0] same ele
            findFilterResult(ele, Item.id,element[0], true);
            findFilterResult(ele, Item.id,element[0], false);//生成standar result
            optionState[Item.id] = false;
            Item.clicked = false;
            Item.onclick = function(){toggleOption(Item.id);};
            setHoverStyle(Item);
            ItemsWrapper.appendChild(Item);
        }
        subCard.appendChild(cardName);
        subCard.appendChild(ItemsWrapper);
        container.appendChild(subCard);
    });
    filterObj.show();
}

// 添加選項tag與結果
function findFilterResult(tag, id,parent, IsSample){
    Attribute = tag;
    if(Attribute=="others"&&IsSample){
        url=FindOthersResultAPI+"?tbName=SampleData"+"&parent="+parent;
        axios(url).then((res)=>{
            console.log(parent,": ",res.data);
            filterObj.addOption(id,res.data,IsSample);
        });
    }
    else if(Attribute=="others"&&IsSample==false){
        url=FindOthersResultAPI+"?tbName=StandardData"+"&parent="+parent;
        axios(url).then((res)=>{
            console.log(parent,": ",typeof res.data);
            filterObj.addOption(id,res.data,IsSample);
        });
    }
    //-------------------
    else if(IsSample){
        url = FilterResultAPI+"?tbName=SampleData"+"&parent="+parent+"&attr="+Attribute;
        axios(url).then((res)=>{
            filterObj.addOption(id,res.data,IsSample);
        });
    }else{
        url = FilterResultAPI+"?tbName=StandardData"+"&parent="+parent+"&attr="+Attribute;
        axios(url).then((res)=>{
            filterObj.addOption(id,res.data,IsSample);
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
                    image.setAttribute('alt',`${element.Med_name}_${element.Source_id}_${element.Sample_id}`);
                    image.setAttribute('title',`${element.Med_name}_${element.Source_id}_${element.Sample_id}`);
                    //-----------------------------
                    const imagePath = "../../img_path/參考條件截圖/"+`${element.Sample_img_id}`+".png";
                    const img = new Image();
                    img.onload = function() {
                            console.log('图片存在且可打开。');
                            image.src=imagePath;
                    };
                    img.onerror = function() {
                            console.error('图片不存在或无法打开。');
                            image.src="./甘草1_1_1.png";
                    };
                    img.src = imagePath;//判定圖片是否存在
                    //-----------------------------
                    title.innerHTML = `<font>${element.Med_name}-${element.Source_id}-${element.Sample_id}</font>`;
                    link.href = `../leaf_page/leaf.html?herb_name=${element.Med_name}&nameid=${element.Med_id}&x=${element.Source_id}&y=${element.Sample_id}&img_id=${element.Sample_img_id}`
                }
                else if(element.source==="standar"){
                    image.setAttribute('alt',`${element.Standard_name}_${element.Standard_id}`);
                    image.setAttribute('title',`${element.Standard_name}_${element.Standard_id}`);
                    //-----------------------------
                    const imagePath = "../../img_path/參考條件截圖/"+`${element.Standard_id}`+".png";
                    const img = new Image();
                    img.onload = function() {
                            console.log('图片存在且可打开。');
                            image.src=imagePath;
                    };
                    img.onerror = function() {
                            console.error('图片不存在或无法打开。');
                            image.src="./甘草1_1_1.png";
                    };
                    img.src = imagePath;//判定圖片是否存在
                    //-----------------------------
                    title.innerHTML = `<font>${element.Standard_name}_${element.Standard_id}</font>`;
                    link.href = `../standar_page/standar.html?stanId=${element.Standard_id}`//尚須更改standar page才能修改這裡
                }
                else console.log("source error the source is "+element);
                
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
async function getSelectedOption(upper_limit,lower_limit,selected_ID) {
    await get_Num_Data(selected_ID,upper_limit,lower_limit,SelectAllSampleAPI,1);
    await get_Num_Data(selected_ID,upper_limit,lower_limit,SelectAllStandardAPI,0);
}
//---------------篩選符合條件的對象----------------
async function get_Num_Data(target_attr,lower_limit,upper_limit,url,is_sample_bool){ axios(url).then((res)=>{
    const upper_int = parseInt(upper_limit.value);
    const lower_int = parseInt(lower_limit.value);
    console.log("target_attr",target_attr);
    var data = res.data.filter(item => {
        const attrValue = parseInt(item[target_attr]);
        if(attrValue >= lower_int&& attrValue <= upper_int){
            return attrValue;
        }
    });
    console.log("selected data",data);
    state.result_num=[];//先清空，再放新東西
    //分別建立local資料表
    console.log("is_sample_bool: ",is_sample_bool);
    if(is_sample_bool==1){
        data.forEach(element => {
            state.result_num.push(`${element.Med_id.toString().padStart(2, '0')}${element.Source_id.toString().padStart(3, '0')}${element.Sample_id.toString().padStart(3, '0')}`);
        });
        filterObj.addOption(target_attr+upper_limit.value+"_"+lower_limit.value, state.result_num, true);
        if(state.comfirm_btn_bool==1){//加入搜尋
            optionState[target_attr+upper_limit.value+"_"+lower_limit.value] = true;
        }
        else{
            optionState[target_attr+upper_limit.value+"_"+lower_limit.value] = false;
        }
    }
    else{
        data.forEach(element => {
            state.result_num.push(`${element.Standard_id.toString().padStart(3, '0')}`);
            filterObj.addOption(target_attr+upper_limit.value+"_"+lower_limit.value, state.result_num, false);
        });
    }
    console.log(target_attr+upper_limit.value+"_"+lower_limit.value," ",state.result_num);
    });
}

//-----------用來記錄目前是取交集還是聯集-------------
let union_bool_state={
    union_bool:1 //預設是取聯集
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
let num_input_array = Array.from(document.getElementsByClassName("numberInput"));