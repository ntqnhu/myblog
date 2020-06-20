let token = sessionStorage.getItem('token');
let id = 0;
let status = 0;

if (!token) {
}
else {
    $.ajax({
        url: 'https://blog-nghiemle.herokuapp.com/user/check',
        type: 'POST',
        dataType: 'json',
        headers: {
            token
        },
        data: {},
        success: function (res) {
            if (typeof (res.user.avatar) === "undefined") {
            }
            else {
                var html = "<img src=\"" + res.user.avatar + "\" style=\"width:40px;height:40px;border-radius:50%;transform:translateY(5px);\">";
                document.getElementById('ava').innerHTML = html;
                document.getElementById('usname').innerHTML = res.user.name;
            }
        }
        , error: function (xhr, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}


$(document).ready(async function () {
    toastr.options = {
        'closeButton': false,
        'background': 'white',
        'color': 'red',
        'debug': false,
        'newestOnTop': false,
        'progressBar': false,
        'positionClass': 'toast-top-right',
        'preventDuplicates': false,
        'showDuration': '1000',
        'hideDuration': '1000',
        'timeOut': '5000',
        'extendedTimeOut': '1000',
        'showEasing': 'swing',
        'hideEasing': 'linear',
        'showMethod': 'fadeIn',
        'hideMethod': 'fadeOut',
    }
    getlist();
});

function getlist() {
    $.ajax({
        url: 'https://blog-nghiemle.herokuapp.com/post/',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (res) {
            var { success } = res;
            if (success == true) {
                render(res);
            }
        }
        , error: function (xhr, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}
function render(list) {
    var cd = 0;
    document.getElementById('title-1').innerHTML = list.posts[cd].title;
    document.getElementById('sum-content-1').innerHTML = list.posts[cd].mainContent;
    $('.item-slide').css('background-image', 'url(" ' + checkImg(list.posts[cd].image) + ' ")');
    id = list.posts[cd]._id;
    setItems_1(list);
    setItem_hot(list.posts[1]);
    setItem_mini(list);
    setPost(list.posts[cd]);
    setPopular_post(list);
    setPopular_author(list);
}
function setItems_1(list) {
    var html = "";
    var item = [];
    var cd = list.posts.length;
    for (var i = 0; i<cd; i++) {
        if (list.posts[i].tag.name == "Công nghệ") {
            item.push(i);
        }
    }
    for (var j = 0; j < 3; j++) {
        var i = item[j];
        html += "<div class=\"item\">"
            + "<div class=\"content\">"
            + "<img src=\"" + checkImg(list.posts[i].image) + "\">"
            + "<h1>" + list.posts[i].title + "</h1>"
            + "<p>" + list.posts[i].mainContent + "</p>"
            + "<div class=\"more\" onClick='Seen(this)' data-id='" + list.posts[i]._id + "'>"
            + "<div>Xem tiếp...</div>"
            + "<a href=\"\"><i class=\"fas fa-caret-right\"></i></a>"
            + "</div>"
            + "</div>"
            + "</div>"
    }

    $(".item-recent").html(html);
}
function setItem_hot(posts) {
    var html = "<div class=\"item\">"
        + "<div class=\"title\">"
        + "<div class=\"t-left\">"
        + "<h1>" + posts.title + "</h1>"
        + "<p>" + posts.date.substring(0, 10) + "</p>"
        + "<p>" + posts.author.name + "</p>"
        + "</div>"
        + "<button class='btn-sm' style=\"background: #2EECB1; border: none; display: flex;\"><i class=\"fas fa-thumbs-up\" style=\"color: white;font-size: 30px; margin-right: 10px;transform:translateY(5px);\"></i><h1 style=\"color: white;font-size: 30px;\" >" + posts.fans.length + "</h1></button>"
        + "</div>"
        + "<img src=\"" + checkImg(posts.image) + "\">"
        + "<p>" + posts.mainContent + "</p>"
        + "<div class=\"more\" onClick='Seen(this)' data-id='" + posts._id + "'>"
        + "<div>Xem tiếp...</div>"
        + "<a href=\"\"><i class=\"fas fa-caret-right\"></i></a>"
        + "</div>"
        + "</div>";
    $(".hot-left").html(html);
}
function setItem_mini(list) {
    var chude = "";
    if (status == 0) {
        chude = "Thể thao";
    }
    else {
        chude = "Phim truyện";
    }
    var html = "";
    var item = [];
    var cd = list.posts.length;
    for (var i = cd - 1; i >= 0; i--) {
        if (list.posts[i].tag.name == chude) {
            item.push(i);
        }
    }
    if (item.length < 6) {
        for (var j = 0; j < item.length; j++) {
            var k = item[j];
            html += "<div class=\"mini-item\" onClick='Seen(this)' data-id='" + list.posts[k]._id + "'>"
                + "<div class=\"text\">"
                + "<img src=\"" + checkImg(list.posts[k].image) + "\">"
                + "<p>" + list.posts[k].date + "</p>"
                + "</div>"
                + "<h2>" + list.posts[k].title + "</h2>"
                + "</div>"
                + " <br>"
        }
    }
    else {
        for (var j = 0; j < 5; j++) {
            var k = item[j];
            html += "<div class=\"mini-item\" onClick='Seen(this)' data-id='" + list.posts[k]._id + "'>"
                + "<div class=\"text\">"
                + "<img src=\"" + checkImg(list.posts[k].image) + "\">"
                + "<p>" + list.posts[k].date + "</p>"
                + "</div>"
                + "<h2>" + list.posts[k].title + "</h2>"
                + "</div>"
                + " <br>"
        }
    }
    $(".mini-content").html(html);
}

function setPost(posts) {
    var html = "<h2>" + posts.title + "</h2>"
        + "<img src=\"" +checkImg(posts.image) + "\">"
    $(".st-post").html(html);
}
function setPopular_post(list) {
    var html = "<h2>Bài viết phổ biến</h2>"
        + "<ul>";
    var cd = list.posts.length;
    for (var i = 0; i<5; i++) {
        html += "<li onClick='Seen(this)' data-id='" + list.posts[i]._id + "'>"
            + "<i class=\"far fa-hand-point-right\"></i>"
            + "<b>" + list.posts[i].title + "</b></li>"
    }
    html += "</ul>"
    $(".popular-post").html(html);
}
function setPopular_author(list) {
    var html = "<h2>Tác giả phổ biến</h2>"
        + "<div class=\"l\">";

    var item = [];
    var cd = list.posts.length;
    for (var i = cd - 1; i >= 0; i--) {
        if (typeof (list.posts[i].author.avatar) !== "undefined") {
            item.push(i);
        }
        
    }
    if (item.length < 4) {
        for (var i = 0; i < item.length; i++) {
            var k = item[i];
            html += "<img src=\"" + list.posts[k].author.avatar + "\">"
        }
    }
    else if (item.length > 7) {
        for (var i = 0; i < 3; i++) {
            var k = item[i];
            html += "<img src=\"" + list.posts[k].author.avatar + "\">"
        }
        html += "</div>"
            + "<div class=\"l\">";
        for (var i = item.length-1; i >item.length- 4; i--) {
            var k = item[i];
            html += "<img src=\"" + list.posts[k].author.avatar + "\">"
        }
    }
    html += "</div>"
    $(".popular-author").html(html);
}
function Send() {
    sessionStorage.setItem('history', 'post');
    if (!token) {
        window.location = "https://ntqnhu.github.io/myblog/login.html";
    }
    else {
        window.location = "https://ntqnhu.github.io/myblog/addpost.html";
    }
}
function Seen(blog) {
    sessionStorage.setItem('postid', $(blog).data('id'));
    window.location = "https://ntqnhu.github.io/myblog/blog.html";
}
$(document).on('click', '#bestpost', function (e) {
    e.preventDefault();
    sessionStorage.setItem('postid', id);
    window.location = "https://ntqnhu.github.io/myblog/blog.html";
});
$(document).on('click', '#out', function (e) {
    e.preventDefault();
    sessionStorage.setItem('username', "");
    sessionStorage.setItem('token', "");
    sessionStorage.setItem('id', "");
    window.location = "https://ntqnhu.github.io/myblog/home.html";

});

function checkImg(img){
    if (typeof (img)=== "undefined") {
       return "https://i.picsum.photos/id/92/1000/1000.jpg"
    }
    else{
        return img;
    }
}

$('#sport').click(async function (e) {
    e.preventDefault();
    status = 0;
    getlist();
});
$('#drama').click(async function (e) {
    e.preventDefault();
    status = 1;
    getlist();
});
$(document).on('click', '#signin', function (e) {
    e.preventDefault();
    window.location = "https://ntqnhu.github.io/myblog/login.html";

});