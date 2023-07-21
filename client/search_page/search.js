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
        content.style.display = 'block'; // 显示内容
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
  
    // 根据输入的数字个数计算输入框的宽度
    const newWidth = Math.min(Math.max(valueLength * charWidth, minWidth), maxWidth);
    input.style.width = newWidth + "px";
}
Ex_subCardName = ['溶劑','其他'];
Cl_subCardName = ['廠牌', '型號', '長度', '寬度', '粒徑', '溫度'];
Ch_subCardName = ['Mobile phase A', 'Mobile phase B', 'Detection wavelength', 'Injection'];
