var host = "http://localhost:5500";

if (localStorage.getItem("SavedToken") === null) {
  window.location.href = "../login.html";
}
console.log(localStorage.getItem("SavedToken"));
$.ajax({
  type: "GET",
  url: host + "/user/profile?token=" + localStorage.getItem("SavedToken"),
  dataType: "JSON",
  success: function (res) {
    console.log(res);
    $("#firstName").val(res.firstName);
    $("#lastName").val(res.lastName);
    $("#city").val(res.city);
    $("#state").val(res.state);
    $("#email").val(res.email);
    $("#zip").val(res.zip);
    $("#streetAddress").val(res.streetAddress);
  },
  error: function (xhr, textStatus, errorThrown) {
    console.log("error : " + textStatus);
    alert("failed");
  },
});
