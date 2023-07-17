const APILINK = 'http://localhost:8002/info';
const main = document.getElementById("title");


SelectAllAPI = 'http://localhost:8002/select_all';
SelectMonoAPI = 'http://localhost:8002/select_mono' ;
SelectDoubleAPI = 'http://localhost:8002/select_double' ;
SelectMedAPI = 'http://localhost:8002/select_med' ;

select(SelectAllAPI);
function select(url){ axios(url).then((res)=>{

    console.log(res.data);

    const div_cardBox = document.createElement('div');
    div_cardBox.setAttribute('class',"result");
    div_cardBox.setAttribute('id' , "result");

    res.data.forEach(element => {

        const exit = document.getElementById(`Card_${element.藥材名}`)
        if(exit) return;

        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'herb');
        div_card.setAttribute('id',`Card_${element.藥材名}`)
        

        
        const image = document.createElement('img');
        image.setAttribute('class', 'herb-img');
        image.setAttribute('alt',`${element.藥材名}`);
        image.setAttribute('title',`${element.藥材名}`);
        image.src = `../../img_path/${element.藥材名}.png`;

        const title = document.createElement('p');
        title.innerHTML = `<font>${element.藥材名}</font>`;

        const link = document.createElement('a');
        link.href = '../info_mid_page/index2.html';
        link.appendChild(image);
        div_card.appendChild(link);
        div_card.appendChild(title);
        div_cardBox.appendChild(div_card);
        
    });
    main.appendChild(div_cardBox);
});
}


const form = document.getElementById('search-filter');
var radioButtons = form.querySelectorAll('#search-filter input[type="radio"]');
  
  radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener('change', function() {
      var value = this.value;
      
      if (value === '1') {
        const A = document.getElementById('result');
        if(A!=null) main.removeChild(A);
        select(SelectMonoAPI);
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

