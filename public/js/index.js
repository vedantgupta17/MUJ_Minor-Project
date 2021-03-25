function checkPasswordMatch() {
    var password = $("#txtNewPassword").val();
    var confirmPassword = $("#txtConfirmPassword").val();

    if (password != confirmPassword){
      $("#divCheckPasswordMatch").html("Passwords do not match!");
      $("#submit-btn").prop('disabled', true);
    }

    else{
      $("#divCheckPasswordMatch").html("Passwords match.");
      $("#submit-btn").prop('disabled', false);
    }

}

function regnoCheck(){
  var reg = $("#regnum").val().length;
  var left = 9-reg;
  if (reg==9){
    $("#divCheckPasswordMatch").html("Valid Reg.Number");
    $("#submit-btn").prop('disabled', false);
  }

else{
  $("#divCheckPasswordMatch").html("Not Valid, "+left+" more numbers");
  $("#submit-btn").prop('disabled', true);
}
}

$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#back2Top').fadeIn();
    } else {
        $('#back2Top').fadeOut();
    }
});
$(document).ready(function() {
    $("#back2Top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

});

// Wrap every letter in a span
var textWrapper = document.querySelector('.ml1 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml1 .letter',
    scale: [0.3,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 600,
    delay: (el, i) => 70 * (i+1)
  }).add({
    targets: '.ml1 .line',
    scaleX: [0,1],
    opacity: [0.5,1],
    easing: "easeOutExpo",
    duration: 700,
    offset: '-=875',
    delay: (el, i, l) => 80 * (l - i)
  }).add({
    targets: '.ml1',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });
