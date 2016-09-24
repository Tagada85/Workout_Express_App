$('.workout ul').hide();
			let workoutNames = $('.workoutName');
			workoutNames.each(function(){
				$(this).click(function(){
					$(this).siblings('ul').toggle();
				})
			})