fetch('http://localhost:5000')
    .then(response => response.json())
    .then(data => {
        // 在页面上显示数据
        var herb_name_Container = document.getElementById('herb_name');
        var herb_name = data.map(item => item['藥材名']);
        //--------------------------------------------------
        var herb_latin_Container=document.getElementById('herb_latin');
        var herb_latin = data.map(item => item['拉丁生藥名稱']);
        //---------------------------------------------------
        var herb_Eng_Container=document.getElementById('herb_Eng')
        var herb_Eng = data.map(item => item['英文名稱']);
//---------------------------------------------------
        var herb_base_Container=document.getElementById('herb_base')
        var herb_base = data.map(item => item['基原']);
        //---------------------------------------------------
        var herb_amount_Container=document.getElementById('herb_amount')
        var herb_amount = data.map(item => item['含量']);
        //---------------------------------------------------
        var herb_use_Container=document.getElementById('herb_use')
        var herb_use = data.map(item => item['用途分類']);
//---------------------------------------------------

        var herb_attribute_Container=document.getElementById('herb_attribute')
        var herb_attribute = data.map(item => item['性味與歸經']);
        //---------------------------------------------------
        var herb_effect_Container=document.getElementById('herb_effect')
        var herb_effect = data.map(item => item['含量']);
        //---------------------------------------------------
        var herb_use_amount_Container=document.getElementById('herb_use_amount')
        var herb_use_amount = data.map(item => item['用途分類']);
        //---------------------------------------------------
        var herb_storage_Container=document.getElementById('herb_storage')
        var herb_storage = data.map(item => item['貯藏法']);

        herb_name_Container.innerHTML = '中文名：' + herb_name.join(', ');
        herb_latin_Container.innerHTML='拉丁生藥名稱: '+herb_latin.join(', ');
        herb_Eng_Container.innerHTML= "英文名稱: "+herb_Eng.join(', ');

        herb_base_Container.innerHTML= "基原: "+herb_base.join(', ');
        herb_amount_Container.innerHTML= "含量: "+herb_amount.join(', ');
        herb_use_Container.innerHTML= "用途分類: "+herb_use.join(', ');

        herb_attribute_Container.innerHTML= "性味與歸經: "+herb_attribute.join(', ');
        herb_effect_Container.innerHTML= "效能: "+herb_effect.join(', ');
        herb_use_amount_Container.innerHTML= "用法與用量: "+herb_use_amount.join(', ');
        herb_storage_Container.innerHTML="貯藏法: "+herb_storage.join(', ');
        
    })
    .catch(error => console.error(error));

// const urlParams = new URLSearchParams(window.location.search);
// const number = urlParams.get('number');
// if(number==='2'){
//         const test = document.getElementById("test");
//         const test_img = document.createElement('img');
//         test_img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb8H0nJQ8kxeWF3negeG66SklTM6ppx4QW9g&usqp=CAU";
//         test.appendChild(test_img);
// }
// console.log(number);
