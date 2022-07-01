var host = "http://localhost:5500";

// var host = "http://13.57.29.105";

$("#btnSubmitModal").click(function () {
  //var field1value = $( "#field1" ).val()
  $.ajax({
    type: "POST",
    url: host + "/user/login",
    data: {
      email: $("#email").val(),
      password: $("#password").val(),
    },
    dataType: "JSON",
    success: function (feedback) {
      console.log(feedback);
      let token = feedback.token;
      let userInfo = feedback.userInfo;
      localStorage.setItem("SavedToken", token);
      localStorage.setItem(
        "Address",
        userInfo.city + " " + userInfo.state + " " + userInfo.zip
      );
      localStorage.setItem("City", userInfo.city);
      localStorage.setItem("State", userInfo.state);
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
