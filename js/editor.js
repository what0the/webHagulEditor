//made by what0the
﻿var korean = false; //한/영 상태 변수
var ACODE = 97; //A키 값(글자키 시작값)
var ACODE_FF = 65; //A키 값(FireFox)
var ifShift = false //Shift 상태 변수
var auto_state = true; //자동완성 on/off flag

var Jamo = new Array('ㅁ','ㅠ','ㅊ','ㅇ','ㄷ','ㄹ','ㅎ','ㅗ','ㅑ','ㅓ','ㅏ','ㅣ','ㅡ','ㅜ','ㅐ','ㅔ','ㅂ','ㄱ','ㄴ','ㅅ','ㅕ','ㅍ','ㅈ','ㅌ','ㅛ','ㅋ');

var InitValue = new Array(6,-1,14,11,3,5,18,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,2,9,-1,17,12,16,-1,15);
var MedialValue = new Array(-1,17,-1,-1,-1,-1,-1,8,2,4,0,20,18,13,1,5,-1,-1,-1,-1,6,-1,-1,-1,12,-1);
var FinalValue = new Array(16,-1,23,21,7,8,27,-1,-1,-1,-1,-1,-1,-1,-1,-1,17,1,4,19,-1,26,22,25,-1,24);

var ShiftJamo = new Array('ㅁ','ㅠ','ㅊ','ㅇ','ㄸ','ㄹ','ㅎ','ㅗ','ㅑ','ㅓ','ㅏ','ㅣ','ㅡ','ㅜ','ㅒ','ㅖ','ㅃ','ㄲ','ㄴ','ㅆ','ㅕ','ㅍ','ㅉ','ㅌ','ㅛ','ㅋ');

var ShiftIValue = new Array(6,-1,14,11,4,5,18,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,2,10,-1,17,13,16,-1,15);
var ShiftMValue = new Array(-1,17,-1,-1,-1,-1,-1,8,2,4,0,20,18,13,3,7,-1,-1,-1,-1,6,-1,-1,-1,12,-1);
var ShiftFValue = new Array(16,-1,23,21,-1,8,27,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,4,20,-1,26,-1,25,-1,24);

//자음모음 순서는 키 코드 순서.

var KOREAN = function(k,v,iv,mv,fv,is){
 this.keyCode = k;
 this.value = v;
 this.InitialValue = iv;
 this.MedialValue = mv;
 this.FinalValue = fv;
 this.ifShift = is;
 return this;
}

var Hunmin = new Array();
var SHunmin = new Array();

for( i=0; i<Jamo.length; i++){
 Hunmin.push(new KOREAN(i+ACODE,Jamo[i],InitValue[i],MedialValue[i],FinalValue[i],false));
 SHunmin.push(new KOREAN(i+ACODE,ShiftJamo[i],ShiftIValue[i],ShiftMValue[i],ShiftFValue[i],true));
}

/*
자/모음 => 키(숫자) : 글자(문자)
문자 자/모음 => 키(숫자) : 글자값(숫자)
*/


var setup = function(){
	ACODE = window.getSelection ? ACODE_FF : ACODE;
	Complete_list.load();
	Complete_list.refresh();
	autoSave.refresh();
	autoSave.exec();
}

var clickEvent = function(e,that){
	if(korean && curState.state){ //한글 입력모드 && 한글 입력중일 경우, 해제.
		curState.reset();
		cursManager.range_end(that);
	}
}

//ㅁ키보드 입력에 대해서 제어하는 부분(입력단계[C])
//box안에 포커스 되어있는 상태의 키보드 입력에 대해서만 처리.(글자키,alt키 처리)
var keyStroke = function(e,that){

	if(korean){
		if( ACODE <= e.keyCode && e.keyCode <= (ACODE+25) ){ //글자키 입력 : 입력 제한하고 typeCommander 이용
			ifShift = !!e.shiftKey;
			typeCommander(ifShift ? SHunmin[e.keyCode-ACODE] : Hunmin[e.keyCode-ACODE], that);
			e.preventDefault?e.preventDefault():(e.returnValue=false);
		}
		else if(e.keyCode == 16){ //shift키
			ifShift = true;
			e.preventDefault?e.preventDefault():(e.returnValue=false);
		}
		else{ //enter:13 //spacebar:32
			if(curState.state){ //한글 입력중일 경우, 해제.
				curState.reset();
				cursManager.range_end(that);
			}

			autoComplete();
			//#v1.2 스페이스바,엔터 처리하는 함수(autoComplete)가 들어갈 부분
		}
	}
	else{
		if(e.keyCode == 13 || e.keyCode == 32){
			autoComplete();
		}
	}
//나머지 키는 그대로.
}

