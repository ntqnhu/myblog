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
    // document.getElementById('usname').innerHTML = Username;
    document.getElementById('authur').innerHTML = Username;
    document.getElementById('date').innerHTML = Date();
    setSelect();
    getlist();
});


$(document).on('click', '#add', async function (e) {
    e.preventDefault();
    check_null();
    var title = $('#title').val();
    var mainContent = $('#mainContent').val();
    var content = $('#content').val();
    var idTag = document.getElementById("type").value;
    var date = new Date();

    var fd = new FormData();
    let file = $('#img').prop('files')[0];

    fd.append('token', token);
    fd.append('title', title);
    fd.append('mainContent', mainContent);
    fd.append('content', content);
    fd.append('idTag', idTag);
    fd.append('date', date);
    fd.append('file', file);

    const getInfo = () => {
        return new Promise(resolve => {
            $.ajax({
                url: 'https://blog-nghiemle.herokuapp.com/post/',
                type: 'POST',
                dataType: 'json',
                headers: {
                    token
                },
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function (Result, textStatus, xhr) {
                    console.log({ Result });
                    return resolve(Result);
                },
                error: function (xhr, textStatus, errorThrown) {
                    return errorThrown;
                }
            });
        })
    }
    const infor = await getInfo();
    var { success } = infor;

    if (success) {
        toastr.error("Thêm thành công!");
        window.location = "http://127.0.0.1:5500/myblog.html";

    }
    else {
        // var { message } = infor;
        toastr.error("Lỗi ");
    }
});
function check_null() {

    var title = $('#title').val();
    var mainContent = $('#mainContent').val();
    var content = $('#content').val();
    if (title.trim() == "") {
        toastr.error("Nhập tiêu đề");
    }
    else if (mainContent.trim() == "") {
        toastr.error("Nhập nội dung tóm tắt");
    }
    else if (content.trim() == "") {
        toastr.error("Nhập nội dung");
    }
}

async function setSelect() {
    const getInfo = () => {
        return new Promise(resolve => {
            $.ajax({
                url: 'https://blog-nghiemle.herokuapp.com/tag',
                type: 'GET',
                dataType: 'json',
                data: {},
                success: function (Result, textStatus, xhr) {
                    ;
                    return resolve(Result);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log('Error in Operation');
                }
            });
        })
    }
    const infor = await getInfo();
    var { success } = infor;

    if (success) {
        var { tags } = infor;
        var html = "";

        for (i = 0; i < tags.length; i++) {
            html = html
                + "<option value =\"" + tags[i]._id + "\">" + tags[i].name + "</option>"
        }

        document.getElementById('type').innerHTML = html;

    }
    else {

        toastr.error("Lỗi ");
    }
}

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
        window.location = "http://127.0.0.1:5500/login.html";
    }
    else {
        window.location = "http://127.0.0.1:5500/addpost.html";
    }
}
function Seen(blog) {
    sessionStorage.setItem('postid', $(blog).data('id'));
    window.location = "http://127.0.0.1:5500/blog.html";
}
$(document).on('click', '#bestpost', function (e) {
    e.preventDefault();
    sessionStorage.setItem('postid', id);
    window.location = "http://127.0.0.1:5500/blog.html";
});
$(document).on('click', '#out', function (e) {
    e.preventDefault();
    sessionStorage.setItem('username', "");
    sessionStorage.setItem('token', "");
    sessionStorage.setItem('id', "");
    window.location = "http://127.0.0.1:5500/home.html";

});

function checkImg(img){
    if (typeof (img)=== "undefined") {
       return "https://i.picsum.photos/id/92/1000/1000.jpg"
    }
    else{
        return img;
    }
}

function Seen(blog){
    sessionStorage.setItem('id',$(blog).data('id'));
    window.location = "http://127.0.0.1:5500/blog.html";
}
$(document).on('click', '#out', function (e) {
    e.preventDefault();
    sessionStorage.setItem('username', "");
    sessionStorage.setItem('token', "");
    sessionStorage.setItem('id', "");
    window.location = "http://127.0.0.1:5500/home.html";

});