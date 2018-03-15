//++ auto complete List ++
//made by what0the

//auto complete list 객체
var autoComplete = function(){

	if(!auto_state){
		return;
	}
	//뒤에서부터 다음 ' '혹은 '/r' 혹은 '/n'이 나올때까지 돌리기
	var el = document.getElementById('editbox');
	var untilSel = el.value.substr(0,el.selectionEnd); //커서 바로앞에 문자열
	var lastSpace = el.value.substr(0,el.selectionEnd-1).lastIndexOf(' '); //마지막 스페이스바 위치
	var lastEnter = el.value.substr(0,el.selectionEnd-1).lastIndexOf('\n'); //마지막 엔터 위치
	var last0 = lastSpace>lastEnter?lastSpace:lastEnter; //마지막 엔터/스페이스바 위치

	var kw = untilSel.substr(last0+1); //단어. keyword

	for(var i in Complete_list['dic']){
		if(i.length == kw.length && kw == i){
			el.selectionStart = last0+1;
			el.setRangeText(Complete_list['dic'][i]);
			el.selectionStart = el.selectionEnd;
		}
	}

//temp0.value.substr(0,temp0.selectionEnd-1).substr(temp0.value.substr(0,temp0.selectionEnd-2).lastIndexOf(' ')+1)

}

var Complete_list = { //localStorage 에 들어가는 값은 해당하는 분류를 키값 앞에 _로 구분하여 저장.
	'dic' : {
	},
	'length' : 0,
	'ID' : '[COMP]_',
	'push' : function(k,v){
		if(!localStorage){
			alert("Sorry I'dont support your web browser");
			return;
		}

		k = k.toString();
		v = v.toString();

		if(this['dic'][k] != undefined){
			this.length++;
		}

		this['dic'][k] = v;
		k = this.ID + k;
		localStorage.setItem(k,v);
	},
	'pop' : function(k){
		if(!localStorage){
			alert("Sorry I'dont support your web browser");
			return;
		}
		delete this['dic'][k];

		this.length--;

		k = this.ID + k;
		localStorage.removeItem(k);
	},
	'load' : function(){ //로컬저장소로부터 불러오기
		var k = "";
		var v = "";

		delete this.dic;
		this.dic = new Object();
		this.length = 0;

		for(var i=0; i<localStorage.length; i++){
			k = localStorage.key(i);
			if(k.startsWith(this.ID)){
				v = localStorage.getItem(k);
				k = k.substr(this.ID.length);
				this.length++;
				this['dic'][k] = v;
			}
		}
	},
	'refresh' : function(){
		var el = document.getElementById("popup_list");
		var txt = ""; //el에 innerHTML로 넣을 text
		var k = "";
		var v = "";
		for(var i in this.dic){
			k = i;
			v = this.dic[i];
			txt += "<tr class='list_line'><td class='list_1'>"+ k +"</td><td>-></td><td class='list_2'>";
			k = '"'+k+'"';
			txt += v +"</td><td class='list_3'><input type='button' class='btn del_autoList' onClick='del_list("+ k +")'";
			txt += "value='삭제''></td></tr>";
		}
		el.innerHTML = txt;
	}
}

//load list : 리스트를 불러와서 테이블로 뿌리기

//save list : 리스트를 수정해서 local Storage에 저장(버튼 눌러서 변경 생길시 사용.)

var del_list = function(k){//삭제버튼
	Complete_list.pop(k);
	Complete_list.refresh();
}

var add_list = function(){//추가버튼
	var cmd = document.getElementById("cmd");
	Complete_list.push(cmd.in_1.value, cmd.in_2.value);
	cmd.in_1.value = "";
	cmd.in_2.value = "";
	cmd.in_1.focus();
	Complete_list.refresh();
}

var autoComp_evt = function(e){
	if(e.keyCode == 13){
		add_list();
	}
}
