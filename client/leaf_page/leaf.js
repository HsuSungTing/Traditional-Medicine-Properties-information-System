LinkAPI = 'http://localhost:8002/ref_link';
const urlParams = new URLSearchParams(window.location.search);
const {herb_name, nameid, x, y ,stanId} = Object.fromEntries(urlParams.entries());
console.log([herb_name, nameid, x, y]);

ref_link_block_maker(LinkAPI);
function ref_link_block_maker(url){
    axios(url).then((res)=>{

        console.log(res.data);
        const div_linkBox = document.getElementById("link-part");
        const standar_link = document.createElement('a');
        standar_link.setAttribute('id','standar_link');
        standar_link.setAttribute('class', 'link-text-color');
        standar_link.innerHTML = `<font>藥材適用標準品</font>`;
        if(isNaN(stanId)) {// 如果 stanId 不是一個數字 用===null沒用QQ
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


