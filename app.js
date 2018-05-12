let queryDatas = new XMLHttpRequest();
queryDatas.open('GET','datas');
queryDatas.onreadystatechange = function(){
  if((queryDatas.readyState > 3) && (queryDatas.status == 200)){
    parseResp(queryDatas.responseText);
  }
}
queryDatas.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
queryDatas.send();

function parseResp(resp){
  let favs = resp.split(/\n/g);
  let favsCleaned = [];
  for (i = 0; i < favs.length; i = (i+3) ) {
    favsCleaned.push({
      'title' : favs[i],
      'url' : favs[(i+1)]
    });
  }
  createHtml(favsCleaned);
}

function createHtml(fc){
  let main = document.querySelector('main');
  for (i = 0; i < fc.length; i++){
    let newItem = '';
    newItem += '<br>---';
    newItem += fc[i].title;
    newItem += '<br>';
    newItem += fc[i].url;
    main.insertAdjacentHTML('beforeend',newItem);
  }
}
