// 側拉式選單
const element = document.querySelector(".sidebar");
const sidebarWidth = window.getComputedStyle(element).width;//注意這傢伙是字串:(
    document.getElementById("page-content").style.marginLeft=sidebarWidth;/*content初始設定收起*/
function openNav() {
    document.getElementById("mySidebar").style.left = "0"; /* 從右邊拉出 */
    document.getElementById("page-content").style.marginLeft=sidebarWidth;/*content彈性移動*/
    document.getElementById("page-content").style.width="75%";
}

function closeNav() {
    document.getElementById("mySidebar").style.left = '-'+sidebarWidth; /* 隱藏回去 */
    document.getElementById("page-content").style.marginLeft="0px";
    document.getElementById("page-content").style.width="100%";
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
