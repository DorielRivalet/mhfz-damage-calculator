//==============================================//
//	Notes for anyone actually looking at this   //
//============================================= //
//  This is a disaster and needs to be redone.  //
//  It was originally intended to be a MM calc  //
//  and just ballooned. If the game ever gets   //
//  back on track to being the game I loved     //
//  I'll redo this from scratch instead of as   //
//  an awful patchwork monstrosity with every   //
//  single value badly hardcoded into a single  //
//  .js file.                                   //
//==============================================//


// Actual Relevant Formulas:
// Attack Values
// Attack addition is added as either Attack A or Attack B and is before or after Hunting Horn buffs respectively.
// Values that are known to reside in Attack B are Rush, Stylish Assault, Flash Conversion, Obscurity, Incitement, Rush, Vigorous Up and Partnyaa Attack Buffs.
// Final True  = ((Weapon True + Attack A) * HH Buff + Attack B) * Multipliers + Additional

// Elemental Values
// It's exactly what you'd expect. Get true by dividing by 10, floor any decimals and truncate them from value 
// Floor(Displayed Elemental / 10 * Hybrid Modifiers)
// e.g. 1150 Black Flame is 
// 1150 / 10 * 1.5 = 172.5 = 1720 Dragon
// 1150 / 10 * 0.5 = 57.5 = 570 Fire 

// Bowguns
// Both Bowguns use normal attack to work out used elemental value on a shot
// Base Shot Power is always 1 
// First multi is always hit count, 1-6 is actual use depending on hits landed

// Heavy Bowgun
// Fire 	(Attack * 0.5) * 1 * Hiden
// Water	(Attack * 0.25) * 3 * Hiden
// Thunder	(Attack * 0.27) * 3 * Hiden
// Ice		(Attack * 0.25) * 3 * Hiden
// Dragon	90 * 6 * Hiden

// Light Bowgun
// Fire 	(Attack * 0.4) * 1
// Water	(Attack * 0.2) * 3
// Thunder	(Attack * 0.2) * 3
// Ice		(Attack * 0.2) * 3
// Dragon	75 * 6


// Damage output
// Hitbox should be final value after all modifiers like TC etc.
// Status multis are 1.10x for Paralysis and the animation of falling into a pitfall, 3.00x on first hit during sleep 

// Melee Weapons
// Weapon Modifier is 1.25x for SnS, 0.72x for Lance impact, 1.00x everywhere else
// Raw
// Floor ( Floor ( Floor ( Motion * Affinity ) / 100 * Sharpness * Weapon Modifier * Sweet Spot * Status Multi * Hitbox / 100 ) * Defense Rate)
// Elemental
// Floor ( Floor ( Elemental / 10 * Sharpness * Element Hitbox / 100 * Hybrid Modifier ) * Defense Rate ) 

// Ranged Damage
// Raw
// Floor(Floor(Floor(Shot Power / 100 * Affinity * Attack) * Critical Distance Multiplier * Coating Modifier * Shot Modifier * Shot Type Multi * Status Multi * Hitbox / 100) * Defense Rate）
// Elemental 
// Floor ( Floor ( Elemental / 10 * Charge Modifiers * Element Hitbox / 100 * Hybrid Modifier ) * Defense Rate ) 

// Status Values
// Displayed Status / 10
// 






// Actual Script Starts - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //





/* asynchronous */
$.ajaxPrefilter(function( options, original_Options, jqXHR ) {
    options.async = true;
});

//====================//
// Version			  //
//====================//



$("#version").html("v20170722");
$("#version").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('<span style="font-size:110%;font-weight:900;">Changelog</span><br/><span style="font-size:100%;"><br/><b>v20170422</b> - Affinity calculator stuff added.<br/></span><span style="font-size:60%;"><b>v20170420</b> - Fixed obscurity and consumption being flat additional instead of additional on base.<br/><b>v20161121</b> - Z1 skills and balance options added.<br/><b>v20161120</b> - Extreme style motion values added for those I have.<br/><b>v20161110</b> - Fixed up rounding on multipliers to make match in game values more closely.<br/><b>v20160901</b> - Tidied motion value input table stuff.<br/><b>v20160906</b> - Motion value input overhauled, G9 skills added as standard, other stuff.<br/><b>v20160815</b> - Added MM required missions number.<br/><b>v20160815</b> - Added external Ferias links for hitboxes etc.<br/><b>v20160807</b> - Caps attack based on Lv180 max MM, notifies if G9 MM values are needed.<br/><b>v20160807</b> - Defense rate modifiers added.<br/><b>v20160802</b> - Motion values added on page. Elemental procs added. Various other tweaks.<br/><b>v20160801</b> - Subtract SR and Sigil option added.<br/><b>v20160729</b> - Sword crystal information in elemental section.<br/><b>v2016XXXX</b> - I didn\'t keep a change log</span>');
	}
);



































//=======================//
// Motion Values Loading //
//=======================//

$('#manualcalc').click( function(){
processvaluesManual();	
});
$('#smolmode').click( function(){
	$('.damagecalc').css("max-height", "80vh");
	$('.bottomrow').css("max-height", "80px");
	$('#bigmode').show();
	$('#smolmode').hide();
});
$('#bigmode').click( function(){
	$('.damagecalc').css("max-height", "61vh");
	$('.bottomrow').css("max-height", "30vh");
	$('#bigmode').hide();
	$('#smolmode').show();
});

$(document).ready(function() {
//	$('#hitboxbox').load('./hitboxvalues.html');
	//$('#iceagebox').load('./iceage/main.html');
//	$('#gunlancebox').load('./gunlance/gunlance.html');
	WeaponShow();
	$('.coverall').fadeOut('200');

	if (getID('weaponclass') == 0){
	var ACweapontypemulti = fetchmulti('weapontype');
	} else {
	var ACweapontypemulti = 1.2;
	}
	document.getElementById('displayedattack').value = Math.floor(getID('trueraw') * ACweapontypemulti );
});

	$('#earthstyle').addClass('styleselected');
	$('.earthstylediv').removeClass('notselectedstyle');
	$('.motionvaluediv').not('.earthstylediv').addClass('notselectedstyle');
	$('.motionvaluediv > table > tbody > tr.earthstyle').show();
	$('.motionvaluediv > table > tbody > tr').not(".earthstyle").hide();

	
function processMotion(){
//sns
if( document.getElementById('weapontype').value == 1){
	$('#weaponiconsns').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.snsdiv').removeClass('notselectedweapon');
	$('.motionvaluediv').not('.snsdiv').addClass('notselectedweapon');
//ds
} else if( document.getElementById('weapontype').value == 2){
	$('#weaponiconds').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.dsdiv').removeClass('notselectedweapon');
	$('.motionvaluediv').not('.dsdiv').addClass('notselectedweapon');
//gs
}else if( document.getElementById('weapontype').value == 3){
	$('#weaponicongs').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.gsdiv').removeClass('notselectedweapon');
	$('.motionvaluediv').not('.gsdiv').addClass('notselectedweapon');
//ls
}else if( document.getElementById('weapontype').value == 4){
	$('#weaponiconls').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.lsdiv').removeClass('notselectedweapon');
	$('.motionvaluediv').not('.lsdiv').addClass('notselectedweapon');
//hammer
}else if( document.getElementById('weapontype').value == 5){
	$('#weaponiconhammer').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.hammerdiv').removeClass('notselectedweapon');
	$('.motionvaluediv').not('.hammerdiv').addClass('notselectedweapon');
//hh
}else if( document.getElementById('weapontype').value == 6){
	$('#weaponiconhh').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.hhdiv').removeClass('notselectedweapon');
	$('.motionvaluediv').not('.hhdiv').addClass('notselectedweapon');
//lance
}else if( document.getElementById('weapontype').value == 7){
	$('#weaponiconlance').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.lancediv').removeClass('notselectedweapon');
	$('.motionvaluediv').not('.lancediv').addClass('notselectedweapon');
//gunlance
}else if( document.getElementById('weapontype').value == 8){
	$('#weaponicongl').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.gldiv').removeClass('notselectedweapon');
	$('.motionvaluediv').not('.gldiv').addClass('notselectedweapon');
//tonfa
}else if( document.getElementById('weapontype').value == 9){
	$('#weaponicontonfa').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.tonfadiv').removeClass('notselectedweapon');
	$('.motionvaluediv').not('.tonfadiv').addClass('notselectedweapon');
//swaxe
}else if( document.getElementById('weapontype').value == 10){
	$('#weaponiconswaxe').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.swaxediv').removeClass('notselectedweapon');
	$('.motionvaluediv').not('.swaxediv').addClass('notselectedweapon');
//lbg
}else if( document.getElementById('weapontype').value == 11){
	$('#weaponiconlbg').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.lbgdiv').removeClass('notselectedweapon notselectedstyle');
	$('.motionvaluediv').not('.lbgdiv').addClass('notselectedweapon notselectedstyle');	
	$('#earthstyle').addClass('styleselected');
	$('.stylebutton').not('#earthstyle').removeClass('styleselected');
	$('.earthstylediv').removeClass('notselectedstyle');
	$('.motionvaluediv').not('.earthstylediv').addClass('notselectedstyle');
//hbg
}else if( document.getElementById('weapontype').value == 12){
	$('#weaponiconhbg').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.hbgdiv').removeClass('notselectedweapon notselectedstyle');
	$('.motionvaluediv').not('.hbgdiv').addClass('notselectedweapon notselectedstyle');
	$('#earthstyle').addClass('styleselected');
	$('.stylebutton').not('#earthstyle').removeClass('styleselected');
	$('.earthstylediv').removeClass('notselectedstyle');
	$('.motionvaluediv').not('.earthstylediv').addClass('notselectedstyle');
//bow
}else if( document.getElementById('weapontype').value == 13){
	$('#weaponiconbow').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.bowdiv').removeClass('notselectedweapon notselectedstyle');
	$('.motionvaluediv').not('.bowdiv').addClass('notselectedweapon notselectedstyle');
	$('#earthstyle').addClass('styleselected');
	$('.stylebutton').not('#earthstyle').removeClass('styleselected');
	$('.earthstylediv').removeClass('notselectedstyle');
	$('.motionvaluediv').not('.earthstylediv').addClass('notselectedstyle');
}

};	

function processMotionRanged(){
if( document.getElementById('rangedweapontype').value == 1){
	$('#weaponiconlbg').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.lbgdiv').removeClass('notselectedweapon notselectedstyle');
	$('.motionvaluediv').not('.lbgdiv').addClass('notselectedweapon notselectedstyle');	
	$('#earthstyle').addClass('styleselected');
	$('.stylebutton').not('#earthstyle').removeClass('styleselected');
	$('.earthstylediv').removeClass('notselectedstyle');
	$('.motionvaluediv').not('.earthstylediv').addClass('notselectedstyle');
//hbg
}else if( document.getElementById('rangedweapontype').value == 2){
	$('#weaponiconhbg').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.hbgdiv').removeClass('notselectedweapon notselectedstyle');
	$('.motionvaluediv').not('.hbgdiv').addClass('notselectedweapon notselectedstyle');
	$('#earthstyle').addClass('styleselected');
	$('.stylebutton').not('#earthstyle').removeClass('styleselected');
	$('.earthstylediv').removeClass('notselectedstyle');
	$('.motionvaluediv').not('.earthstylediv').addClass('notselectedstyle');
//bow
}else if( document.getElementById('rangedweapontype').value == 3){
	$('#weaponiconbow').addClass('clicked');
	$('.weaponicon').not(this).removeClass('clicked');
	$('.bowdiv').removeClass('notselectedweapon notselectedstyle');
	$('.motionvaluediv').not('.bowdiv').addClass('notselectedweapon notselectedstyle');
	$('#earthstyle').addClass('styleselected');
	$('.stylebutton').not('#earthstyle').removeClass('styleselected');
	$('.earthstylediv').removeClass('notselectedstyle');
	$('.motionvaluediv').not('.earthstylediv').addClass('notselectedstyle');
}
}

$("#meleecalc").click(
 function(){
	$('#meleecalc').addClass('styleselected');
	$('.calcbutton').not(this).removeClass('styleselected');
	$("#weaponclass").val(0).change();
	document.getElementById('displayedattack').value = Math.floor(getID('trueraw') * +fetchmulti('weapontype') );
	forcedupdate();
});
$("#gunnercalc").click(
 function(){
	$('#gunnercalc').addClass('styleselected');
	$('.calcbutton').not(this).removeClass('styleselected');
	$("#weaponclass").val(1).change();
	processranged();
	document.getElementById('displayedattack').value = Math.floor(getID('trueraw') * 1.2 );
	forcedupdate();
});


//Correct Buttons
if( document.getElementById('weaponclass').value == 1){
	$('#gunnercalc').addClass('styleselected');
	$('.calcbutton').not('#gunnercalc').removeClass('styleselected');
	$("#weaponclass").val(1).change();
}
 

$("#earthstyle").click(
 function(){
	$('#earthstyle').addClass('styleselected');
	$('.stylebutton').not(this).removeClass('styleselected');	

$('.motionvaluediv > table > tbody > tr.earthstyle').show();
$('.motionvaluediv > table > tbody > tr').not(".earthstyle").hide();

	
});


$("#heavenstyle").click(
 function(){
	$('#heavenstyle').addClass('styleselected');
	$('.stylebutton').not(this).removeClass('styleselected');
//	$('.heavenstylediv').removeClass('notselectedstyle');
//	$('.motionvaluediv').not('.heavenstylediv').addClass('notselectedstyle');
	
	$('.motionvaluediv > table > tbody > tr.heavenstyle').show();
	$('.motionvaluediv > table > tbody > tr').not(".heavenstyle").hide();
});

$("#stormstyle").click(
 function(){
	$('#stormstyle').addClass('styleselected');
	$('.stylebutton').not(this).removeClass('styleselected');
//	$('.stormstylediv').removeClass('notselectedstyle');
//	$('.motionvaluediv').not('.stormstylediv').addClass('notselectedstyle');

	$('.motionvaluediv > table > tbody > tr.stormstyle').show();
	$('.motionvaluediv > table > tbody > tr').not(".stormstyle").hide();

});

$("#extremestyle").click(
 function(){
	$('#extremestyle').addClass('styleselected');
	$('.stylebutton').not(this).removeClass('styleselected');
//	$('.extremestylediv').removeClass('notselectedstyle');
//	$('.motionvaluediv').not('.extremestylediv').addClass('notselectedstyle');

	$('.motionvaluediv > table > tbody > tr.extremestyle').show();
	$('.motionvaluediv > table > tbody > tr').not(".extremestyle").hide();

});


function WeaponShow(){
		forcedupdate();
		if( document.getElementById('weaponclass').value == 1){
			$(".meleeweapontable").hide();
			$(".rangedweapontable").show();
			processMotionRanged();
		} else {
			$(".meleeweapontable").show();
			$(".rangedweapontable").hide();	
			processMotion();
		}
		
		if( document.getElementById('weapontype').value == 8){
			$(".gunlanceSelected").hide();
		} else {
			$(".gunlanceSelected").hide();
		}
		if( document.getElementById('weapontype').value == 9){
			$(".tonfaSelected").show();
		} else {
			$(".tonfaSelected").hide();
			$("#tonfamode").val(1).change();
		}
		
    };


$('select#weaponclass,select#weapontype,select#rangedweapontype,#WeaponStyle').blur(WeaponShow);
$('select#weaponclass,select#weapontype,select#rangedweapontype,#WeaponStyle').change(WeaponShow);

//====================//
// Help and Importing //
//====================//

$(".showmotionvalues").click(
    function(){
		$("#backgrounddiv").fadeToggle('75');
		$("#hitboxbox").hide();	
		$("#iceagebox").hide();	
		$("#gunlancebox").hide();
		$("#motionboxclose").fadeToggle('75');	
    	$("#motionbox").fadeToggle('75');	
		
    }
);
$(".showhitboxvalues").click(
    function(){
		$("#backgrounddiv").fadeToggle('75');
		$("#motionbox").hide();	
		$("#iceagebox").hide();	
		$("#gunlancebox").hide();
		$("#motionboxclose").fadeToggle('75');	
    	$("#hitboxbox").fadeToggle('75');	
    }
);
$(".showiceagecalc").click(
    function(){
		$("#backgrounddiv").fadeToggle('75');
		$("#motionbox").hide();	
		$("#hitboxbox").hide();	
		$("#gunlancebox").hide();
		$("#motionboxclose").fadeToggle('75');	
    	$("#iceagebox").fadeToggle('75');	
    }
);
$(".showgunlancecalc").click(
    function(){
		$("#backgrounddiv").fadeToggle('75');
		$("#motionbox").hide();	
		$("#hitboxbox").hide();	
		$("#iceagebox").hide();		
		$("#motionboxclose").fadeToggle('75');	
    	$("#gunlancebox").fadeToggle('75');	
    }
);

$(".closemotionvalues").click(
    function(){
		$("#backgrounddiv").fadeOut('75');
		$("#motionboxclose").fadeOut('75');	
    	$("#motionbox").fadeOut('75');
		$("#hitboxbox").fadeOut('75');
		$("#iceagebox").fadeOut('75');
		$("#gunlancebox").fadeOut('75');
		
    }
);


$("#extramodsRanged").click(
    function(){
		$(".extramodsRanged").fadeToggle('5');	
	}
);

$("#extramodsMelee").click(
    function(){
		$(".extramodsMelee").fadeToggle('5');	
	}
);




