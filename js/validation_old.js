// JavaScript Document

$(window).load(function(){

	function create_dates(){
		for(var i = 1; i <= 12; i++){
			var expiry_month = document.createElement('option');
			expiry_month.value = i;
			expiry_month.innerHTML = i;
			$('#expiry_month').append(expiry_month);
		}
		
		var current_year = parseInt(new Date().getFullYear());
		
		for(current_year ; current_year < 2030; current_year++){
			var expiry_year = document.createElement('option');
			expiry_year.value = current_year;
			expiry_year.innerHTML = current_year;
			$('#expiry_year').append(expiry_year);
		}
	}

	function removeAll(x){																		// Change State of form
		$(x).parent().removeClass('error').removeClass('focus').removeClass('focus');
		$(x).parent().find('span').empty().removeClass('icon-cross').removeClass('icon-checkmark2');
	}
	
	function addError(x){
		removeAll(x);
		$(x).parent().addClass('error');
		$(x).parent().find('span').addClass('icon-cross');
	}
	
	function addValid(x){
		removeAll(x);
		$(x).parent().addClass('valid');
		$(x).parent().find('span').addClass('icon-checkmark2');
	}
	
	function addActive(x){
		removeAll(x);
		var focus_img = document.createElement('img');										// Create Image spinner
		focus_img.src = 'svg/loading/loading-spinning-bubbles.svg';
		
		$(x).parent().find('span').append(focus_img).attr('src','svg/loading/loading-spinning-bubbles.svg');
		$(x).parent().addClass('focus'); 
	}
	
	function input_status(x){
		$(x).on('focus',function(){
			$(x).stop;
			var focus_img = document.createElement('img');
			focus_img.src = 'svg/loading/loading-spinning-bubbles.svg';
			var parent = $(this).parent().addClass('focus').removeClass('error');
			var span = parent.find('span').removeClass('icon-checkmark2').removeClass('icon-cross');
			var img = parent.find('span').append(focus_img).attr('src','svg/loading/loading-spinning-bubbles.svg');
			
			setTimeout(function(){
				span.empty();
				parent.removeClass('focus');
			},3000);
			
		});
	}
	
	function empty_check(x){
		$(x).stop();
		$(x).on('blur',function(){
			removeAll(x);
			var value = $(x).val();
			if(value == ''){
				addError(x)
			} else {
				addValid(x)
			}
		});
	};
	
	function check_email(x){
		$(x).on('blur',function(){
			var value = $(x).val();
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!filter.test(email.value)) {
				addError(x);
			} else {
				addValid(x);
			}
		});
	};
	
	function check_match(x,y){
		$(y).on('blur',function(){
			var value = $(x).val();
			var value_1 = $(y).val();
			if (value != value_1 | value_1 =='') {
				addError(y);
			} else {
				addValid(y);
			}
		});
	}
	
	function check_select(x,y){
		$(x).on('click',function(){
			var value = $(this).val();
			var parent = $(x).parent();
			if( value == y){
				addError(parent)
			} else {
				addValid(parent)
			}
		});
	}
	
	function check_credit_no(x){
		$(x).on('blur',function(){
			var value = $(x).val().replace(/ |-/g,'')	// .replace(/ /g,'').replace(/-/g,'');
			var digits =/^\d{16}$/;
			if (value.match(digits)) {
				addValid(x);
			} else {
				addError(x);
			}
		});
	}
	
	function check_number(x,y){
		$(x).on('blur',function(){
			var value = $(x).val().replace(/ |-/g,'')	// .replace(/ /g,'').replace(/-/g,'');
			var digits = y;
			if (value.match(digits)) {
				addValid(x);
			} else {
				addError(x);
			}
		});
	}
			
	function validate_details(){
			
			input_status('input[type=text]');
			empty_check('#name');
			check_email('#email');
			check_match('#email','#email_match');
			check_number('#phone',/^\d{10}$|^\d{8}$/);
			
			check_select('#adults option','Select');
			check_select('#children_0_6 option','Select');
			check_select('#children_7_12 option','Select');
			check_select('#style option','Select');
			
			$('#proceed_info').click(function(){
				
				removeAll('#name,#email,#email_match,#phone,#adults,#children_0_6,#children_7_12,#style');
				addValid('#name,#email,#email_match,#phone');
				
				var name = $('#name').val(),																// Input Variables
					email = $('#email').val(),
					email_match = $('#email_match').val(),
					phone = $('#phone').val().replace(/ |-/g,''),
					adults = $('#adults').val(),
					children_0_6 = $('#children_0_6').val(),
					children_7_12 = $('#children_7_12').val(),
					style = $('#style').val();
					
				var email_filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,		// Input Variables
					phone_filter =/^\d{10}$|^\d{8}$/;				
				
				var	total = 0;
				var	form = new Object;
				
				form[0] = (name != '') ? 1:0;																// Input Variables
				form[1] = (email.match(email_filter)) ? 1:0; 	
				form[2] = (email == email_match) ? 1:0; 
				form[3] = (phone.match(phone_filter)) ? 1:0; 
				form[4] = (adults != 'Select') ? 1:0; 
				form[5] = (children_0_6 != 'Select') ? 1:0; 
				form[6] = (children_7_12 != 'Select') ? 1:0; 
				form[7] = (style != 'select') ? 1:0; 
				
				function get_total(){
					for(var i = 0; i < 8; i++){																// Manually count the number of objects
						total += form[i];
					}
				};
				
				get_total();
				
				if(total == 8){
					$('#error_message_info').empty();
					var cart_items = document.createElement('span');
					$(cart_items).addClass('hidden');
				} else {
					$('#error_message_info').empty().html('Sorry there are errors with you form: ');
					
					function errorQuote(x){
						$('#error_message_info').append(x);
					}
					
					if( form[0] == 0){
						addError('#name');
						errorQuote(' Name Feild Empty;');
					}
					if( form[1] == 0){
						addError('#email');
						errorQuote(' Email Address incorrect;');  
					}
					if( form[2] == 0){
						addError('#email_match');
						errorQuote(' Email Address\'s do not match;');  
					}
					if( form[3] == 0){
						addError('#phone');
						errorQuote(' Phone Number Invalid;');  
					}
					if( form[4] == 0){
						addError('#adults');
						errorQuote(' Select how many Adults;');  
					}
					if( form[5] == 0){
						addError('#children_0_6');
						errorQuote(' Select how many Children 0-6;');  
					}
					if( form[6] == 0){
						addError('#children_7_12');
						errorQuote(' Select how many Children 7-12.');  
					}
					if( form[7] == 0){
						addError('#style');
					}
				}
			});
			
		
	}
	
	function validate_payment(){
		
		check_select('#card_type option','Select');
		check_select('#expiry_month option','Month');
		check_select('#expiry_year option','Year')
		empty_check('#card_name');
		
		check_number('#card_number',/^\d{16}$/);
		check_number('#card_code',/^\d{3}$/);
		
		$('#proceed_payment').click(function(){
				var form = [0,0,0,0,0,0]; 
				var total = 0;
				
				function get_total(){
					for(var i = 0; i < form.length; i++){
						total += form[i];
					}
				};
				
				var card_type = $('#card_type').val(),
					card_name = $('#card_name').val(),
					card_number = $('#card_number').val().replace(/ |-/g,''),
					number_filter =/^\d{16}$/,
					card_code = $('#card_code').val().replace(/ |-/g,''),
					code_filter =/^\d{3}$/,
					expiry_month = $('#expiry_month').val(),
					expiry_year = $('#expiry_year').val();
				
				form[0] = (card_type != 'Select') ? 1:0; 				
				form[1] = (card_name != '') ? 1:0; 					
				form[2] = (card_number.match(number_filter)) ? 1:0; 					
				form[3] = (card_code.match(code_filter)) ? 1:0; 			
				form[4] = (expiry_month != 'Month') ? 1:0; 					
				form[5] = (expiry_year != 'Year') ? 1:0; 					
				
				get_total();
				
				if(total == 6){
					$('#error_payment').empty();
					// var cart_items = document.createElement('span');
					//$(cart_items).addClass('hidden');
				} else {
					$('#error_payment').empty().html('Sorry there are errors with you form: ');
					
					function errorQuotePayment(x){
						$('#error_payment').append(x);
					}
					
					if( form[0] == 0){
						addError('#card_type');
						errorQuotePayment(' No Card Type Selected;');
					}
					if( form[1] == 0){
						addError('#card_name');
						errorQuotePayment(' Card Name Incorrect');  
					}
					if( form[2] == 0){
						addError('#card_number');
						errorQuotePayment(' Please Enter a Valid Card Number');  
					}
					if( form[3] == 0){
						addError('#card_code');
						errorQuotePayment(' Card Code Invalid;');  
					}
					if( form[4] == 0){
						addError('#expiry_month');
						errorQuotePayment(' Select Expiry Month;');  
					}
					if( form[5] == 0){
						addError('#expiry_year');
						errorQuotePayment(' Select Expiry Year;');  
					}
				}
		});
		
	}
	
	create_dates()
	validate_details();
	validate_payment();
	
});

