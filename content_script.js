function copyID() {
  var range = document.createRange();
  range.selectNodeContents(document.getElementById("id"));
  window.getSelection().removeAllRanges(); // clear current selection
  window.getSelection().addRange(range); // to select text
  document.execCommand("copy");
  window.getSelection().removeAllRanges(); // to deselect

  $("#copybutton").after($("<DIV>").text("OK"));
}

var result = function (user) {
  $("#content").html(
    `<div class='tag'>用户名</div>` +
      `<div id='id' class='value'>${user.attributes["user-name"]}</div>` +
      `<div class='tag'>ID</div>` +
      `<div id='id'>${user.id}</div>` +
      `<div class='tag'>ELO</div>` +
      `<div class='value'>${user.attributes.elo}</div>` +
      `<div class='tag'>最近上线</div>` +
      `<div class='value'>${user.attributes["last-online"]}</div>` +
      "<button id='copybutton' onclick='copyID()'>复制ID</button>"
  );
};

var init = function () {
  $("body").empty();

  $("body").append(
    $("<input>")
      .attr("id", "user_name_append")
      .attr("placeholder", "ETT用户名，大小写精确匹配")
      .attr("size", "50")
  );

  $("#user_name_append").after(
    $("<button>")
      .text("查询")
      .click(function () {
        $("DIV").remove();
        $("body").append($("<DIV>").attr("id", "content"));
        $("#content").text("用户查询中...");

        var userName = $("#user_name_append").val() || "";
        userName = $.trim(userName);

        if (userName.length == 0) {
          alert("请输入ETT昵称（区分大小写）");
          return;
        }

        //首先根据昵称查用户id
        $.getJSON(
          "https://www.elevenvr.club/accounts/search/" + userName,
          function (data) {
            if (!data || !data.data) {
              alert("请求失败");
              return;
            }

            if (data.data.length < 1) {
              $("#content").html(
                `未匹配到用户: ${userName}。请去<a href="https://elevenvr.net/search" target="blank">官网</a> 查找你的完整用户名`
              );
              return;
            }

            var matchedUser;
            for (index = 0; index < data.data.length; index++) {
              var user = data.data[index];
              if (userName == user.attributes["user-name"]) {
                matchedUser = user;
                break;
              }
            }
            if (!matchedUser) {
              $("#content").html(
                `未精确匹配到用户: ${userName}。请去<a href="https://elevenvr.net/search" target="blank">官网</a> 查找你的完整用户名`
              );
              return;
            }
            try {
              if (localStorage) {
                var userInfo = {};
                userInfo.name = userName;
                userInfo.id = matchedUser.id;
                localStorage.user = JSON.stringify(userInfo);
              }
            } catch (e) {}
            result(matchedUser);
          }
        );
      })
  );
  try {
    if (localStorage && localStorage.user) {
      var userInfo = JSON.parse(localStorage.user);
      $("#user_name_append").val(userInfo.name);
      result(userInfo);
    }
  } catch (e) {}
};
