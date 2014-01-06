// ==UserScript==
// @name			Eulili_Bookmark-List Highlighter
// @namespace		GC Review Bookmark-List
// @version			1.17
// @downloadURL   	https://ssl.webpack.de/eulili.de/grease_eigene/Bookmark-List_Highlighter/Bookmark-List_Highlighter.user.js
// @updateURL		http://www.eulili.de/grease_eigene/Bookmark-List_Highlighter/Bookmark-List_Highlighter.user.js
// @include			http://www.geocaching.com/bookmarks/view.aspx*
// @include			http://www.geocaching.com/bookmarks/bulk.aspx*
// @include			file:///E:/web/Timepublish.htm*
// @include         file:///E:/web/DeaktivierteCaches.htm*
// @icon			http://www.eulili.de/greasemonkey/icons/eulili.png
// @description		Bookmark_Templates Script (Einfuegen von Zeit-Buttons auf der Bookmarkseite)
// ==/UserScript==
//
// Versionshistorie
// ================
// * v01.00		2013-07-30 EU	Grundfunktion des Scripts eingerichtet
// * v01.10		2013-11-24 EU	Automatisches Update eingepflegt
// * v01.12		2013-11-26 EU	Gesamte Zeile markieren und Review-Link versetzen
// * v01.13x	2013-11-27 EU	Zeile fett markieren
// * v01.14		2013-11-30 EU	Grafik eingefügt und Funktion von Aufruf aller markierten Caches
// * v01.15     2013-12-19 EU   Nutzung für SBA und Freischaltung eingerichtet
// * v01.16		2013-12-25 EU	Umstellung Script bei der Suche nach Datum
// * v01.17		2013-12-29 EU	Bugfix (Reihenfolge der Abfragen geändert)


//  Icon image data.
var UpArrowImg =
	'data:image/gif,GIF89a%0C%00%0E%00%B3%00%00%00%00%00c%7B%94k%' +
	'8C%9Cs%8C%9C%84%9C%AD%8C%9C%AD%94%A5%B5%A5%B5%BD%B5%BD%CE%B5' +
	'%C6%CE%C6%CE%D6%CE%D6%DE%D6%DE%DE%E7%EF%EF%F7%F7%F7%FF%FF%FF' +
	'!%F9%04%01%00%00%00%00%2C%00%00%00%00%0C%00%0E%00%00%04E%10%' +
	'C8I%AB%BD%0B%A1e%D7%08%600p%D2%12%9E%01%E7%08%A1b%82%82%93%8' +
	'4%CB%F3(ab%80%8Am%BF%85B%E0%C0%F0%3D%18%87%00a%072%86%0A%B8%' +
	'A6%AF%E5%F8%04%9C%81%18%A0%C1r%0A%1A%93%C6%C0H%00%03%22%00%3B'


//var input2=new Array;


