var host = "http://localhost:5500";
var valid = false,
  confirmed = false;

$("#confirmPassword").on("input", function () {
  confirmed = true;
  if ($("#password").val() != $("#confirmPassword").val()) {
    $("#confirmPassword").addClass("text-danger");
    valid = false;
  } else {
    $("#confirmPassword").removeClass("text-danger");

    valid = true;
  }
});
$("#password").on("input", function () {
  if ($("#password").val() != $("#confirmPassword").val()) {
    if (confirmed) $("#confirmPassword").addClass("text-danger");
    valid = false;
  } else {
    $("#confirmPassword").removeClass("text-danger");

    valid = true;
  }
});
$("#btnSubmitModal").click(function () {
  if (valid == false) {
    alert("Passwords do not match.");
    return;
  }
  //var field1value = $( "#field1" ).val()
  console.log(host);
  $.ajax({
    type: "POST",
    url: host + "/user",
    data: {
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      city: $("#city").val(),
      state: $("#state").val(),
      email: $("#email").val(),
      password: $("#password").val(),
      confirmPass: $("#confirmPassword").val(),
      zip: $("#zip").val(),
      streetAddress: $("#streetAddress").val(),
    },
    dataType: "JSON",
    success: function (res) {
      console.log(res);
      let token = res.token;
      let userInfo = res.userInfo;
      localStorage.setItem("SavedToken", token);
      localStorage.setItem(
        "Address",
        userInfo.city + " " + userInfo.state + " " + userInfo.zip
      );
      window.location.href = "/";
      //if(feedback.status === "error"){
      //   alert("failure")
      //} else if(feedback.status === "success"){
      //window.location = "login.php";
      //     alert("sucess")
      // }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log("error : " + textStatus);
      alert("failed");
    },
  });
});
