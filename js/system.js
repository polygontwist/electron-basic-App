"use strict";
/*
	Grundsetting mit laden/speichern der aktuellen Fensterposition und Größe (+Setting in Programmeinstellungen)
*/


const electron = require('electron');
const {remote} = electron;
const {dialog, BrowserWindow} = remote;
const fs = require('fs');


var electron_app=function(){
	var Programmeinstellungen={//als Einstellungen gespeichert
		windowsize:{x:0,y:0,width:0,height:0}
	};
	
	var appdata={
		userdokumente:"",
		pathData:"",
		ProgrammOrdner:"myElectronApp",
		DateinameOptionen:"optionen.json"
	}
	
	var zielNode;
	var app = require('electron').remote; 
	var path = require('path');
	path.join(__dirname, 'templates');
	//console.log(__dirname,path);

	//--basic--
	var gE=function(id){if(id=="")return undefined; else return document.getElementById(id);}
	var cE=function(z,e,id,cn){
		var newNode=document.createElement(e);
		if(id!=undefined && id!="")newNode.id=id;
		if(cn!=undefined && cn!="")newNode.className=cn;
		if(z)z.appendChild(newNode);
		return newNode;
	}
	var istClass=function(htmlNode,Classe){
		if(htmlNode!=undefined && htmlNode.className){
			var i,aClass=htmlNode.className.split(' ');
			for(i=0;i<aClass.length;i++){
					if(aClass[i]==Classe)return true;
			}	
		}		
		return false;
	}
	var addClass=function(htmlNode,Classe){	
		var newClass;
		if(htmlNode!=undefined){
			newClass=htmlNode.className;
			if(newClass==undefined || newClass=="")newClass=Classe;
			else
			if(!istClass(htmlNode,Classe))newClass+=' '+Classe;			
			htmlNode.className=newClass;
		}			
	}

	var subClass=function(htmlNode,Classe){
		var aClass,i;
		if(htmlNode!=undefined && htmlNode.className!=undefined){
			aClass=htmlNode.className.split(" ");	
			var newClass="";
			for(i=0;i<aClass.length;i++){
				if(aClass[i]!=Classe){
					if(newClass!="")newClass+=" ";
					newClass+=aClass[i];
					}
			}
			htmlNode.className=newClass;
		}
	}
	var delClass=function(htmlNode){
		if(htmlNode!=undefined) htmlNode.className="";		
	}
	var getClasses=function(htmlNode){return htmlNode.className;}
	
	//--electron--
	
	var getSettingsAtStart=function(){
		var r,optionen,property,
			win=remote.getCurrentWindow();
			
		if(fs.existsSync(appdata.pathData+appdata.DateinameOptionen)){
			r=fs.readFileSync(appdata.pathData+appdata.DateinameOptionen,'utf-8',"a");
			if(r!=""){
				optionen=JSON.parse(r);
				if(optionen.windowsize!=undefined){
					win.setPosition(optionen.windowsize.x,optionen.windowsize.y);
					if(optionen.windowsize.width>0 && optionen.windowsize.height>0)
						win.setSize(optionen.windowsize.width,optionen.windowsize.height);
				}
				//setings
				//gespeicherte Propertys anfügen/ersetzen
				for( property in optionen ) {
						Programmeinstellungen[property]=optionen[property];
				}
			}
		}
		else{
			console.log("keine Optionsdatei gefunden. "+appdata.pathData+appdata.DateinameOptionen);
		}
	}

	
	var saveSettings=function(){
		//asyncron
		fs.writeFile(
				appdata.pathData+appdata.DateinameOptionen, 
				JSON.stringify(Programmeinstellungen),
				'utf-8',
				statussaving
			);
	}	
	var statussaving=function(err){
		if(err){
			showDevTools(true);
			console.log("Fehler:",err);
		}
	}

	var showDevTools=function(b){
		var win=remote.getCurrentWindow();
		if(b===true)				
			win.webContents.openDevTools();
			else
			win.webContents.closeDevTools();			
	}
	
	//--basicsEvent--
	var EventResize=function(event){
		var win=remote.getCurrentWindow();
		var bereich=win.getBounds();// x: 279, y: 84, width: 1250, height: 640
		Programmeinstellungen.windowsize=bereich;
		saveSettings();
	}
	
	this.ini=function(zielid){
		//electron basisc ini
		var win=remote.getCurrentWindow();
		appdata.userdokumente=app.app.getPath('documents');// C:\Users\andreas\Documents 
		if(!fs.existsSync(appdata.userdokumente+"\\"+appdata.ProgrammOrdner)){			
			fs.mkdirSync(appdata.userdokumente+"\\"+appdata.ProgrammOrdner);		//create dir if not
		}
		appdata.pathData=appdata.userdokumente+"\\"+appdata.ProgrammOrdner+"\\";
		appdata.pathData=path.normalize(appdata.pathData);
		
		getSettingsAtStart();//SetWindowSize
		
		if(Programmeinstellungen.showDevTool===true){
			showDevTools(true);
		}

		win.on('move',EventResize);
		//http://electron.atom.io/docs/api/web-contents/
		window.addEventListener('resize',EventResize );
		
		//myProgramm
		zielNode=gE(zielid);
		zielNode.innerHTML="ready.";		
		
		CreateProgramm();
	}
		
	//--Programm--
		
	var CreateProgramm=function(){
		zielNode.innerHTML="Hallo.";
		
		showDevTools(true);
	}
	
	
}

//Start nach dem Laden
window.addEventListener('load', function (event) {
		var oProgramm_app;
		oProgramm_app=new electron_app();
		oProgramm_app.ini("myapplication");
	});
