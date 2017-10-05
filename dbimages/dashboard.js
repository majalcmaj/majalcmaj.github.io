/* Code by David N Brown. Copyright 2006. Version 1.02.00 BETA - 15 Feb 2006.

This code is provided free of charge and without warranty of any kind. You use it at
your own risk. You are free to modify the code as you wish but be aware that in doing
so you will not be able to easily upgrade as the author introduces new features and
functions.

This code will not work without the required variables being set first in the calling
html page and the required graphic files being available in the appropriate directory.
Full instructions were provided with this file in its original zip archive.

Please leave this notice intact and unmodified.  */

var mod = 1000;
var fst = "position:relative; cursor:pointer; ";
var tds = "font-family: Verdana,Arial,Helvetica; font-size: 9px; color: #000055; "

function dohums(tit,id,eid,size,data){

 if(size == "large"){ 
  tgd="<div id='"+id+"' style='"+fst+"width:90px;'><img src='dbimages/humidl.gif'></div>";
  factor=1;
  bottom=375;
 }else{ 
  tgd="<div id='"+id+"' style='"+fst+"width:90px;'><img src='dbimages/humids.gif'></div>";
  factor=2;
  bottom=195;
 } 
 
 eid.parentNode.innerHTML=tgd;
 eid=document.getElementById(id);
 scale=3.6/factor;
 maxm=100; 
 val=parseFloat(data[0]);
 t=parseInt(((maxm-val)*scale)+16);
 b=(bottom-t)+1;
 var jg=new jsGraphics(id);
 jg.setColor(HumColor || "#A0C4E7");
 
 mo = new Array()
 c = 0;
 
 if(!isNaN(t)){
  jg.fillRect(50,t,15,b);
  mo[c]="Aktualnie:"+parseFloat(data[0])+" %";
 }
 else mo[c]="Aktualnie: Nie występuje";
 c++;

 if(data[1]){
  jg.setColor("#0000FF");
  val=parseFloat(data[1]);
  t=parseInt(((maxm-val)*scale)+16);
  if(!isNaN(t)){
   jg.drawLine(43,t,72,t);
   mo[c]="Min dzisiaj:"+parseFloat(data[1])+" %";
   c++
  }
 }
 
 if(data[2]){
  jg.setColor("#FF0000");
  val=parseFloat(data[2]);
  t=parseInt(((maxm-val)*scale)+16);
  if(!isNaN(t)){
   jg.drawLine(43,t,72,t);
   mo[c]="Max dzisiaj:"+parseFloat(data[2])+" %";
   c++;
  }
 }
  
 if(data[3]){
  jg.drawImage('dbimages/'+data[3]+'.gif',53,bottom-33,9,29);
  mo[c]="Tendencja: "+data[3];
 }
 
 jg.paint();
 eid.title="entete=["+tit+" (%)] body=["+getmo(mo)+"] delay=["+mod+"]";
}

function dotemps(tit,id,eid,size,data){
 if(size=="large"){ 
  tgd="<div id='"+id+"' style='"+fst+"width:90px;'><img src='dbimages/thermol.gif'></div>";
  factor=1;
  bottom=375;
 }else{ 
  tgd="<div id='"+id+"' style='"+fst+"width:90px;'><img src='dbimages/thermos.gif'></div>";
  factor=2;
  bottom=195;
 } 
 
 eid.parentNode.innerHTML=tgd;
 eid=document.getElementById(id);
 
 tu = tempunits.replace("&#176;","°");
 
 if(tu.indexOf("C")>-1){
  scale=3.6/factor;maxm=60;
 }else{
  scale=2/factor;maxm=140;
 }
 
 valnow=parseFloat(data[0]);
 t=parseInt(((maxm-valnow)*scale)+16);b=(bottom-t)+1;l=31;r=60;
 var jg=new jsGraphics(id);
 jg.setColor(TempColor || "#A0C4E7");
 
 mo = new Array()
 c = 0;
 
 if(!isNaN(t)){
  jg.fillRect(38,t,15,b);
  mo[c]="Aktualnie:"+valnow+" "+tu;
 }
 else mo[c]="Aktualnie: nie występuje";
 c++;
 
 if(data[1]){
  jg.setColor("#0000FF");
  val=parseFloat(data[1]);
  t=parseInt(((maxm-val)*scale)+16);
  if(!isNaN(t))jg.drawLine(l,t,r,t);
  mo[c]="Min dzisiaj:"+val+" "+tu;
  c++;
 }
 
 if(data[2]){
  jg.setColor("#FF0000");
  val=parseFloat(data[2]);
  t=parseInt(((maxm-val)*scale)+16);
  if(!isNaN(t))jg.drawLine(l,t,r,t);
  mo[c]="Max dzisiaj:"+val+" "+tu;
  c++;
 }
  
 if(data[3]){
  jg.drawImage('dbimages/'+data[4]+'.gif',41,bottom-33,9,29);
  mo[c]="Tendencja:"+data[3];
 }
 
 jg.paint();
 eid.title="entete=["+tit+" ("+tempunits+")] body=["+getmo(mo)+"] delay=["+mod+"]";
}