var funcStroke = function(e){
	// console.log(e.keyCode);
 if( e.keyCode == 17 ){ //Ctrl키 입력 : 한/영전환
  korean = !korean;
  stateBox(korean); //한/영 css상태 최신화
 }
//  if( e.keyCode == 18 ){ //Alt키 입력 : 한/영전환
//   korean = !korean;
//   stateBox(korean); //한/영 css상태 최신화
//  }
}

var keyUp = function(e){
	if(e.keyCode == 16){ //shift키
		ifShift = false;
	}

}


//ㅁ키값을 한글로 변환하는 부분(중간단계[M])!!!!!!중요
//입력받은 값을 한글로 변환하는 변환기 : 입력받은 매개변수 갯수에 따라서 처리
var convert = function(){ //입력:KOREAN 객체 /출력:유니코드 or 한글 문자열
 if(arguments.length == 1){ //자음 or 모음만 입력될 때
  //자음모음,쌍자음,쌍모음까지 일대일 매칭하고 리턴
  return arguments[0].value;
 }
 var tmp = document.createElement('tmp');
 tmp.innerHTML = "&#"+(arguments[0].InitialValue*588 + arguments[1].MedialValue*28 + (arguments[2] ? arguments[2].FinalValue : 0) + 44032) + ";";
 return (tmp.innerText ? tmp.innerText : tmp.textContent);
}
//커서 제어 및 통제[C]
/*
하나의 글자가 완성되기 전까지 현재 상태를 저장하고, 다음 임력으로 인해 하나의 문자가 이루어지면 커서를 바꾸면서
새로운 현재상태를 저장.
*/
var typeCommander = function(k,that){
	//입력값 KOREAN객체로 받기
	//현재 입력 상태에 따라서 글자 처리
	var result = curState.update(k); //글자 결과값 (STRING형태)
	//변동사항을 프론트에 업데이트(커서,입력 문자값)
	//-현재 커서 상태에 따라서 위치 파악(범위 or 그냥 커서)
	//-범위일 경우, 범위 안의 내용을 result 변수값으로.
	//--이후 커서 위치 및 상태는 입력상태변수에 따라서 처리.
	//-범위가 아닐경우, 현재 위치에 result값을 추가하고 추가한 값을 범위지정.
	if(curState.state){
		cursManager.paste_ing(result,that);
	}
	else{
		cursManager.paste_end(result,that);
	}
	//전부 처리 완료 후, 커서 제어기의 상태 업데이트.(이벤트에 추가하지만, 다시 확인하는 차원에서.)
}

