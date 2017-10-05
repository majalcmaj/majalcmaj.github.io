 function CheckZahl(Eingabe){
  var nur_das ="0123456789.-";
  for (var i = 0; i < Eingabe.length; i++)
   if (nur_das.indexOf(Eingabe.charAt(i))<0 ) return false;
  return true;
 }

 function pruef_ms(ms){
   if(ms<0)
     ms=0;
   if(!CheckZahl(ms))
     ms=0;

   return ms;
 }

 function pruef_kmh(kmh){
   if(kmh<0)
     kmh=0;
   if(!CheckZahl(kmh))
     kmh=0;

   return kmh;
 }

 function pruef_mph(mph){
   if(mph<0)
     mph=0;
   if(!CheckZahl(mph))
     mph=0;

   return mph;
 }


 function pruef_knoten(knoten){
   if(knoten<0)
     knoten=0;
   if(!CheckZahl(knoten))
     knoten=0;

   return knoten;
 }

 function pruef_beaufort(beaufort){
   if(beaufort<0)
     beaufort=0;
   if(beaufort>12)
     beaufort=0;

   if(!CheckZahl(beaufort))
     beaufort=0;

   return beaufort;
 }

 function kmh2ms(kmh){
   var ms=0;
   ms = Math.round((kmh/3.6)*100)/100;
   return ms;
 }

 function kmh2mph(kmh){
   var mph=0;
   mph = Math.round((0.6215*kmh)*100)/100;
   return mph;
 }

 function ms2knoten(ms){
   var knoten=0;
   knoten = Math.round((1.9438*ms)*100)/100;
   return knoten;
 }

 function kmh2knoten(kmh){
   var knoten=0;
   var ms=0;
   ms=kmh2ms(kmh);
   knoten=ms2knoten(ms);
   return knoten;
 }

 function knoten2beaufort(knoten){
 
   if (knoten==0)
    return 0;
   if (knoten<=3)
    return 1;
   if (knoten<=6)
    return 2;
   if (knoten<=10)
    return 3;
   if (knoten<=15)
    return 4;
   if (knoten<=21)
    return 5;
   if (knoten<=27)
    return 6;
   if (knoten<=33)
    return 7;
   if (knoten<=40)
    return 8;
   if (knoten<=47)
    return 9;
   if (knoten<=55)
    return 10;
   if (knoten<=63)
    return 11;
   else
    return 12;   
 }

 function ms2kmh(ms){
   var kmh=0;
   kmh = Math.round((ms*3.6)*100)/100;
   return kmh;
 }

 function ms2mph(ms){
   var mph=0;
   var kmh=0;
   kmh=ms2kmh(ms);
   mph=kmh2mph(kmh);
   return mph;
 }

 function mph2kmh(mph){
   var kmh=0;
   kmh = Math.round((1.609*mph)*100)/100;
   return kmh;
 }

 function mph2ms(mph){
   var ms=0;
   var kmh=0;
   kmh=mph2kmh(mph);
   ms=kmh2ms(kmh);
   return ms;
 }

 function mph2knoten(mph){
  var knoten=0;
  var ms=0;
  ms=mph2ms(mph);
  knoten=ms2knoten(ms);
  return knoten;
 }

 function mph2beaufort(mph){
   var beaufort=0;
   var knoten=0;
   knoten=mph2knoten(mph);
   beaufort=knoten2beaufort(knoten);
   return beaufort;
 }

 function ms2beaufort(ms){
   var knoten=0;
   var beaufort=0;
   knoten=ms2knoten(ms);
   beaufort=knoten2beaufort(knoten);
   return beaufort;   
 }

 function kmh2beaufort(kmh){
   beaufort=0;
   ms=0;
   ms=kmh2ms(kmh);
   beaufort=ms2beaufort(ms);
   return beaufort;
 }

 function knoten2ms(knoten){
   var ms=0;
   ms = Math.round((0.51444*knoten)*100)/100;
   return ms;
 }

 function knoten2mph(knoten){
   var mph=0;
   ms=0;
   ms=knoten2ms(knoten);
   mph=ms2mph(ms);
   return mph;
 }

 function knoten2kmh(knoten){
   var ms=0;
   var kmh=0;
   ms=knoten2ms(knoten);
   kmh=ms2kmh(ms);
   return kmh;
 }

 function beaufort2knoten(beaufort){
   var knoten="0";
   if(beaufort==1)
     knoten="1-3"
   if(beaufort==2)
     knoten="4-6"
   if(beaufort==3)
     knoten="7-10"
   if(beaufort==4)
     knoten="11-15"
   if(beaufort==5)
     knoten="16-21"
   if(beaufort==6)
     knoten="22-27"
   if(beaufort==7)
     knoten="28-33"
   if(beaufort==8)
     knoten="34-40"
   if(beaufort==9)
     knoten="41-47"
   if(beaufort==10)
     knoten="48-55"
   if(beaufort==11)
     knoten="56-63"
   if(beaufort==12)
     knoten=">64"
   return knoten;   
 }

 function beaufort2ms(beaufort){
   var ms=0;
   if(beaufort==1)
     ms="0.3-1.5"
   if(beaufort==2)
     ms="1.6-3.3"
   if(beaufort==3)
     ms="3.4-5.4"
   if(beaufort==4)
     ms="5.5-7.9"
   if(beaufort==5)
     ms="8.0-10.7"
   if(beaufort==6)
     ms="10.8-13.8"
   if(beaufort==7)
     ms="13.9-17.1"
   if(beaufort==8)
     ms="17.2-20.7"
   if(beaufort==9)
     ms="20.8-24.4"
   if(beaufort==10)
     ms="24.5-28.4"
   if(beaufort==11)
     ms="28.5-32.6"
   if(beaufort==12)
     ms=">32.6"
    return ms;
 }

 function beaufort2kmh(beaufort){
   var kmh=0;
   if(beaufort==1)
     kmh="1.1-5.4"
   if(beaufort==2)
     kmh="5.5-11.9"
   if(beaufort==3)
     kmh="12.0-19.4"
   if(beaufort==4)
     kmh="19.5-28.4"
   if(beaufort==5)
     kmh="28.5-38.5"
   if(beaufort==6)
     kmh="38.6-49.7"
   if(beaufort==7)
     kmh="49.8-61.5"
   if(beaufort==8)
     kmh="61.6-74.5"
   if(beaufort==9)
     kmh="74.6-87.8"
   if(beaufort==10)
     kmh="87.9-102.2"
   if(beaufort==11)
     kmh="102.3-117.3"
   if(beaufort==12)
     kmh=">117.4"
   return kmh;
 }

 function beaufort2mph(beaufort){
   var mph=0;
   if(beaufort==1)
     mph="0.7-3.5"
   if(beaufort==2)
     mph="3.6-7.5"
   if(beaufort==3)
     mph="7.6-12.2"
   if(beaufort==4)
     mph="12.3-17.8"
   if(beaufort==5)
     mph="17.9-24.0"
   if(beaufort==6)
     mph="24.1-31.0"
   if(beaufort==7)
     mph="31.1-38.3"
   if(beaufort==8)
     mph="38.4-46.4"
   if(beaufort==9)
     mph="46.5-54.7"
   if(beaufort==10)
     mph="54.8-63.6"
   if(beaufort==11)
     mph="63.7-73.0"
   if(beaufort==12)
     mph=">73"
   return mph;
 }

 function WBerechnen(){
   var ms=document.wind.ms.value;
   var knoten=document.wind.knoten.value;
   var beaufort=document.wind.beaufort.value;
   var kmh=document.wind.kmh.value;
   var mph=document.wind.mph.value;
   if (document.wind.ms.value != ""){
     ms=pruef_ms(ms);
     knoten=ms2knoten(ms);
     beaufort=ms2beaufort(ms);
     kmh=ms2kmh(ms);
     mph=ms2mph(ms);
   }
   else{
     if (document.wind.knoten.value != ""){
       knoten=pruef_knoten(knoten);
       ms=knoten2ms(knoten);
       beaufort=knoten2beaufort(knoten);
       kmh=knoten2kmh(knoten);
       mph=knoten2mph(knoten);
     }
     else {
       if (document.wind.beaufort.value != ""){
         beaufort=pruef_beaufort(beaufort);
         ms=beaufort2ms(beaufort);
         knoten=beaufort2knoten(beaufort);
         kmh=beaufort2kmh(beaufort);
         mph=beaufort2mph(beaufort);
       }
       else{
         if (document.wind.kmh.value != ""){
           kmh=pruef_kmh(kmh);
           ms=kmh2ms(kmh);
           knoten=kmh2knoten(kmh);
           beaufort=kmh2beaufort(kmh);
           mph=kmh2mph(kmh);
         }
         else{
           if (document.wind.mph.value != ""){
             mph=pruef_mph(mph);
             ms=mph2ms(mph);
             knoten=mph2knoten(mph);
             beaufort=mph2beaufort(mph);
             kmh=mph2kmh(mph);
           };
         };
       };
     };
   };
   document.wind.knoten.value=knoten;
   document.wind.beaufort.value=beaufort;     
   document.wind.ms.value=ms;
   document.wind.kmh.value=kmh;
   document.wind.mph.value=mph;
   document.wind.knoten.value=pruef_komma(document.wind.knoten.value);
   document.wind.ms.value=pruef_komma(document.wind.ms.value);
   document.wind.kmh.value=pruef_komma(document.wind.kmh.value);
   document.wind.mph.value=pruef_komma(document.wind.mph.value);
   return;
 }

 function WLoeschen(){
   with(document.wind){
     ms.value="";
     knoten.value="";
     beaufort.value="";
     kmh.value="";
     mph.value="";
   }
 }
