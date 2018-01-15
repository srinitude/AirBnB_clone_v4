let amenitiesChecked = [];
$(() => {
  $("input[type=checkbox]").click((e) => {
    console.log($(this));
    let index = amenitiesChecked.indexOf($(this).data('id'));
    if ($(this).checked) {
      amenitiesChecked.push($(this).data('id'));
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