function getmo(mot){
 st = "";
 st += "<table cellpadding=3 cellspacing=0 border=0 style='"+tds+"'>";
 for (j=0;j<mot.length;j++){
  st += "<tr><td align=right style='"+tds+"'>";
  st += mot[j].substring(0,mot[j].indexOf(":")+1);
  st += "</td><td align=left style='"+tds+"'>";
  st += mot[j].substring(mot[j].indexOf(":")+1);
  st += "</td></tr>";
 }
 st += "</table>";
 return st;
}

function getpixel(midx,midy,speed,degrees,factor){
 ret=new Array();
 x=midx;
 y=midy;
 dia=(parseFloat(speed)/factor)*2;
 point=parseInt(degrees);
 angle=((90-point)*(2*Math.PI))/360;
 xx=parseInt(Math.round(Math.cos(angle)*dia));
 ret[0]=x+xx;
 yy=parseInt(Math.round(Math.sin(angle)*dia));
 ret[1]=y-yy;
 return(ret);
}

function dobar(type){
 if(type=="analog"){
  abtc=AnalogBaroTextColor;abnc=AnalogBaroNeedleColor;
  tgd="<div id='barometer' style='"+fst+"width:220px; height:180px;'><img src='dbimages/barometer2.gif'></div>";
  document.getElementById("barometer").parentNode.innerHTML=tgd;
  var jg=new jsGraphics("barometer");
  jg.drawImage('dbimages/'+bardata[5]+'.gif',70,97,9,29);
  // do 'current' needle
  val=0;
  if(parseFloat(bardata[0])<100){
   val=Math.ceil(bardata[0]/0.029528750668088)-565;
  }else{
   val=parseInt(bardata[0])-565;
  }
  to=getpixel(110,110,63,val,2);
   jg.setColor(abnc || "#000000"); // BLACK default unless set in html page
  jg.setStroke(2);
  jg.drawLine(110,110,to[0],to[1]);
  jg.drawEllipse(103,103,14,14);
 // do 'Max' needle
    val=0;
  if(parseFloat(bardata[3])<100){
   val=Math.ceil(bardata[3]/0.029528750668088)-565;
  }else{
   val=parseInt(bardata[3])-565;
  }
  to=getpixel(110,110,55,val,2);
  jg.setColor("#FF0000"); // RED
  jg.drawLine(110,110,to[0],to[1]);
  // do 'Min' needle
    val=0;
  if(parseFloat(bardata[4])<100){
   val=Math.ceil(bardata[4]/0.029528750668088)-565;
  }else{
   val=parseInt(bardata[4])-565;
  }
  to=getpixel(110,110,55,val,2);
  jg.setColor("#0000FF"); // BLUE
  jg.drawLine(110,110,to[0],to[1]);
  
  jg.setColor("#999999");
  jg.fillEllipse(105,105,12,12);
  jg.setColor("#999999");jg.fillEllipse(105,105,12,12);
  jg.setFont("verdana","9px",Font.PLAIN);
  jg.setColor(abtc || "#555555");
  jg.drawStringRect("Aktualnie: "+parseFloat(bardata[0]),60,138,100,"center")
  jg.setFont("verdana","9px",Font.PLAIN);
  jg.setColor(abtc || "#555555");
  jg.drawStringRect("Max: "+parseFloat(bardata[3]),60,150,100,"center")
  jg.setFont("verdana","9px",Font.PLAIN);
  jg.setColor(abtc || "#555555");
  jg.drawStringRect("Min: "+parseFloat(bardata[4]),60,162,100,"center")
  mo[0]="Aktualnie:"+bardata[0]+" "+bardata[1];
  mo[1]="Max auj:"+parseFloat(bardata[3])+" "+bardata[1];
  mo[2]="Min auj:"+parseFloat(bardata[4])+" "+bardata[1];
  mo[3]="Tendencja:"+bardata[2];
  document.getElementById("barometer").title="entete=[Baromètre ("+bardata[1]+")] body=["+getmo(mo)+"] delay=["+mod+"]";
 }else{
  w=90; 
  h=100;
  tgd="<div id='barometer' style='"+fst+"width:"+w+"px; height:"+h+"px;'></div>";
  document.getElementById("barometer").parentNode.innerHTML=tgd;
  var jg=new jsGraphics("barometer");
  jg.setColor("#AAAAAA");
  jg.fillRect(0,0,w,h);
  jg.setColor("#DDDDDD");
  jg.fillRect(5,5,w-10,23);
  jg.setColor("#FEFEFE");
  jg.drawLine(0,0,w,0);
  jg.setColor("#FEFEFE");
  jg.drawLine(0,0,0,h);
  jg.setColor("#000000");
  jg.drawLine(1,h,w,h);
  jg.setColor("#000000");
  jg.drawLine(w,h,w,1);
  jg.setColor("#FEFEFE");
  jg.drawLine(5,28,w-5,28);
  jg.setColor("#FEFEFE");
  jg.drawLine(w-5,5,w-5,28);
  jg.setColor("#000000");
  jg.drawLine(5,5,w-5,5);
  jg.setColor("#000000");
  jg.drawLine(5,5,5,28);
  jg.setFont("verdana","18px",Font.BOLD);
  jg.setColor("#000000");
  jg.drawStringRect(bardata[0],5,5,w-10,"center");
  jg.setFont("verdana","9px",Font.PLAIN);
  jg.setColor("#FFFFFF");
  jg.drawStringRect(bardata[1],5,36,70,"left");
  jg.drawImage('dbimages/'+bardata[5]+'.gif',w-14,35,9,29); 
  jg.setFont("verdana","9px",Font.PLAIN);
  jg.setColor("#FFFFFF");
  jg.drawStringRect(bardata[2],5,50,70,"left");
  jg.setFont("verdana","9px",Font.PLAIN);
  jg.setColor("#FFFFFF");
  jg.drawStringRect("Max: "+parseFloat(bardata[3]),5,70,w-10,"center");
  jg.setFont("verdana","9px",Font.PLAIN);
  jg.setColor("#FFFFFF");
  jg.drawStringRect("Min: "+parseFloat(bardata[4]),5,82,w-10,"center");
 }
 jg.paint();
}

