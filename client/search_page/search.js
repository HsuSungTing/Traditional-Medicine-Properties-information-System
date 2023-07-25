// 在 index2.html 中獲取查詢參數的值
SelectadvancedAPI = 'http://localhost:5000/getadvancedData';

let Ex_subCardName=[];
let Cl_subCardName=[];
//-----------------------------------------------
function create_Ex_subCardName(url, Ex_subCardName) {
    return new Promise((resolve, reject) => {
        axios(url).then((res) => {
            var data = res.data;
            mid_array=['溶劑'];
            sub_array=[];
            //-----------------
            data.forEach(element => {
                let add_bool=1;
                for(let i=0;i<sub_array.length;i++){
                    if(sub_array[i]==element.萃取溶劑){
                        add_bool=0;
                    }
                }
                if(add_bool==1){
                    sub_array.push(element.萃取溶劑);
                    console.log("push successfully",sub_array);
                }
            });
            console.log("in_func sub_array",sub_array);
            //---------------------------
            mid_array.push(sub_array)
            Ex_subCardName.push(mid_array)
            // 很重要!!!在异步操作完成后解决 Promise
            resolve(Ex_subCardName);
        }).catch((error) => {
            // 异步操作出错时拒绝 Promise
            reject(error);
        });
    });
}

//-----------------------------------------------------------
function create_Cl_subCardName(url, Cl_subCardName) {
    return new Promise((resolve, reject) => {
        axios(url).then((res) => {
            var data = res.data;
            mid_array=['廠牌'];
            sub_array=[];
            data.forEach(element => {
                let add_bool=1;
                for(let i=0;i<sub_array.length;i++){
                    if(sub_array[i]==element.管柱條件_廠牌){
                        add_bool=0;
                    }
                }
                if(add_bool==1){
                    sub_array.push(element.管柱條件_廠牌);
                    console.log("push successfully",sub_array);
                }
            });
            mid_array.push(sub_array);//part 1
            Cl_subCardName.push(mid_array);
            //-------------------------------------------------
            mid_array=['型號'];
            sub_array=[];
            data.forEach(element => {
                let add_bool=1;
                for(let i=0;i<sub_array.length;i++){
                    if(sub_array[i]==element.管柱條件_型號){
                        add_bool=0;
                    }
                }
                if(add_bool==1){
                    sub_array.push(element.管柱條件_型號);
                    console.log("push successfully",sub_array);
                }
            });
            console.log("in_func sub_array",sub_array);
            mid_array.push(sub_array);//part 2
            Cl_subCardName.push(mid_array);
            // 很重要!!!在异步操作完成后解决 Promise
            resolve(Cl_subCardName);
        }).catch((error) => {
            // 异步操作出错时拒绝 Promise
            reject(error);
        });
    });
}


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
            cardName.style.color = 'white';} 
        else {
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

function adjustInputWidth(input) {
    const valueLength = input.value.length;
    const minWidth = 30; // 设置输入框的最小宽度
    const maxWidth = 150; // 设置输入框的最大宽度
    const charWidth = 15; // 设置一个字符的宽度（根据具体情况调整）

    const newWidth = Math.min(Math.max(valueLength * charWidth, minWidth), maxWidth);
    input.style.width = newWidth + "px";
}

function createValueItem(containerID) {
    const container = document.getElementById(containerID);
    const valueItem = document.createElement("div");
    valueItem.classList.add("ValueItem");
    valueItem.innerHTML = '：<input type="number" class="numberInput" oninput="adjustInputWidth(this)"> &le; x &le; <input type="number" class="numberInput" oninput="adjustInputWidth(this)">';
    container.appendChild(valueItem);
}

//Cl_subCardName = [['廠牌',[1]], ['型號',[1]], ['長度',[1]], ['寬度',[1]], ['粒徑',[1]], ['溫度',[1]]];
//Cl_subCardName = [['廠牌',["AK","BM","CP"]], ['型號',["EB","GH","ML"]], ['長度',[1]], ['寬度',[1]], ['粒徑',[1]], ['溫度',[1]]];
Ch_subCardName = ['Mobile phase A', 'Mobile phase B', 'Detection wavelength', 'Injection'];

function createSubCard(containerID, Names){
    console.log("I'm here 0",Names);

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
                const valueItem = document.createElement("div");
                valueItem.classList.add("ValueItem");
                valueItem.innerHTML = '：<input type="number" class="numberInput" oninput="adjustInputWidth(this)"> &le; x &le; <input type="number" class="numberInput" oninput="adjustInputWidth(this)">';
                ItemsWrapper.appendChild(valueItem);
            } else {
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

create_Ex_subCardName(SelectadvancedAPI, Ex_subCardName).then((data) => {
    console.log("after_func Ex_subCardName", data);
    createSubCard('Ex_subCardWrapper', data);
    //createSubCard('Cl_subCardWrapper', Cl_subCardName);
}).catch((error) => {
    console.error("Error occurred:", error);
});

create_Cl_subCardName(SelectadvancedAPI, Cl_subCardName).then((data) => {
    console.log("after_func Cl_subCardName", data);
    createSubCard('Cl_subCardWrapper', data);
}).catch((error) => {
    console.error("Error occurred:", error);
});
