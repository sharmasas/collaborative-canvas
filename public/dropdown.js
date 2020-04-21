/* DROPDOWN, used website as reference: https://www.w3schools.com/howto/howto_js_dropdown.asp */

/*toggle dropdown*/
function dropdownToggle() {
  document.getElementById("ProjectDropdown").classList.toggle("show");
}

/* close dropdown if user clicks outside*/
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