function dowind(){
 toadd=2.5;maxspeed=10;
 
 if(winddata[0].indexOf("Calm")>-1)winddata[0]=winddata[0].replace("Calm","0");
 if(winddata[2].indexOf("Calm")>-1)winddata[2]=winddata[2].replace("Calm","0");
 
 for(i=0;i<hwspd.length-1;i++){
  if(hwspd[i]>80){toadd=30;maxspeed=120;}
  else if(hwspd[i]>40 && maxspeed<80){toadd=20;maxspeed=80;}
  else if(hwspd[i]>20 && maxspeed<40){toadd=10;maxspeed=40;}
  else if(hwspd[i]>10 && maxspeed<20){toadd=5;maxspeed=20;}
 }
 if(Math.max(parseFloat(winddata[0]),parseFloat(winddata[2]))>80 && maxspeed<120){toadd=30;maxspeed=120;}
 else if(Math.max(parseFloat(winddata[0]),parseFloat(winddata[2]))>40 && maxspeed<80){toadd=20;maxspeed=80;}
 else if(Math.max(parseFloat(winddata[0]),parseFloat(winddata[2]))>20 && maxspeed<40){toadd=10;maxspeed=40;}
 else if(Math.max(parseFloat(winddata[0]),parseFloat(winddata[2]))>10 && maxspeed<20){toadd=5;maxspeed=20;}
 
 factor=toadd/10;
 tgd="<div id='wind' style='"+fst+"width:220px; height:220px;'><img src='dbimages/windrose"+maxspeed+".gif'></div>";
 document.getElementById("wind").parentNode.innerHTML=tgd;
 
 mo[0]="Rafale:"+winddata[0]+" "+wsu+" - "+getord(parseInt(winddata[1]));
 mo[1]="Moy:"+winddata[2]+" "+wsu+" - "+getord(parseInt(winddata[3]));
 
 tmo=winddata[4].substring(0,winddata[4].indexOf(","));
 tmod=winddata[4].substring(winddata[4].indexOf(",")+1,winddata[4].indexOf("&#176;"));
 tmos=parseInt(tmod);
 tmo+=" - "+getord(tmos);
 mo[2]="Max:"+tmo;
 
 document.getElementById("wind").title="entete=[Vent ("+wsu+")] body=["+getmo(mo)+"] delay=["+mod+"]";
 var jg=new jsGraphics("wind");
 jg.setFont("arial","10px",Font.PLAIN);
 jg.drawStringRect(wsu,10,10,70,"left");
 
 for(i=0;i<hwspd.length-1;i++){
  hist=getpixel(110,108,maxspeed-hwspd[i],hwdir[i],factor);
  jg.setColor(WindHistColor || "#777700");
  jg.setStroke(1);jg.fillRect(hist[0],hist[1],2,2);
 }
 
 if(winddata[0]>winddata[2]){
  plotf=new Array(0,1,WindGustColor || "#990000");
  plots=new Array(2,3,WindAvgColor || "#009900");
 }else{
  plotf=new Array(2,3,WindAvgColor || "#009900");
  plots=new Array(0,1,WindGustColor || "#990000");
 }
 
 from=getpixel(110,108,maxspeed,parseInt(winddata[plotf[1]]),factor);
 to=getpixel(110,108,maxspeed-parseFloat(winddata[plotf[0]]),parseInt(winddata[plotf[1]]),factor);
 jg.setColor(plotf[2]);jg.setStroke(2);jg.drawLine(from[0],from[1],to[0],to[1]);
 jg.fillEllipse(from[0]-2,from[1]-2,6,6);
 
 from=getpixel(110,108,maxspeed,parseInt(winddata[plots[1]]),factor);
 to=getpixel(110,108,maxspeed-parseFloat(winddata[plots[0]]),parseInt(winddata[plots[1]]),factor);
 jg.setColor(plots[2]);jg.setStroke(2);jg.drawLine(from[0],from[1],to[0],to[1]);
 jg.fillEllipse(from[0]-2,from[1]-2,6,6);
 
 jg.paint();
}
//convertie à échelle 0-360 - fourni pour Cumulus par Mark Crossley
function getord(d){
if(d>=360){d-=360;}
deg = Math.ceil((d+11.25)/22.5)
ords = new Array("N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO")
return(ords[deg-1]);
}

