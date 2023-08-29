const getTableAPI = "http://localhost:5000/getAllData";
const change_database_API="http://localhost:5000/updateData";
const add_row_API="http://localhost:5000/add_new_row";
const delete_row_API="http://localhost:5000/delete_row";

const main=document.getElementById("main");
const add_data_btn=document.getElementById("Add_Data_btn");
const mySidebar=document.getElementById("mySidebar");
let data=null;//開一個全域變數來記錄一開始從資料庫查詢出來的data
//-----管理四個按鈕------------
const AllMed_btn=document.getElementById("AllMed_id");
const MedSource_btn=document.getElementById("MedSource_id");
const SampleData_btn=document.getElementById("SampleData_id");
const StandardData_btn=document.getElementById("StandardData_id");
const MedAssociate_btn=document.getElementById("MedAssociate_id")
AllMed_btn.addEventListener("click", () => {
    selected_table="AllMed";
    updateClickedState(selected_table);
    update_table();
});
MedSource_btn.addEventListener("click", () => {
    selected_table="MedSource";
    updateClickedState(selected_table);
    update_table()
});
SampleData_btn.addEventListener("click", () => {
    selected_table="SampleData";
    updateClickedState(selected_table);
    update_table()
});
StandardData_btn.addEventListener("click", () => {
    selected_table="StandardData";
    updateClickedState(selected_table);
    update_table()
});
MedAssociate_btn.addEventListener("click", () => {
    selected_table="MedAssociate";
    updateClickedState(selected_table);
    update_table()
});
//-----------------sidebar btns hover----------------------
setHoverStyle(document.getElementById("AllMed_id"));
setHoverStyle(document.getElementById("MedSource_id"));
setHoverStyle(document.getElementById("SampleData_id"));
setHoverStyle(document.getElementById("StandardData_id"));
setHoverStyle(document.getElementById("MedAssociate_id"));

function setHoverStyle(obj){

    obj.addEventListener('mouseover', function() {
        obj.style.backgroundColor = 'rgb(91, 91, 95)';
        obj.style.color = 'white';
    });
        
    obj.addEventListener('mouseout', function() {
        if (obj.clicked) {
            obj.style.backgroundColor = 'gray';
            obj.style.color = 'white';
        } else {
            obj.style.backgroundColor = 'white';
            obj.style.color = 'black';
        }
    });  
}
function updateClickedState(selected){
    sidebarBtn = ["AllMed_id", "MedSource_id", "SampleData_id", "StandardData_id","MedAssociate_id"];
    objId = selected + "_id";
    for(const id of sidebarBtn){
        if(id==objId) document.getElementById(id).clicked = true;
        else document.getElementById(id).clicked = false;
        updateStyle(id);
    }
}
function updateStyle(objId) {
    const optionElement = document.getElementById(objId);
    optionElement.style.backgroundColor = optionElement.clicked ? 'gray' : 'white';
    optionElement.style.color = optionElement.clicked ? 'white' : 'black';
}

//---------------------------------------
function add_empty_row(){
    const tbody = document.querySelector(".data-table tbody");
    const newRow = tbody.insertRow(); 
    
    const idCell = newRow.insertCell(); // 插入 ID 單元格
    const current_id=ID_array[current_table_lenth-1]+1;
    newRow.id="row_id_"+current_id;
    idCell.textContent = current_id; // 往下加一，-2的原因是因為會多加一次
    console.log("newRow.id",newRow.id);//尚未更新總長度
    console.log("new_row_ID",current_id);//尚未紀錄current_table_lenth

    for(key in data[0]){
        const cell = newRow.insertCell();
        const input = document.createElement("input");
        input.setAttribute("class","input_row_"+current_id) // 添加新行的 class
        input.setAttribute("placeholder", "Enter value"); // 提示用戶輸入內容
        cell.appendChild(input);
    }
    const editCell = newRow.insertCell()
    const editButton = document.createElement("button");//幫每個change btn建立不同id
    editButton.setAttribute("id","change_"+current_id)
    editButton.textContent = "change";

    editCell.appendChild(editButton);
    const del_cell=newRow.insertCell()
    const del_btn=document.createElement("button");
    del_btn.setAttribute("id","delete_"+current_id)
    del_btn.textContent = "delete";
    // del_btn.addEventListener("click", () => {
    //     delete_row(current_table_lenth);
    //     console.log("del_btn.id",del_btn.id)
    // });
    del_cell.appendChild(del_btn);
    current_table_lenth=current_table_lenth+1;//靶新的row加入只有在這裡可以被改動到
    ID_array.push(current_id);
    console.log(ID_array);
}

