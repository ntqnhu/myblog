let Username = sessionStorage.getItem('username');
let token = sessionStorage.getItem('token');

if (!token) {
    window.location = "http://127.0.0.1:5500/login.html";
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
    getlist_sum();
});
function getlist() {
    $.ajax({
        url: 'https://blog-nghiemle.herokuapp.com/user/check',
        type: 'POST',
        dataType: 'json',
        headers: {
            token
        },
        data: {},
        success: function (res) {
            render(res);
        }
        , error: function (xhr, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

function render(data) {
    console.log(data);
    $('#name').val(data.user.name);
    $('#email').val(data.user.email);
    var html = "<img src=\"" + data.user.avatar + "\" style=\"width:100%;height:100%\">";
    document.getElementById('img').innerHTML = html;
}

$(document).on('click', '#update', function (e) {
    e.preventDefault();
    var oldPassword = $('#pwd').val();
    //không đổi mật khẩu
    if (oldPassword.length == 0) {
        var name = $('#name').val();
        var email = $('#email').val();
        if (name.length == 0) {
            toastr.error("Nhập Username!")
            return;
        }
        else if (email.length == 0) {
            toastr.error("Nhập Email!")
            return;
        }
        else {
            updateUser();
        }
    }
    else {
        var newPassword = $('#new-pwd').val();
        if (newPassword.length == 0) {
            toastr.error("Nhập mật khẩu mới!")
            return;
        }
        else {
            updatePass(oldPassword, newPassword);


        }
    }
});

async function updatePass(oldPassword, newPassword) {
    const getInfo = () => {
        return new Promise(resolve => {
            $.ajax({
                url: 'https://blog-nghiemle.herokuapp.com/user/updatePass',
                type: 'POST',
                dataType: 'json',
                data: {newPassword,oldPassword},
                headers: {
                    token
                },
                success: function (res) {
                    return resolve(Result);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(xhr.textStatus + " " + errorThrown);

                }
            });
        })
    }
    // biến chứa kết quả trả về từ API
    const info = await getInfo();

    if (info.success == false) {
        toastr.error(info.message)
    }
    else {
        var name = $('#name').val();
        var email = $('#email').val();
        if (name.length == 0) {
            toastr.error("Nhập Username!")
            return;
        }
        else if (email.length == 0) {
            toastr.error("Nhập Email!")
            return;
        }
        else {
            updateUser();
        }
    }
}


async function updateUser() {

    var name = $('#name').val();
    var email = $('#email').val();
    var fd = new FormData();

    let file = $('#avatar').prop('files')[0];
    fd.append('file', file);
    fd.append('name', name);
    fd.append('email', email);

    $.ajax({
        url: 'https://blog-nghiemle.herokuapp.com/user/',
        type: 'PUT',
        dataType: 'json',
        headers: {
            token
        },
        data: fd,
        processData: false,
        contentType: false,
        success: function (res) {
            if (res.success == false) {
                toastr.error(res.message)
            }
            else {
                sessionStorage.setItem('username', name);
                toastr.success("Thành công!")
                setTimeout(function () {
                    location.reload();
                }, 1500);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr.textStatus + " " + errorThrown);

        }
    });
}


function getlist_sum() {
    $.ajax({
        url: 'https://blog-nghiemle.herokuapp.com/post/',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (res) {
            var { success } = res;
            if (success == true) {
                render_sum(res)
            }
        }
        , error: function (xhr, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}
function render_sum(list) {
    var cd = list.posts.length - 1;
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
        window.location = "http://127.0.0.1:5500/login.html";
    }
    else {
        window.location = "http://127.0.0.1:5500/addpost.html";
    }
}

$(document).on('click', '#bestpost', function (e) {
    e.preventDefault();
    sessionStorage.setItem('postid', id);
    window.location = "http://127.0.0.1:5500/blog.html";
});


function checkImg(img){
    if (typeof (img)=== "undefined") {
       return "https://i.picsum.photos/id/92/1000/1000.jpg"
    }
    else{
        return img;
    }
}

$(document).on('click', '#out', function (e) {
    e.preventDefault();
    sessionStorage.setItem('username', "");
    sessionStorage.setItem('token', "");
    sessionStorage.setItem('id', "");
    window.location = "http://127.0.0.1:5500/home.html";

});