function dorain(id,eid,size){
 units=raintoday[1];total=0;maxmf=1;files="l";bot=376;
 if(size=="small"){maxmf=2;files="s";bot=196;}
 
 if(units!="mm"){
  total=parseFloat(raintoday[0])/0.04;
 }else{
  total=parseFloat(raintoday[0]);
 }
 
 if(total<=9){
  tgd="<div id='rain' style='"+fst+"width:90px;'><img src='dbimages/rain"+files+"10.gif'></div>";factor=1;maxm=10;
 }else if(total<=99){
  tgd="<div id='rain' style='"+fst+"width:90px;'><img src='dbimages/rain"+files+"100.gif'></div>";factor=10;maxm=100;
 }else if(total<=199){
  tgd="<div id='rain' style='"+fst+"width:90px;'><img src='dbimages/rain"+files+"200.gif'></div>";factor=20;maxm=200;
 }else{
  tgd="<div id='rain' style='"+fst+"width:90px;'><img src='dbimages/rain"+files+"400.gif'></div>";factor=40;maxm=400;
 }
 
 eid.parentNode.innerHTML=tgd;
 eid=document.getElementById(id);
 if(units!="mm" && total>7.5)scale=37/factor/maxmf;
 else scale=36/factor/maxmf;
 t=Math.floor(bot-(total*scale));b=bot-t;
 var jg=new jsGraphics(id);
 jg.setColor(RainColor || "#0000FF");
 if(!isNaN(t)&&t<bot)jg.fillRect(38,t,15,b);
 jg.paint();
 
 mo = new Array();
 mo[0]="W sumie:"+parseFloat(raintoday[0])+units;
 mo[1]="Obecnie:"+parseFloat(raintoday[2])+units+"/h";
 if(!isNaN(parseFloat(raintoday[3])))mo[2]="Deszcz:"+parseFloat(raintoday[3])+units+"/h";
 
 eid.title="entete=[Dzeszcz dzisiaj ("+raintoday[1]+")] body=["+getmo(mo)+"] delay=["+mod+"]";
}

