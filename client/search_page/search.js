const OptionGeneratorAPI = "http://localhost:8002/option?Attribute=";
// 获取sidebar class的元素
const element = document.querySelector(".sidebar");

// 获取元素的计算后宽度值
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

document.getElementById("med_name").setAttribute("href","../home_page/index.html");
document.getElementById("med_info").setAttribute("href",`../home_page/index.html`);
document.getElementById("med_ref").setAttribute("href", `../home_page/index.html`);

////////三個條件的按鈕事件處理///////
const Ex_cardName = document.getElementById('Ex_cardName');
const Cl_cardName = document.getElementById('Cl_cardName');
const Ch_cardName = document.getElementById('Ch_cardName');
let downPage = [false, false, false];
cardNames = [Ex_cardName, Cl_cardName, Ch_cardName]

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


/////////處理條件屬於數值輸入的狀況///////
function adjustInputWidth(input) {
    const valueLength = input.value.length;
    const minWidth = 30; // 设置输入框的最小宽度
    const maxWidth = 150; // 设置输入框的最大宽度
    const charWidth = 15; // 设置一个字符的宽度（根据具体情况调整）
  
    // 根据输入的数字个数计算输入框的宽度
    const newWidth = Math.min(Math.max(valueLength * charWidth, minWidth), maxWidth);
    input.style.width = newWidth + "px";
}

// function createValueItem(containerID) {
//     const container = document.getElementById(containerID);
//     // 创建<div class="ValueItem">元素
//     const valueItem = document.createElement("div");
//     valueItem.classList.add("ValueItem");
//     valueItem.innerHTML = '：<input type="number" class="numberInput" oninput="adjustInputWidth(this)"> &le; x &le; <input type="number" class="numberInput" oninput="adjustInputWidth(this)">';
//     container.appendChild(valueItem);
// }//直接寫進createSubCard了

/////////處理條件屬於數值輸入的狀況///////

//////Option Generator///////////

Ex_subCardName = [['溶劑',['乙醇','甲醇']],['條件2',['選項1','選項2']]];
Cl_subCardName = [['廠牌',['Kanto Mightysil']], ['型號',['RP-18GP']], ['長度',[1]], ['寬度',[1]], ['粒徑',[1]], ['溫度',[1]]];
Ch_subCardName = [['層析條件_Mobile_phase_A',[]], ['層析條件_Mobile_phase_B',[]], ['層析條件_Detection_wavelength_nm',[1]], ['層析條件_Flow_rate_mLDIVmin',[1]],['層析條件_Injection_miuL',[1]]];

/**
 * 對subCardName做forEach condition[0]取出該屬性數量>1的選項(至多?個選項)
 * 把condition[0]作為Attribute灌進/option中
 * 得到的ForEach element.`${condition[0]}`就要被push into condition[0]
 * 要注意如果element.`${condition[0]}`的型別type=number就直接push 1
*/
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
                    if(typeof element[condition[0]] === 'number'){
                        if(condition[1].length>=1) condition[1][0]=1;
                        else condition[1].push(1);
                    }else if(element[condition[0]]===null){//之後再改= =
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

    // options=[];
    // subCardName.forEach(function(condition){
    //     if(max!==0) url= OptionGeneratorAPI+condition[0]+`&max=${max}`;
    //     else url = OptionGeneratorAPI+condition[0];
    //     axios(url).then((res)=>{
    //         res.data.forEach(element => {
    //             //options.push(element[condition[0]])
    //             if(typeof element[condition[0]] === 'number'){
    //                 if(condition[1].length>=1) condition[1][0]=1;
    //                 else condition[1].push(1);
    //             }else if(element[condition[0]]===null){//之後再改= =
    //                 if(condition[1].length>=1) condition[1][0]=1;
    //                 else condition[1].push(1);
    //             }else{
    //                 condition[1].push(element[condition[0]]);
    //             }
    //         });
    //     });
    // });
    //callback();
}

optionGenerator(Ch_subCardName,0).then(result => {
    // 在這裡可以使用 A 函式的結果，例如呼叫 B 函式
    createSubCard('Ch_subCardWrapper',result);
});


console.log(Ch_subCardName);

//////Option Generator///////////

//////Create subCard///////////
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
                const valueItem = document.createElement("div");
                valueItem.classList.add("ValueItem");
                valueItem.innerHTML = '：<input type="number" class="numberInput" oninput="adjustInputWidth(this)"> &le; x &le; <input type="number" class="numberInput" oninput="adjustInputWidth(this)">';
                ItemsWrapper.appendChild(valueItem);
                break;
            } else {//對多個名稱選項創ChoiceItem
                const Item = document.createElement('div');
                Item.classList.add('ChoiceItem');
                Item.textContent = ele;
                ItemsWrapper.appendChild(Item);
            }
        }


        subCard.appendChild(cardName);
        subCard.appendChild(ItemsWrapper);
        
        container.appendChild(subCard);

        
    });
}
createSubCard('Ex_subCardWrapper',Ex_subCardName);
createSubCard('Cl_subCardWrapper',Cl_subCardName);

//////Create subCard///////////
// function createItems(containerID, itemNames){
//     const container = document.getElementById(containerID);
//     itemNames.forEach(function(element){
//         if (typeof element === 'number') {//創一個輸入框，並且這個itemNames的array項目只有一個
//             createValueItem(containerID)
//         } else {//對多個名稱選項創ChoiceItem
//             Item = document.createElement('div');
//             Item.classList.add('ChoiceItem');
//             Item.textContent = element;
//             container.appendChild(Item);
//         }
//     });
// }//寫進createSubCard裡面了