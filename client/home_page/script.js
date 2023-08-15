const main = document.getElementById("title");


SelectAllAPI = 'http://localhost:8002/select_all';
SelectMonoAPI = 'http://localhost:8002/select_mono' ;
SelectDoubleAPI = 'http://localhost:8002/select_double' ;
SelectMedAPI = 'http://localhost:8002/select_med' ;
SearchKeywordAPI = 'http://localhost:8002/search_result' ;

/**
 * 給定URL依照搜索結果在首頁上加上藥材卡片
 */
select(SelectAllAPI);
function select(url){ axios(url).then((res)=>{//依照filter吐出藥材card

    console.log(res.data);

    const div_cardBox = document.createElement('div');
    div_cardBox.setAttribute('class',"result");
    div_cardBox.setAttribute('id' , "result");

    res.data.forEach(element => {
        //如果該藥材已存在在首頁中 則跳過 避免重複
        const exit = document.getElementById(`Card_${element.Med_name}`)
        if(exit) return;

        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'herb');
        div_card.setAttribute('id',`Card_${element.Med_name}`)
        

        
        const image = document.createElement('img');
        image.setAttribute('class', 'herb-img');
        image.setAttribute('alt',`${element.Med_name}`);
        image.setAttribute('title',`${element.Med_name}`);
        image.src = `../../img_path/${element.Med_name}.png`;

        const title = document.createElement('p');
        title.innerHTML = `<font>${element.Med_name}</font>`;

        const link = document.createElement('a');
        link.href = `../info_mid_page/index2.html?number=${element.Med_id}`;
        link.appendChild(image);
        div_card.appendChild(link);
        div_card.appendChild(title);
        div_cardBox.appendChild(div_card);
    });
    main.appendChild(div_cardBox);
});
}

//--------------單選表單處理--------------
const form = document.getElementById('search-filter');
var radioButtons = form.querySelectorAll('#search-filter input[type="radio"]');
  
  radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener('change', function() {
      var value = this.value;
      if (value === '1') {
        const A = document.getElementById('result');
        if(A!=null) main.removeChild(A);//都要先移除後
        select(SelectMonoAPI);//再加上內容
      } else if (value === '2') {
        const A = document.getElementById('result');
        if(A!=null) main.removeChild(A);
        select(SelectDoubleAPI);
      } else if (value === '3') {
        const A = document.getElementById('result');
        if(A!=null) main.removeChild(A);
        select(SelectMedAPI);
      } else {
        const A = document.getElementById('result');
        if(A!=null) main.removeChild(A);
        select(SelectAllAPI);
      }
    });
  });
//---------------------------搜尋框處理-------------------------
var search = document.getElementById("searchInput");//搜尋框
var selectedId = document.getElementById("selectedId");//推薦列表
var arr=[] = getAllHerbName();//放所有的藥草名稱

function getAllHerbName(){
  var herb_list=[];
  axios(SelectAllAPI).then((res)=>{
    res.data.forEach(element => {
      herb_list.push(`${element.Med_name}`);
    });
  });
  return herb_list;
}

function showList(){//創造出推薦列表
	var res = searchByIndexOf(search.value,arr);
	for(var i=0;i<res.length;i++){
		var li = document.createElement("li");
		li.innerHTML = res[i];
    li.onclick = function(){
      search.value = li.innerHTML;
      console.log(li.innerHTML);
    }
		document.getElementById("drop").appendChild(li);
    
	}
}

//模糊查询:利用字符串的indexOf方法(另也可用正則表達查詢)
function searchByIndexOf(keyWord, list){
  if(!(list instanceof Array)){
      return ;
  }
  if(keyWord == ""){
    return [];
  }else{
    var len = list.length;
    var arr = [];
    for(var i=0;i<len;i++){
        //如果字符串中不包含目标字符会返回-1
        if(list[i].indexOf(keyWord)>=0){
            arr.push(list[i]);
        }
    }
    return arr;//包含target的words的list
  }
}

search.oninput = function getMoreContents() {//在有輸入時，實時更新推薦列表
	//删除ul
	var drop = document.getElementById("drop");
	selectedId.removeChild(drop);
	//把ul添加回来
	var originalUl = document.createElement("ul");
    originalUl.id = "drop";
    selectedId.appendChild(originalUl);
	
	showList();
}

// 添加获取焦点事件
search.onfocus = function(){//焦點在搜索框上時 列表必須存在
    	// 初始下拉列表
        var originalUl = document.createElement("ul");
        originalUl.id = "drop";
        selectedId.appendChild(originalUl);
	showList();
}

//添加失去焦点事件
search.onblur = function(){//焦點離開搜索框時 列表必須消失
//	console.log("soutsout")
  var drop = document.getElementById("drop");
  document.addEventListener("click", function(event) {
    // 獲取點擊時的目標元素，如果點擊推薦列表，則不移除推薦列表
    var clickedElement = event.target;
    if(clickedElement.tagName!=='LI')selectedId.removeChild(drop);
  });
}

//點擊搜尋按鈕後的行為
const search_btn = document.getElementById("search-btn-img");
search_btn.onclick = function(event){
  event.preventDefault();
  
  // 获取搜索框中的关键字
  const keyword = document.getElementById('searchInput').value;
  var Link = SearchKeywordAPI + "?keyword=" + encodeURIComponent(keyword);
  
  const A = document.getElementById('result');
  if (A != null) main.removeChild(A);//先刪掉當前的推薦列
  select(Link);//再做一個新的推薦列
  console.log(keyword);  
}
