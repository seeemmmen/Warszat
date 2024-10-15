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
$(".sign-container").show();
$(".login-container").hide();
});
$("#log-in").click(function(event) {
$(".login-container").show();
$(".sign-container").hide();
});
});       
   
$('body').on('click', '.password-checkbox', function(){
if ($(this).is(':checked')){
$('#pass').attr('type', 'text');
} else {
$('#pass').attr('type', 'password');
}
}); 
$('body').on('click', '.password-checkbox', function(){
if ($(this).is(':checked')){
$('#pass2').attr('type', 'text');
} else {
$('#pass2').attr('type', 'password');
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
$(document).ready(function() {
    $('#registration-form').on('submit', function(e) {
        e.preventDefault(); // Prevent the form from submitting in the traditional way

        $.ajax({
            url: 'register.php',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function(response) {
                // Display success or error message
                if (response.status === 'success') {
                    $('#registration-message').html('<p style="color: green;">' + response.message + '</p>');
                    $('#registration-form')[0].reset(); // Reset form fields
                } else {
                    $('#registration-message').html('<p style="color: red;">' + response.message + '</p>');
                }
            },
            error: function() {
                $('#registration-message').html('<p style="color: red;">An error occurred while processing the request.</p>');
            }
        });
    });
});
