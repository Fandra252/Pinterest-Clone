document.getElementById("two").onclick=function(){
    document.getElementById("two").style.pointerEvents="none";
    document.getElementById("two").style.opacity="0.5";
    document.querySelector(".responsive-search-bar").style.top="0px";
  }
  document.querySelector(".close").onclick=function(){
    document.getElementById("two").style.pointerEvents="auto";
    document.getElementById("two").style.opacity="1";
    document.querySelector(".responsive-search-bar").style.top="-300px";
  }

  