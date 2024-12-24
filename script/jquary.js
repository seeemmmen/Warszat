$(document).ready(function() {
    $('#mobile-nav').animate({ left: '150%' }, 200);
});

$(document).ready(function() {
    let isOpen = false;

    // Kliknięcie na ikonę menu
    $('.menu-icon').click(function(event) {
        $('#mobile-nav').animate({ left: '50%' }, 200); // Przesunięcie menu na 50%
    });

    // Kliknięcie poza menu lub ikoną
    $(document).click(function(event) {
        if (!$(event.target).closest('#mobile-nav, .menu-icon').length) {
            $('#mobile-nav').animate({ left: '150%' }, 200); // Przesunięcie menu z powrotem
        }
    });
});

$(document).ready(function(){
    $(".sign-container").hide(); // Ukrycie kontenera rejestracji
    $("#logged").hide();
    // Przełączanie między formularzami rejestracji i logowania
    $("#sign-in").click(function(event) {
        $(".sign-container").show(200); // Pokazanie formularza rejestracji
        $(".login-container").hide(200); // Ukrycie formularza logowania
    });
    $("#log-in").click(function(event) {
        $(".login-container").show(200); // Pokazanie formularza logowania
        $(".sign-container").hide(200); // Ukrycie formularza rejestracji
    });
});
$(document).ready(function(){
    $(".sign-container").hide(); // Ukrycie kontenera rejestracji
    $("#logged").hide();
    // Przełączanie między formularzami rejestracji i logowania
    $("#sign-up-mb").click(function(event) {
        $(".sign-container").show(200); // Pokazanie formularza rejestracji
        $(".login-container").hide(200); // Ukrycie formularza logowania
    });
    $("#log-up-mb").click(function(event) {
        $(".login-container").show(200); // Pokazanie formularza logowania
        $(".sign-container").hide(200); // Ukrycie formularza rejestracji
    });
});
$('body').on('click', '.password-checkbox', function(){
    // Zmiana typu pola hasła na tekst lub hasło
    if ($(this).is(':checked')){
        $("#password_log").attr('type', 'text');
    } else {
        $('#password_log').attr('type', 'password');
    }
});

$('body').on('click', '.password-checkbox', function(){
    // Zmiana typu pola hasła na tekst lub hasło
    if ($(this).is(':checked')){
        $('#password').attr('type', 'text');
    } else {
        $('#password').attr('type', 'password');
    }
});

$(document).ready(function(){
    var a = 0;
    $( ".regestration" ).hide(); // Ukrycie sekcji rejestracji
    $('#open').click(function(){
        $( ".regestration" ).show(); // Pokazanie sekcji rejestracji
        if(a == 0){
            $(".regestration").animate({
                height: '+=0.5px'  
            }, 200); // Animacja rozciągania sekcji
            a = 1;
        } else {
            $(".regestration").animate({
                height: '-=0.5px'  
            }, 200); // Animacja zwijania sekcji
            a = 0;
            $( ".regestration" ).hide(500); // Ukrycie sekcji po animacji
        }
    });
});
$(document).ready(function(){
    var a = 0;
    $( ".regestration" ).hide(); // Ukrycie sekcji rejestracji
    $('#open').click(function(){
        $( ".regestration" ).show(); // Pokazanie sekcji rejestracji
        if(a == 0){
            $(".regestration").animate({
                height: '+=400px'  
            }, 500); // Animacja rozciągania sekcji
            a = 1;
        } else {
            $(".regestration").animate({
                height: '-=400px'  
            }, 500); // Animacja zwijania sekcji
            a = 0;
            $( ".regestration" ).hide(500); // Ukrycie sekcji po animacji
        }
    });
});

$(document).ready(function(){
    var a = 0;
    $( ".regestration-mb" ).hide(); // Ukrycie sekcji rejestracji mobilnej
    $('#open-mb').click(function(){
        if(a == 0){
            $(".regestration-mb").fadeIn(500); // Pokazanie sekcji rejestracji mobilnej
            a = 1;
        } else {
            $(".regestration-mb").fadeOut(500); // Ukrycie sekcji rejestracji mobilnej
            a = 0;
        }
    });
});

$(document).ready(function(){
    $(".auth").hide(); // Ukrycie sekcji autoryzacji

    // Pokazanie sekcji autoryzacji po kliknięciu
    $('#sign-in-bt').click(function(){
        $(".auth").fadeIn('200').delay('5000').fadeOut('200'); // Animacja autoryzacji
        $("#loginMessage").html(" ");
        $("#responseMessage").html(" ");
    });
    $('#log-in-bt').click(function(){
        $(".auth").fadeIn('200').delay('5000').fadeOut('200'); // Animacja autoryzacji
        $("#loginMessage").html(" ");
        $("#responseMessage").html(" ");
    });
    $('#log-in-bt-mb').click(function(){
        $(".auth").fadeIn('200').delay('5000').fadeOut('200'); // Animacja autoryzacji
        $("#loginMessage").html(" ");
        $("#responseMessage").html(" ");
    });
});

$(document).ready(function(){
    var ready = 0;
    $('#click').click(function(){
        if(ready == 0){
            $("#tg").animate({
                left: '-=200px'  
            }, 500); // Przesunięcie elementu
            ready = 1;
        } else {
            $("#tg").animate({
                left: '+=200px'  
            }, 500); // Przesunięcie elementu w przeciwną stronę
            ready = 0;
        }
    });
});
$(document).ready(function() {
    $(".thumbnail").click(function(){
 
        
        console.log("click"); 
        $('#fullscreen-container').fadeIn();
    });

    // Zamknięcie pełnoekranowego widoku po kliknięciu poza nim
    $('#fullscreen-container').on('click', function(event) {
        if (!$(event.target).closest('#fullscreen-content').length) {
            $('#fullscreen-container').fadeOut();
        }
    });
});