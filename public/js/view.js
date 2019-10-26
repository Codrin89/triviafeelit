var Config = {}

Config.getUrl = function() {
  return 'https://feelittrivia.herokuapp.com';
}

var XHR = {}

XHR.setCallback = function(callback) {
    this.xhttp = new XMLHttpRequest();
    var _self = this;
    this.xhttp.onreadystatechange = function() {
      if (_self.xhttp.readyState == 4 && _self.xhttp.status >= 200 && _self.xhttp.status <= 299) {
          console.log(_self);
        callback(_self.xhttp.responseText);
      }
    };
  }


XHR.GET = function(path, callback) {
    this.xhttp.open("GET", "https://cors-anywhere.herokuapp.com/" + Config.getUrl() + path, true);
    this.xhttp.setRequestHeader("X-Parse-Application-Id", "feelittrivia");
    this.xhttp.setRequestHeader("Content-type", "application/json");
    this.xhttp.send();
}

var ParseRequest = {};

ParseRequest.getData = function() {
    XHR.setCallback(function(response){
        data = JSON.parse(response).results;
        for(let i = 0; i < data.length; i++) {
            formTableOfResults(data[i]);
        }
    });
    XHR.GET('/parse/classes/UsersDataResult');
}

ParseRequest.getData();

function formTableOfResults(data) {
    let markup = '<div class="row">';
    const keys = Object.keys(data);
    for(var i = 0; i < keys.length; i++) {
        markup += '<div class="column">' + data[keys[i]] + '</div>';
    }
    markup += '</div>';
    document.getElementById('view-list').innerHTML += markup;
}