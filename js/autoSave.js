//made by what0the
//new Date(Date.now()).toLocaleFormat(); <-표준이 아니므로 toLocaleString()사용.

var autoSave = {
	"list" : ["","","","","",""],//[30초전,1분전,1분30초전,2분전,2분30초전,3분전]
	"time" : ["","","","","",""],
	"ID_time" : "[AUSV]_T",
	"ID_list" : "[AUSV]_L",
	"exec" : function(){
		var el = document.getElementById('editbox');
		this.sec_ctrl = setInterval(function(){

			for(var i=5; i>0; i--){
				autoSave.list[i] = autoSave.list[i-1];
				autoSave.time[i] = autoSave.time[i-1];
			}
			autoSave.list[0] = el.value;
			autoSave.time[0] = new Date(Date.now()).toLocaleString();

			autoSave.local_save();
			autoSave.refresh();
		},30000); //30sec
	},
	"sec_ctrl" : "",
	"min_ctrl" : "",
	"refresh" : function(){
		var el = document.getElementById("autoSave_list");
		var txt = "";
		var list = this.list;
		var time = this.time;

		this.local_load();
		if(list[0]){
			txt += "<tr><td onclick='autoSave.load(0);' class='list'>30초 전 - "+ time[0] +"</td></tr>";
		}

		for(var i=1; i<6; i +=2){
			if(list[i]){
				txt += "<tr><td onclick='autoSave.load("+ i +");' class='list'>"+ (Number.parseInt(i/2)+1) +"분 전 - "+ time[i] +"</td></tr>";
			}
		}

		el.innerHTML = txt;
	},
	"load" : function(num){
		var el = document.getElementById('editbox');
		el.value = this.list[num];
	},
	"local_save" : function(){
		var list = this.list;
		var time = this.time;

		for(var i=0; i<this.list.length; i++){
			localStorage.setItem(this.ID_time + i , time[i]);
			localStorage.setItem(this.ID_list + i , list[i]);
		}
	},
	"local_load" : function(){
		var list = this.list;
		var time = this.time;
		var ID_list = this.ID_list;
		var ID_time = this.ID_time;

		for(var i=0; i<localStorage.length; i++){
			var k = localStorage.key(i);
			if(k.startsWith(ID_list)){
				var v = localStorage.getItem(k);
				k = k.substr(ID_list.length,1);
				list[k] = v;
			}
			else if(k.startsWith(ID_time)){
				var v = localStorage.getItem(k);
				k = k.substr(ID_time.length,1);
				time[k] = v;
			}
		}
	}
}
