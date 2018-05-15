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
  for (i = 0; i + 1 < favs.length; i = (i+3) ) {


      let urlArray = favs[(i+1)].split('/');
      let siteName = '';
      if(urlArray[2]!= 'feedproxy.google.com'){
        siteName = urlArray[2];
      }else{
        siteName = urlArray[4];
      }

      favsCleaned.push({
        'title' : favs[i],
        'url' : favs[(i+1)],
        'sitename' : siteName
      });

  }
  createHtml(favsCleaned);
}

function createHtml(fc){
  let main = document.querySelector('main');
  for (i = 0; i < fc.length; i++){
    if(fc[i].url){
      let newItem = '';
      newItem += '<a href="';
      newItem += fc[i].url;
      newItem += '">';
      newItem += '<div class="img"><img id="img_' + i + '" src="icon.svg" /></div>';
      newItem += '<div class="text"><p class="site-name">' + fc[i].sitename + '</p><p class="title">' + fc[i].title + '</p></div>';
      newItem += '</a>';
      main.insertAdjacentHTML('beforeend',newItem);
      fetchIcon(i, fc[i].url);
    }
  }
}

function fetchIcon(i, url){
  let urlArray = url.split('/');
  let urlFavicon = urlArray[0] + '//' + urlArray[2] + '/favicon.ico';
  let img = new Image();
  img.onload = function(){
    let selector = '#img_' + i;
    document.querySelector(selector).src = urlFavicon;
  }
  img.src = urlFavicon;
}

let searchField = document.querySelector('#search');
searchField.value = '';

function searchIn(){
  let titles = document.querySelectorAll('.title');
  // console.log(titles);
  for(i = 0; i < titles.length; i++){
    if(titles[i].innerHTML.indexOf(this.value) > 0){
      titles[i].parentNode.parentNode.style.display = 'inherit';
    }else{
      titles[i].parentNode.parentNode.style.display = 'none';
    }
  }
  if(!this.value){
    let links = document.querySelectorAll('main a');
    for(i = 0; i < titles.length; i++){
      links[i].style.display = 'inherit';
    }
  }
}

searchField.addEventListener('keyup', searchIn);
