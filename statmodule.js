localStorageElt = document.getElementById('local-storage');

var localStorageSpace = function(){
    var allStrings = '';
    for(var key in window.localStorage){
        if(window.localStorage.hasOwnProperty(key)){
            allStrings += window.localStorage[key];
        }
    }
    return allStrings ? 3 + ((allStrings.length*16)/(8*1024)) + ' KB' : 'Empty (0 KB)';
};

try {
    localStorageSpace();
    localStorageElt.innerHTML = localStorageSpace();
}
catch {
    localStorageElt.innerHTML = "DISABLED BY BROWSER";
}
