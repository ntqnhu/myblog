let status = 0;
let stt_mail = 1;
$(document).ready(async function () {
    getlist();
});
//mở form quên mật khẩu
$('.lost-password').click(function (e) {
    e.preventDefault();
    document.getElementById('id01').style.display = 'block';
    // document.getElementById('id02').style.display='none'; 
    stt_mail = 1;
});
//thẻ đóng form
$('.close').click(function (e) {
    e.preventDefault();
    if (status == 3) {
        document.getElementById('id03').style.display = 'none';
        document.getElementById('id02').style.display = 'block';
    }
    else {
        document.getElementById('id01').style.display = 'none';
        document.getElementById('id02').style.display = 'block';
    }
});
//hàm login
$('#login').click(async function (e) {
    e.preventDefault();

    var email = $('#usn').val();
    var plainPassword = $('#psw').val();

    const getInfo = () => {
        return new Promise(resolve => {
            $.ajax({
                url: 'https://blog-nghiemle.herokuapp.com/user/signin',
                type: 'POST',
                dataType: 'json',
                data: { email, plainPassword },
                success: function (Result, textStatus, xhr) {
                    return resolve(Result);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log('Error in Operation');
                }
            });
        })
    }
    //biến chứa kết quả trả về từ API
    const info = await getInfo();
    //kiểm tra kết quả trả về
    console.log(info);
    var { success } = info;
    if (success) {
        //gán token vao localStorage
        let { user } = info;
        console.log(user);
         sessionStorage.setItem('username', user.name);
         sessionStorage.setItem('token', user.token);
         sessionStorage.setItem('id', user._id);

         var history =  sessionStorage.getItem('history');
        //quyền
        if (history == "post") {
            window.location = "https://ntqnhu.github.io/addpost.html";
        }
        else {
            window.location = "https://ntqnhu.github.io/myblog.html";
        }
    }
    else {
        var { message } = info;
        toastr.error(message);
        setTimeout(function () {
            location.reload();
        }, 700)
    }
});
function getlist() {
    $.ajax({
        url: 'https://blog-nghiemle.herokuapp.com/post/',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (res) {
            console.log('HAHA');
            console.log(res);
            var { success } = res;
            if (success == true) {
                //    list = res;
                render(res);
            }
        }
        , error: function (xhr, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}
function render(list) {
    var cd = list.posts.length-1;
    setPost(list.posts[cd]);
    setPopular_post(list);
    setPopular_author(list);
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
    for (var i = cd - 1; i >= cd - 5; i--) {
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
        window.location = "https://ntqnhu.github.io/login.html";
    }
    else {
        window.location = "https://ntqnhu.github.io/addpost.html";
    }
}

$(document).on('click', '#bestpost', function (e) {
    e.preventDefault();
    sessionStorage.setItem('postid', id);
    window.location = "https://ntqnhu.github.io/blog.html";
});
$(document).on('click', '#out', function (e) {
    e.preventDefault();
    sessionStorage.setItem('username', "");
    sessionStorage.setItem('token', "");
    sessionStorage.setItem('id', "");
    window.location = "https://ntqnhu.github.io/home.html";

});

function checkImg(img){
    if (typeof (img)=== "undefined") {
       return "https://i.picsum.photos/id/92/1000/1000.jpg"
    }
    else{
        return img;
    }
}