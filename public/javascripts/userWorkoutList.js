let btn = document.getElementById('btn-workout');
let form = document.getElementById('new-workout-form');
let deleteBtn = document.querySelectorAll('.delete_btn');
console.log(deleteBtn);
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
});

if(deleteBtn.length !== 0){
	deleteBtn.forEach((btn)=>{
		btn.onclick = function(){
			let id = $(this).prev('input').attr('value');
			$.ajax({
				url:'delete_workout/' + id,
				method: 'DELETE'
			}).done(()=>{
				alert('Workout deleted!');
			})
		}
	})

	}
