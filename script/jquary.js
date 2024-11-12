$(document).ready(function() {
    $('#mobile-nav').animate({ left: '150%' }, 200);
});
$(document).ready(function() {
let isOpen = false;

$('.menu-icon').click(function(event) {
           $('#mobile-nav').animate({ left: '50%' }, 200);

});

$(document).click(function(event) {
if (!$(event.target).closest('#mobile-nav, .menu-icon').length) {
    $('#mobile-nav').animate({ left: '150%' }, 200);
}
});

});
  
$(document).ready(function(){
$(".sign-container").hide();

$("#sign-in").click(function(event) {
$(".sign-container").show(200);
$(".login-container").hide(200);
});
$("#log-in").click(function(event) {
$(".login-container").show(200);
$(".sign-container").hide(200);
});
});       
   
$('body').on('click', '.password-checkbox', function(){
if ($(this).is(':checked')){
$("#password_log").attr('type', 'text');
} else {
$('#password_log').attr('type', 'password');
}
}); 
$('body').on('click', '.password-checkbox', function(){
if ($(this).is(':checked')){
$('#password').attr('type', 'text');
} else {
$('#password').attr('type', 'password');
}
}); 
$(document).ready(function(){
var a=0;
$( ".regestration" ).hide();
    $('#open').click(function(){
        $( ".regestration" ).show();
        if(a==0){
            $(".regestration").animate({
            height: '+=400px'  
        }, 500);
        a=1;

        }
        else{
            $(".regestration").animate({
            height: '-=400px'  
        }, 500);
        a=0;
        $( ".regestration" ).hide(500);


        }
         
    });
});
$(document).ready(function(){
var a=0;
$( ".regestration-mb" ).hide();
    $('#open-mb').click(function(){
        if(a==0){
            $(".regestration-mb").fadeIn(500);
        a=1;

        }
        else{
            $(".regestration-mb").fadeOut(500);

        a=0;
        }
         
    });
});
$(document).ready(function(){
        
      
        $(".auth").hide();

        $('#sign-in-bt').click(function(){
            $(".auth").fadeIn('200').delay('5000').fadeOut('200');
            $("#loginMessage").html(" ");
            $("#responseMessage").html(" ");
        });
        $('#log-in-bt').click(function(){
            $(".auth").fadeIn('200').delay('5000').fadeOut('200');
            $("#loginMessage").html(" ");
            $("#responseMessage").html(" ");
        });
        $('#log-in-bt-mb').click(function(){
            $(".auth").fadeIn('200').delay('5000').fadeOut('200');
            $("#loginMessage").html(" ");
            $("#responseMessage").html(" ");
        });
        
        
});
$(document).ready(function(){
        
      
   //$("#tg").hide();
    var ready=0;
    $('#click').click(function(){
        if(ready==0){
            $("#tg").animate({
                left: '-=200px'  
            }, 500);
            ready=1;
        }
      
        else{
            $("#tg").animate({
                left: '+=200px'  
            }, 500);
            ready=0;
        }
    });
   
    
    
});

