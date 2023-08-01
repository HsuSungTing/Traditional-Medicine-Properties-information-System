LinkAPI = 'http://localhost:8002/ref_link';
const urlParams = new URLSearchParams(window.location.search);
const {herb_name, nameid, x, y ,stanId} = Object.fromEntries(urlParams.entries());
console.log([herb_name, nameid, x, y]);
ref_link_block_maker(LinkAPI);
function ref_link_block_maker(url){
    axios(url).then((res)=>{

        console.log(res.data);
    
        // const div_linkBox = document.createElement('div');
        // div_linkBox.setAttribute('class',"link-part");
        // div_linkBox.setAttribute('id' , "link-part");
        const div_linkBox = document.getElementById("link-part");
        const standar_link = document.createElement('a');
        standar_link.setAttribute('class', 'link-text-color');
        standar_link.innerHTML = `<font>藥材適用標準品</font>`;

        const ref_link = document.createElement('a');
        ref_link.setAttribute('class', 'link-text-color');
        ref_link.setAttribute('target','_blank');
        ref_link.innerHTML = `<font>參考文獻</font>`;

        const ref_text = document.createElement('p');
        ref_text.setAttribute('style',"margin:10px;");
        
        res.data.forEach(element => {
            if(element.資料來源ID=== Number(x)){
                //standar_link.setAttribute('href',`../standar_page/standar.html?herb_name=${herb_name}&nameid=${nameid}&x=${x}&y=${y}&stanId=${element.標準品編號ID}`);
                standar_link.setAttribute('href',`../standar_page/standar.html?stanId=${stanId}`);
                ref_link.setAttribute("href",`${element.資料來源連結}`);
                ref_text.innerHTML = `${element.資料來源名稱}`;
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

