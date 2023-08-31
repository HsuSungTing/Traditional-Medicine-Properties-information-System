CompInfoAPI = 'http://localhost:8002/comp_info';
CompElementAPI = 'http://localhost:8002/comp_element';
CompSampleAPI = "http://localhost:8002/get_comp_sample"
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('number');
//const id = 15;
const comp_element = document.getElementById("element");
const comp_sample = document.getElementById("sample");
getCompInfo(CompInfoAPI+"?id="+id);
select_source(CompElementAPI+"?id="+id);
select_sample(CompSampleAPI+"?id="+id);
function getCompInfo(url){ 
  axios(url).then((res)=>{
    res.data.forEach(element => {
      document.getElementById('herb_name').textContent = "複方藥材名：" + element.Med_name;
      document.getElementById('herb_effect').textContent = "效能：" + element.Med_efficacy;
      document.getElementById('herb_use').textContent = "用法：" + element.Med_dosage;
    });
  });
}


function select_source(url){ 
  axios(url).then((res)=>{
    const div_cardBox = document.createElement('div');
    div_cardBox.setAttribute('class',"med_info_box");
    div_cardBox.setAttribute('id' , "med_info_box");

    res.data.forEach(element => {
      const exit = document.getElementById(`Card_${element.Med_id}`)
      if(exit) return;

      const div_card = document.createElement('div');
      div_card.setAttribute('class', 'med_info');
      div_card.setAttribute('id',`Card_${element.Med_id}`)
      
      const image = document.createElement('img');
      image.setAttribute('class', 'med_info_img');
      image.setAttribute('alt',`${element.Med_name}_${element.Med_id}`);
      image.setAttribute('title',`${element.Med_name}_${element.Med_id}`);
      //---------處理圖片連結-----------------
      const imagePath = "../../img_path/"+`${element.Med_name}`+".png";
      const img = new Image();
      img.onload = function() {
              console.log('圖片存在且可開');
              image.src=imagePath;
      };
      img.onerror = function() {
              console.error('圖片不存在或無法打開。');
              image.src="../../img_path/甘草.png";
      };
      img.src = imagePath;//判定圖片是否存在

      const title = document.createElement('p');
      title.innerHTML = `<font>${element.Med_name}</font>`;

      const link = document.createElement('a');
      link.href = `../info_mid_page/index2.html?number=${element.Med_id}`;

      link.appendChild(image);
      div_card.appendChild(link);
      div_card.appendChild(title);
      div_cardBox.appendChild(div_card);

    });
    comp_element.appendChild(div_cardBox);
  });
}

function select_sample(url){
  axios(url).then((res)=>{
    const div_cardBox = document.createElement('div');
    div_cardBox.setAttribute('class',"med_info_box");
    div_cardBox.setAttribute('id' , "med_sample_box");
    res.data.forEach(element=>{
      const exit = document.getElementById(`Card_${element.Sample_id}`)
          if(exit) return;

          const div_card = document.createElement('div');
          div_card.setAttribute('class', 'med_info');
          div_card.setAttribute('id',`Card_${element.Sample_id}`)
          
          const image = document.createElement('img');
          image.setAttribute('class', 'med_info_img');
          image.setAttribute('alt',`${element.Med_name}_${element.Sample_id}`);
          image.setAttribute('title',`${element.Med_name}_${element.Sample_id}`);
          //---------處理圖片連結-----------------
          const imagePath = "../../img_path/參考條件截圖/"+`${element.Sample_img_id}`+".png";
          const img = new Image();
          img.onload = function() {
                  console.log('圖片存在且可開');
                  image.src=imagePath;
          };
          img.onerror = function() {
                  console.error('圖片不存在或無法打開。');
                  image.src="../../img_path/甘草.png";
          };
          img.src = imagePath;//判定圖片是否存在

          const title = document.createElement('p');
          title.innerHTML = `<font>${element.Med_name}-${element.Source_id}-${element.Sample_id}</font>`;
  
          const link = document.createElement('a');
          link.href = `../leaf_page/leaf.html?herb_name=${element.Med_name}&nameid=${element.Med_id}&x=${element.Source_id}&y=${element.Sample_id}&stanId=${element.Standard_id}&img_id=${element.Sample_img_id}`;
  
          link.appendChild(image);
          div_card.appendChild(link);
          div_card.appendChild(title);
          div_cardBox.appendChild(div_card);
    });
    comp_sample.appendChild(div_cardBox);
  });
}