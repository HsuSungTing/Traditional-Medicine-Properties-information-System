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

// document.getElementById("med_name").setAttribute("href","../home_page/index.html");
// document.getElementById("med_info").setAttribute("href",`../info_mid_page/index2.html?number=${nameid}`);
// document.getElementById("med_ref").setAttribute("href", `../info_mid_page/index2.html?number=${nameid}`);

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

function createValueItem(containerID) {
    const container = document.getElementById(containerID);
    // 创建<div class="ValueItem">元素
    const valueItem = document.createElement("div");
    valueItem.classList.add("ValueItem");
    valueItem.innerHTML = '：<input type="number" class="numberInput" oninput="adjustInputWidth(this)"> &le; x &le; <input type="number" class="numberInput" oninput="adjustInputWidth(this)">';
    container.appendChild(valueItem);
}



/////////處理條件屬於數值輸入的狀況///////


//////Create subCard///////////
Ex_subCardName = [['溶劑',['乙醇','甲醇']],['條件2',['選項1','選項2']]];
Cl_subCardName = [['廠牌',[1]], ['型號',[1]], ['長度',[1]], ['寬度',[1]], ['粒徑',[1]], ['溫度',[1]]];
Ch_subCardName = ['Mobile phase A', 'Mobile phase B', 'Detection wavelength', 'Injection'];



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
        
        element[1].forEach(function(ele){
            if (typeof ele === 'number') {//創一個輸入框，並且這個itemNames的array項目只有一個
                // createValueItem(ItemsWrapper.id)
                const valueItem = document.createElement("div");
                valueItem.classList.add("ValueItem");
                valueItem.innerHTML = '：<input type="number" class="numberInput" oninput="adjustInputWidth(this)"> &le; x &le; <input type="number" class="numberInput" oninput="adjustInputWidth(this)">';
                ItemsWrapper.appendChild(valueItem);
            } else {//對多個名稱選項創ChoiceItem
                const Item = document.createElement('div');
                Item.classList.add('ChoiceItem');
                Item.textContent = ele;
                ItemsWrapper.appendChild(Item);
            }
        });


        subCard.appendChild(cardName);
        subCard.appendChild(ItemsWrapper);
        
        container.appendChild(subCard);

        
    });
}
createSubCard('Ex_subCardWrapper',Ex_subCardName);
createSubCard('Cl_subCardWrapper',Cl_subCardName);
//createSubCard('Ch_subCardWrapper',Ch_subCardName);

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
// }