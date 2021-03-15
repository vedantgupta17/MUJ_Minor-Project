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