function docloud(){
 tgd = "<div id='cloudbase' style='position:relative; width:90px;'><img src='dbimages/cloudbase.gif'>";
 document.getElementById("cloudbase").parentNode.innerHTML=tgd
 var jg = new jsGraphics("cloudbase");
 jg.setColor(CloudTextColor || "#000000");
 jg.setFont("arial","10px",Font.PLAIN); 
 jg.drawStringRect(cloudbase,10,93,70,"center"); 
 jg.paint();
}

// Le code qui suit appel la fonction ci-haut.

divid = new Array("outsidetemp","insidetemp","extratemp1","extratemp2","dewpoint","heatindex","windchill");
ddata = new Array(tempos,tempis,tempex1,tempex2,tempdp,temphi,tempwc)
esn1 = "Extra Temperature 1";
esn2 = "Extra Temperature 2";
if(ExtraSensor1Name) esn1 = ExtraSensor1Name + " Temperature";
if(ExtraSensor2Name) esn2 = ExtraSensor2Name + " Temperature";
divti = new Array("Temperatura","Temperatura wewnątrz",esn1,esn2,"Punkt rosy","Humidex","Chłodzenie wiatrem");
for(x=0;x<divid.length;x++){
 if(document.getElementById(divid[x])){
  eid=document.getElementById(divid[x]);
  dotemps(divti[x],divid[x],eid,eid.innerHTML,ddata[x]);
 }
}

divid = new Array("outsidehumidity","insidehumidity","extrahumidity1","extrahumidity2");
ddata = new Array(humos,humis,humex1,humex2)
esn1 = "Extra Humidity 1";
esn2 = "Extra Humidity 2";
if(ExtraSensor1Name) esn1 = ExtraSensor1Name + " Humidity";
if(ExtraSensor2Name) esn2 = ExtraSensor2Name + " Humidity";
divti = new Array("Wilgotność","Inside Humidity",esn1,esn2);
for(i=0;i<divid.length;i++){
 if(document.getElementById(divid[i])){
  eid=document.getElementById(divid[i]);
  dohums(divti[i],divid[i],eid,eid.innerHTML,ddata[i]);
 }
}

if(document.getElementById("barometer")) dobar(document.getElementById("barometer").innerHTML);

if(document.getElementById("cloudbase")) docloud();

if(document.getElementById("rain")){
 eid=document.getElementById("rain");
 dorain("rain",eid,eid.innerHTML);
}

if(document.getElementById("wind")) dowind();