$(() => {
  let amenitiesChecked = []
    function updateAmenitiesChecked() {
      $("input[type=checkbox]").click((event) => {
	let index = amenitiesChecked.findIndex(this.dataset.id);
	if (!this.checked) {
	  amenitiesChecked.push(this.dataset.id);
	}
	else {
	  if (index !== -1) {
	    amenitiesChecked.splice(index, 1);
	  }
	  else {
	    console.log("Corrupted amenties checked array");
	  }
	}
      });
    }
    updateAmenitiesChecked();
});