//---------------------------------------

function remove_empty_row() {
    const tbody = document.querySelector(".data-table tbody");
    const rows = tbody.getElementsByTagName("tr");
    const lastRow = rows[rows.length - 1];
    
    if (lastRow) {
        tbody.removeChild(lastRow);
        current_table_lenth=current_table_lenth-1;//是把最後一個元素拿掉
        ID_array.pop();
    }
    console.log("ID_array",ID_array);
}

//---------------------------------------
let selected_table="AllMed";
maketable();

let keep_column_name=[];
let current_table_lenth=0;//紀錄目前的有幾個row
function change_database(target_Id,keep_input_obj) {
    console.log(keep_input_obj)
    const targetId =parseInt(target_Id);
    if (targetId) {
        const data = { targetId,keep_input_obj,selected_table}; // 创建一个包含要发送的数据的对象
        axios.post(change_database_API, data).then((res) => {
            console.log(res.data);
        });
    }
}
//----------------------
function add_row_to_database(){
    const row_id=ID_array[current_table_lenth-1];
    console.log("new_row_ID",row_id)
    // console.log("current_table_lenth",current_table_lenth)
    console.log("keep_input_obj",keep_input_obj)//直接去把現在從第幾個row開始傳遞給資料庫，使用者改不了ID
    const data = { keep_input_obj,selected_table,row_id}; // 创建一个包含要发送的数据的对象
    axios.post(add_row_API, data).then((res) => {
        console.log(res.data);
    });
}
//----------------
function update_table(){
    removeTable();
    maketable();
    keep_input_obj={};
    keep_column_name=[];
    ID_array=[];
}
//--------------------------------------------------------------
let Add_data_obj={
    state:0, //0表示可以讓使用者新增data，1表示使用者可以選擇要儲存修改還是放棄修改
    cancel_btn_state:0,//用來記錄cancel使否有被點選到，用來控制一組按鈕的state
    del_and_change_btn_disabled:false
}

