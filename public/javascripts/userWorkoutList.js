let btn = document.getElementById('btn-workout');
let form = document.getElementById('new-workout-form');
form.style.display = 'none';

btn.onclick = function(){
	form.style.display == 'block' ? form.style.display = 'none' : form.style.display = 'block'
}

$('.workout ul').hide();
let workoutNames = $('.workoutName');
workoutNames.each(function(){
	$(this).click(function(){
		$(this).siblings('ul').toggle();
	})
})