$("#helpDefrate1,#helpDefrate2,#helpDefrate3,#helpDefrate4").click(
    function(){
		
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Defense rates can be found on ferias under the hitzones section.<br/><br/>Multipliers stack so for example a Rajang in Rage mode has a base rate of 0.45 and a rage modifier of 0.8 which means it results in a final Defense Rate of 0.36.</br>Similarly a GHC Rajang in Rage Mode has a specific HC multiplier of 1.4 on rage, this is a third multiplier making the result 0.5 (0.45 x 0.8 x 1.4)<br/><a href="http://i.imgur.com/QicT8Md.png" target="_blank">Image showing where to get and enter values</a>');
    }
);
$("#helpElemental").click(
    function(){
		
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('For the three levels of Standard Elemental Sword Crystals you can use the values 500, 700, 900 and for the GR600 Crystals you can use the values 1300, 1500 and 2100.<br/><br/>This value <b>replaces</b> any elemental values on the weapon so set the element appropriately and use only the number above.');
    }
);
$(".helpMotionvalues").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Depending on how you want to calculate you may want to add motion values together. So for example if you wanted to calculate the total damage of a basic SnS Combo (Unsheathe > 3 Slashes > Horizontal Slash with Sigil) which has combined motion values of <b>21, 17, 14, 10･16, 31･16</b> you would enter <b>125</b> as a motion value and use <b>7</b> as the value for <b>Elemental and Status Attack procs</b> as it is the total number of actual hits that will be landed<br/><br/>This obviously has the downside of assuming best case and that all hits land on the same hitbox but should be accurate enough for most purposes.');
    }
);
$(".helpMotionvaluesRanged").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Depending on how you want to calculate you may want to add motion values together. So for example if you wanted to calculate the total damage of a Rapid LV4 Bow Shot with all hits landing you would add the motion values portions together (<b>14 + 6 + 4 + 3</b>) and enter <b>27</b> as a motion value and use <b>4</b> as the value for <b>Elemental and Status Attack procs</b> as it is the total number of actual arrows that will hit.<br/><br/>This obviously has the downside of assuming best case and that all hits land on the same hitbox but should be accurate enough for most purposes.<br/><br/>For attacks which pierce the projectile obviously continues travelling, this means critical distance and hitboxes may change as it travels etc. meaning any values resulting from adding motion values for those shots should probably be viewed as an optimistic approximation.');
    }
);
$("#helpElementalprocs,#helpElementalprocs2").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('The number of times that elemental values are processed, for example if you have a motion value of <b>14・6・4・3</b> you would enter <b>4</b>, likewise for things such as <b>16･11x4･24</b> you would enter <b>6 (1 + 4 + 1)</b>.<br/><br/><b>Do not set this to 2 for Fencing+2</b>, use the Fencing specific dropdown for that.');
    }
);
$("#helpStatusprocs").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('<b>Calculations always assume use of Poison.</b><br/>The number of times that status is <b>actively applied</b> during the combo for which you have entered a motion value.<br/><br/>If you are using <b>Drug Knowledge</b> enter the number of hits (i.e. <b>14・9・5</b> would be <b>3</b>).<br/><br/>If you are <b>not using Drug Knowledge</b> you can enter any number up to the number of hits to work out varying status application damage values. By default, <b>33% of hits apply status</b> meaning if there are 3 hits the valid range of procs is <b>0 to 3</b>.<br/><br/>Fencing does not need to be accounted for, use the Fencing specific dropdown for that.');
    }
);

$("#backgrounddiv,#helpbox").click(
    function(){
		
		$("#helpbox").hide('200');
		$("#motionbox").hide('200');
		$("#hitboxbox").hide('200');
		$("#gunlancebox").hide('200');
		$("#iceagebox").hide('200');
		$("#backgrounddiv").fadeOut('200');
		$("#motionboxclose").fadeOut('75');	
		
    }
);




$("#futureskill").click(
    function(){
		$(".futureskill").fadeToggle('5');	
    }
);
$("#affinitySkills").click(
    function(){
		$(".affinitySkills").fadeToggle('5');	
    }
);
$("#affinityoutRow").click(
    function(){
	  if( confirm ('Use for Critical Conversion value?') ){
		document.getElementById('ACcritconv').value = +$('#affinityoutRow').text().replace(/%/g,"");
	  } else {		  
	
	  };
		processAC();
    }
);

$("#averagecritical").click(
    function(){
		$(".criticalstuff").fadeToggle('5');	
    }
);

$("#rangedaveragecritical").click(
    function(){
		$(".rangedcriticalstuff").fadeToggle('5');	
    }
);

$("#helpCaravan").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('These are not a final multiplier but rather <b>additional true raw damage</b>. <br/><br/>For example, <b>Weapons Art Large</b> on a <b>600 true raw</b> weapon would be the same as <b>+30 Attack</b> or <b>Attack Up Very Large</b> \(<b>600*0.05</b>\).<br/><br/><b>This will only be calculated correctly if you have the proper base true raw value entered.</b>');
    }
);
$("#helpLength").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Adjusts base True Raw appropriately if you are using a Length Up sigil on a G Rank weapon. This reduction does not stack so 3 sigils to increase length 3 times would be the same reduction as 1.');
    }
);
$("#helpArmourpieces,#helpArmourpieces2").click(
    function(){
		
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('These buffs only take effect if you are using a weapon that is on a Gou tree while on a Gou, Supremacy or G Rank quest.<br/><br/>For example normal Lv50 weapons would get no buffs on any quests but having an G Supremacy Weapon and 2 approprioate armour pieces would result in a +40 addition to final damage.');
    }
);
$("#helpVampirism").click(
    function(){
		
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Each successfully leeching attack with a weapon adds a certain amount of additional true raw up to a <b>maximum of +80</b>.<br/><br/><b>Dual Swords, Tonfa, LBG:</b> +3<br/><b>SnS, LS, Lance, Gunlance, Swaxe F, HBG, Bow:</b> +4<br/><b>Hammer, Hunting Horn:</b> +5<br/><b>Greatsword:</b> +7<br/><br/>Mulitply the successful leeches by the value and <b>round down to +80 if in excess</b>.');
    }
);

$("#helpBaseaffinity").click(
    function(){
		
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Enter the weapon\'s <b>original base affinity</b>, this is <b>without any adjustments from SR, Skills or Sigils</b>. <br/>E.g. Raviente Affinity weapons have a base affinity of 50%, even if they display 100% or higher in status.');
    }
);

$("#helpCoatings").click(
    function(){
		
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Enable the checkbox to adjust for Consumption Slayer, a future skill that causes double coating consumption for an additional +0.2x multiplier.');
    }
);
$("#helpConqatk").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('The value of the skill as displayed on your SR stats if enabled. Only takes effect on standard Conquest quests <br/><b>Shiten conquests do not count</b>');
    }
);
$("#helpConqpot").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Toggle whether or not you have consumed a Conquest Attack Potion on a standard Conquest quest <br/><b>Shiten conquests do not count</b>');
    }
);



$("#helpCritconv").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Enter your <b>Total Affinity</b> rather than just excess. <br/>i.e. if you have <b>125%</b> affinity enter <b>125</b>.<br/><br/>You can also calculate it using the <b>Affinity Skills</b> button next to <b>Natural Affinity</b> above and simply <b>click the value to use it</b>.<br/><br/><span style="font-weight:bold;font-size:115%;">Affinity Amounts</span><br/><b>Expert:</b> +10%/20%/30%/40%/50%<br/><b>Issen:</b> +5%/10%/20%<br/><b>Crit Conversion:</b> +30%<br/><b>Style Ranks:</b> +22% to +24%<br/><b>Determination:</b> +100%<br/><b>Blue or Higher Sharp:</b> +10%<br/><br/><span style="font-weight:bold;font-size:115%;">Base Maxed Pools</span><br/> <b>Ranged:</b> 122%<br/><b>Melee:</b> 132%<br/><b>Ranged Determination:</b> 152%<br/><b>Melee Determination:</b> 162%<br/><br/><b>Starving Wolf</b> adds another 50%<br/><br/><span style="font-weight:bold;font-size:115%;">Critical Conversion</span><br/> <b>Crit Conversion:</b> Conversion is: √(excess affinity) * 7 rounded down as true raw.<br/><b>Crit Conversion Up:</b> Takes natural affinity ignoring all factors such as Sigils and Skills and adds either 5 or 10 × √Natural Affinity depending on skill level. Does not need affinity over 100% to add True Raw.');
    }
);

$("#helpSigil").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('The value of any sigils you intend to insert into the weapon.<br/><br/>If using the values provided by the game menus (<b>4 > 3 > 1 (狀態 > 裝備狀態 > 任務裝備)</b>) enter the values as normal then hit the <b>calculate</b> button button to work out true base raw. <br/><br/>If sigils are species targetted they are not added in town, add these values after calculating true base raw.<br><br><img src="./img7/SigilAttack.png" alt=""><br/>For example for the sigil above you would enter <b>10</b> to calculate the True Raw for areas without a Large Carapaceon present and <b>18</b> while using base true raw to calculate the attack while in an area with a Carapaceon present such as a Daimyo.');
    }
);
$("#helpSRatk").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('The top most attack level as displayed on SR info, if <b>\'Lv MAX\'</b> enter 100. <br/><br/>If using the values provided by the game menus (<b>4 > 3 > 1 (狀態 > 裝備狀態 > 任務裝備)</b>) enter the values as normal then hit the <b>calculate</b> button to work out true base raw.<br/><img src="./img7/SRattack.png" alt=""><br/>For the above you would enter <b>84</b> as your SR Attack value.');
    }
);
$("#helpDisplayed").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('If you are using game provided values, use the number from <b>4 > 3 > 1 (狀態 > 裝備狀態 > 任務裝備)</b> in the game menus and then enter the values of your SR Attack Level and Sigils and hit the minus button next to <b>True Raw</b> to calculate your weapon\'s actual base True Raw.<br/><img src="./img7/displayedraw.png" alt=""><br/><img src="./img7/SigilAttack.png" alt=""><br/><img src="./img7/SRattack.png" alt="">');
    }
);
  
$("#helpSA").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Enter <b>Poison Value</b> as found on Weapon. If using <b>Drug Knowledge</b> hit the tickbox to the right of the entry box.<br/></br>Value generated is only for <b>Poison</b> weapons and is only applied when status damage triggers while a monster is already poisoned.</br></br>For skill adjustments, divide by 10 and then multiply by <b>1.1</b> for a <b>Sigil</b>, <b>1.125</b> for <b>Status Attack Up</b>, <b>1.125</b> for <b>Status Guild Pugi</b>, <b>1.2</b> for <b>Status Phials with Swaxes</b> and then <b>round down</b> and multiply again by 10.<br/><b>E.g.</b> 900 = 90 * 1.1 * 1.125 * 1.125 * 1.2 = 150.35 = 1500');
	}
);
  
$("#helpAdd,#helpAdd2").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Enter any other additional damage to be calculated against only the defense rate such as Bombs, Blast, manually calculated Status Assault, etc.');
	}
);

$("#helpShelling").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('Enter the number the game provides in <b>4 > 3 > 1 (狀態 > 裝備狀態 > 任務裝備)</b> while on quest, this scales with Sigils and SR/GSR progression.<br/><img src="./img7/displayedraw.png" alt="">');
	}
);

$("#helpSweet").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('1.05x with center of a GS or LS. Generally 1.0x with everything else assuming green or higher sharpness.');
	}
);


$("#helpCorrection").click(
    function(){
		$("#helpbox,#backgrounddiv").fadeToggle('75');
		$("#helpbox").html('<b>1.0x</b> in most situations.<br/>SnS and GS modifiers are automatically calculated in their motion tables where relevant.<br/>You can use <b>0.72x</b> for Lance Impact Damage calculations.<br/>Use <b>1.13</b> for Transcend Raw Buff.<br/>Use <b>1.2</b> for Raviente Power Sword Crystals.');
	}
);

$("#importLtoR").click(
		function(){
			rawImport();
		}
);
$("#importLtoRranged").click(
		function(){
			rawImportRanged();
		}
);

$("#importmulti").click(
		function(){
			setCrit();
		}
);

	function rawImport(){
		processAC();
		if( confirm ('Import raw from Attack Calculator?') ){
			document.getElementById('trueraw').value = parseInt($("#ACtrueout").html());
			var weapontypemulti = fetchmulti('weapontype');
			document.getElementById('displayedattack').value = Math.floor(getID('trueraw') * weapontypemulti );	
		} else {
			
		};
				processall();

	};

	function rawImportRanged(){
		processAC();
		if( confirm ('Import raw from Attack Calculator?') ){
			document.getElementById('ACtrueoutHolder').value = parseInt($("#ACtrueout").html());
			document.getElementById('rangeddisplayedattack').value = Math.floor(getIDtrueraw('ACtrueoutHolder') * 1.2 );	
		} else {
			
		};
		processranged();
	};
	
