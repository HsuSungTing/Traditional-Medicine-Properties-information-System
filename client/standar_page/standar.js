LinkAPI = 'http://localhost:8002/ref_link';
StandarDataAPI = 'http://localhost:8002/standar';
const main = document.getElementById("main");
const urlParams = new URLSearchParams(window.location.search);
const {stanId } = Object.fromEntries(urlParams.entries());


function ref_link_block_maker(url, sourceId){
    axios(url).then((res)=>{
        console.log(res.data);
        const div_linkBox = document.getElementById("link-part");

        const ref_link = document.createElement('a');
        ref_link.setAttribute('class', 'link-text-color');
        ref_link.setAttribute('target','_blank');
        ref_link.innerHTML = `<font>參考文獻</font>`;

        const ref_text = document.createElement('p');
        ref_text.setAttribute('style',"margin:10px;");
        
        res.data.forEach(element => {
            if(element.Source_id=== Number(sourceId)){
                ref_link.setAttribute("href",`${element.Source_link}`);
                ref_text.innerHTML = `${element.Source_name}`;
            }
        });
        
        div_linkBox.appendChild(ref_link);
        div_linkBox.appendChild(ref_text);
    });
    
}

function getSampleData(url){
    axios(url).then((res)=>{
        res.data.forEach(element => {
            nameid=element.Med_id;
            herb_name=element.Med_name;
            soruceId = element.Source_id;
            document.getElementById("med_info").setAttribute("href",`../info_mid_page/index2.html?number=${nameid}`);
            document.getElementById("med_ref").setAttribute("href", `../info_mid_page/index2.html?number=${nameid}`);
            document.getElementById("herb-name").innerHTML = `${herb_name}`; 
            ref_link_block_maker(LinkAPI,soruceId);
        });
    });
}

getSampleData(StandarDataAPI + `?stanId=${stanId}&tbName=SampleData&max=${1}`);
document.getElementById("med_name").setAttribute("href","../home_page/index.html");
//document.getElementById("sample").innerHTML=getStandarData(StandarDataAPI + `?stanId=${stanId}&tbName=StandardData&max=${1}`);
getStandarData(StandarDataAPI + `?stanId=${stanId}&tbName=StandardData&max=${1}`);

function getStandarData(url){
    console.log(url);
    axios(url).then((res)=>{
        res.data.forEach(element => {
            Standard_name = document.getElementById("sample");
            Standard_name.innerHTML = element.Standard_name;
            Standard_name.style.textAlign = 'left';
        });
    });
    
}

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
    let ref_img=document.createElement("img");//參考條件截圖
    ref_img.setAttribute('class', "datachart-img");
    const imagePath1 = "../../img_path/參考條件截圖/"+`${stanId}`+".png";
    ref_img.src=await check_img(imagePath1);
    //--------------------------------
    let finger_print_img=document.createElement("img");//指紋圖譜
    finger_print_img.setAttribute('class', "datachart-img");
    const imagePath2 = "../../img_path/指紋圖譜截圖/"+`${stanId}`+".png";
    finger_print_img.src=await check_img(imagePath2);
    //--------------------------------
    const finger_print_data_img=document.createElement("img");//指紋圖譜數據
    finger_print_data_img.setAttribute('class', "datachart-img");
    const imagePath3 = "../../img_path/指紋圖譜數據截圖/"+`${stanId}`+".png";
    finger_print_data_img.src=await check_img(imagePath3);
    //-------------------------------------
    const ratio_img=document.createElement("img");//萃取溶劑比例
    ratio_img.setAttribute('class', "datachart-img");
    const imagePath4 = "../../img_path/標準品與萃取溶劑的比例截圖/"+`${stanId}`+".png";
    ratio_img.src=await check_img(imagePath4);
    //--------------------------------------------------
    main.appendChild(ref_img);
    main.appendChild(finger_print_img);
    main.appendChild(finger_print_data_img);
    main.appendChild(ratio_img);
}

loadImages(); // 呼叫函數來加載圖片
