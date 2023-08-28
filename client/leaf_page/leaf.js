LinkAPI = 'http://localhost:8002/ref_link';
const main = document.getElementById("main");
const urlParams = new URLSearchParams(window.location.search);
const {herb_name, nameid, x, y ,stanId,img_id} = Object.fromEntries(urlParams.entries());
console.log([herb_name, nameid, x, y,img_id]);

ref_link_block_maker(LinkAPI);
//處理標準品連結與參考資料連結
function ref_link_block_maker(url){
    axios(url).then((res)=>{
        console.log(res.data);
        const div_linkBox = document.getElementById("link-part");
        const standar_link = document.createElement('a');
        standar_link.setAttribute('id','standar_link');
        standar_link.setAttribute('class', 'link-text-color');
        standar_link.innerHTML = `<font>藥材適用標準品</font>`;
        if(isNaN(stanId)) {// 如果 stanId 不是一個數字 用===null沒辦法QQ
            standar_link.addEventListener('click', function(event) {
            // 阻止默認的鏈接行為，以便我們可以自行控制
                event.preventDefault();
                alert('此樣品無對應之標準品');
            });
        } else {
            standar_link.setAttribute('href',`../standar_page/standar.html?stanId=${stanId}`);                    
        }

        const ref_link = document.createElement('a');
        ref_link.setAttribute('class', 'link-text-color');
        ref_link.setAttribute('target','_blank');
        ref_link.innerHTML = `<font>參考文獻</font>`;

        const ref_text = document.createElement('p');
        ref_text.setAttribute('style',"margin:10px;");
        
        res.data.forEach(element => {
            if(element.Source_id=== Number(x)){
                ref_link.setAttribute("href",`${element.Source_link}`);
                ref_text.innerHTML = `${element.Source_name}`;
            }
            
        });
        div_linkBox.appendChild(standar_link);
        div_linkBox.appendChild(ref_link);
        div_linkBox.appendChild(ref_text);
    });
    
}


document.getElementById("med_name").setAttribute("href","../home_page/index.html");
document.getElementById("med_info").setAttribute("href",`../info_mid_page/index2.html?number=${nameid}`);
document.getElementById("med_ref").setAttribute("href", `../info_mid_page/index2.html?number=${nameid}`);

document.getElementById("herb-name").innerHTML = `${herb_name}`;
document.getElementById("sample").innerHTML=`參考條件${x}-${y}`;

//---------動態生成四種圖片-----------
//----------檢查圖片是否正確生成-----------
function check_img(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            console.log('圖片存在且可以打開。');
            resolve(imagePath);
        };
        img.onerror = function () {
            console.error('圖片不存在或無法打開');
            resolve("./甘草1_1_1.png"); // 返回預設圖片路徑
        };
        img.src = imagePath; // 判定該路徑的圖片是否存在
    });
}

async function loadImages() {
    const img_left = document.getElementById("img_left");
    const img_right = document.getElementById("img_right");
    let ref_img=document.createElement("img");//參考條件截圖
    ref_img.setAttribute('class', "datachart-img");
    const imagePath1 = "../../img_path/參考條件截圖/"+`${img_id}`+".png";
    ref_img.src=await check_img(imagePath1);
    //--------------------------------
    let finger_print_img=document.createElement("img");//指紋圖譜
    finger_print_img.setAttribute('class', "datachart-img");
    const imagePath2 = "../../img_path/指紋圖譜截圖/"+`${img_id}`+".png";
    finger_print_img.src=await check_img(imagePath2);
    //--------------------------------
    const finger_print_data_img=document.createElement("img");//指紋圖譜數據
    finger_print_data_img.setAttribute('class', "datachart-img");
    const imagePath3 = "../../img_path/指紋圖譜數據截圖/"+`${img_id}`+".png";
    finger_print_data_img.src=await check_img(imagePath3);
    //-------------------------------------
    const ratio_img=document.createElement("img");//萃取溶劑比例
    ratio_img.setAttribute('class', "datachart-img");
    const imagePath4 = "../../img_path/標準品與萃取溶劑的比例截圖/"+`${img_id}`+".png";
    ratio_img.src=await check_img(imagePath4);
    //--------------------------------------------------
    img_left.appendChild(ref_img);
    img_left.appendChild(ratio_img);
    img_right.appendChild(finger_print_img);
    img_right.appendChild(finger_print_data_img);
}

loadImages(); // 呼叫函數來加載圖片