var cachelink= new Array;
var uebergehen = 0;
var i1 = 0;
var i2 = 0;
var zzz;
var linktext ="";
$(document).ready(function() {

	$('tr[id^="ctl00_ContentBody_ListInfo_BookmarkWpts"][id$="dataRow2"] :nth-child(2)').each(function( index ) {
		var input = $(this).text();
		if (ergebnis=input.match(/([0-9]{4})\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/)) {
			pruef_datum = ergebnis[0];
			uebergehen=1;
		} 
		else if (ergebnis=input.match(/(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.([0-9]{4})/)) {
			if (ergebnis[1]<=9) { ergebnis[1] = "0"+ergebnis[1]; }
			if (ergebnis[2]<=9) { ergebnis[1] = "0"+ergebnis[2]; }
			if (ergebnis[3]<=9) { ergebnis[1] = "0"+ergebnis[3]; }
			pruef_datum = ergebnis[3]+"-"+ergebnis[2]+"-"+ergebnis[1];
			uebergehen=1;
		}
		if (uebergehen==1) {  // "Prüfen ob Datum vorhanden"
			var action_date = Date.parse(pruef_datum);
			var curr = new Date();
			if(((curr-action_date-86400000)>=0)) {
			// Hintergrundfarbe auf GELB setzen
				$(this).parent().children('td').css('font-weight','bold').css('background-color', '#FFFFAA');
				$(this).parent().prev().children('td').css('font-weight','bold').css('background-color', '#FFFFAA');
			// Bei archivierten Caches automatisch den Haken setzen
				$(".OldWarning").each(function() {
					$(this).closest('[id$="dataRow"]').find("td:nth-child(1) :input").attr('checked','checked');
					$(this).closest('[id$="dataRow"]').find("td:nth-child(1)").css('background-color', '#FF0000');
				});
			// Ausrichtung "Top"
				$(this).parent().prev().children('td:nth-child(3)').css('vertical-align','top');
				$(this).parent().prev().children('td:nth-child(4)').css('vertical-align','top');
				$(this).parent().prev().children('td:nth-child(5)').css('vertical-align','top');
			// Prüfläufe "SBA" und "Freischaltung"
				if (ergebnis=input.match(/(SBA )/)) {
					++i1;
					// GC-Code ausfiltern aus der entsprechenden Zeile
					var gccode1 = $(this).parent().prev().children('td:nth-child(4)').text();
					var gccode2 = "http://www.geocaching.com/admin/review.aspx?wp="+gccode1;
					// Link anlegen
					linktext  = '<a href="javascript:void(0)" onClick="aufruf()" class="sammellink" ';
					linktext += 'title="alle bis hier als Review-Seite öffnen"><img id=LfdNr'+i1+' ';
					linktext += 'alt='+gccode1+' title="alle markierten öffnen" src='+UpArrowImg+'></a>';
					$(this).parent().prev().children('td:nth-child(3)').append(linktext);
				}
				else if (ergebnis=input.match(/(Freischaltung)/)) {
					++i2;
					$(this).parent().prev().closest('[id$="dataRow"]')
						.find("td:nth-child(1) :input").addClass('SBACheck');
					$(this).parent().prev().closest('[id$="dataRow"]')
						.find("td:nth-child(1) :input").attr('checked','checked');
					$('.CheckSBA').attr('checked','checked');
				}
			uebergehen = 0;	
			};
		} // Ende Schleife "Prüfen ob Datum vorhanden"
	});
	
	// Review-Links in Zeile eintragen
	$('tr[id^="ctl00_ContentBody_ListInfo_BookmarkWpts"][id$="dataRow"] :nth-child(4)').each(function( index ) {
		++zzz;
		var input = $(this).text();
		cachelink[zzz] = 'http://www.geocaching.com/admin/review.aspx?wp='+input;
		$(this).append('<br><a class="gs_review" href='+cachelink[zzz]+' target="_blank">Review</a>');
		$('.gs_review').click(function() {
			$(this).closest('[id$="dataRow"]').find("td:nth-child(1) :input").attr('checked','checked');
		});
	});

// Buttons oben einfügen wenn freigeschaltete Caches gefunden wurden
	if (i2>1) {
		Text_Btn1  = "<Button id=CheckPub name=CheckPub type=Button>"+i2+" ";
		Text_Btn1 += "bereits freigeschaltete Caches von Liste entfernen</Button>";
		Text_Btn2  = "<Button id=CheckPub2 name=CheckPub2 type=Button>"+i2+"  ";
		Text_Btn2 += "Caches nochmals auf Freischaltung prüfen</Button>";
		$('#ctl00_ContentBody_ListInfo_uxAbuseReport').prev().append(Text_Btn1);
		$('#ctl00_ContentBody_ListInfo_uxAbuseReport').prev().append(Text_Btn2);
	}

// Aufruf "Löschen der Einträge bereits freigeschalteter Caches"        
	$( '#CheckPub' ).click(function() {
		$('.SBACheck').each(function( index ) {
			$(this).attr('checked','checked');
		});
		//setTimeout(function() {
			$('#ctl00_ContentBody_ListInfo_btnDelete').trigger('click');
		//}, 1000);
	});

// Aufruf "Nochmals prüfen ob freigeschaltet"
	$( '#CheckPub2' ).click(function() {
		$('.SBACheck').each(function( index ) {
			$(this).attr('checked','checked');
		});
			$('#ctl00_ContentBody_ListInfo_MassPublish').trigger('click');
	});

$( '[id^="LfdNr"]' ).click(function() {
	$('[id^="LfdNr"]').each(function( index ) {
		window.open("http://www.geocaching.com/admin/review.aspx?wp="+$(this).attr('alt'),"Review-Seite"+$(this).attr('alt'));
        $(this).closest('[id$="dataRow"]').find("td:nth-child(1) :input").attr('checked','checked');

	});
});



});





