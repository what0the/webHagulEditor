//made by what0the
var stateBox = function(state){
	var el = document.getElementById("state");
	// var msg = document.getElementById("msg");
	if(state){//한글
		el.style.backgroundColor = "#0080ff";
		el.style.borderColor = "#0080ff";
		el.innerHTML = "한글";
		// msg.style.display = "inline";
	}
	else{//영문
		el.style.backgroundColor = "ff80aa";
		el.style.borderColor = "ff80aa";
		el.innerHTML = "영문";
		// msg.style.display = "none";
	}
}

var auto_state = true; //자동완성 on/off flag

var autoComp_st = function(that){
	if(auto_state){
		that.classList.remove('auto_on');
		that.classList.add('auto_off');
		that.innerHTML = "OFF";
		auto_state = false;
	}
	else{
		that.classList.remove('auto_off');
		that.classList.add('auto_on');
		that.innerHTML = "ON";
		auto_state = true;
	}
}

var show_laidPopup = function(){
	document.getElementById("laidPopup").style.display="block";
}

var hide_laidPopup = function(){
	document.getElementById("laidPopup").style.display="none";
}
