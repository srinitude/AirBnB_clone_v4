let amenitiesChecked = [];
$(() => {
  $("input[type=checkbox]").click(function () {
    let index = amenitiesChecked.indexOf(this.dataset.id);
    if (this.checked) {
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
});