function add_new_row_control(){
    if(Add_data_obj.state==0){//使用者想要增加row會進入這個條件
        window.scrollTo(0, document.body.scrollHeight);
        Add_data_obj.del_and_change_btn_disabled=true;
        const cancel_btn=document.createElement("button");
        cancel_btn.innerHTML="cancel";
        cancel_btn.setAttribute("class","cancel_newdata");
        cancel_btn.setAttribute("id","cancel_btn");
        cancel_btn.addEventListener("click", () => {
            remove_empty_row();
            Add_data_obj.state=1;
            Add_data_obj.cancel_btn_state=1;
            add_new_row_control();
        });
        mySidebar.appendChild(cancel_btn);
        Add_data_obj.state=1;
        add_data_btn.innerHTML="save change"
        add_data_btn.style.fontSize="2ch";
        add_empty_row();
    }
    else {//表示現在是兩個按鈕狀態，cancel可能被選中也可能沒有
        if(Add_data_obj.state==1&&Add_data_obj.cancel_btn_state==0){
            read_new_row_input();//真正把資料寫入表格
        }
        const cancel_btn=document.getElementById("cancel_btn");
        mySidebar.removeChild(cancel_btn);
        add_data_btn.innerHTML="+";
        add_data_btn.style.fontSize="5ch";
        Add_data_obj.state=0;
        Add_data_obj.cancel_btn_state=0;
        Add_data_obj.del_and_change_btn_disabled=false;
    }
}
//--------------------------------------------------------------
let ID_array=[]
function maketable(){
    
    const url=getTableAPI+"?table_name="+selected_table;
    axios(url).then((res) => {
    data = res.data;
    //----創建ID作為index-------------
    //let ID_array=[]
    data.forEach((item) => {
        if(selected_table=="AllMed"){
            ID_array.push(item["Med_id"]);
        }
        else if(selected_table=="MedSource"){
            ID_array.push(item["Source_id"]);
        }
        else if(selected_table=="SampleData"){
            ID_array.push(item["Sample_id"]);
        }
        else if(selected_table=="MedAssociate"){
            ID_array.push(item["Asso_id"]);
        }
        else {
            ID_array.push(item["Standard_id"]);
        }
    });
    console.log("ID_array:",ID_array);
    console.log("here",data)
    // 创建表格元素
    const table = document.createElement("table");
    table.classList.add("data-table");

    // 建立column name
    //----------建立一個row的標準動作------------
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    //-----------------------------------------
    //外加"編號"column--------------------------
    const th_id=document.createElement("th");
    th_id.textContent="ID";
    headerRow.appendChild(th_id);
    for (const key in data[0]) {
        const th = document.createElement("th");//data的格式是這樣，一個array中
        th.textContent = key;//放好幾個dict  [["name":"甘草","id":1],["name":"黃芩","id":2]]
        headerRow.appendChild(th);
        keep_column_name.push(key)
    }

    //外加"修改"這個column head
    const th_btn=document.createElement("th");
    th_btn.textContent="make change";
    headerRow.appendChild(th_btn);
    //--------------------------------------------
    const th_del_btn=document.createElement("th");
    th_del_btn.textContent="delete row";
    headerRow.appendChild(th_del_btn);
    
    // 放入數據
    const tbody = table.createTBody();
    
    current_table_lenth=0;
    data.forEach((item) => {
        current_table_lenth=current_table_lenth+1;//只有在這裡可以被改動
        const currentId = ID_array[current_table_lenth-1]; //OK
        console.log("currentId",currentId)
        const row = tbody.insertRow();//建立一個空白row
        row.id="row_id_"+currentId;
        console.log("row:",row);
        //先建立row id的編號
        const id_cell=row.insertCell();
        // const id_txt=document.createTextNode(toString(id_row_count));
        // id_cell.appendChild(id_txt)
        id_cell.textContent=currentId.toString();
        for (const key in item) {
            const cell = row.insertCell();
            const input = document.createElement("input");
            input.setAttribute("class","input_row_"+currentId)
            console.log("input_row_"+currentId);
            input.value = item[key];
            
            input.setAttribute('disabled', 'true');//初始化都先鎖起來
            cell.appendChild(input);
        }
        const editCell = row.insertCell()
        const editButton = document.createElement("button");
        //幫每個change btn建立不同id
        editButton.setAttribute("id","change_"+currentId)
        editButton.textContent = "change";

        editButton.addEventListener("click", () => {
            if(Add_data_obj.del_and_change_btn_disabled==false){
                console.log("row.id",row.id)
                input_toggle(editButton,currentId,data[currentId-1]);
                console.log("editButton.id",editButton.id)
            }
        });
        editCell.appendChild(editButton);

        //---------加入delete 按鈕-----------------------
        const del_cell=row.insertCell()
        const del_btn=document.createElement("button");
        del_btn.setAttribute("id","delete_"+currentId)
        del_btn.textContent = "delete";
        del_btn.addEventListener("click", () => {
            if(Add_data_obj.del_and_change_btn_disabled==false){
                delete_row(currentId);
                console.log("debug frontend:",currentId);
                console.log("del_btn.id",del_btn.id)
            }
        });
        del_cell.appendChild(del_btn);
        //-----------------------------------------------
        // current_table_lenth=current_table_lenth+1;//只有在這裡可以被改動
    });
    //--------------------
    // 将表格添加到页面中
    main.appendChild(table);
    });
}

