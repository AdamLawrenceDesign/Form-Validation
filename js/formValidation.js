$(function(){

/***********************************************
	
	Function:	Form Validation
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
	
*************************************************/

function SelectCreate(id,type)
{
	this.type = type;
	this.id = id;
	
	function loop(id, minNumber, maxNumber)
	{
		for(var i = minNumber; i <= maxNumber; i++)
		{
			var option = document.createElement('option');
			option.value = i;
			option.innerHTML = i;
			$(id).append(option);
		}
	};

	switch(type)
	{
		case 'day':
			loop(id,1,31);
		break;
		
		case 'month':
			loop(id,1,12);
		break;
		
		case 'year':
			var currentYear = parseInt(new Date().getFullYear());
			loop(id,1960,currentYear-3);
		break;
		
		case 'expiry':
			var currentYear = parseInt(new Date().getFullYear());
			console.log(currentYear);
			loop(id,currentYear,currentYear+15);
		break;	
	}; 

};

function selectCreateCall(id,type)
{
	var instance = new SelectCreate(id,type);
	return instance;
};

var day = selectCreateCall($('#dobDay'),'day');
var month = selectCreateCall($('#dobMonth'),'month');
var year = selectCreateCall($('#dobYear'),'year');


/****************************************/

function ValidateForm(form)
{
	var inputs = [];
	
	function obj(name,type,value,pass)
	{
		this.name = name;
		this.type = type;
		this.value = value;
		this.pass = pass;
	};
	
	$('input').each(function(i, form) 
	{
		var name = $(this).attr('id'),	
			type = $(this).attr('data-type'),
			value = $(this).val(),
			pass = false;
		inputs.push(new obj(name,type,value,pass));
	});
	
	$('select').each(function(i, form)
	{
		var name = $(this).attr('id'),
			type = $(this).attr('data-type'),
			value = $(this).val(),
			pass = false;
		inputs.push(new obj(name, type, value, pass));
	});
	
	$('textarea').each(function(i, form) 
	{
		var name = $(this).attr('id'),	
			type = $(this).attr('data-type');
			value = $(this).val(),
			pass = false;
		inputs.push(new obj(name,type,value,pass));
	});

	
	/*********************************/ 			// Methods 
	
	function removeAll(obj)
	{	
		$(obj).parent().removeClass('error').removeClass('focus');
		$(obj).parent().find('span').empty().removeClass('icon-cross').removeClass('icon-checkmark2');
		$(obj).parent().css('border-color','#ecedf0');
	};
	
	function active(obj)
	{
		removeAll(obj);
		var focusIcon = document.createElement('img');	
		focusIcon.src = 'img/loading/loader_grey.gif';
		$(obj).parent().find('span').append(focusIcon).attr('src','img/loading/loader_grey.gif');
		$(obj).parent().addClass('focus'); 
		$(obj).parent().css('border-color','#ecedf0');
	};
	
	function error(obj)
	{
		removeAll(obj);
		$(obj).parent().addClass('error');
		$(obj).parent().removeClass('valid');
		$(obj).parent().find('span').addClass('icon-cross').css('color','#f15755');
		$(obj).parent().css('border-color','#f15755');
	};
	
	function valid(obj)
	{
		removeAll(obj);
		//$(obj).parent().addClass('valid').removeClass('error');
		$(obj).parent().removeClass('error');
		$(obj).parent().find('span').addClass('icon-checkmark2').css('color','#4BC9BD');
		$(obj).parent().css('border-color','#ecedf0'); // green #73b64a
	};
	
	/*********************************/ 			 
	
	function updateValue(name, value)
	{
		for(var i = 0; i < inputs.length; i++)
		{
			if(inputs[i].name == name)
			{
				inputs[i].value = value;
				return inputs[i].value;
			};
			
		};
	};
	
	/*********************************/ 		// Checks 
	
	function passLoop(name)
	{
		for(var i = 0; i < inputs.length; i++)
		{
			if(inputs[i].name == name)
			{
				inputs[i].pass = true;
				return inputs[i].pass;
			}
		};
	};
	
	function textCheck(obj,name,value)
	{
		if(value != '') 
		{
			updateValue(name,value);
			valid(obj);
			passLoop(name);
		}
		else
		{
			error(obj);
		};
	};
	
	function emailCheck(obj,name,value)
	{
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (filter.test(value)) 
		{
			updateValue(name,value);
			valid(obj);
			passLoop(name);
		} 
		else 
		{
			error(obj);
		}
	};
	
	function emailMatch(obj,name,value)
	{
		for(var i = 0; i < inputs.length; i++)
		{
			if(inputs[i].type == 'email')
			{
				var currentEmail = inputs[i].value;
			};
		};

		if (currentEmail == value && currentEmail != '') 
		{
			updateValue(name,value);
			valid(obj);
			passLoop(name);
		} 
		else 
		{
			error(obj);
		}
		
	};
	
	function phoneCheck(obj,name,value)
	{
		value = value.replace(/ |-/g,'')	
		var digits = /^\d{10}$|^\d{8}$/;		// Set to Australia 8 and 10 digit phones
		
		if (value.match(digits))
		{
			updateValue(name,value);
			valid(obj);
			passLoop(name);
		} 
		else 
		{
			error(obj);
		}
	};
	
	function selectCheck(obj,name,value)
	{
		if(value != '0')
		{
			updateValue(name,value);
			valid(obj);
			passLoop(name);
		}
		else
		{
			error(obj);
		}
	};
	
	/*********************************/ 		// Event Listeners
	 		 
	function focusAction()
	{
		$('input').on('focus', function()
		{	
			active(this);
		});	
		
		$('select').on('focus',function()
		{
			removeAll(this);
		});
		
		$('input').on('blur', function()
		{
			var obj = this,
				name = $(this).attr('id'),
				value = $(this).val(),
				type = $(obj).attr('data-type');
			
			removeAll(obj);
					
			switch(type)
			{
				case 'text':
					textCheck(obj,name,value);
				break;
				
				case 'email':
					emailCheck(obj,name,value);
				break;
				
				case 'emailMatch':
					emailMatch(obj,name,value);
				break;
				
				case 'phone':
					phoneCheck(obj,name,value);
				break;
			};
			
		});
		
		$('select').on('change',function()
		{
			var obj = this,
				name = $(this).attr('id'),
				value = $(this).val();
			selectCheck(obj,name,value);	
		});
		
		$('textarea').on('blur',function()
		{
			var obj = this,
				name = $(this).attr('id'),
				value = $(this).val();
			textCheck(obj,name,value);	
		});
		
	};
	
	function formSubmit()
	{
		$('button').on('click',function(event)
		{
			event.preventDefault();
			var count = 0;
			
			for(var i = 0; i < inputs.length; i++)
			{
				var obj = document.getElementById(inputs[i].name),
					name = inputs[i].name,
					value = $(obj).val(),
					type = inputs[i].type;
				
				removeAll(obj);
					
				if(type == 'text')
				{
					textCheck(obj,name,value);
				};
				
				if(type == 'select')
				{
					selectCheck(obj,name,value);
				};
				
				if(type == 'phone')
				{
					phoneCheck(obj,name,value);
				};
				
				if(type == 'email')
				{
					emailCheck(obj,name,value);
				};
				
				if(type == 'emailMatch')
				{
					emailMatch(obj,name,value);
				};
				
				if(type == 'textarea')
				{
					textCheck(obj,name,value);
				};
				
				if(inputs[i].pass)
				{
					count = count+1;
				};
				
			};
			
			if(count < inputs.length)
			{
				$('#errorMessage').slideDown(400);
			}
			else
			{
				$('#errorMessage').slideUp(400);
				console.log('pass');
			}

			
		});
	}
	
	focusAction();
	formSubmit();
	
};

function validateFormCall(form)
{
	var instance = new ValidateForm(form);
	return instance;
}
	
var sampleForm = validateFormCall($('form'));	
	
		
});