//=============//
// Attack Calc //
//=============//
	
	$("#subtractExtra").click(
    function(){
		if (confirm('Subtract SR Attack and Sigils to calculate base attack?')) {
		var ACweapontypemulti = fetchmulti('weapontype');
		document.getElementById('trueraw').value = +getID('trueraw') - +getID('ACsrattack') - (+getID('ACsigil') + +getID('ACsigil2') + +getID('ACsigil3')) ;
		document.getElementById('displayedattack').value = Math.floor(getID('trueraw') * ACweapontypemulti );	
		processAC();
	} else {
	}
	});
	
	function processAC(){
		if (getID('AffinitySW') >= 1){
			var starvingwolfaffinity = 50;
		} else {
			var starvingwolfaffinity = 0;
		}
	  if (getID('AffinityCeaseless') == 1){
			var ceaselessaffinity = 35;
	  } else if (getID('AffinityCeaseless') == 2){
			var ceaselessaffinity = 50;
	  } else if (getID('AffinityCeaseless') == 3){
			var ceaselessaffinity = 60;
	  } else {
			var ceaselessaffinity = 0;
	  }		
		
		if (getID('ACfurious') == 70){
			furiousAff = 10;
		} else if (getID('ACfurious') == 100){
			furiousAff = 25;
		} else if (getID('ACfurious') == 180){
			furiousAff = 40;
		} else {
			furiousAff = 0;
			
		}
		
		var aoeAff = ((20 * +getID('aoeAffCount')) + (+getID('aoeAff') * 2));
		if(getID('aoeAffCount') == 0 || getID('aoeAff') == 0){
			aoeAff = 0;
		}
		
		
		var totalaffinityOut = (+getID('AffinityIssen') + +getID('AffinitySharp') + +getID('AffinitySigils') + +getID('AffinitySigils2') + +getID('AffinitySigils3') + +getID('AffinityStylerank') + +getID('AffinityExpert') + +getID('AffinityNatural') + +getID('AffinityFlash')  + +getID('AffinityGSAF') + +getID('AffinityDrink') + starvingwolfaffinity + ceaselessaffinity + furiousAff + aoeAff);    
		$("#totalaffinityOut").text(totalaffinityOut);
	
	
	var missionreq = [1, 3, 5, 6, 7, 9, 12, 13, 15, 17, 18, 20, 22, 23, 24, 25, 28, 30, 31, 33, 36, 37, 38, 39, 41, 42, 44, 46, 47, 48, 49, 51, 53, 54, 55, 57, 59, 60, 62, 64, 65, 66, 67, 70, 72, 73, 75, 76, 78, 79, 81, 83, 84, 86, 88, 89, 90, 91, 94, 95, 96, 97, 99, 101, 102, 104, 106, 107, 108, 109, 112, 113, 114, 115, 117, 118, 120, 121, 123, 125, 126, 128, 130, 131, 132, 133, 135, 137, 138, 139, 141, 143, 144, 146, 148, 150, 151, 153, 154, 156, 157, 159, 160, 161, 162, 164, 166, 167, 169, 170, 171, 172, 173, 174, 175, 176, 177, 179, 180, 181, 182, 183, 184, 185, 187, 188, 189, 190, 191, 192, 193, 195, 196, 197, 198, 199, 200, 201, 203, 204, 205, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 217, 219, 220, 221, 222, 223, 224, 225, 227, 228, 229, 230, 231, 232, 233, 235, 236, 237, 238, 239, 240, 241, 243, 244, 245, 246, 247, 248, 249];
		
	
	if (getID('weaponclass') == 0){
	var ACweapontypemulti = fetchmulti('weapontype');
	} else {
	var ACweapontypemulti = 1.2;
	}
	$(document.body).on('change','#ACweapontype',function(){
		document.getElementById('displayedattack').value = Math.ceil(getID('trueraw') * ACweapontypemulti );
	});

	$(document.body).on('change','#trueraw',function(){
		document.getElementById('displayedattack').value = Math.floor(getID('trueraw') * ACweapontypemulti );	
	});

	$(document.body).on('change','#displayedattack',function(){
		document.getElementById('trueraw').value = Math.ceil(getID('displayedattack') / ACweapontypemulti );
	});
	
	if(getID('ACadvlvl') != 0){
		if(getID('ACadvfloor') > 10){
			if(+getID('ACadvfloor') > 26){
				AdvFloors = 21;
			} else {
				AdvFloors = +getID('ACadvfloor') - 5;
			}
			var RoadAdvancement = +getID('ACadvlvl') + +(Math.floor((AdvFloors - 1) / 5) * 10);
		} else if (getID('ACadvfloor') > 5){
			var RoadAdvancement = +getID('ACadvlvl');
		} else {
			var RoadAdvancement = 0; 
		}
	} else {
			var RoadAdvancement = 0; 		
	}
	
	if(getID('ACvigup') == 1 && getID('ACadren') == 1.15){
		if(getID('weaponclass') == 0){
			var VigAddition = 100;
		} else {
			var VigAddition = 50;
		};
	} else {
		var VigAddition = 0;
	}
	
	var caravanadd = Math.floor( +document.getElementById('trueraw').value * +document.getElementById('ACcaravan').value );


	// Obscurity
	if(getID('weaponclass') == 0){
		// get actual weapon
		var weapontypevari = getID('weapontype');
		if(weapontypevari == 1 || weapontypevari == 7 || weapontypevari == 8 ||weapontypevari == 9){
		// Sns, Lance, Gl, Tonfa
			obscurityArray = [ 0, 40, 80, 120, 160, 200, 220, 240, 260, 280, 300, 70, 140, 210, 240, 270, 300 ];
			var patientdefenderAttack = obscurityArray[getID('ACpatient')];
		} else if(weapontypevari == 3 || weapontypevari == 10 || weapontypevari == 11){
		// GS, Swaxe, Magnet Spike
			obscurityArray = [ 0, 30, 60, 90, 120, 150, 165, 180, 195, 210, 225, 50, 100, 150, 175, 200, 225 ];
			var patientdefenderAttack = obscurityArray[getID('ACpatient')];
		} else if(weapontypevari == 4){
		// LS
			obscurityArray = [ 0, 20, 40, 60, 80, 100, 110, 120, 130, 140, 150, 30, 60, 90, 110, 130, 150 ];
			var patientdefenderAttack = obscurityArray[getID('ACpatient')];
		} else {
			var patientdefenderAttack = 0;
		}
	} else {
		var patientdefenderAttack = 0;
	}
	
//	alert(getID('ACweapontype'));
	
	var lengthtype = +document.getElementById('AClengthup').value;
	if( lengthtype == 1){
		var truerawvalue = Math.ceil( +document.getElementById('trueraw').value - ((+document.getElementById('trueraw').value * 0.07) + 0.7) );
	}else if( lengthtype == 2){
		var truerawvalue = Math.ceil( +document.getElementById('trueraw').value - ((+document.getElementById('trueraw').value * 0.07) + 1) );
	}else if( lengthtype == 0){
		var truerawvalue = +document.getElementById('trueraw').value;
	}
	
	/* Crit Conversion */
	if (document.getElementById('ACcritconv').value < 101){
		if (document.getElementById('ACcritup').value == 1){
			var critconversion = 0 + Math.floor((Math.sqrt(+document.getElementById('AffinityNatural').value)) * 5);
		} else if (document.getElementById('ACcritup').value == 2){ 
			var critconversion = 0 + Math.floor((Math.sqrt(+document.getElementById('AffinityNatural').value)) * 10);
		}else {
			var critconversion = 0;
		}
	} else {
		if (document.getElementById('ACcritup').value == 1){
			var critconversion = Math.floor((Math.sqrt(+document.getElementById('ACcritconv').value - 100)) * 7) + Math.floor((Math.sqrt(+document.getElementById('AffinityNatural').value)) * 5);
		} else if (document.getElementById('ACcritup').value == 2){
			var critconversion = Math.floor((Math.sqrt(+document.getElementById('ACcritconv').value - 100)) * 7) + Math.floor((Math.sqrt(+document.getElementById('AffinityNatural').value)) * 10);
		} else {
			var critconversion = Math.floor((Math.sqrt(+document.getElementById('ACcritconv').value - 100)) * 7);
		}
	};
	
	/* base to multiply */
	
	/* drug knowledge add */


	if(getID('drugknowledgeToggle') == 1){
		var furious = furiousMulti();
		var DrugKnowledgeRaw = Math.floor(Math.floor((+getID('statusvalue') * +getID('statusStatusattack') * +getID('statusGuildpugi') *  +getID('statusSigil') * furious)/10) * +getID('drugknowledgeupToggle') * 0.658);
	} else {
		var DrugKnowledgeRaw = 0;
	}
	
	var zeniAtk = 30 + (20 * getID('zeniAtk'));
	var aoeAtk = ((25 * +getID('aoeAtkCount')) + (+getID('aoeAtk') * 5));
	
	if(getID('zeniAtk') == 0){
		zeniAtk = 0;
	}
	if(getID('aoeAtkCount') == 0 || getID('aoeAtk') == 0){
		aoeAtk = 0;
	}
	
	
	
	
	/* Rush / Stylish Assault / Vampirism / Flash Conversion / Obscurity / Incitement / Furious / Vigorous Up
	does not get multiplied by horn */	
	var attackB =  +document.getElementById('ACrush').value + +document.getElementById('ACstylishass').value + +document.getElementById('ACfurious').value + +VigAddition + +critconversion+ +document.getElementById('ACVamp').value + +patientdefenderAttack + +document.getElementById('ACincite').value;
	
	/* takes all multipliers */
	var attackA = +truerawvalue + +document.getElementById('ACpassives').value + (+document.getElementById('ACsigil').value + +document.getElementById('ACsigil2').value + +document.getElementById('ACsigil3').value ) + +document.getElementById('ACconqatk').value + +document.getElementById('ACconqpot').value + +document.getElementById('ACatkskill').value + +document.getElementById('ACfood').value + +document.getElementById('ACseeds').value + +document.getElementById('ACsrattack').value + +document.getElementById('ulSigil').value + DrugKnowledgeRaw + +document.getElementById('ACdure').value + +document.getElementById('AClonewolf').value + +caravanadd + +document.getElementById('ACrising').value + +RoadAdvancement  + Math.floor(+document.getElementById('ACdrug').value * 0.025) + +document.getElementById('ACconsumption').value + +document.getElementById('ACroadlast').value + +document.getElementById('AClance').value + +document.getElementById('ACtower').value + zeniAtk + aoeAtk;
	

	
	/* multiplication */ 
	
	// ((weapon + AttackA) * horn + AttackB * multis + addititive
	
	var multis = Math.floor((Math.floor(attackA * +document.getElementById('AChh').value) + attackB) * +document.getElementById('ACadren').value * +document.getElementById('ACcomsup').value * +document.getElementById('ACdstonfa').value * +document.getElementById('AChiden').value * +document.getElementById('AChammer').value)
	
	/* flat additions */
	var additions = +document.getElementById('ACpartnyaabond').value + +document.getElementById('ACbondhunter').value + +document.getElementById('ACassist').value + +document.getElementById('ACsoul').value + +document.getElementById('ACarmour1').value + +document.getElementById('ACarmour2').value + +document.getElementById('ACarmourG').value + +document.getElementById('ACsecrettech').value;
	//alert(additions)
	//alert(multis)
	
	/* actual output */
	var lengthup = 0;
		
		$("#ACtrueout").text(Math.floor( +additions +  +multis ));
		$("#ACtrueoutHolder").val(Math.floor( +additions +  +multis ));
		
		$("#ACdisplayout").text(Math.floor((Math.floor( +additions + Math.floor( +multis ))) * ACweapontypemulti ));
		
		var atkceil = Math.ceil( (Math.floor( +additions +  +multis ) - 800) / 40 );
		if ( atkceil < 0){
			$("#AttackCeiling").text(0);
			$("#MissionsNeeded").text(0);
		} else if (atkceil > 110 && atkceil < 180) {
			$("#AttackCeiling").html(atkceil);
			$("#MissionsNeeded").text(missionreq[atkceil-1]);			
		} else if (atkceil > 180) {
			$("#AttackCeiling").html("180");
			$("#ACtrueout").text("8000");
			$("#ACdisplayout").text( Math.floor(8000 * ACweapontypemulti));
			$("#MissionsNeeded").text(249);
		} else {
			$("#AttackCeiling").text(atkceil);
			if (atkceil <= 0){
			$("#MissionsNeeded").text(0);
			} else {
			$("#MissionsNeeded").text(missionreq[atkceil-1]);
			}			
		};		
		
		var roundingcheck = Math.floor((Math.floor( +additions + Math.floor( +multis ))) * ACweapontypemulti );
	};

	

	


processAC();
$('input').blur(processAC);
$('input').change(processAC);
$('select').blur(processAC);
$('select').change(processAC);
	
$('#abnormalityToggle').change(function(){
	if(getID('abnormalityToggle') == 0){
	$('#drugknowledgeToggle').val(0);
	$('#statusAssaultToggle').val(0);
	$('#statusStatusattack').val(1);
	} else {
	$('#drugknowledgeToggle').val(1);
	$('#statusAssaultToggle').val(1);
	$('#statusStatusattack').val(1.125);
	}
})

if (getID('weaponclass') == 0){
	document.getElementById('ACweapontype').value = getID('weapontype');
} else {
	document.getElementById('ACweapontype').value = 10 + +getID('rangedweapontype');
}
	
//	ACprocessall();
	
//================//
// Return Multies //
//================//

function fetchmulti(idtoget){
	var weapontypevari = document.getElementById(idtoget).value;
	if(weapontypevari == 1 || weapontypevari == 2){
		return 1.4;
	} else if( weapontypevari == 3 || weapontypevari == 4){
		return 4.8;
	} else if( weapontypevari == 5 || weapontypevari == 6){
		return 5.2;
	} else if( weapontypevari == 7 || weapontypevari == 8){
		return 2.3;
	} else if( weapontypevari == 9 ){
		return 1.8;
	} else if( weapontypevari == 10 || weapontypevari == 11 ){
		return 5.4;
	} else { 
		return 1.2;
	};	
};





/*function fetchstatusassault(){
	alert('test');
	var weapontypevari = document.getElementById('weapontype').value;
	if(+getID('statustype') == 1){
	if(weapontypevari == 1){
		//sns
		return 12;
	} else if( weapontypevari == 2 ){
		//ds
		return 10;
	} else if( weapontypevari == 3 ){
		//gs
		return 20;
	} else if( weapontypevari == 4 ){
		//ls
		return 11;
	} else if( weapontypevari == 5 ){
		//hammer
		return 11;
	} else if( weapontypevari == 6 ){
		//hh
		return 13;
	} else if( weapontypevari == 7 ){
		//lance
		return 14;
	} else if( weapontypevari == 8 ){
		//gl
		return 10;
	} else if( weapontypevari == 9 ){
		//tonfa
		return 10;
	} else if( weapontypevari == 10 ){
		//swaxe
		return 11;
	};
}else if(+getID('statustype') == 2){
	if(weapontypevari == 1){
		//sns
		return 7;
	} else if( weapontypevari == 2 ){
		//ds
		return 2;
	} else if( weapontypevari == 3 ){
		//gs
		return 10;
	} else if( weapontypevari == 4 ){
		//ls
		return 7;
	} else if( weapontypevari == 5 ){
		//hammer
		return 10;
	} else if( weapontypevari == 6 ){
		//hh
		return 7;
	} else if( weapontypevari == 7 ){
		//lance
		return 7;
	} else if( weapontypevari == 8 ){
		//gl
		return 9;
	} else if( weapontypevari == 9 ){
		//tonfa
		return 6;
	} else if( weapontypevari == 10 ){
		//swaxe
		return 7;
	};
} else {
	return 0;
}
};*/

	function getIDtrueraw(idtoget){
		if(document.getElementById(idtoget).value <= 8000){
			return document.getElementById(idtoget).value;
		} else if (document.getElementById(idtoget).value >= 8001){
			return 8000;
		};
	};
	function getIDtext(idtoget){return document.getElementById(idtoget).text;};
	function setID(idtoget,idval){document.getElementById(idtoget).value = idval;};
	function getIDselecttext(idtoget){
	return $('#' + idtoget + ' option:selected').text();
	};
	function setIDselecttext(idtoget,idval){
	$("#" + idtoget + " option").each(function() {
	  if($(this).text() == idval) {
		$(this).attr('selected', 'selected');            
	  }                        
	});
	};



//===================//
// Ranged Processing //
//===================//

	function processranged(){
	if( document.getElementById('weaponclass').value == 1){
	var bowchargesetting = document.getElementById('bowchargemodifier').value;
	var boworbowgun = document.getElementById('rangedweapontype').value;
		if( boworbowgun == 1 ){
		//is lbg
		$("#rangedelementtypeBowgun").hide();
		$("#rangedelementtypeBow").hide();
		$("#bowgunshotmodifier").show();
		$("#bowchargemodifier").hide();
		$("#shotmultiheader").text('Shot Multiplier');
		$("#coatingsrow").hide();	
		$("#HBGchargerow").hide();
		$("#HBGcompressed").hide();
		$("#HBGelecompressed").hide();
		$("#bowquickshotrow").hide();
		$("#shotmultiplierrow").show();
		$(".boweleshot").hide();
		$("#eleheader").hide();
		var rangedweaponelementtype = document.getElementById('rangedelementtypeBowgun').value;
		var shotadjustedmotion = document.getElementById('rangedmotionvalue').value 
		}else if( boworbowgun == 2 ){
		//is hbg
		$("#rangedelementtypeBowgun").hide();
		$("#rangedelementtypeBow").hide();
		$("#bowgunshotmodifier").show();
		$("#bowquickshotrow").hide();
		$("#bowchargemodifier").hide();
		$("#HBGchargerow").show();
		$("#HBGcompressed").show();
		$("#HBGelecompressed").show();
		$("#bowquickshotrow").hide();
		$("#coatingsrow").hide();
		$("#shotmultiplierrow").hide();
		$(".boweleshot").hide();
		var rangedweaponelementtype = document.getElementById('rangedelementtypeBowgun').value;
		var shotadjustedmotion = document.getElementById('rangedmotionvalue').value * document.getElementById('HBGchargemulti').value;
		}else  if( boworbowgun == 3 ){
		//is bow
		$("#rangedelementtypeBow").show();
		$("#rangedelementtypeBowgun").hide();
		$("#bowchargemodifier").show();
		$("#bowquickshotrow").show();
		$("#bowgunshotmodifier").hide();
		$("#HBGchargerow").hide();	
		$("#coatingsrow").show();
		$("#HBGcompressed").hide();	
		$("#HBGelecompressed").hide();
		$("#shotmultiheader").text('Charge Multiplier');
		$("#shotmultiplierrow").show();
		$(".boweleshot").show();
		$("#eleheader").show();
		var rangedweaponelementtype = document.getElementById('rangedelementtypeBow').value;
		} 
	} else {
		$("#rangedelementtypeBowgun").hide();
		$("#rangedelementtypeBow").hide();
		$("#bowgunshotmodifier").hide();
		$("#bowchargemodifier").hide();
		$("#coatingsrow").hide();	
		$("#HBGchargerow").hide();
		$("#HBGcompressed").hide();
		$("#HBGelecompressed").hide();
		$("#shotmultiplierrow").hide();
		$("#bowquickshotrow").hide();
		$(".boweleshot").hide();
		$("#eleheader").hide();		
	};

	if(rangedweaponelementtype == 0){ rangedfireval = 0; rangedwaterval = 0; rangedthunderval = 0; rangediceval = 0; rangeddragonval = 0;
	//Fire
	} else if(rangedweaponelementtype == 1){ rangedfireval = 1; rangedwaterval = 0; rangedthunderval = 0; rangediceval = 0; rangeddragonval = 0;						
	//Water
	} else if(rangedweaponelementtype == 2){ rangedfireval = 0; rangedwaterval = 1; rangedthunderval = 0; rangediceval = 0; rangeddragonval = 0;
	//Thunder
	} else if(rangedweaponelementtype == 3){ rangedfireval = 0; rangedwaterval = 0; rangedthunderval = 1; rangediceval = 0; rangeddragonval = 0;
	//Dragon
	} else if(rangedweaponelementtype == 4){ rangedfireval = 0; rangedwaterval = 0; rangedthunderval = 0; rangediceval = 0; rangeddragonval = 1;
	//Ice
	} else if(rangedweaponelementtype == 5){ rangedfireval = 0; rangedwaterval = 0; rangedthunderval = 0; rangediceval = 1; rangeddragonval = 0;
	//Light
	} else if(rangedweaponelementtype == 6){ rangedfireval = 0.7; rangedwaterval = 0; rangedthunderval = 0.7; rangediceval = 0; rangeddragonval = 0;
	//Blaze
	} else if(rangedweaponelementtype == 7){ rangedfireval = 0.7; rangedwaterval = 0; rangedthunderval = 0; rangediceval = 0; rangeddragonval = 0.7;
	//Tenshou
	} else if(rangedweaponelementtype == 8){ rangedfireval = 0.3; rangedwaterval = 1; rangedthunderval = 0.7; rangediceval = 0; rangeddragonval = 0;
	//Lightning Pole
	} else if(rangedweaponelementtype == 9){ rangedfireval = 0; rangedwaterval = 0; rangedthunderval = 0.7; rangediceval = 0; rangeddragonval = 0.7;
	//Okikio
	} else if(rangedweaponelementtype == 10){ rangedfireval = 0.8; rangedwaterval = 0; rangedthunderval = 0; rangediceval = 0.8; rangeddragonval = 0.4;
	//Black Dragon
	} else if(rangedweaponelementtype == 11){ rangedfireval = 0.5; rangedwaterval = 0; rangedthunderval = 0; rangediceval = 0; rangeddragonval = 1.5;
	//Crimson Demon
	} else if(rangedweaponelementtype == 12){ rangedfireval = 1.5; rangedwaterval = 0; rangedthunderval = 0; rangediceval = 0; rangeddragonval = 0.5;
	//Darkness
	} else if(rangedweaponelementtype == 13){ rangedfireval = 0; rangedwaterval = 0; rangedthunderval = 0; rangediceval = 0.7; rangeddragonval = 0.7;
	//Music
	} else if(rangedweaponelementtype == 14){ rangedfireval = 0; rangedwaterval = 1; rangedthunderval = 0; rangediceval = 1; rangeddragonval = 0;
	//Sound
	} else if(rangedweaponelementtype == 15){ rangedfireval = 0; rangedwaterval = 1; rangedthunderval = 0; rangediceval = 0; rangeddragonval = 1;
	//Wind
	} else if(rangedweaponelementtype == 16){ rangedfireval = 0; rangedwaterval = 0; rangedthunderval = 0.8; rangediceval = 0.8; rangeddragonval = 0;
	} else if(rangedweaponelementtype == 17){ rangedfireval = 1.25; rangedwaterval = 0; rangedthunderval = 0; rangediceval = 1.25; rangeddragonval = 0;
	} else if(rangedweaponelementtype == 18){ rangedfireval = 0; rangedwaterval = 0; rangedthunderval = 1.5; rangediceval = 0.0; rangeddragonval = 0.5;
	};
	
	};


	processranged();
//	$('input').blur(processranged);
	$('input').change(processranged);
