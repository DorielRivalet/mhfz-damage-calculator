/* asynchronous */
$.ajaxPrefilter(function( options, original_Options, jqXHR ) {
    options.async = true;
});

function getID(idtoget){return document.getElementById(idtoget).value;}
function jsonsearch(jsonfile,searchtype,searchdistance){

if (searchtype == "1"){
// No Links CN EN JP
   var request = new XMLHttpRequest();
   request.open("GET", jsonfile, false);
   request.send(null)
   var data = JSON.parse(request.responseText);
        var options = {
			caseSensitive: false,
			shouldSort: true,
			tokenize: false,
			threshold: 0.25,
			location: 0,
			distance: searchdistance,
			maxPatternLength: 32,
			keys: ["jpname","cnname","enname","tags"]
        }
        var f = new Fuse(data, options);
		var output = f.search(getID('textbox').split('G')[0].split('Z')[0]);
		console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th><th>EN Name</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td>' + output[i].jpname + '</td><td>' + output[i].cnname + '</td><td>' + output[i].enname + '</td></tr>'
        }	
							


   $('#textbox').on('keypress', function (event) {
         if(event.which === 13){

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");

            //Do Stuff, submit, etc..
		var f = new Fuse(data, options);
		var output = f.search(getID('textbox').split('G')[0].split('Z')[0]);
        console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th><th>EN Name</th></tr>'  
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td>' + output[i].jpname + '</td><td>' + output[i].cnname + '</td><td>' + output[i].enname + '</td></tr>'
		}
         }

			$(this).removeAttr('disabled');
		 });
	} else if (searchtype == "9"){
// No Links CN EN JP (Monster Names)
   var request = new XMLHttpRequest();
   request.open("GET", jsonfile, false);
   request.send(null)
   var data = JSON.parse(request.responseText);
        var options = {
			caseSensitive: false,
			shouldSort: true,
			tokenize: false,
			threshold: 0.25,
			location: 0,
			distance: searchdistance,
			maxPatternLength: 32,
			keys: ["jpname","cnname","enname","tags"]
        }
        var f = new Fuse(data, options);
		var output = f.search(getID('textbox'));
		console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th><th>EN Name</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '" target="_blank">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '" target="_blank">' + output[i].cnname + '</a></td><td>' + output[i].enname + '</td></tr>'
        }	
							


   $('#textbox').on('keypress', function (event) {
         if(event.which === 13){

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");

            //Do Stuff, submit, etc..
		var f = new Fuse(data, options);
		var output = f.search(getID('textbox'));
        console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th><th>EN Name</th></tr>'  
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '">' + output[i].cnname + '</a></td><td>' + output[i].enname + '</td></tr>'
		}
         }

			$(this).removeAttr('disabled');
		 });
	} else if (searchtype == "8"){
// Sigil Recipes
   var request = new XMLHttpRequest();
   request.open("GET", jsonfile, false);
   request.send(null)
   var data = JSON.parse(request.responseText);
        var options = {
			caseSensitive: false,
			shouldSort: true,
			tokenize: false,
			threshold: 0.25,
			location: 0,
			distance: searchdistance,
			maxPatternLength: 32,
			keys: ["name","skillpoints","tags"]
        }
        var f = new Fuse(data, options);
		var output = f.search(getID('textbox'));
		console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>Sigil Recipe</th><th>Skills</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td>' + output[i].name + '</td>' + '<td>' + output[i].skillpoints + '</td></tr>'
        }	
							


   $('#textbox').on('keypress', function (event) {
         if(event.which === 13){

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");

            //Do Stuff, submit, etc..
		var f = new Fuse(data, options);
		var output = f.search(getID('textbox'));
        console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>Sigil Recipe</th><th>Skills</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td>' + output[i].name + '</td>' + '<td>' + output[i].skillpoints + '</td></tr>'
        }	
         }

			$(this).removeAttr('disabled');
		 });
	} else if (searchtype == "5"){
// No Links CN EN JP
   var request = new XMLHttpRequest();
   request.open("GET", jsonfile, false);
   request.send(null)
   var data = JSON.parse(request.responseText);
        var options = {
			caseSensitive: false,
			shouldSort: true,
			tokenize: false,
			threshold: 0.1,
			location: 0,
			distance: searchdistance,
			maxPatternLength: 32,
			keys: ["jpname","cnname","enname","tags"]
        }
        var f = new Fuse(data, options);
		var output = f.search(getID('textbox'));
		console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '">' + output[i].cnname + '</a></td></tr>'
        }	
							


   $('#textbox').on('keypress', function (event) {
         if(event.which === 13){

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");

            //Do Stuff, submit, etc..
		var f = new Fuse(data, options);
		var output = f.search(getID('textbox'));
        console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th></tr>'  
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '">' + output[i].cnname + '</a></td></tr>'
		}
         }

			$(this).removeAttr('disabled');
		 });
	} else if (searchtype == "2"){
		
// Links CN EN JP
		   var request = new XMLHttpRequest();
   request.open("GET", jsonfile, false);
   request.send(null)
   var data = JSON.parse(request.responseText);
        var options = {
			caseSensitive: false,
			shouldSort: true,
			tokenize: false,
			threshold: 0.25,
			location: 0,
			distance: searchdistance,
			maxPatternLength: 32,
			keys: ["jpname","cnname","enname"]
        }
        var f = new Fuse(data, options);
		if(getID('textbox').length > 1){
			var output = f.search(getID('textbox'));
		} else {
			var output = f.search('');
		}
		console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th><th>EN Name</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '">' + output[i].cnname + '</a></td><td>' + output[i].enname + '</td></tr>'
        }	
		
   $('#textbox').on('keypress', function (event) {
         if(event.which === 13){

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");

            //Do Stuff, submit, etc..
		var f = new Fuse(data, options);
		if(getID('textbox').length > 1){
			var output = f.search(getID('textbox'));
		} else {
			var output = f.search('');
		}
        console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th><th>EN Name</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '">' + output[i].cnname + '</a></td><td>' + output[i].enname + '</td></tr>'
		}
         }

			$(this).removeAttr('disabled');
		 });
	}  else if (searchtype == "4"){
		
// Links CN JP EN, Decorations + Skill Points
		
   var request = new XMLHttpRequest();
   request.open("GET", jsonfile, false);
   request.send(null)
   var data = JSON.parse(request.responseText);
   
		if(	$('#skillstoggle').is(':checked')){
				var options = {
				caseSensitive: false,
				shouldSort: true,
				tokenize: false,
				threshold: 0.2,
				location: 0,
				distance: searchdistance,
				maxPatternLength: 32,
				keys: ["jpname","cnname","skills","notes"]
			}
		} else {
				var options = {
				caseSensitive: false,
				shouldSort: true,
				tokenize: false,
				threshold: 0.2,
				location: 0,
				distance: searchdistance,
				maxPatternLength: 32,
				keys: ["jpname","cnname"]
				}
		};
   

        var f = new Fuse(data, options);
		if(getID('textbox').length > 1){
			var output = f.search(getID('textbox'));
		} else {
			var output = f.search('');
		}
		console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th><th>Info</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '">' + output[i].cnname + '</a></td><td>' + output[i].skills + '</td></tr>'
        }	
		
   $('#textbox').on('keypress', function (event) {
         if(event.which === 13){
		if(	$('#skillstoggle').is(':checked')){
				var options = {
				caseSensitive: false,
				shouldSort: true,
				tokenize: false,
				threshold: 0.2,
				location: 0,
				distance: searchdistance,
				maxPatternLength: 32,
				keys: ["jpname","cnname","skills","notes"]
			}
		} else {
				var options = {
				caseSensitive: false,
				shouldSort: true,
				tokenize: false,
				threshold: 0.2,
				location: 0,
				distance: searchdistance,
				maxPatternLength: 32,
				keys: ["jpname","cnname"]
				}
		};
            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");

            //Do Stuff, submit, etc..
        var f = new Fuse(data, options);
		if(getID('textbox').length > 1){
			var output = f.search(getID('textbox'));
		} else {
			var output = f.search('');
		}
		console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th><th>Info</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '">' + output[i].cnname + '</a></td><td>' + output[i].skills + '</td></tr>'
        }	
         }

			$(this).removeAttr('disabled');
		 });
	} else if (searchtype == "3"){
		
// Links CN JP EN, Decorations + Skill Points
		
   var request = new XMLHttpRequest();
   request.open("GET", jsonfile, false);
   request.send(null)
   var data = JSON.parse(request.responseText);
   
		if(	$('#skillstoggle').is(':checked')){
				var options = {
				caseSensitive: false,
				shouldSort: true,
				tokenize: false,
				threshold: 0.2,
				location: 0,
				distance: searchdistance,
				maxPatternLength: 32,
				keys: ["jpname","cnname","skills"]
			}
		} else {
				var options = {
				caseSensitive: false,
				shouldSort: true,
				tokenize: false,
				threshold: 0.2,
				location: 0,
				distance: searchdistance,
				maxPatternLength: 32,
				keys: ["jpname","cnname"]
				}
		};
   

        var f = new Fuse(data, options);
		if(getID('textbox').length > 1){
			var output = f.search(getID('textbox'));
		} else {
			var output = f.search('');
		}
		console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th><th>Skill Points</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '">' + output[i].cnname + '</a></td><td>' + output[i].skills + '</td></tr>'
        }	
		
   $('#textbox').on('keypress', function (event) {
         if(event.which === 13){
		if(	$('#skillstoggle').is(':checked')){
				var options = {
				caseSensitive: false,
				shouldSort: true,
				tokenize: false,
				threshold: 0.2,
				location: 0,
				distance: searchdistance,
				maxPatternLength: 32,
				keys: ["jpname","cnname","skills"]
			}
		} else {
				var options = {
				caseSensitive: false,
				shouldSort: true,
				tokenize: false,
				threshold: 0.2,
				location: 0,
				distance: searchdistance,
				maxPatternLength: 32,
				keys: ["jpname","cnname"]
				}
		};
            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");

            //Do Stuff, submit, etc..
        var f = new Fuse(data, options);
		if(getID('textbox').length > 1){
			var output = f.search(getID('textbox'));
		} else {
			var output = f.search('');
		}
		console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th><th>Skill Points</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '">' + output[i].cnname + '</a></td><td>' + output[i].skills + '</td></tr>'
        }	
         }

			$(this).removeAttr('disabled');
		 });
	} else {
		
// No Links CN JP
	var request = new XMLHttpRequest();
   request.open("GET", jsonfile, false);
   request.send(null)
   var data = JSON.parse(request.responseText);
        var options = {
			caseSensitive: false,
			shouldSort: true,
			tokenize: false,
			threshold: 0.2,
			location: 0,
			distance: searchdistance,
			maxPatternLength: 32,
			keys: ["jpname","cnname"]
        }
        var f = new Fuse(data, options);
		if(getID('textbox').length > 1){
			var output = f.search(getID('textbox'));
		} else {
			var output = f.search('');
		}
		console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '">' + output[i].cnname + '</a></td> </tr>'
        }	
		

   $('#textbox').on('keypress', function (event) {
         if(event.which === 13){

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");

            //Do Stuff, submit, etc..
		var f = new Fuse(data, options);
		if(getID('textbox').length > 1){
			var output = f.search(getID('textbox'));
		} else {
			var output = f.search('');
		}
        console.log(output)
		document.getElementById('results').innerHTML = '<tr><th>JP Name</th><th>CN Name</th></tr>' 
        for(i=0;i<output.length;i++){
            document.getElementById('results').innerHTML += '<tr><td><a href="' + output[i].jpurl + '">' + output[i].jpname + '</a></td> ' + '<td><a href="' + output[i].cnurl + '">' + output[i].cnname + '</a></td></tr>'
		}
         }

			$(this).removeAttr('disabled');
		 });
	}

}