//ㅁ텍스트 현재 입력상태[M]
var curState = {
	"Init" : -1, //없음(= -1)
	"Medi" : -1,
	"Final" : -1,
	"state" : 0, //(입력없음 상태 ,초성 입력상태 ,중성 입력상태 ,종성 입력상태)
	"word" : "",
	"reset" : function(){
		this.Init = -1;
		this.Medi = -1;
		this.Final = -1;
		this.state = 0;
		this.word = "";
	},
	"update" : function(k){ //현재 상태 갱신. 입력:KOREAN객체 출력:업데이트된 문자(새로운 문자가 생길경우 포함해서 출력)
		var ornState = this.state; //최초 상태값
		var lastValue; //과거 문자값(String형태)
		var rstValue;
		if(ornState == 0){//입력 없음 상태
			if(k.InitialValue >= 0){
				this.Init = k;
				this.state = 1;
			}
			else{ //기본적으로 키보드 자판으로 치는건 자음/모음이며, 이는 초성과 중성으로 구분이 가능하다.
				this.Medi = k;
				this.state = 0;
			}
			rstValue = convert(k);
		}
		else if(ornState == 1){//초성 입력 상태
			if(k.MedialValue >= 0){
				this.Medi = k;
				this.state = 2;
				rstValue = convert(this.Init,this.Medi);
			}
			else{
				lastValue = convert(this.Init);
				this.reset();
				this.Init = k;
				this.state = 1;
				rstValue = convert(k);
			}
		}
		else if(ornState == 2){//중성 입력 상태
			if(k.MedialValue >=0){
				if(this.Medi.value == 'ㅗ'){
					if(k.value == 'ㅏ'){
						this.Medi = new KOREAN(null,'ㅘ',-1,9,-1,false);
						rstValue = convert(this.Init, this.Medi);
					}
					else if(k.value == 'ㅐ'){
						this.Medi = new KOREAN(null,'ㅙ',-1,10,-1,false);
						rstValue = convert(this.Init, this.Medi);
					}
					else if(k.value == 'ㅣ'){
						this.Medi = new KOREAN(null,'ㅚ',-1,11,-1,false);
						rstValue = convert(this.Init, this.Medi);
					}
					else{ //중성일 경우
						lastValue = convert(this.Init, this.Medi);
						this.reset();
						this.Medi = k;
						this.state = 0;
						rstValue = convert(k);
					}
				}
				else if(this.Medi.value == 'ㅜ'){
					if(k.value == 'ㅓ'){
						this.Medi = new KOREAN(null,'ㅝ',-1,14,-1,false);
						rstValue = convert(this.Init, this.Medi);
					}
					else if(k.value == 'ㅔ'){
						this.Medi = new KOREAN(null,'ㅞ',-1,15,-1,false);
						rstValue = convert(this.Init, this.Medi);
					}
					else if(k.value == 'ㅣ'){
						this.Medi = new KOREAN(null,'ㅟ',-1,16,-1,false);
						rstValue = convert(this.Init, this.Medi);
					}
					else{ //중성일 경우
						lastValue = convert(this.Init, this.Medi);
						this.reset();
						this.Medi = k;
						this.state = 0;
						rstValue = convert(k);
					}
				}
				else if(this.Medi.value == 'ㅡ'){
					if(k.value == 'ㅣ'){
						this.Medi = new KOREAN(null,'ㅢ',-1,19,-1,false);
						rstValue = convert(this.Init, this.Medi);
					}
					else{ //중성일 경우
						lastValue = convert(this.Init, this.Medi);
						this.reset();
						this.Medi = k;
						this.state = 0;
						rstValue = convert(k);
					}
				}
				else{ //중성일 경우
					lastValue = convert(this.Init, this.Medi);
					this.reset();
					this.Medi = k;
					this.state = 0;
					rstValue = convert(k);
				}
			}
			else if(k.FinalValue >=0){
				this.Final = k;
				this.state = 3;
				rstValue = convert(this.Init, this.Medi, this.Final);
			}
			else{ //초성일 경우,,, 중성과 종성일 경우는 앞에서 처리함
				lastValue = convert(this.Init, this.Medi);
				this.reset();
				this.Init = k;
				this.state = 1;
				rstValue = convert(k);
			}
		}
		else if(ornState == 3){//종성 입력 상태
			//이중 종성
			if(k.FinalValue >= 0 && this.Final.FinalValue >= 0){
				if(this.Final.value == 'ㄱ' && k.value == 'ㅅ'){
					this.Final = new KOREAN(null,'ㄳ',-1,-1,3,false);
					rstValue = convert(this.Init, this.Medi, this.Final);
				}
				else if(this.Final.value == 'ㄴ' && k.value == 'ㅈ'){
					this.Final = new KOREAN(null,'ㄵ',-1,-1,5,false);
					rstValue = convert(this.Init, this.Medi, this.Final);
				}
				else if(this.Final.value == 'ㄴ' && k.value == 'ㅎ'){
					this.Final = new KOREAN(null,'ㄶ',-1,-1,6,false);
					rstValue = convert(this.Init, this.Medi, this.Final);
				}
				else if(this.Final.value == 'ㄹ' && k.value == 'ㄱ'){
					this.Final = new KOREAN(null,'ㄺ',-1,-1,9,false);
					rstValue = convert(this.Init, this.Medi, this.Final);
				}
				else if(this.Final.value == 'ㄹ' && k.value == 'ㅁ'){
					this.Final = new KOREAN(null,'ㄻ',-1,-1,10,false);
					rstValue = convert(this.Init, this.Medi, this.Final);
				}
				else if(this.Final.value == 'ㄹ' && k.value == 'ㅂ'){
					this.Final = new KOREAN(null,'ㄼ',-1,-1,11,false);
					rstValue = convert(this.Init, this.Medi, this.Final);
				}
				else if(this.Final.value == 'ㄹ' && k.value == 'ㅅ'){
					this.Final = new KOREAN(null,'ㄽ',-1,-1,12,false);
					rstValue = convert(this.Init, this.Medi, this.Final);
				}
				else if(this.Final.value == 'ㄹ' && k.value == 'ㅌ'){
					this.Final = new KOREAN(null,'ㄾ',-1,-1,13,false);
					rstValue = convert(this.Init, this.Medi, this.Final);
				}
				else if(this.Final.value == 'ㄹ' && k.value == 'ㅍ'){
					this.Final = new KOREAN(null,'ㄿ',-1,-1,14,false);
					rstValue = convert(this.Init, this.Medi, this.Final);
				}
				else if(this.Final.value == 'ㄹ' && k.value == 'ㅎ'){
					this.Final = new KOREAN(null,'ㅀ',-1,-1,15,false);
					rstValue = convert(this.Init, this.Medi, this.Final);
				}
				else if(this.Final.value == 'ㅂ' && k.value == 'ㅅ'){
					this.Final = new KOREAN(null,'ㅄ',-1,-1,18,false);
					rstValue = convert(this.Init, this.Medi, this.Final);
				}
				else{ //이중종성이 아닌 종성은 다음글자 초성으로.
					lastValue = convert(this.Init, this.Medi, this.Final);
					this.reset();
					this.Init = k;
					this.state = 1;
					rstValue = convert(k);
				}
			}
			else if(k.InitialValue >=0){ //위에서 안걸러진 초성들.
				lastValue = convert(this.Init, this.Medi, this.Final);
				this.reset();
				this.Init = k;
				this.state = 1;
				rstValue = convert(k);
			}
			else if(k.MedialValue >=0){
				if(this.Final.value == 'ㄳ'){
					lastValue = convert(this.Init, this.Medi, Hunmin[17]);
					this.reset();
					this.Init = Hunmin[19];
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
				else if(this.Final.value == 'ㄵ'){
					lastValue = convert(this.Init, this.Medi, Hunmin[18]);
					this.reset();
					this.Init = Hunmin[22];
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
				else if(this.Final.value == 'ㄶ'){
					lastValue = convert(this.Init, this.Medi, Hunmin[18]);
					this.reset();
					this.Init = Hunmin[6];
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
				else if(this.Final.value == 'ㄺ'){
					lastValue = convert(this.Init, this.Medi, Hunmin[5]);
					this.reset();
					this.Init = Hunmin[17];
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
				else if(this.Final.value == 'ㄻ'){
					lastValue = convert(this.Init, this.Medi, Hunmin[5]);
					this.reset();
					this.Init = Hunmin[0];
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
				else if(this.Final.value == 'ㄼ'){
					lastValue = convert(this.Init, this.Medi, Hunmin[5]);
					this.reset();
					this.Init = Hunmin[16];
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
				else if(this.Final.value == 'ㄽ'){
					lastValue = convert(this.Init, this.Medi, Hunmin[5]);
					this.reset();
					this.Init = Hunmin[19];
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
				else if(this.Final.value == 'ㄾ'){
					lastValue = convert(this.Init, this.Medi, Hunmin[5]);
					this.reset();
					this.Init = Hunmin[23];
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
				else if(this.Final.value == 'ㄿ'){
					lastValue = convert(this.Init, this.Medi, Hunmin[5]);
					this.reset();
					this.Init = Hunmin[21];
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
				else if(this.Final.value == 'ㅀ'){
					lastValue = convert(this.Init, this.Medi, Hunmin[5]);
					this.reset();
					this.Init = Hunmin[6];
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
				else if(this.Final.value == 'ㅄ'){
					lastValue = convert(this.Init, this.Medi, Hunmin[16]);
					this.reset();
					this.Init = Hunmin[19];
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
				else{
					lastValue = convert(this.Init, this.Medi);
					var tmp = this.Final;
					this.reset();
					this.Init = tmp;
					this.Medi = k;
					this.state = 2;
					rstValue = convert(this.Init, this.Medi);
				}
			}
			//나머진 다음글자로..
		}
		this.word = lastValue ? (lastValue+rstValue) : rstValue;
		return this.word;
	}
};



//ㅁ커서 제어기[C]
//각종 이벤트 혹은 현재 입력상태에 따른 커서 상태 관리, 현재 입력상태 관리 및 입력 관리
var cursManager = {
	"isRange" : false, //단일커서-범위지정 상태 변수
	"paste_ing" : function(txt,that){
		console.log('paste_ing 실행');
		var element = that;
		//기존에 범위가 없을 경우 : 입력한 부분을 범위로 지정.
		if(element.selectionStart == element.selectionEnd){
			element.setRangeText(txt);
			element.selectionEnd = element.selectionEnd + 1;
		}
		else{//기존에 범위가 있을 경우
			element.setRangeText(txt);
			if(txt.length > 1){
			element.selectionStart = element.selectionEnd - 1;
			}
		}
		this.isRange = true;
	},
	"paste_end" : function(txt,that){
		console.log('paste_end 실행');
		var element = that;
		element.setRangeText(txt);
		if(txt.length > 1){
			element.selectionStart = element.selectionEnd;
		}
		else{
			element.selectionEnd++;
			element.selectionStart = element.selectionEnd;
		}
		this.isRange = false;
	},
	"range_end" : function(that){
		var element = that;
		element.selectionStart = element.selectionEnd;
		this.isRange = false;
	}
};