//	$('select').blur(processranged);
	$('select').change(processranged);
	
	document.getElementById('compressedshotpower').value = Math.floor(getID('HBGshotstocompress') * getID('HBGcompressedshots') );	
		
	$(document.body).on('change','#HBGshotstocompress',function(){
		document.getElementById('compressedshotpower').value = Math.floor(getID('HBGshotstocompress') * getID('HBGcompressedshots') );	
		processranged();
	});
	$(document.body).on('change','#HBGcompressedshots',function(){
		document.getElementById('compressedshotpower').value = Math.floor(getID('HBGshotstocompress') * getID('HBGcompressedshots') );	
		processranged();
	});
	
	$(document.body).on('change','#ACtrueoutHolder',function(){
		document.getElementById('rangeddisplayedattack').value = Math.floor(getIDtrueraw('ACtrueoutHolder') * 1.2 );	
	});

	$(document.body).on('change','#rangeddisplayedattack',function(){
		document.getElementById('ACtrueoutHolder').value = Math.ceil(getID('rangeddisplayedattack') / 1.2 );
	});
	
	
		
		
		
//=============//
// Melee Calc //
//=============//
	function setCrit(){
	var critvalue = 1.25;
	if (getID('AffinitySW') == 2){
	var critvalue = critvalue + 0.1;
	}
	
	  if (getID('AffinityCeaseless') == 1){
			var critvalue = critvalue + 0.1;
	  } else if (getID('AffinityCeaseless') == 2){
			var critvalue = critvalue + 0.15;
	  } else if (getID('AffinityCeaseless') == 3){
			var critvalue = critvalue + 0.2;
	  } else {
			var critvalue = critvalue;
	  }
	  
	if (getID('AffinityExpert') == 100){
	var critvalue = critvalue + 0.25;
	setID('AffinityIssen','0');
	processAC();
	} else if (getID('AffinityIssen') == 5){
	var critvalue = critvalue + 0.1;
	} else if (getID('AffinityIssen') == 10){
	var critvalue = critvalue + 0.15;
	} else if (getID('AffinityIssen') == 20){
	var critvalue = critvalue + 0.25;
	}
	$('#critmulti').val(critvalue.toFixed(2));
	
	
	}

	function getID(idtoget){return document.getElementById(idtoget).value}




	function processall(){
	processAC();
		
		
	if($('#weapontype').find('option:selected').text() == 'Sword and Shield'){
		document.getElementById('wcorrection').value = 1.25;
	} else {
		document.getElementById('wcorrection').value = 1.0;
	}
		

	/* Weapon Multipliers */
	var weapontypemulti = fetchmulti('weapontype');

	// GL Shalle Norm1-9,Long1-9,Spread1-9
	var shellvalues = [16, 23, 30, 35, 40, 65, 75, 85, 99, 24, 33, 42, 48, 53, 84, 95, 106, 122, 31, 44, 57, 63, 68, 107, 119, 133, 153];
	var gunlanceraw = getID('gunlanceraw') / 2.3;
	var shelltype = getID('shellingtype') - 1;
	
	if(getID('shellingtype') > 18){
		var shelldamage = 0.09 * gunlanceraw + shellvalues[shelltype];
	} else if(getID('shellingtype') > 9){
		var shelldamage = 0.10 * gunlanceraw + shellvalues[shelltype];
	} else if(getID('shellingtype') > 0){
		var shelldamage = 0.11 * gunlanceraw + shellvalues[shelltype];
	}

	$("#shellout").html(Math.floor(shelldamage));
	$("#shelloutQR").html(Math.floor(shelldamage * 1.5));
	

	
	/* Raw Stats */
	/* Sharpness Multipliers */	
	var weaponsharpmulti = document.getElementById('sharpness').value;
	if( weaponsharpmulti == 0) { rawsharpnessmulti = 0.6;}
	else if( weaponsharpmulti == 1) { rawsharpnessmulti = 0.85;}
	else if( weaponsharpmulti == 2) { rawsharpnessmulti = 1.1;}
	else if( weaponsharpmulti == 3) { rawsharpnessmulti = 1.325;}
	else if( weaponsharpmulti == 4) { rawsharpnessmulti = 1.45;}
	else if( weaponsharpmulti == 5) { rawsharpnessmulti = 1.6;}
	else if( weaponsharpmulti == 6) { rawsharpnessmulti = 1.7;}
	else if( weaponsharpmulti == 7) { rawsharpnessmulti = 1.8;};
	
	/* Elemental Stats */
	/* Sharpness Multipliers */
	var weaponelementtype = getID('elementtype');
	var weaponsharpmulti = document.getElementById('sharpness').value;

	if( weaponsharpmulti == 0) { elesharpnessmulti = 0.6;}
	else if( weaponsharpmulti == 1) { elesharpnessmulti = 0.85;}
	else if( weaponsharpmulti == 2) { elesharpnessmulti = 1.1;}
	else if( weaponsharpmulti == 3) { elesharpnessmulti = 1.325;}
	else if( weaponsharpmulti == 4) { elesharpnessmulti = 1.45;}
	else if( weaponsharpmulti == 5) { elesharpnessmulti = 1.6;}
	else if( weaponsharpmulti == 6) { elesharpnessmulti = 1.7;}
	else if( weaponsharpmulti == 7) { elesharpnessmulti = 1.8;};

	/* define elements */
	// Fire
	if(weaponelementtype == 0){ fireval = 1; waterval = 0; thunderval = 0; iceval = 0; dragonval = 0;
	$('.elementalMult.fire').show();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').hide(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();	
	// Water
	} else if(weaponelementtype == 1){ fireval = 0; waterval = 1; thunderval = 0; iceval = 0; dragonval = 0;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').show();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').hide(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Thunder
	} else if(weaponelementtype == 2){ fireval = 0; waterval = 0; thunderval = 1; iceval = 0; dragonval = 0;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').show();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').hide(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Dragon
	} else if(weaponelementtype == 3){ fireval = 0; waterval = 0; thunderval = 0; iceval = 0; dragonval = 1;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').show(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Ice
	} else if(weaponelementtype == 4){ fireval = 0; waterval = 0; thunderval = 0; iceval = 1; dragonval = 0;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').show();	$('.elementalMult.dragon').hide(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Light
	} else if(weaponelementtype == 5){ fireval = 0.7; waterval = 0; thunderval = 0.7; iceval = 0; dragonval = 0;
	$('.elementalMult.fire').show();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').show();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').hide(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Blaze
	} else if(weaponelementtype == 6){ fireval = 0.7; waterval = 0; thunderval = 0; iceval = 0; dragonval = 0.7;
	$('.elementalMult.fire').show();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').show(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Tenshou
	} else if(weaponelementtype == 7){ fireval = 0.3; waterval = 1; thunderval = 0.7; iceval = 0; dragonval = 0;
	$('.elementalMult.fire').show();	$('.elementalMult.water').show();	$('.elementalMult.thunder').show();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').hide(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Lightning Rod
	} else if(weaponelementtype == 8){ fireval = 0; waterval = 0; thunderval = 0.7; iceval = 0; dragonval = 0.7;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').show();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').show(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Seraphim
	} else if(weaponelementtype == 9){ fireval = 0.8; waterval = 0; thunderval = 0; iceval = 0.8; dragonval = 0.4;
	$('.elementalMult.fire').show();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').show();	$('.elementalMult.dragon').show(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	//Black Dragon
	} else if(weaponelementtype == 10){ fireval = 0.5; waterval = 0; thunderval = 0; iceval = 0; dragonval = 1.5;
	$('.elementalMult.fire').show();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').show(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Crimson Demon
	} else if(weaponelementtype == 11){ fireval = 1.5; waterval = 0; thunderval = 0; iceval = 0; dragonval = 0.5;
	$('.elementalMult.fire').show();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').show(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Darkness
	} else if(weaponelementtype == 12){ fireval = 0; waterval = 0; thunderval = 0; iceval = 0.7; dragonval = 0.7;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').show();	$('.elementalMult.dragon').show(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Music
	} else if(weaponelementtype == 13){ fireval = 0; waterval = 1; thunderval = 0; iceval = 1; dragonval = 0;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').show();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').show();	$('.elementalMult.dragon').hide(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Sound
	} else if(weaponelementtype == 14){ fireval = 0; waterval = 1; thunderval = 0; iceval = 0; dragonval = 1;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').show();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').show(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Raw
	} else if(weaponelementtype == 16){ fireval = 0; waterval = 0; thunderval = 0; iceval = 0; dragonval = 0;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').hide();
	$('.elementalMult.ice').hide();	$('.elementalMult.dragon').hide(); $('.meleeEleproc').hide();  $('.extraeleMelee ').hide();
	// Wind
	} else if(weaponelementtype == 15){ fireval = 0; waterval = 0; thunderval = 0.8; iceval = 0.8; dragonval = 0;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').show();
	$('.elementalMult.ice').show();	$('.elementalMult.dragon').hide(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Burning Zero
	} else if(weaponelementtype == 17){ fireval = 1.25; waterval = 0; thunderval = 0; iceval = 1.25; dragonval = 0;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').show();
	$('.elementalMult.ice').show();	$('.elementalMult.dragon').hide(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	// Emperor's Roar
	} else if(weaponelementtype == 18){ fireval = 0; waterval = 0; thunderval = 1.5; iceval = 0; dragonval = 0.5;
	$('.elementalMult.fire').hide();	$('.elementalMult.water').hide();	$('.elementalMult.thunder').show();
	$('.elementalMult.ice').show();	$('.elementalMult.dragon').hide(); $('.meleeEleproc').show();  $('.extraeleMelee ').show();
	
	};

	};
	
	


/* Update displayed and true raw values on changes */	   
	$(document.body).on('change','#weapontype',function(){
	var weapontypemulti = fetchmulti('weapontype');
	document.getElementById('displayedattack').value = Math.floor(getIDtrueraw('ACtrueoutHolder') * weapontypemulti );
			if($('#weapontype').find('option:selected').text() == 'Sword and Shield'){
				document.getElementById('wcorrection').value = 1.25;
			} else {
				document.getElementById('wcorrection').value = 1.0;
			}
	});
	
	
	
	$(document.body).on('change','#trueraw',function(){
		var weapontypemulti = fetchmulti('weapontype');
		document.getElementById('displayedattack').value = Math.floor(getIDtrueraw('trueraw') * weapontypemulti );	
	});
	$(document.body).on('change','#displayedattack',function(){
		var weapontypemulti = fetchmulti('weapontype');
		document.getElementById('trueraw').value = Math.ceil(getID('displayedattack') / weapontypemulti );
		document.getElementById('displayedattack').value = Math.floor(getIDtrueraw('trueraw') * weapontypemulti );	
	});
	
	


	processall();
	processranged();

	$('input').blur(processall);
	$('input').change(processall);
	$('select').blur(processall);
	$('select').change(processall);

/* as named */
function fetchstatusassault(){
	var weapontypevari = document.getElementById('weapontype').value;
	
	if(+getID('statustype') == 1){
		if(weapontypevari == 1){
			return 12;
		} else if( weapontypevari == 2 ){
			return 10;
		} else if( weapontypevari == 3 ){
			return 20;
		} else if( weapontypevari == 4 ){
			return 11;
		} else if( weapontypevari == 5 ){
			return 11;
		} else if( weapontypevari == 6 ){
			return 13;
		} else if( weapontypevari == 7 ){
			return 14;
		} else if( weapontypevari == 8 ){
			return 10;
		} else if( weapontypevari == 9 ){
			return 10;
		} else if( weapontypevari == 10 ){
			return 11;
		} else if( weapontypevari == 11 ){
			return 13;
		};
	}else if(+getID('statustype') == 2){
		if(weapontypevari == 1){
			//sns
			return 7;
		} else if( weapontypevari == 2 ){
			//ds
			return 2;
		} else if( weapontypevari == 3 ){
			//gs
			return 10;
		} else if( weapontypevari == 4 ){
			//ls
			return 7;
		} else if( weapontypevari == 5 ){
			//hammer
			return 10;
		} else if( weapontypevari == 6 ){
			//hh
			return 7;
		} else if( weapontypevari == 7 ){
			//lance
			return 7;
		} else if( weapontypevari == 8 ){
			//gl
			return 9;
		} else if( weapontypevari == 9 ){
			//tonfa
			return 6;
		} else if( weapontypevari == 10 ){
			//swaxe
			return 7;
		} else if( weapontypevari == 11 ){
			//magspike
			return 6;
		};
	} else {
		return 0;
	}
};
//===============//
// Motion Tables //
//===============//
function forcedupdate(){
	if( document.getElementById('weaponclass').value == 0){
			if (getID('weapontype') == 1){
			var WeaponType = ".snsmotiontable";
			} else if (getID('weapontype') == 2){
			var WeaponType = ".dsmotiontable";
			} else if (getID('weapontype') == 3){
			var WeaponType = ".gsmotiontable";
			} else if (getID('weapontype') == 4){
			var WeaponType = ".lsmotiontable";
			} else if (getID('weapontype') == 5){
			var WeaponType = ".hammermotiontable";
			} else if (getID('weapontype') == 6){
			var WeaponType = ".huntinghornmotiontable";
			} else if (getID('weapontype') == 7){
			var WeaponType = ".lancemotiontable";
			} else if (getID('weapontype') == 8){
			var WeaponType = ".gunlancemotiontable";
			} else if (getID('weapontype') == 9){
			var WeaponType = ".tonfamotiontable";
			} else if (getID('weapontype') == 10){
			var WeaponType = ".swaxemotiontable";
			} else if (getID('weapontype') == 11){
			var WeaponType = ".magspikemotiontable";
			} 
			processtable(WeaponType,getID('WeaponStyle'))
		}else if( document.getElementById('weaponclass').value == 1){
		
			if (getID('rangedweapontype') == 1){
			var WeaponType = ".lbgmotiontable";
			} else if (getID('rangedweapontype') == 2){
			var WeaponType = ".hbgmotiontable";
			} else if (getID('rangedweapontype') == 3){
			var WeaponType = ".bowmotiontable";
			} 
			processtableRanged(WeaponType,getID('WeaponStyle'))
		}
}

function processvalues(){
if(getID('autoproc') == 1){
	if( document.getElementById('weaponclass').value == 0){
			if (getID('weapontype') == 1){
			var WeaponType = ".snsmotiontable";
			} else if (getID('weapontype') == 2){
			var WeaponType = ".dsmotiontable";
			} else if (getID('weapontype') == 3){
			var WeaponType = ".gsmotiontable";
			} else if (getID('weapontype') == 4){
			var WeaponType = ".lsmotiontable";
			} else if (getID('weapontype') == 5){
			var WeaponType = ".hammermotiontable";
			} else if (getID('weapontype') == 6){
			var WeaponType = ".huntinghornmotiontable";
			} else if (getID('weapontype') == 7){
			var WeaponType = ".lancemotiontable";
			} else if (getID('weapontype') == 8){
			var WeaponType = ".gunlancemotiontable";
			} else if (getID('weapontype') == 9){
			var WeaponType = ".tonfamotiontable";
			} else if (getID('weapontype') == 10){
			var WeaponType = ".swaxemotiontable";
			} else if (getID('weapontype') == 11){
			var WeaponType = ".magspikemotiontable";
			} 
			processtable(WeaponType,getID('WeaponStyle'))
		}else if( document.getElementById('weaponclass').value == 1){
		
			if (getID('rangedweapontype') == 1){
			var WeaponType = ".lbgmotiontable";
			} else if (getID('rangedweapontype') == 2){
			var WeaponType = ".hbgmotiontable";
			} else if (getID('rangedweapontype') == 3){
			var WeaponType = ".bowmotiontable";
			} 
			processtableRanged(WeaponType,getID('WeaponStyle'))
		}
	} else {
	
}
};

function processvaluesManual(){
	if( document.getElementById('weaponclass').value == 0){
			if (getID('weapontype') == 1){
			var WeaponType = ".snsmotiontable";
			} else if (getID('weapontype') == 2){
			var WeaponType = ".dsmotiontable";
			} else if (getID('weapontype') == 3){
			var WeaponType = ".gsmotiontable";
			} else if (getID('weapontype') == 4){
			var WeaponType = ".lsmotiontable";
			} else if (getID('weapontype') == 5){
			var WeaponType = ".hammermotiontable";
			} else if (getID('weapontype') == 6){
			var WeaponType = ".huntinghornmotiontable";
			} else if (getID('weapontype') == 7){
			var WeaponType = ".lancemotiontable";
			} else if (getID('weapontype') == 8){
			var WeaponType = ".gunlancemotiontable";
			} else if (getID('weapontype') == 9){
			var WeaponType = ".tonfamotiontable";
			} else if (getID('weapontype') == 10){
			var WeaponType = ".swaxemotiontable";
			} else if (getID('weapontype') == 11){
			var WeaponType = ".magspikemotiontable";
			} 
			processtable(WeaponType,getID('WeaponStyle'))
		}else if( document.getElementById('weaponclass').value == 1){
		
			if (getID('rangedweapontype') == 1){
			var WeaponType = ".lbgmotiontable";
			} else if (getID('rangedweapontype') == 2){
			var WeaponType = ".hbgmotiontable";
			} else if (getID('rangedweapontype') == 3){
			var WeaponType = ".bowmotiontable";
			} 
			processtableRanged(WeaponType,getID('WeaponStyle'))
		}
};

// Elemental Exploit or Dissolver for melee
function proceleex(eleexType,hitbox){
	
//	alert(eleexType + ' ' + eleexType);
	
	if (eleexType == 0){
	
	if (getID('weapontype') == 1 || getID('weapontype') == 3 || getID('weapontype') == 4 || getID('weapontype') == 5 || getID('weapontype') == 6 || getID('weapontype') == 7 || getID('weapontype') == 10){
		var eleexploitmod = 15;
	}else if (getID('weapontype') == 2 || getID('weapontype') == 8){
		var eleexploitmod = 10;
	} else{
		var eleexploitmod = 5;
	};
	} else { 
		if (getID('rangedweapontype') == 1){
			var eleexploitmod = 10;
		}else if (getID('rangedweapontype') == 2){
			var eleexploitmod = 5;
		}else if (getID('rangedweapontype') == 3){
			var eleexploitmod = 5;
		};
	}
	
	if(getID('hhweak') == "allelehb" || getID('hhweak') == "hhstack"){
		var hhmod = 4;
	} else {
		var hhmod = 0;
	};
	
	if(+getID('eleex') != 0 && (+getID(hitbox) + +hhmod) < +getID('eleex')){
		var elehbused = +hhmod + +getID(hitbox);
	} else if (+getID('eleex') != 0 && (+getID(hitbox) + +hhmod) >= +getID('eleex')){
		var elehbused = +hhmod + +eleexploitmod + +getID(hitbox);
	} else if (+getID('eleex') == 100){
		var elehbused = +hhmod + +eleexploitmod + +getID(hitbox);
	} else {
		var elehbused = +hhmod + +getID(hitbox);
	};
	return elehbused;
};


// Exploit Weakness, Thunder Clad Tonfa Modes
function exploitweakness(weaponclass,hitbox){
	
	// set hh debuff pool
	if(getID('hhweak') == "rawhb" || getID('hhweak') == "hhstack"){
		var hhmod = 2;
	} else {
		var hhmod = 0;
	};
	// set initial hitbox
	used = +getID(hitbox) + +getID('thunderclad') + +hhmod;
		
	// critical shot, sniper, determination, precision in critical distance
	if(weaponclass == 1){
		 used = used + +getID('sniperraw');
	}
	
	// check if processed hitboxes have been pushed to 35 and then apply EW
	if(+getID('exweak') == 0){
	// skill is off
	} else if (+getID('exweak') == 1 && used >= 35){
	// normal exploit weakness
	var used = used + 5;
	}  else if (+getID('exweak') == 3 && used >= 30){
	// normal exploit weakness
	var used = used + 5;
	} else if (+getID('exweak') == 2){
	//determination is always applied
	var used = used + 5;
	}
	
	// check point breakthrough
	if(+getID('pbreak') == 0){
	// skill is off
	} else if (+getID('pbreak') == 1){
	// normal exploit weakness
	var used = used + 5;
	} else if (+getID('pbreak') == 2){
	// lesser defbuff
	var used = used + 2;
	}
	
	// check acid shot
	if(+getID('acidShot') == 0){
	// skill is off
	} else if (+getID('acidShot') == 1){
	// raw acid
	var used = used + 10;
	} 
	
	return used;
};

function furiousMulti(){
	if(+getID("ACfurious") == 0){
		return 1.00;
	} else if(+getID("ACfurious") == 70){
		return 1.05;
	} else if(+getID("ACfurious") == 100){
		return 1.10;
	} else if(+getID("ACfurious") == 180){
		return 1.20;
	} 
}

function processtable(idtoget,weaponstyle){
// hitbox preprocessing
var elementhitbox0 = proceleex('0','elehb0');
var elementhitbox1 = proceleex('0','elehb1');
var elementhitbox2 = proceleex('0','elehb2');
var elementhitbox3 = proceleex('0','elehb3');
var elementhitbox4 = proceleex('0','elehb4');
var rawhitbox = exploitweakness('0','rawhb');

var furious = furiousMulti();


var aoeEle = ((50 * +getID('aoeEleCount')) + (+getID('aoeEle') * 50));
var zeniEle = 1 + ((1.3 + +getID('zeniEle')) * 0.1);
if(+getID('zeniEle') == 0)
{
	zeniEle = 1;
}
if(+getID('aoeEleCount') == 0 || +getID('aoeEle') == 0)
{
	aoeEle = 0;
}

var usedFire = Math.floor( Math.floor( ((+getID('fakeelement') + (+getID('eleSigil1') * 10) + (+getID('eleSigil2') * 10) + (+getID('eleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('firemulti') * zeniEle * +getID('eleHalk') * +getID('eleHH') * +getID('eleSwaxe') * furious) * fireval)  / 10 * elesharpnessmulti * elementhitbox0 / 100);
var usedWater = Math.floor( Math.floor( ((+getID('fakeelement') + (+getID('eleSigil1') * 10) + (+getID('eleSigil2') * 10) + (+getID('eleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('watermulti') * zeniEle * +getID('eleHalk') * +getID('eleHH') * +getID('eleSwaxe') * furious) * waterval)  / 10 * elesharpnessmulti * elementhitbox1 / 100);
var usedThunder = Math.floor( Math.floor( ((+getID('fakeelement') + (+getID('eleSigil1') * 10) + (+getID('eleSigil2') * 10) + (+getID('eleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('thundermulti') * zeniEle * +getID('eleHalk') * +getID('eleHH') * +getID('eleSwaxe') * furious) * thunderval)  / 10 * elesharpnessmulti * elementhitbox2 / 100);
var usedIce = Math.floor( Math.floor( ((+getID('fakeelement') + (+getID('eleSigil1') * 10) + (+getID('eleSigil2') * 10) + (+getID('eleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('icemulti') * zeniEle * +getID('eleHalk') * +getID('eleHH') * +getID('eleSwaxe') * furious) * iceval)  / 10 * elesharpnessmulti * elementhitbox3 / 100);
var usedDragon = Math.floor( Math.floor( ((+getID('fakeelement') + (+getID('eleSigil1') * 10) + (+getID('eleSigil2') * 10) + (+getID('eleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('dragonmulti') * zeniEle * +getID('eleHalk') * +getID('eleHH') * +getID('eleSwaxe') * furious) * dragonval)  / 10 * elesharpnessmulti * elementhitbox4 / 100);
	
$(idtoget + weaponstyle + ' .mval').each(function()
{
    var $this = $(this);
	if($this[0] === $(idtoget + weaponstyle + ' .mval').last()[0]) {
	$('.motionvaluetable:not(idtoget + weaponstyle)').hide(); 
	$(idtoget + weaponstyle).show();
	if(idtoget == '.tonfamotiontable'){
		if(getID('tonfamode') == 1){
			$(".tonfamotiontable.shortmode").hide();
		} else {
			$(".tonfamotiontable.longmode").hide();
		}
	}
	};


	// handle motions with additional properties
	if( $(this).parent().find('.specialflag').html() == "custommotion"){
		var motionvariable = getID('customMotion');
		var hitcount = getID('customHit');
		var elemulti = getID('customElemental');
		$(this).parent().find('.custommotionvalue').html(motionvariable);
	} else {
	var motionvariable = $(this).html();
	var elemulti = $(this).parent().find('.elemental').html();
	var hitcount = $(this).parent().find('.hitcount').html();
	}
	
	if( getID('fencingtoggle') == 1){	var fencingmod = 1.2;} else {var fencingmod = 1.0;};

	// Reflect
	if( $(this).parent().find('.specialflag').html() == "nocrit"){
		var critmulti = 1.0;
	} else {
		if (getID('averaging') == 0 ){
			var critmulti = +getID('critmulti');
			var totalaffinityused = 100;
		} else if (getID('averaging') == 1 ){
			  if (getID('AffinitySW') >= 1){
					var starvingwolfaffinity = 50;
				} else {
					var starvingwolfaffinity = 0;
			  }
			  if (getID('AffinityCeaseless') == 1){
					var ceaselessaffinity = 35;
				} else if (getID('AffinityCeaseless') == 2){
					var ceaselessaffinity = 50;
			  } else {
					var ceaselessaffinity = 0;
			  }
			var totalaffinityused = (+getID('AffinityIssen') + +getID('AffinitySharp') + +getID('ulSigil') + +getID('AffinitySigils') + +getID('AffinitySigils2') + +getID('AffinitySigils3') + +getID('AffinityStylerank') + +getID('AffinityExpert') + +getID('AffinityNatural') + +getID('AffinityFlash') + starvingwolfaffinity + ceaselessaffinity) ;
			if(totalaffinityused > 100){totalaffinityused = 100}
			else if(totalaffinityused < 0){totalaffinityused = 0}
			var critmulti = (((totalaffinityused / 100) * +getID('critmulti')) + ((1-(totalaffinityused / 100)) * 1));
		} else {
			var critmulti = 1.0;
			var totalaffinityused = 0;
		}
		
	}


	
	// SnS Sigil
	if( $(this).parent().find('.specialflag').html() == "snssigil"){
		if(getID('elementtype') == 16){
			var oldSharp = [0.25,0.5,0.75,1,1.0625,1.125,1.15,1.2]
			var snssigiladded = Math.floor(Math.floor(getIDtrueraw('ACtrueoutHolder') * 0.025 * oldSharp[getID('sharpness')] * (+exploitweakness('1','rawhb')/100)) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2')));
			var critmulti = 1.0;
			var motionvariable = 0;
		} else {
			var motionvariable = 0;
			var snssigiladded = 0;
		};
	} else {
			var snssigiladded = 0;

	}
	
	// GS Charges	
	if( $(this).parent().find('.specialflag').html() == "gscharge1"){
		var flagmulti = 1.1;
	} else if( $(this).parent().find('.specialflag').html() == "gscharge2"){
		var flagmulti = 1.2;
	} else if( $(this).parent().find('.specialflag').html() == "gscharge3"){
		var flagmulti = 1.3;
	} else {
		var flagmulti = 1;
	}
	
	//Transcend
	/*
	var rawTranscend = [1.1, 1.15, 1.2, 1.25, 1.3, 1.5, 1.55, 1.6, 1.75, 1.8, 2, 1]
	var eleTranscend = [1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.09, 1.1, 1.13, 1]
	var rawTmulti = rawTranscend[getID('rawtrans')];
	var fireTmulti = eleTranscend[getID('firemultitrans')];
	var waterTmulti = eleTranscend[getID('watermultitrans')];
	var thunderTmulti = eleTranscend[getID('thundermultitrans')];
	var iceTmulti = eleTranscend[getID('icemultitrans')];
	var dragonTmulti = eleTranscend[getID('dragonmultitrans')];
	*/

	// Elemental
	$(this).parent().find('.fire').html(Math.floor(Math.floor( usedFire * (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2')))  * hitcount * elemulti * fencingmod));
	fireout = $(this).parent().find('.fire').html();
	
	$(this).parent().find('.water').html(Math.floor(Math.floor( usedWater * (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2')))  * hitcount * elemulti * fencingmod));
	waterout = $(this).parent().find('.water').html();
	
	$(this).parent().find('.thunder').html(Math.floor(Math.floor( usedThunder * (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2')))  * hitcount * elemulti * fencingmod));
	thunderout = $(this).parent().find('.thunder').html();
	
	$(this).parent().find('.ice').html(Math.floor(Math.floor( usedIce * (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2')))  * hitcount * elemulti * fencingmod));
	iceout = $(this).parent().find('.ice').html();
	
	$(this).parent().find('.dragon').html(Math.floor(Math.floor(usedDragon* (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2')))  * hitcount * elemulti * fencingmod));
	dragonout = $(this).parent().find('.dragon').html();
	var totalelementalout = (+fireout + +waterout + +thunderout + +iceout + +dragonout);
	
	$(this).parent().find('.allele').html(totalelementalout);
	
	// Additional including status assault

	// Status active, poison or paralysis
	if(getID('statusAssaultToggle') == 1 && getID('statustype') > 0 ){
	// Fencing
	if(getID('fencingtoggle') == 1){ fencingmulti = 1.2 }else{ fencingmulti = 1.0 };
	// Check for enough to deal status
	if(getID('statusvalue') < 10){
		var statusassault = 0;
		
	// Enough to deal 
	} else if(getID('statusvalue') >= 10){
		
	// Set status multiplier
	if(getID('drugknowledgeToggle') == 1){
		var statvalmult = getID('drugknowledgeupToggle');
	} else { 
		var statvalmult = 1;
	};
	
	// Set damage multiplier
	if(getID('statustype') == 1){
		var statassmult = 1.5;
	} else { 
		var statassmult = 6;
	};
	
	var StatusUsedSA = Math.floor(Math.floor(((+getID('statusvalue')/10) * +getID('statusStatusattack') * +getID('statusGuildpugi') * +getID('statusSigil') * +getID('statusPhial') * furious)) * statvalmult);
	
	
	
	// Status assault Poison (1.5 x (Poison + Modifier)) * defrate stuff
	var statusassault = Math.floor(Math.floor(Math.floor(+statassmult * (+StatusUsedSA + +fetchstatusassault())) * (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2'))) * fencingmod)
	
	
	};	
	} else {
		var statusassault = 0;
	};
	
	if( $(this).parent().find('.specialflag').html() == "bomb50"){
		var additionaladditional = Math.floor(50 *  (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2')))
	} else if( $(this).parent().find('.specialflag').html() == "bomb100"){
		var additionaladditional = Math.floor(100 *  (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2')))
	} else if( $(this).parent().find('.specialflag').html() == "bomb200"){
		var additionaladditional = Math.floor(200 *  (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2')))
	} else {
		var additionaladditional = 0;
	}
	
	$(this).parent().find('.additional').html((Math.floor(+getID('additional') * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) + +additionaladditional + +statusassault + +snssigiladded) * hitcount);
	var additionalout = $(this).parent().find('.additional').html();
	

	// Raw Output
	$(this).parent().find('.raw').html(
	(Math.floor(Math.floor(Math.floor((Math.floor(Math.floor( Math.floor( motionvariable * critmulti) / 100 * getIDtrueraw('ACtrueoutHolder') * rawsharpnessmulti * flagmulti * getID('wcorrection') * getID('ssmulti') * getID('statusmulti') * rawhitbox / 100) * (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2'))) )) * getID('Absdef')) * getID('Premium') * fencingmod))
	);

	// Final Ouput
	var totalraw = $(this).parent().find('.raw').html();
	$(this).parent().find('.total').html(+totalelementalout + +totalraw + +additionalout);
	
	
	
	// Used Values
	// Used Values
    if($this[0] === $(idtoget + weaponstyle + ' .mval').first()[0]) {
		
		$('#internalFire').text(Math.floor(((+getID('fakeelement') + (+getID('eleSigil1') * 10) + (+getID('eleSigil2') * 10) + (+getID('eleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle)* +getID('firemulti') * zeniEle * +getID('eleHalk') * +getID('eleHH') * +getID('eleSwaxe') * furious) * fireval / 10 * elesharpnessmulti));
		$('#internalWater').text(Math.floor(((+getID('fakeelement') + (+getID('eleSigil1') * 10) + (+getID('eleSigil2') * 10) + (+getID('eleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle)* +getID('watermulti') * zeniEle * +getID('eleHalk') * +getID('eleHH') * +getID('eleSwaxe') * furious) * waterval / 10 * elesharpnessmulti));
		$('#internalThunder').text(Math.floor(((+getID('fakeelement') + (+getID('eleSigil1') * 10) + (+getID('eleSigil2') * 10) + (+getID('eleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle)* +getID('thundermulti') * zeniEle * +getID('eleHalk') * +getID('eleHH') * +getID('eleSwaxe') * furious) * thunderval / 10 * elesharpnessmulti));
		$('#internalIce').text(Math.floor(((+getID('fakeelement') + (+getID('eleSigil1') * 10) + (+getID('eleSigil2') * 10) + (+getID('eleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle)* +getID('icemulti') * zeniEle * +getID('eleHalk') * +getID('eleHH') * +getID('eleSwaxe') * furious) * iceval / 10 * elesharpnessmulti));
		$('#internalDragon').text(Math.floor(((+getID('fakeelement') + (+getID('eleSigil1') * 10) + (+getID('eleSigil2') * 10) + (+getID('eleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle)* +getID('dragonmulti') * zeniEle * +getID('eleHalk') * +getID('eleHH') * +getID('eleSwaxe') * furious) * dragonval / 10 * elesharpnessmulti));
		$('#internalAtk').text(Math.floor(+getIDtrueraw('ACtrueoutHolder') * rawsharpnessmulti * +getID('wcorrection') * +getID('ssmulti') * +getID('statusmulti')));
		$('#internalAffinity').text(totalaffinityused + '%');
		
		
		
			if(getID('drugknowledgeToggle') == 1){
				$('#internalStatus').text(Math.floor(Math.floor((+getID('statusvalue') * +getID('statusStatusattack') * +getID('statusGuildpugi') * +getID('statusSigil') * +getID('statusPhial')) * furious) * getID('drugknowledgeupToggle')));
				
				var statusassault = Math.floor(((StatusUsedSA + +fetchstatusassault()) * 0.15 * (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2'))) * hitcount);
				
			} else {
				// 1x 
				$('#internalStatus').text(Math.floor(Math.floor((+getID('statusvalue') * +getID('statusStatusattack') * +getID('statusGuildpugi') * +getID('statusSigil') * +getID('statusPhial') * furious))));
			};
		}
});
}

function processtableRanged(idtoget,weaponstyle){
// show right table when single table
if(idtoget == '.hbgmotiontable' || idtoget == '.lbgmotiontable'){
	weaponstyle = ".earthstyle";
};
// consumption slayer
	if(	$('#consumptionS').is(':checked')){
	var coatingmod = +document.getElementById('bowbottles').value + 0.2 ;
	} else {
	var coatingmod = +document.getElementById('bowbottles').value ;
	};

// hitbox preprocessing
var elementhitbox0 = proceleex('1','elehb0');
var elementhitbox1 = proceleex('1','elehb1');
var elementhitbox2 = proceleex('1','elehb2');
var elementhitbox3 = proceleex('1','elehb3');
var elementhitbox4 = proceleex('1','elehb4');
var rawhitbox = exploitweakness('1','rawhb');
var defenseratetotal = (document.getElementById('defenserate').value * document.getElementById('defenseratemod').value * document.getElementById('defenseratemod2').value)
processranged();

$(idtoget + weaponstyle + ' .mval').each(function()
{	
    var $this = $(this);
	var rangedformulaBowgun = Math.floor(Math.floor(Math.floor( Math.floor( Math.floor( +shotadjustedmotion / 100 * document.getElementById('critmulti').value * document.getElementById('ACtrueoutHolder').value) * document.getElementById('rangeddistancemulti').value * document.getElementById('bulletstrengthmod').value * document.getElementById('bowgunshotmodifier').value * document.getElementById('statusmulti').value * rawhitbox / 100 ) * defenseratetotal) * document.getElementById('Absdef').value ) * document.getElementById('Premium').value );
	
	var rangedformulaBowgunNocrit = Math.floor(Math.floor(Math.floor( Math.floor( Math.floor( +shotadjustedmotion / 100 * 1 * document.getElementById('ACtrueoutHolder').value) * document.getElementById('rangeddistancemulti').value * document.getElementById('bulletstrengthmod').value * document.getElementById('bowgunshotmodifier').value * document.getElementById('statusmulti').value * rawhitbox / 100 ) * defenseratetotal 	) * document.getElementById('Absdef').value ) * document.getElementById('Premium').value );
	
	
	$('.motionvaluetable:not(idtoget + weaponstyle)').hide(); 
		$(idtoget + weaponstyle).show();

	
	
	// Custom Motion
	if( $(this).parent().find('.specialflag').html() == "custommotion"){
		var motionvariable = getID('customMotion');
		$(this).parent().find('.custommotionvalue').html(motionvariable);
	} else if( $(this).parent().find('.specialflag').html() == "compressionmotion"){
		var motionvariable = getID('compressedshotpower');
		$(this).parent().find('.compressionmotionvalue').html(motionvariable);
	} else {
	var motionvariable = $(this).html();
	}

	// Required variables for output
	var boworbowgun = document.getElementById('rangedweapontype').value;
	if( boworbowgun == 1 ){
	//is lbg
//	var rangedweaponelementtype = document.getElementById('rangedelementtypeBowgun').value;
	var shotadjustedmotion = motionvariable;
		
	}else if( boworbowgun == 2 ){
	//is hbg
//	var rangedweaponelementtype = document.getElementById('rangedelementtypeBowgun').value;
	var shotadjustedmotion = motionvariable * document.getElementById('HBGchargemulti').value;
	}else{
	//is bow	
	var rangedweaponelementtype = document.getElementById('rangedelementtypeBow').value;
	};
	
	// Required variables for bows
	if(	$('#consumptionS').is(':checked')){
	var coatingmod = +document.getElementById('bowbottles').value + 0.2 ;
	} else {
	var coatingmod = +document.getElementById('bowbottles').value ;
	};
	
	if( getID('bowchargemodifier') == 0) { bowchargelevel = 0.4; elebowchargelevel = 0.7;}
	else if( getID('bowchargemodifier') == 1) { bowchargelevel = 1; elebowchargelevel = 0.8;}
	else if( getID('bowchargemodifier') == 2) { bowchargelevel = 1.5; elebowchargelevel = 1.2;}
	else if( getID('bowchargemodifier') == 3) { bowchargelevel = 1.85; elebowchargelevel = 1.334;}
	else if( getID('bowchargemodifier') == 4) { bowchargelevel = 1.0; elebowchargelevel = 1.0;}
	else if( getID('bowchargemodifier') == 5) { bowchargelevel = 1.125; elebowchargelevel = 1.1;}
	else if( getID('bowchargemodifier') == 6) { bowchargelevel = 0.48; elebowchargelevel = 0.7;}
	else if( getID('bowchargemodifier') == 7) { bowchargelevel = 1.3; elebowchargelevel = 0.8;}
	else if( getID('bowchargemodifier') == 8) { bowchargelevel = 2.1; elebowchargelevel = 1.2;}
	else if( getID('bowchargemodifier') == 9) { bowchargelevel = 2.59; elebowchargelevel = 1.334;}
	else if( getID('bowchargemodifier') == 10) { bowchargelevel = 0.4; elebowchargelevel = 1;}
	else if( getID('bowchargemodifier') == 11) { bowchargelevel = 1.0; elebowchargelevel = 1.5;};
	
	if(getID('quickshotchargemodifier') == 1 || getID('quickshotchargemodifier') == 2){
	// is quick shot
	// lv2 0.85x
	if( getID('bowchargemodifier') == 1) { 
		var bowchargeQuick = 0.85;}
	// lv3 0.75x
	else if( getID('bowchargemodifier') == 2) { 
		var bowchargeQuick = 0.75;}
	// lv4 0.65x
	else if( getID('bowchargemodifier') == 3) { 
		var bowchargeQuick = 0.65;
	} else {
		var bowchargeQuick = 1;
	}
	} else {
		var bowchargeQuick = 1;
	}
	
	// critical handling

	
	if( $(this).parent().find('.specialflag').html() == "nocrit"){
		var critmulti = 1.0;
	} else {
		if (getID('averaging') == 0 ){
			var critmulti = +getID('critmulti');
			totalaffinityused = 100;
		} else if (getID('averaging') == 1 ){
			  if (getID('AffinitySW') >= 1){
					var starvingwolfaffinity = 50;
				} else {
					var starvingwolfaffinity = 0;
			  }
  
			  if (getID('AffinityCeaseless') == 1){
					var ceaselessaffinity = 35;
				} else if (getID('AffinityCeaseless') == 2){
					var ceaselessaffinity = 50;
			  } else {
					var ceaselessaffinity = 0;
			  }
			var aoeAff = ((20 * +getID('aoeAffCount')) + (+getID('aoeAff') * 2));
			if(+getID('aoeAffCount') == 0 || +getID('aoeAff') == 0){
				aoeAff = 0;
			};
			  
			var totalaffinityused = (+getID('AffinityIssen') + +getID('AffinitySharp') + +getID('AffinitySigils') + +getID('AffinitySigils2') + +getID('AffinitySigils3') + +getID('AffinityStylerank') + +getID('AffinityExpert') + +getID('AffinityNatural') + aoeAff + +getID('AffinityFlash') + starvingwolfaffinity + ceaselessaffinity) ;
			if(totalaffinityused > 100){totalaffinityused = 100}
			else if(totalaffinityused < 0){totalaffinityused = 0}
			var critmulti = (((totalaffinityused / 100) * +getID('critmulti')) + ((1-(totalaffinityused / 100)) * 1));
		} else {
			var critmulti = 1.0;
			totalaffinityused = 0;
		}
		
	}
	

	
	// lazy handling of individual shot multipliers and properties
	var bombvalues = 0;
	var bulletstrengthmod = 1.0;
	var CritDistanceMulti = document.getElementById('rangeddistancemulti').value;
	var quickshotmode = getID('quickshotchargemodifier');
	var dragonshotvalue = 0;
	var fireshotvalue = 0;
	var watershotvalue = 0;
	var iceshotvalue = 0;
	var thundershotvalue = 0;
	var bowsigiladded = 0;
	
	
	if( $(this).parent().find('.specialflag').html() == "melee"){
	// I have no idea what multipliers are actually used. So 0.6x
			CritDistanceMulti = 0.6;
			bulletstrengthmod = 1.0;
			quickshotchargemodifier = 0;
			bowchargelevel = 1.0; 
			elebowchargelevel = 0.6;
			bowchargeQuick = 1;
			quickshotmode = 1;
	} else if($(this).parent().find('.specialflag').html() == "bowsigil"){

			if(getID('rangedelementtypeBow') == 0){
			var rawSigilChargeMulti = [0.4,1.0,1.5,1.85,1.0,1.1,2.0];
				if(getID('bowchargemodifier') >= 0 && getID('bowchargemodifier') < 6){
					
					var bowsigiladded = Math.floor(Math.floor(getIDtrueraw('ACtrueoutHolder') * 0.015 * rawSigilChargeMulti[getID('bowchargemodifier')] * (+exploitweakness('1','rawhb')/100)) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2')));
					var critmulti = 1.0;
					var motionvariable = 0;
				} else {
					var bowsigiladded = 0;
				}
			} else {
				var bowsigiladded = 0;	
			};
	} else if( $(this).parent().find('.specialflag').html() == "nocmel"){
	// I have no idea what multipliers are actually used. So 0.6x
			CritDistanceMulti = 0.6;
			bulletstrengthmod = 1.0;
			quickshotchargemodifier = 0;
			bowchargelevel = 1.0; 
			elebowchargelevel = 0.6;
			bowchargeQuick = 1;
			quickshotmode = 1;
			var critmulti = 1.0;
	} else if( $(this).parent().find('.specialflag').html() == "rapid"){
	// rapid up normal up and steady hand
		var CritDistanceMulti = document.getElementById('rangeddistancemulti').value;
		if(getID('bulletstrengthmod') == "rapid" || getID('bulletstrengthmod') == "steady"){
			bulletstrengthmod = 1.1;
		} else {
			bulletstrengthmod = 1.0;
		}
	} else if( $(this).parent().find('.specialflag').html() == "scatter"){
	// scatter up pellet up and steady hand
		var CritDistanceMulti = document.getElementById('rangeddistancemulti').value;
		if(getID('bulletstrengthmod') == "scatter" || getID('bulletstrengthmod') == "steady"){
			bulletstrengthmod = 1.3;
		}else {
			bulletstrengthmod = 1.0;
		}
		if($(this).parent().find('td:nth-child(1)').html() == "LV1 Pellet S."){
			watershotvalue = 15;
		} else if($(this).parent().find('td:nth-child(1)').html() == "LV2 Pellet S."){
			watershotvalue = 16;
		} else if($(this).parent().find('td:nth-child(1)').html() == "LV3 Pellet S."){
			watershotvalue = 20;
		};
		
	} else if( $(this).parent().find('.specialflag').html() == "pierce"){
	// pierce up and steady hand
		var CritDistanceMulti = document.getElementById('rangeddistancemulti').value;
		if(getID('bulletstrengthmod') == "pierce" || getID('bulletstrengthmod') == "steady"){
			bulletstrengthmod = 1.1;
		}else {
			bulletstrengthmod = 1.0;
		}
	
	} else if( $(this).parent().find('.specialflag').html() == "sniper1"){
	// use 1.0x / 1.0x multi
	bowchargelevel = 1.0; 
	elebowchargelevel = 1.0;
	bowchargeQuick = 1;
	quickshotmode = 1;
	} else if( $(this).parent().find('.specialflag').html() == "sniper2"){
	// use 1.125x / 1.2x multi
	bowchargelevel = 1.125; 
	elebowchargelevel = 1.2;
	bowchargeQuick = 1;
	quickshotmode = 1;
	} else if( $(this).parent().find('.specialflag').html() == "arcshot1"){
	// use 1.0x / 0.7x multi with no critical distance 
	bowchargelevel = 1.0; 
	elebowchargelevel = 0.2;
	CritDistanceMulti = 1;
	bowchargeQuick = 1;
	quickshotmode = 1;
	} else if( $(this).parent().find('.specialflag').html() == "arcshot2"){
	// use 1.0x / 0.2x multi with no critical distance and 19 bomb damage	
	bowchargelevel = 1.0; 
	elebowchargelevel = 0.2;
	CritDistanceMulti = 1;	
	bowchargeQuick = 1;
	quickshotmode = 1;
	} else if( $(this).parent().find('.specialflag').html() == "risingmulti1"){
	// use 0.4x / 1.0x multi
	bowchargelevel = 0.4; 
	elebowchargelevel = 1.0;
	bowchargeQuick = 1;
	quickshotmode = 1;
	} else if( $(this).parent().find('.specialflag').html() == "risingmulti2"){
	// use 1.0x / 1.5x multi
	bowchargelevel = 1.0; 
	elebowchargelevel = 1.5;
	bowchargeQuick = 1;
	quickshotmode = 1;
	} else if( $(this).parent().find('.specialflag').html() == "crag1"){
	//Bomb 30, Fire 400
		bombvalues = 30;
		fireshotvalue = 40;
	} else if( $(this).parent().find('.specialflag').html() == "crag2"){
	//Bomb 40, Fire 600
		bombvalues = 40;
		fireshotvalue = 60;
	} else if( $(this).parent().find('.specialflag').html() == "crag3"){
	//Bomb 50, Fire 800
		bombvalues = 50;
		fireshotvalue = 80;
	} else if( $(this).parent().find('.specialflag').html() == "cluster1"){
	// Bomb 32, Fire 20 x 3
		bombvalues = 96;
		fireshotvalue = 6;
	} else if( $(this).parent().find('.specialflag').html() == "cluster2"){
	// Bomb 32, Fire 20 x 4
		bombvalues = 128;
		fireshotvalue = 8;
	} else if( $(this).parent().find('.specialflag').html() == "cluster3"){
	// Bomb 32, Fire 20 x 5	
		bombvalues = 160;
		fireshotvalue = 10;
	} else if( $(this).parent().find('.specialflag').html() == "fireshot"){
	//Weapon Attack + Fire x0.5 (0.4x lbg)
	bowchargelevel = 1.0; 
	elebowchargelevel = 1.0;
	bowchargeQuick = 1;
	quickshotmode = 1;
		if(document.getElementById('rangedweapontype').value == 2){
			fireshotvalue = Math.floor(Math.floor(document.getElementById('ACtrueoutHolder').value * 0.5) * document.getElementById('HBGchargemulti').value); 
			fireshotvalue = fireshotvalue * getID('firemulti') * getID('eleHalk') * getID('eleHH');
		} else if(document.getElementById('rangedweapontype').value == 1){
			fireshotvalue = document.getElementById('ACtrueoutHolder').value * 0.4;
			fireshotvalue = fireshotvalue * getID('firemulti') * getID('eleHalk') * getID('eleHH');
		}
		
	} else if( $(this).parent().find('.specialflag').html() == "watershot"){
	//(Weapon Attack x0.25 Water) x 3 (0.13x lbg)
	bowchargelevel = 1.0; 
	elebowchargelevel = 1.0;
	bowchargeQuick = 1;
	quickshotmode = 1;
		if(document.getElementById('rangedweapontype').value == 2){
			watershotvalue = Math.floor(Math.floor((document.getElementById('ACtrueoutHolder').value * 0.25) * 3) * document.getElementById('HBGchargemulti').value);
			watershotvalue = watershotvalue * getID('watermulti') * getID('eleHalk') * getID('eleHH');
		} else if(document.getElementById('rangedweapontype').value == 1){
			watershotvalue = Math.floor((document.getElementById('ACtrueoutHolder').value * 0.2) * 3);
			watershotvalue = watershotvalue * getID('watermulti') * getID('eleHalk') * getID('eleHH');
		}
	} else if( $(this).parent().find('.specialflag').html() == "thundershot"){
	//(Weapon Attack x 0.27 Thunder) x 3 (0.2x lbg)
	bowchargelevel = 1.0; 
	elebowchargelevel = 1.0;
	bowchargeQuick = 1;
	quickshotmode = 1;
		if(document.getElementById('rangedweapontype').value == 2){
			thundershotvalue = Math.floor(Math.floor((document.getElementById('ACtrueoutHolder').value * 0.27) * 3) * document.getElementById('HBGchargemulti').value);
			thundershotvalue = thundershotvalue * getID('thundermulti') * getID('eleHalk') * getID('eleHH');
		} else if(document.getElementById('rangedweapontype').value == 1){
			thundershotvalue = Math.floor((document.getElementById('ACtrueoutHolder').value * 0.2) * 3);
			thundershotvalue = thundershotvalue * getID('thundermulti') * getID('eleHalk') * getID('eleHH');
		}
	} else if( $(this).parent().find('.specialflag').html() == "iceshot"){
	//(Weapon Attack x0.25 Ice) x 3 (0.13x lbg)
	bowchargelevel = 1.0; 
	elebowchargelevel = 1.0;
	bowchargeQuick = 1;
	quickshotmode = 1;
		if(document.getElementById('rangedweapontype').value == 2){
			iceshotvalue = Math.floor(Math.floor((document.getElementById('ACtrueoutHolder').value * 0.25) * 3)* document.getElementById('HBGchargemulti').value);
			iceshotvalue = iceshotvalue * getID('icemulti') * getID('eleHalk') * getID('eleHH');
		} else if(document.getElementById('rangedweapontype').value == 1){
			iceshotvalue = Math.floor((document.getElementById('ACtrueoutHolder').value * 0.2) * 3);
			iceshotvalue = iceshotvalue * getID('icemulti') * getID('eleHalk') * getID('eleHH');
		}
	} else if( $(this).parent().find('.specialflag').html() == "dragonshot"){
	//90 Dragon x3 (75 lbg)
	bowchargelevel = 1.0; 
	elebowchargelevel = 1.0;
	bowchargeQuick = 1;
	quickshotmode = 1;
		if(document.getElementById('rangedweapontype').value == 2){
			dragonshotvalue = Math.floor(270 * document.getElementById('HBGchargemulti').value) * getID('dragonmulti') * getID('eleHalk') * getID('eleHH');
		} else if(document.getElementById('rangedweapontype').value == 1){
			dragonshotvalue = 225 * getID('dragonmulti') * getID('eleHalk') * getID('eleHH');
		}
	} else if( $(this).parent().find('.specialflag').html() == "elecomp"){
	
	bowchargelevel = 1.0; 
	elebowchargelevel = 1.0;
	bowchargeQuick = 1;
	quickshotmode = 1;
		var eleshottype = getID('HBGcompressedshotEle');
		var eleshotnumber = getID('HBGshotstocompressEle');
		var trueraw = getID('ACtrueoutHolder');
		var eleshotcharge = getID('HBGchargemulti');
		if(eleshottype == "compFireS"){
			shotadjustedmotion = eleshotnumber * 0.5;
			fireshotvalue = Math.floor((trueraw * 0.3 * eleshotnumber) * eleshotcharge) * getID('firemulti') * getID('eleHalk') * getID('eleHH');
		}else if(eleshottype == "compWaterS"){
			shotadjustedmotion = (eleshotnumber * 0.5) * 3;
			watershotvalue = Math.floor(((trueraw * 0.15 * eleshotnumber) * 3 ) * eleshotcharge) * getID('watermulti') * getID('eleHalk') * getID('eleHH');;
		
		}else if(eleshottype == "compThunderS"){
			shotadjustedmotion = (eleshotnumber * 0.5) *3;
			thundershotvalue = Math.floor(((trueraw * 0.17 * eleshotnumber) * 3 ) * eleshotcharge) * getID('thundermulti') * getID('eleHalk') * getID('eleHH');;
		
		}else if(eleshottype == "compIceS"){
			shotadjustedmotion = (eleshotnumber * 0.5) * 3;
			iceshotvalue = Math.floor(((trueraw * 0.15 * eleshotnumber) * 3 ) * eleshotcharge) * getID('icemulti') * getID('eleHalk') * getID('eleHH');;
		
		}else if(eleshottype == "compDragonS"){
			shotadjustedmotion = (eleshotnumber * 0.5) * 3;
			dragonshotvalue = Math.floor(((72 * eleshotnumber) * 3 ) * eleshotcharge) * getID('dragonmulti') * getID('eleHalk') * getID('eleHH');;
		}else if(eleshottype == "pcompFireS"){
			shotadjustedmotion = eleshotnumber * 0.8;
			fireshotvalue = Math.floor((trueraw * 0.4 * eleshotnumber) * eleshotcharge) * getID('firemulti') * getID('eleHalk') * getID('eleHH');;
		}else if(eleshottype == "pcompWaterS"){
			shotadjustedmotion = eleshotnumber * 0.8;
			watershotvalue = Math.floor(((trueraw * 0.2 * eleshotnumber) * 3 ) * eleshotcharge) * getID('watermulti') * getID('eleHalk') * getID('eleHH');;
		
		}else if(eleshottype == "pcompThunderS"){
			shotadjustedmotion = eleshotnumber * 0.8;
			thundershotvalue = Math.floor(((trueraw * 0.215 * eleshotnumber) * 3 ) * eleshotcharge) * getID('thundermulti') * getID('eleHalk') * getID('eleHH');;
		
		}else if(eleshottype == "pcompIceS"){
			shotadjustedmotion = eleshotnumber * 0.8;
			iceshotvalue = Math.floor(((trueraw * 0.2 * eleshotnumber) * 3 ) * eleshotcharge) * getID('icemulti') * getID('eleHalk') * getID('eleHH');;
		
		}else if(eleshottype == "pcompDragonS"){
			shotadjustedmotion = eleshotnumber * 0.5;
			dragonshotvalue = Math.floor(((90 * eleshotnumber) * 3 ) * eleshotcharge) * getID('dragonmulti') * getID('eleHalk') * getID('eleHH');;	
		} else {
			shotadjustedmotion = 0;
			bowchargelevel = 1.0; 
			elebowchargelevel = 1.0;
			bowchargeQuick = 1;
			quickshotmode = 1;
		}

		$(this).parent().find('.compressionmotionvalue').html(Math.floor(shotadjustedmotion));
	} else { 
	}
	

	
	// actual raw output
	var boworbowgun = document.getElementById('rangedweapontype').value;
	if( boworbowgun == 1 || boworbowgun == 2 ){
	
	//is bowgun
	var rawoutput = Math.floor(Math.floor(Math.floor( 
	( ( (+shotadjustedmotion / 100) * +critmulti * document.getElementById('ACtrueoutHolder').value) * CritDistanceMulti * bulletstrengthmod * document.getElementById('bowgunshotmodifier').value * 
	document.getElementById('statusmulti').value * (rawhitbox / 100) ) * defenseratetotal) * document.getElementById('Absdef').value ) * document.getElementById('Premium').value );	
	}else{
		
	//is bow
	if (quickshotmode != 2){
		var rawoutput = Math.floor(Math.floor(Math.floor( Math.floor( Math.floor( (motionvariable / 100) * +critmulti * document.getElementById('ACtrueoutHolder').value) * document.getElementById('rangeddistancemulti').value * coatingmod * bulletstrengthmod * bowchargelevel * bowchargeQuick * document.getElementById('statusmulti').value * rawhitbox / 100 ) * defenseratetotal  ) * document.getElementById('Absdef').value ) * document.getElementById('Premium').value );
	} else if (quickshotmode == 2){
		var rawoutput = (Math.floor(Math.floor(Math.floor( Math.floor( Math.floor( (motionvariable / 100) * +critmulti * document.getElementById('ACtrueoutHolder').value) * document.getElementById('rangeddistancemulti').value * coatingmod * bulletstrengthmod * bowchargelevel * document.getElementById('statusmulti').value * rawhitbox / 100 ) * defenseratetotal  ) * document.getElementById('Absdef').value ) * document.getElementById('Premium').value )) + 
		(Math.floor(Math.floor(Math.floor( Math.floor( Math.floor( motionvariable / 100 * +critmulti * document.getElementById('ACtrueoutHolder').value) * document.getElementById('rangeddistancemulti').value * coatingmod * bulletstrengthmod * bowchargelevel * bowchargeQuick * document.getElementById('statusmulti').value * rawhitbox / 100 ) * defenseratetotal  ) * document.getElementById('Absdef').value ) * document.getElementById('Premium').value ));	
	}
	}
	// proper tables
	$('.motionvaluetable:not(idtoget + weaponstyle)').hide(); 
	$(idtoget + weaponstyle).show();

	// grab values
	var motionvariable = $(this).html();
	var elemulti = $(this).parent().find('.elemental').html();
	var hitcount = $(this).parent().find('.hitcount').html();
	var aoeEle = ((50 * +getID('aoeEleCountRanged')) + (+getID('aoeEleRanged') * 50));
	var zeniEle = 1 + ((1.3 + +getID('zeniEleRanged')) * 0.1);
	if(+getID('zeniEleRanged') == 0)
	{
		zeniEle = 1;
	}
	if(+getID('aoeEleCountRanged') == 0 || +getID('aoeEleRanged') == 0)
	{
		aoeEle = 0;
	}
	
	var furious = furiousMulti();
	
	// Elemental
	if( boworbowgun == 1 || boworbowgun == 2 ){
	// Bowguns
		$(this).parent().find('.fire').html(Math.floor((Math.floor(Math.floor(fireshotvalue) * elebowchargelevel * furious * zeniEle * bowchargeQuick * elementhitbox0 / 100) * (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2')))));
		fireout = $(this).parent().find('.fire').html();
		
		$(this).parent().find('.water').html(Math.floor(Math.floor(Math.floor(Math.floor(watershotvalue) * elebowchargelevel * furious * zeniEle * bowchargeQuick * elementhitbox1 / 100) * (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2')))));
		waterout = $(this).parent().find('.water').html();
		
		$(this).parent().find('.thunder').html(Math.floor(Math.floor(Math.floor(Math.floor(thundershotvalue) * elebowchargelevel * furious * zeniEle * bowchargeQuick * elementhitbox2 / 100) * (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2')))));
		thunderout = $(this).parent().find('.thunder').html();
		
		$(this).parent().find('.ice').html(Math.floor(Math.floor(Math.floor(Math.floor(iceshotvalue) * elebowchargelevel * furious * zeniEle * bowchargeQuick * elementhitbox3 / 100) * (getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2')))));
		iceout = $(this).parent().find('.ice').html();
		
		$(this).parent().find('.dragon').html(Math.floor(Math.floor(Math.floor(Math.floor((dragonshotvalue))  * elebowchargelevel * furious * zeniEle * bowchargeQuick * elementhitbox4 / 100) * getID('defenserate') * getID('defenseratemod') * getID('defenseratemod2'))));
		dragonout = $(this).parent().find('.dragon').html();
		var totalelementalout = (+fireout + +waterout + +thunderout + +iceout + +dragonout);
	}else{
		// Bow
		if (+getID('quickshotchargemodifier') != 2){
			$(this).parent().find('.fire').html(Math.floor((Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('firemulti') * zeniEle * furious ) * rangedfireval)  / 10 * elebowchargelevel * bowchargeQuick * elementhitbox0 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount);
			fireout = $(this).parent().find('.fire').html();
			
			$(this).parent().find('.water').html(Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('watermulti') * zeniEle * furious ) * rangedwaterval)  / 10 * elebowchargelevel * bowchargeQuick * elementhitbox1 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount);
			waterout = $(this).parent().find('.water').html();
			
			$(this).parent().find('.thunder').html(Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('thundermulti') * zeniEle * furious ) * rangedthunderval)  / 10 * elebowchargelevel * bowchargeQuick * elementhitbox2 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount);
			thunderout = $(this).parent().find('.thunder').html();
			
			$(this).parent().find('.ice').html(Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('icemulti') * zeniEle * furious ) * rangediceval)  / 10 * elebowchargelevel * bowchargeQuick * elementhitbox3 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount);
			iceout = $(this).parent().find('.ice').html();
			
			$(this).parent().find('.dragon').html(Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('dragonmulti') * zeniEle * furious ) * rangeddragonval) / 10 * elebowchargelevel * bowchargeQuick * elementhitbox4 / 100) * +getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2')) ) * hitcount);
			dragonout = $(this).parent().find('.dragon').html();
			var totalelementalout = (+fireout + +waterout + +thunderout + +iceout + +dragonout);
		} else if (+getID('quickshotchargemodifier') == 2){
			$(this).parent().find('.fire').html(
			(Math.floor((Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('firemulti') * zeniEle * furious ) * rangedfireval)  / 10 * elebowchargelevel * bowchargeQuick * elementhitbox0 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount) + (Math.floor((Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('firemulti') * zeniEle * furious ) * rangedfireval)  / 10 * elebowchargelevel * elementhitbox0 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount)
			);
			fireout = $(this).parent().find('.fire').html();
			
			$(this).parent().find('.water').html(
			(Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('watermulti') * zeniEle * furious ) * rangedwaterval)  / 10 * elebowchargelevel * bowchargeQuick * elementhitbox1 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount) + (Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('watermulti') * zeniEle * furious ) * rangedwaterval)  / 10 * elebowchargelevel * elementhitbox1 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount)
			);
			waterout = $(this).parent().find('.water').html();
			
			$(this).parent().find('.thunder').html(
			(Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('thundermulti') * zeniEle * furious ) * rangedthunderval)  / 10 * elebowchargelevel * bowchargeQuick * elementhitbox2 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount) + (Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('thundermulti') * zeniEle * furious ) * rangedthunderval)  / 10 * elebowchargelevel * elementhitbox2 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount)
			);
			thunderout = $(this).parent().find('.thunder').html();
			
			$(this).parent().find('.ice').html(
			(Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('icemulti') * zeniEle * furious ) * rangediceval)  / 10 * elebowchargelevel * bowchargeQuick * elementhitbox3 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount) + (Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('icemulti') * zeniEle * furious ) * rangediceval)  / 10 * elebowchargelevel * elementhitbox3 / 100) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2'))) ) * hitcount)
			);
			iceout = $(this).parent().find('.ice').html();
			
			$(this).parent().find('.dragon').html(
			(Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('dragonmulti') * zeniEle * furious ) * rangeddragonval) / 10 * elebowchargelevel * bowchargeQuick * elementhitbox4 / 100) * +getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2')) ) * hitcount) + (Math.floor(Math.floor( Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle) * +getID('dragonmulti') * zeniEle * furious ) * rangeddragonval) / 10 * elebowchargelevel * elementhitbox4 / 100) * +getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2')) ) * hitcount)
			);
			dragonout = $(this).parent().find('.dragon').html();
			var totalelementalout = (+fireout + +waterout + +thunderout + +iceout + +dragonout);	
		}
	}
	// Sum above
	$(this).parent().find('.allele').html(Math.floor(+totalelementalout));
	
	// Additional
	$(this).parent().find('.additional').html((Math.floor((+getID('additional') + +bombvalues) * (+getID('defenserate') * +getID('defenseratemod') * +getID('defenseratemod2')))) + +bowsigiladded);
	var additionalout = $(this).parent().find('.additional').html();
	
	
	// Actual Output
	$(this).parent().find('.raw').html(rawoutput);
	
	var totalraw = $(this).parent().find('.raw').html();
	$(this).parent().find('.total').html(+totalelementalout + +totalraw + +additionalout);
	
	var furious = furiousMulti();
	// show values used on first update 
	if($this[0] === $(idtoget + weaponstyle + ' .mval').first()[0]) {
		if( boworbowgun == 1 || boworbowgun == 2 ){
		//bowguns
			$('#internalFire').text('-');
			$('#internalWater').text('-');
			$('#internalThunder').text('-');
			$('#internalIce').text('-');
			$('#internalDragon').text('-');
		}else{
		//bows
			$('#internalFire').text(Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle * furious) * +getID('firemulti')  * zeniEle) * rangedfireval)  / 10));
			$('#internalWater').text(Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle * furious) * +getID('watermulti')  * zeniEle) * rangedwaterval)  / 10));
			$('#internalThunder').text(Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle * furious) * +getID('thundermulti')  * zeniEle) * rangedthunderval)  / 10));
			$('#internalIce').text(Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle * furious) * +getID('icemulti')  * zeniEle) * rangediceval)  / 10));
			$('#internalDragon').text(Math.floor( Math.floor( ((+getID('rangedfakeelement') + (+getID('rangedEleSigil1') * 10) + (+getID('rangedEleSigil2') * 10) + (+getID('rangedEleSigil3') * 10) + (+getID('ulSigil') * 10) + aoeEle * furious) * +getID('dragonmulti')  * zeniEle) * rangeddragonval)  / 10));
		}
		$('#internalAtk').text(Math.floor(getIDtrueraw('ACtrueoutHolder') * getID('ssmulti') * getID('statusmulti')));
		$('#internalAffinity').text(totalaffinityused + '%');
		$('#internalStatus').text('-');
	}
		
});
}

processvalues();
$('input').blur(processvalues);
$('input').change(processvalues);
$('select').blur(processvalues);
$('select').change(processvalues);
	
//=========//
// Cookies //
//=========//
function nukeSaves(){
if (confirm('Delete all saves? Cannot be undone!')) {
localStorage.clear();
} else {
}

};




function saveSlot(){
slotnumber = getID('saveSlot');
if (confirm('Save to Slot ' + slotnumber + '?')) {
var slotnumber = "save" + slotnumber;
localStorage.setItem(slotnumber + "weaponclass",getID('weaponclass'));
localStorage.setItem(slotnumber + "ACweapontype",getID('ACweapontype'));
localStorage.setItem(slotnumber + "weapontype",getID('weapontype'));
localStorage.setItem(slotnumber + "WeaponStyle",getID('WeaponStyle'));
localStorage.setItem(slotnumber + "displayedattack",getID('displayedattack'));
localStorage.setItem(slotnumber + "trueraw",getID('trueraw'));
localStorage.setItem(slotnumber + "ACsrattack",getID('ACsrattack'));
localStorage.setItem(slotnumber + "ACsigil",getID('ACsigil'));
localStorage.setItem(slotnumber + "ACsigil2",getID('ACsigil2'));
localStorage.setItem(slotnumber + "ACsigil3",getID('ACsigil3'));
localStorage.setItem(slotnumber + "AffinityNatural",getID('AffinityNatural'));
localStorage.setItem(slotnumber + "AffinitySigils",getID('AffinitySigils'));
localStorage.setItem(slotnumber + "AffinitySigils2",getID('AffinitySigils2'));
localStorage.setItem(slotnumber + "AffinitySigils3",getID('AffinitySigils3'));
localStorage.setItem(slotnumber + "critmulti",getID('critmulti'));
localStorage.setItem(slotnumber + "averaging",getID('averaging'));
localStorage.setItem(slotnumber + "fencingtoggle",getID('fencingtoggle'));
localStorage.setItem(slotnumber + "sharpness",getID('sharpness'));
localStorage.setItem(slotnumber + "ssmulti",getID('ssmulti'));
localStorage.setItem(slotnumber + "elementtype",getID('elementtype'));
localStorage.setItem(slotnumber + "fakeelement",getID('fakeelement'));
localStorage.setItem(slotnumber + "eleSwaxe",getID('eleSwaxe'));
localStorage.setItem(slotnumber + "statusvalue",getID('statusvalue'));
localStorage.setItem(slotnumber + "additional",getID('additional'));
localStorage.setItem(slotnumber + "tonfamode",getID('tonfamode'));
localStorage.setItem(slotnumber + "rangeddistancemulti",getID('rangeddistancemulti'));
localStorage.setItem(slotnumber + "bulletstrengthmod",getID('bulletstrengthmod'));
localStorage.setItem(slotnumber + "bowgunshotmodifier",getID('bowgunshotmodifier'));
localStorage.setItem(slotnumber + "HBGchargemulti",getID('HBGchargemulti'));
localStorage.setItem(slotnumber + "HBGshotstocompress",getID('HBGshotstocompress'));
localStorage.setItem(slotnumber + "HBGcompressedshots",getID('HBGcompressedshots'));
localStorage.setItem(slotnumber + "HBGshotstocompressEle",getID('HBGshotstocompressEle'));
localStorage.setItem(slotnumber + "HBGcompressedshotEle",getID('HBGcompressedshotEle'));
localStorage.setItem(slotnumber + "bowchargemodifier",getID('bowchargemodifier'));
localStorage.setItem(slotnumber + "bowbottles",getID('bowbottles'));
localStorage.setItem(slotnumber + "quickshotchargemodifier",getID('quickshotchargemodifier'));
localStorage.setItem(slotnumber + "rangedelementtypeBow",getID('rangedelementtypeBow'));
localStorage.setItem(slotnumber + "rangedfakeelement",getID('rangedfakeelement'));

localStorage.setItem(slotnumber + "defenserate",getID('defenserate'));
localStorage.setItem(slotnumber + "defenseratemod",getID('defenseratemod'));
localStorage.setItem(slotnumber + "defenseratemod2",getID('defenseratemod2'));
localStorage.setItem(slotnumber + "rawhb",getID('rawhb'));
localStorage.setItem(slotnumber + "minrawhb",getID('minrawhb'));
localStorage.setItem(slotnumber + "maxrawhb",getID('maxrawhb'));
localStorage.setItem(slotnumber + "elehb0",getID('elehb0'));
localStorage.setItem(slotnumber + "elehb1",getID('elehb1'));
localStorage.setItem(slotnumber + "elehb2",getID('elehb2'));
localStorage.setItem(slotnumber + "elehb3",getID('elehb3'));
localStorage.setItem(slotnumber + "elehb4",getID('elehb4'));
localStorage.setItem(slotnumber + "statusmulti",getID('statusmulti'));
localStorage.setItem(slotnumber + "thunderclad",getID('thunderclad'));
localStorage.setItem(slotnumber + "sniperraw",getID('sniperraw'));
localStorage.setItem(slotnumber + "exweak",getID('exweak'));
localStorage.setItem(slotnumber + "pbreak",getID('pbreak'));
localStorage.setItem(slotnumber + "acidShot",getID('acidShot'));
localStorage.setItem(slotnumber + "eleex",getID('eleex'));
localStorage.setItem(slotnumber + "hhweak",getID('hhweak'));
localStorage.setItem(slotnumber + "Absdef",getID('Absdef'));
localStorage.setItem(slotnumber + "Premium",getID('Premium'));

localStorage.setItem(slotnumber + "AffinityStylerank",getID('AffinityStylerank'));
localStorage.setItem(slotnumber + "AffinitySharp",getID('AffinitySharp'));
localStorage.setItem(slotnumber + "AffinityFlash",getID('AffinityFlash'));
localStorage.setItem(slotnumber + "AffinityExpert",getID('AffinityExpert'));
localStorage.setItem(slotnumber + "AffinityIssen",getID('AffinityIssen'));
localStorage.setItem(slotnumber + "AffinityCeaseless",getID('AffinityCeaseless'));
localStorage.setItem(slotnumber + "AffinityDrink",getID('AffinityDrink'));
localStorage.setItem(slotnumber + "AffinityGSAF",getID('AffinityGSAF'));
localStorage.setItem(slotnumber + "ACatkskill",getID('ACatkskill'));
localStorage.setItem(slotnumber + "ACcaravan",getID('ACcaravan'));
localStorage.setItem(slotnumber + "ACpassives",getID('ACpassives'));
localStorage.setItem(slotnumber + "ACfood",getID('ACfood'));
localStorage.setItem(slotnumber + "ACseeds",getID('ACseeds'));
localStorage.setItem(slotnumber + "AClonewolf",getID('AClonewolf'));
localStorage.setItem(slotnumber + "ACcritconv",getID('ACcritconv'));
localStorage.setItem(slotnumber + "ACcritup",getID('ACcritup'));
localStorage.setItem(slotnumber + "ACstylishass",getID('ACstylishass'));
localStorage.setItem(slotnumber + "ACconsumption",getID('ACconsumption'));
localStorage.setItem(slotnumber + "ACpatient",getID('ACpatient'));
localStorage.setItem(slotnumber + "ACVamp",getID('ACVamp'));
localStorage.setItem(slotnumber + "ACrush",getID('ACrush'));
localStorage.setItem(slotnumber + "ACrising",getID('ACrising'));
localStorage.setItem(slotnumber + "ACincite",getID('ACincite'));
localStorage.setItem(slotnumber + "AClengthup",getID('AClengthup'));
localStorage.setItem(slotnumber + "ACtower",getID('ACtower'));
localStorage.setItem(slotnumber + "AClance",getID('AClance'));
localStorage.setItem(slotnumber + "ACroadlast",getID('ACroadlast'));
localStorage.setItem(slotnumber + "ACadvlvl",getID('ACadvlvl'));
localStorage.setItem(slotnumber + "ACadvfloor",getID('ACadvfloor'));
localStorage.setItem(slotnumber + "ACdure",getID('ACdure'));
localStorage.setItem(slotnumber + "ACconqatk",getID('ACconqatk'));
localStorage.setItem(slotnumber + "ACconqpot",getID('ACconqpot'));
localStorage.setItem(slotnumber + "AChh",getID('AChh'));
localStorage.setItem(slotnumber + "ACadren",getID('ACadren'));
localStorage.setItem(slotnumber + "AChiden",getID('AChiden'));
localStorage.setItem(slotnumber + "ACdstonfa",getID('ACdstonfa'));
localStorage.setItem(slotnumber + "ACcomsup",getID('ACcomsup'));
localStorage.setItem(slotnumber + "ACarmour1",getID('ACarmour1'));
localStorage.setItem(slotnumber + "ACarmour2",getID('ACarmour2'));
localStorage.setItem(slotnumber + "ACarmourG",getID('ACarmourG'));
localStorage.setItem(slotnumber + "ACsoul",getID('ACsoul'));
localStorage.setItem(slotnumber + "ACassist",getID('ACassist'));
localStorage.setItem(slotnumber + "ACbondhunter",getID('ACbondhunter'));
localStorage.setItem(slotnumber + "ACsecrettech",getID('ACsecrettech'));
localStorage.setItem(slotnumber + "ACvigup",getID('ACvigup'));
localStorage.setItem(slotnumber + "ACfurious",getID('ACfurious'));
localStorage.setItem(slotnumber + "AffinitySW",getID('AffinitySW'));
localStorage.setItem(slotnumber + "ACpartnyaabond",getID('ACpartnyaabond'));
localStorage.setItem(slotnumber + "firemulti",getID('firemulti'));
localStorage.setItem(slotnumber + "watermulti",getID('watermulti'));
localStorage.setItem(slotnumber + "thundermulti",getID('thundermulti'));
localStorage.setItem(slotnumber + "icemulti",getID('icemulti'));
localStorage.setItem(slotnumber + "dragonmulti",getID('dragonmulti'));
localStorage.setItem(slotnumber + "eleHalk",getID('eleHalk'));
localStorage.setItem(slotnumber + "eleHH",getID('eleHH'));
localStorage.setItem(slotnumber + "statusStatusattack",getID('statusStatusattack'));
localStorage.setItem(slotnumber + "statusGuildpugi",getID('statusGuildpugi'));
localStorage.setItem(slotnumber + "statusSigil",getID('statusSigil'));
localStorage.setItem(slotnumber + "statusPhial",getID('statusPhial'));
localStorage.setItem(slotnumber + "drugknowledgeToggle",getID('drugknowledgeToggle'));
localStorage.setItem(slotnumber + "drugknowledgeupToggle",getID('drugknowledgeupToggle'));
localStorage.setItem(slotnumber + "statusAssaultToggle",getID('statusAssaultToggle'));
localStorage.setItem(slotnumber + "customMotion",getID('customMotion'));
localStorage.setItem(slotnumber + "customHit",getID('customHit'));
localStorage.setItem(slotnumber + "customElemental",getID('customElemental'));

} else {
	
}

};



function loadSlot(slotnumber){

slotnumber = getID('saveSlot');
if (confirm('Load from Slot ' + slotnumber + '?')) {
	
	
var slotnumber = "save" + slotnumber;
if (localStorage.getItem(slotnumber + "weaponclass") === null){
	alert("Save does not exist.")
} else {

setID('weaponclass',localStorage.getItem(slotnumber + "weaponclass"));
setID('ACweapontype',localStorage.getItem(slotnumber + "ACweapontype"));
setID('weapontype',localStorage.getItem(slotnumber + "weapontype"));
setID('WeaponStyle','.extremestyle');
setID('displayedattack',localStorage.getItem(slotnumber + "displayedattack"));
setID('trueraw',localStorage.getItem(slotnumber + "trueraw"));
setID('ACsrattack',localStorage.getItem(slotnumber + "ACsrattack"));
setID('ACsigil',localStorage.getItem(slotnumber + "ACsigil"));
setID('ACsigil2',localStorage.getItem(slotnumber + "ACsigil2"));
setID('ACsigil3',localStorage.getItem(slotnumber + "ACsigil3"));
setID('AffinityNatural',localStorage.getItem(slotnumber + "AffinityNatural"));
setID('AffinitySigils',localStorage.getItem(slotnumber + "AffinitySigils"));
setID('AffinitySigils2',localStorage.getItem(slotnumber + "AffinitySigils2"));
setID('AffinitySigils3',localStorage.getItem(slotnumber + "AffinitySigils3"));
setID('critmulti',localStorage.getItem(slotnumber + "critmulti"));
setID('averaging',localStorage.getItem(slotnumber + "averaging"));
setID('fencingtoggle',localStorage.getItem(slotnumber + "fencingtoggle"));
setID('sharpness',localStorage.getItem(slotnumber + "sharpness"));
setID('ssmulti',localStorage.getItem(slotnumber + "ssmulti"));
setID('elementtype',localStorage.getItem(slotnumber + "elementtype"));
setID('fakeelement',localStorage.getItem(slotnumber + "fakeelement"));
setID('eleSwaxe',localStorage.getItem(slotnumber + "eleSwaxe"));
setID('statusvalue',localStorage.getItem(slotnumber + "statusvalue"));
setID('additional',localStorage.getItem(slotnumber + "additional"));
setID('tonfamode',localStorage.getItem(slotnumber + "tonfamode"));
setID('rangeddistancemulti',localStorage.getItem(slotnumber + "rangeddistancemulti"));
setID('bulletstrengthmod',localStorage.getItem(slotnumber + "bulletstrengthmod"));
setID('bowgunshotmodifier',localStorage.getItem(slotnumber + "bowgunshotmodifier"));
setID('HBGchargemulti',localStorage.getItem(slotnumber + "HBGchargemulti"));
setID('HBGshotstocompress',localStorage.getItem(slotnumber + "HBGshotstocompress"));
setID('HBGcompressedshots',localStorage.getItem(slotnumber + "HBGcompressedshots"));
setID('HBGshotstocompressEle',localStorage.getItem(slotnumber + "HBGshotstocompressEle"));
setID('HBGcompressedshotEle',localStorage.getItem(slotnumber + "HBGcompressedshotEle"));
setID('bowchargemodifier',localStorage.getItem(slotnumber + "bowchargemodifier"));
setID('bowbottles',localStorage.getItem(slotnumber + "bowbottles"));
setID('quickshotchargemodifier',localStorage.getItem(slotnumber + "quickshotchargemodifier"));
setID('rangedelementtypeBow',localStorage.getItem(slotnumber + "rangedelementtypeBow"));
setID('rangedfakeelement',localStorage.getItem(slotnumber + "rangedfakeelement"));

setID('defenserate',localStorage.getItem(slotnumber + "defenserate"));
setID('defenseratemod',localStorage.getItem(slotnumber + "defenseratemod"));
setID('defenseratemod2',localStorage.getItem(slotnumber + "defenseratemod2"));
setID('rawhb',localStorage.getItem(slotnumber + "rawhb"));
setID('minrawhb',localStorage.getItem(slotnumber + "minrawhb"));
setID('maxrawhb',localStorage.getItem(slotnumber + "maxrawhb"));
setID('elehb0',localStorage.getItem(slotnumber + "elehb0"));
setID('elehb1',localStorage.getItem(slotnumber + "elehb1"));
setID('elehb2',localStorage.getItem(slotnumber + "elehb2"));
setID('elehb3',localStorage.getItem(slotnumber + "elehb3"));
setID('elehb4',localStorage.getItem(slotnumber + "elehb4"));
setID('statusmulti',localStorage.getItem(slotnumber + "statusmulti"));
setID('thunderclad',localStorage.getItem(slotnumber + "thunderclad"));
setID('sniperraw',localStorage.getItem(slotnumber + "sniperraw"));
setID('exweak',localStorage.getItem(slotnumber + "exweak"));
setID('pbreak',localStorage.getItem(slotnumber + "pbreak"));
setID('acidShot',localStorage.getItem(slotnumber + "acidShot"));
setID('eleex',localStorage.getItem(slotnumber + "eleex"));
setID('hhweak',localStorage.getItem(slotnumber + "hhweak"));
setID('Absdef',localStorage.getItem(slotnumber + "Absdef"));
setID('Premium',localStorage.getItem(slotnumber + "Premium"));

setID('AffinityStylerank',localStorage.getItem(slotnumber + "AffinityStylerank"));
setID('AffinitySharp',localStorage.getItem(slotnumber + "AffinitySharp"));
setID('AffinityFlash',localStorage.getItem(slotnumber + "AffinityFlash"));
setID('AffinityExpert',localStorage.getItem(slotnumber + "AffinityExpert"));
setID('AffinityIssen',localStorage.getItem(slotnumber + "AffinityIssen"));
setID('AffinityCeaseless',localStorage.getItem(slotnumber + "AffinityCeaseless"));
setID('AffinityDrink',localStorage.getItem(slotnumber + "AffinityDrink"));
setID('AffinityGSAF',localStorage.getItem(slotnumber + "AffinityGSAF"));
setID('ACatkskill',localStorage.getItem(slotnumber + "ACatkskill"));
setID('ACcaravan',localStorage.getItem(slotnumber + "ACcaravan"));
setID('ACpassives',localStorage.getItem(slotnumber + "ACpassives"));
setID('ACfood',localStorage.getItem(slotnumber + "ACfood"));
setID('ACseeds',localStorage.getItem(slotnumber + "ACseeds"));
setID('AClonewolf',localStorage.getItem(slotnumber + "AClonewolf"));
setID('ACcritconv',localStorage.getItem(slotnumber + "ACcritconv"));
setID('ACcritup',localStorage.getItem(slotnumber + "ACcritup"));
setID('ACstylishass',localStorage.getItem(slotnumber + "ACstylishass"));
setID('ACconsumption',localStorage.getItem(slotnumber + "ACconsumption"));
setID('ACfurious',localStorage.getItem(slotnumber + "ACfurious"));
setID('ACpatient',localStorage.getItem(slotnumber + "ACpatient"));
setID('ACVamp',localStorage.getItem(slotnumber + "ACVamp"));
setID('ACrush',localStorage.getItem(slotnumber + "ACrush"));
setID('ACrising',localStorage.getItem(slotnumber + "ACrising"));
setID('ACincite',localStorage.getItem(slotnumber + "ACincite"));
setID('AClengthup',localStorage.getItem(slotnumber + "AClengthup"));
setID('ACtower',localStorage.getItem(slotnumber + "ACtower"));
setID('AClance',localStorage.getItem(slotnumber + "AClance"));
setID('ACroadlast',localStorage.getItem(slotnumber + "ACroadlast"));
setID('ACadvlvl',localStorage.getItem(slotnumber + "ACadvlvl"));
setID('ACadvfloor',localStorage.getItem(slotnumber + "ACadvfloor"));
setID('ACdure',localStorage.getItem(slotnumber + "ACdure"));
setID('ACconqatk',localStorage.getItem(slotnumber + "ACconqatk"));
setID('ACconqpot',localStorage.getItem(slotnumber + "ACconqpot"));
setID('AChh',localStorage.getItem(slotnumber + "AChh"));
setID('ACadren',localStorage.getItem(slotnumber + "ACadren"));
setID('AChiden',localStorage.getItem(slotnumber + "AChiden"));
setID('ACdstonfa',localStorage.getItem(slotnumber + "ACdstonfa"));
setID('ACcomsup',localStorage.getItem(slotnumber + "ACcomsup"));
setID('ACarmour1',localStorage.getItem(slotnumber + "ACarmour1"));
setID('ACarmour2',localStorage.getItem(slotnumber + "ACarmour2"));
setID('ACarmourG',localStorage.getItem(slotnumber + "ACarmourG"));
setID('ACsoul',localStorage.getItem(slotnumber + "ACsoul"));
setID('ACassist',localStorage.getItem(slotnumber + "ACassist"));
setID('ACbondhunter',localStorage.getItem(slotnumber + "ACbondhunter"));
setID('ACsecrettech',localStorage.getItem(slotnumber + "ACsecrettech"));
setID('ACvigup',localStorage.getItem(slotnumber + "ACvigup"));
setID('AffinitySW',localStorage.getItem(slotnumber + "AffinitySW"));
setID('ACpartnyaabond',localStorage.getItem(slotnumber + "ACpartnyaabond"));
setID('firemulti',localStorage.getItem(slotnumber + "firemulti"));
setID('watermulti',localStorage.getItem(slotnumber + "watermulti"));
setID('thundermulti',localStorage.getItem(slotnumber + "thundermulti"));
setID('icemulti',localStorage.getItem(slotnumber + "icemulti"));
setID('dragonmulti',localStorage.getItem(slotnumber + "dragonmulti"));
setID('eleHalk',localStorage.getItem(slotnumber + "eleHalk"));
setID('eleHH',localStorage.getItem(slotnumber + "eleHH"));
setID('statusStatusattack',localStorage.getItem(slotnumber + "statusStatusattack"));
setID('statusGuildpugi',localStorage.getItem(slotnumber + "statusGuildpugi"));
setID('statusSigil',localStorage.getItem(slotnumber + "statusSigil"));
setID('statusPhial',localStorage.getItem(slotnumber + "statusPhial"));
setID('drugknowledgeToggle',localStorage.getItem(slotnumber + "drugknowledgeToggle"));
setID('drugknowledgeupToggle',localStorage.getItem(slotnumber + "drugknowledgeupToggle"));
setID('statusAssaultToggle',localStorage.getItem(slotnumber + "statusAssaultToggle"));
setID('customMotion',localStorage.getItem(slotnumber + "customMotion"));
setID('customHit',localStorage.getItem(slotnumber + "customHit"));
setID('customElemental',localStorage.getItem(slotnumber + "customElemental"));


WeaponShow();
processall();
processAC();
processranged();


//Correct Buttons
if( document.getElementById('weaponclass').value == 1){
	$('#gunnercalc').addClass('styleselected');
	$('.calcbutton').not('#gunnercalc').removeClass('styleselected');
	$("#weaponclass").val(1).change();
}

};

} else{

};


};



forcedupdate();
