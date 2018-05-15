let queryDatas = new XMLHttpRequest();
queryDatas.open('GET','datas');
queryDatas.onreadystatechange = function(){
  if((queryDatas.readyState > 3) && (queryDatas.status == 200)){
    parseResp(queryDatas.responseText);
  }
}
queryDatas.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
queryDatas.send();

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function parseResp(resp){
  let favs = resp.split(/\n/g);
  document.querySelector('.total').innerHTML = ((favs.length - 1) / 3);
  document.querySelector('.showed').innerHTML = ((favs.length - 1) / 3);
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
  favsCleaned = shuffle(favsCleaned);
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let searchField = document.querySelector('#search');
searchField.value = '';
function searchIn(){
  let titles = document.querySelectorAll('.title');
  // console.log(titles);
  let y = 0;
  for(i = 0; i < titles.length; i++){
    let raw = titles[i].innerHTML.indexOf(this.value);
    let uppercase = titles[i].innerHTML.indexOf(this.value.toUpperCase());
    let lowercase = titles[i].innerHTML.indexOf(this.value.toLowerCase());
    let firstLetter = titles[i].innerHTML.indexOf(capitalizeFirstLetter(this.value));
    if((raw >= 0) || (uppercase >= 0) || (lowercase >= 0) || (firstLetter >= 0)){
      titles[i].parentNode.parentNode.style.display = 'inherit';
      y++;
    }else{
      titles[i].parentNode.parentNode.style.display = 'none';
    }
  }
  if(!this.value){
    let links = document.querySelectorAll('main a');
    for(i = 0; i < titles.length; i++){
      links[i].style.display = 'inherit';
    }
    y = titles.length;
  }
  document.querySelector('.showed').innerHTML = y;
}

searchField.addEventListener('keyup', searchIn);
searchField.focus();