//----------------
let selected_row={//紀錄目前被選中的按鈕的id
    id:0 //0表示沒有row被選中
};
keep_input_obj={};//一開始會先被建立起來，只要是同一張表格事都不會變，改內容即可

function input_toggle(editButton,id_int){
    if(selected_row.id==0){//修改
        input_row_array=Array.from(document.getElementsByClassName("input_row_"+id_int))
        for (var i = 0; i < input_row_array.length; i++) {
            //console.log(input_row_array[i].value);
            input_row_array[i].removeAttribute('disabled');
        }
        selected_row.id=parseInt(id_int);
        editButton.textContent="save";
    }
    else{//讀取使用者更新的資料
        input_row_array=Array.from(document.getElementsByClassName("input_row_"+id_int))//用class抓取一個class的所有物件再一個一個讀取input.value
        for (var i = 0; i < input_row_array.length; i++) {
            keep_input_obj[keep_column_name[i]]=input_row_array[i].value;
            input_row_array[i].setAttribute('disabled', 'true');
        }
        //console.log("keep_input_obj",keep_input_obj)
        change_database(id_int,keep_input_obj);
        selected_row.id=0;
        editButton.textContent="change";
    }
}

function read_new_row_input(){

    const new_row_id=ID_array[current_table_lenth-1];
    console.log("new_row_id",new_row_id);
    //-----------------------------------------
    input_row_array=Array.from(document.getElementsByClassName("input_row_"+new_row_id))//用class抓取一個class的所有物件再一個一個讀取input.value
    for (var i = 0; i < input_row_array.length; i++) {
        keep_input_obj[keep_column_name[i]]=input_row_array[i].value;
        input_row_array[i].setAttribute('disabled', 'true');
    }
    // console.log("keep_input_obj",keep_input_obj)
    add_row_to_database();
    const currentId=ID_array[current_table_lenth-1];
    //console.log("debug:",currentId);
    const editButton=document.getElementById("change_"+currentId)
    editButton.addEventListener("click", () => {
        if(Add_data_obj.del_and_change_btn_disabled==false){
            input_toggle(editButton,currentId);
            console.log("editButton.id",editButton.id)
        }
    });
    //-----------------------------------------------
    const delete_btn=document.getElementById("delete_"+currentId)
    delete_btn.addEventListener("click", () => {
        if(Add_data_obj.del_and_change_btn_disabled==false){
            delete_row(currentId);
            console.log("debug frontend:",currentId);
            console.log("del_btn.id",delete_btn.id)
        }
    });
    //-----------------------------------------------
}

//------delete row-------------
function delete_row(row_id){
    const data = {row_id,selected_table}; // 创建一个包含要发送的数据的对象
        axios.post(delete_row_API, data).then((res) => {
        console.log(res.data);
    });
    for(var i=0;i<current_table_lenth;i++){
        if(ID_array[i]==row_id){
            ID_array.splice(i, 1);
            break
        }
    }
    current_table_lenth=current_table_lenth-1;//長度要扣1
    //ID_array.pop();//從記錄的array中清除該row_id
    removeRowById("row_id_"+row_id);
}
function removeTable() {
    const tableElement = document.querySelector(".data-table"); // Assuming you have a class "data-table" on your table element
    if (tableElement) {
        tableElement.remove();
    }
}

function removeRowById(rowId) {//前端更新，把表格去除
    console.log("rowId for delete frontend",rowId)
    const rowToRemove = document.getElementById(rowId);
    //console.log("rowToRemove",rowToRemove);
    if (rowToRemove) {
        const tbody = rowToRemove.parentNode; // 获取行所在的tbody元素
        tbody.removeChild(rowToRemove); // 从tbody中移除行
    }
}