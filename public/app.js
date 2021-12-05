function copyData() {
	var copyText = document.getElementById("json");
	copyText.select();
  	copyText.setSelectionRange(0, 99999); /* For mobile devices */

	navigator.clipboard.writeText(copyText.value)
		.then(function() {
			alert("Copied the JSON data to clipboard");
		}, function() {
			console.log('Failed')
		});
}