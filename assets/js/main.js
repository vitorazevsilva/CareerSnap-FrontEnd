let _Token = null;
if (localStorage.getItem('Token'))
    _Token = localStorage.getItem('Token');
else if (sessionStorage.getItem('Token'))
    _Token = sessionStorage.getItem('Token');
else
    _Token = null;

$(document).ready(function() {
    $(":input").inputmask();
});