let Username = sessionStorage.getItem('username');
let token = sessionStorage.getItem('token');
let id = sessionStorage.getItem('id');
let _id = sessionStorage.getItem('postid');
let fans = new Object();

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
    document.getElementById('usname').innerHTML = Username;
    document.getElementById('name_cmt').innerHTML = Username;
    getlist();
    getlist_sum();
});
function getlist() {

    $.ajax({
        url: 'https://blog-nghiemle.herokuapp.com/post/' + _id,
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (res) {
            render(res);
        }
    });
}
function getlist_cmt(comments) {
    var html = "";
    if (comments.length == 0) {
        $('.table-scroll-cmt').css('height', '0px');
        $(".cmt").html(html);
    }
    else if (comments.length == 1) {
        $('.table-scroll-cmt').css('height', '123px');
        render_cmt(comments);
    }
    else if (comments.length == 2) {
        $('.table-scroll-cmt').css('height', '246px');
        render_cmt(comments);
    }
    else {
        $('.table-scroll-cmt').css('height', '300px');
        render_cmt(comments);
    }
}
function render(data) {

    document.getElementById('title').innerHTML = data.post.title;
    document.getElementById('date').innerHTML = data.post.date;
    document.getElementById('authur').innerHTML = data.post.author.name;
    document.getElementById('mainContent').innerHTML = data.post.mainContent;
    document.getElementById('content').innerHTML = data.post.content;
    var html = "<img src=\"" + data.post.image + "\" style=\"width:100%;height:100%\">";
    document.getElementById('img').innerHTML = html;

    var like = data.post.fans.length;
    document.getElementById('like').innerHTML = like;
    getlist_cmt(data.post.comments);
    fans = data.post.fans;
}
function render_cmt(comments) {
    var cd = comments.length;
    var html = "";
    for (var i = 0; i < cd; i++) {
        html += "<div class=\"cmt-title\">"
            + "<div class=\"left\">"
            + "<h2>" + comments[i].author.name + "</h2>"
            + "<p>" + comments[i].content + "</p>"
            + "</div>"
            + "<div class=\"option\">"
            + "<button class='btn-danger btn-sm' onClick='sendDel(this)'data-id='" + comments[i]._id
            + "' data-toggle='modal' data-target='#myModalDel'><i class='fas fa-trash-alt'></i></button>"
            + "<button class='btn-dark btn-sm' onClick='sendUpd(this)' data-id='" + comments[i]._id
            + "' data-content='" + comments[i].content
            + "' data-toggle='modal' data-target='#myModalUpd'><i class='fas fa-pencil-alt'></i></button>"
            + "</td>"
            + "</div>"
            + "</div>";
    }
    $(".cmt").html(html);
}

function sendDel(blog) {
    var _id = $(blog).data('id');

    $('#delete').click(async function (e) {
        e.preventDefault();

        //lấy kết quả trả về từ API
        const getInfo = () => {
            return new Promise(resolve => {
                $.ajax({
                    url: 'https://blog-nghiemle.herokuapp.com/comment/' + _id,
                    type: 'DELETE',
                    dataType: 'json',
                    data: {},
                    headers: {
                        token
                    },
                    success: function (Result, textStatus, xhr) {
                        return resolve(Result);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(xhr.textStatus + " " + errorThrown);

                    }
                });
            })
        }
        //biến chứa kết quả trả về từ API
        const info = await getInfo();

        if (info.success == false) {
            toastr.error("Xóa không thành công!")
        }
        else {
            toastr.success("Xóa thành công!");
            setTimeout(function () {
                location.reload();
            }, 1500);
        }
    });

}
function sendUpd(blog) {
    var _id = $(blog).data('id');
    $('#c-content').val($(blog).data('content'));

    $('#update').click(async function (e) {
        e.preventDefault();

        var _id = $(blog).data('id');
        var content = $('#c-content').val();
        console.log(_id);
        //lấy kết quả trả về từ API
        const getInfo = () => {
            return new Promise(resolve => {
                $.ajax({
                    url: 'https://blog-nghiemle.herokuapp.com/comment/' + _id,
                    type: 'PUT',
                    dataType: 'json',
                    data: { content },
                    headers: {
                        token
                    },
                    success: function (Result, textStatus, xhr) {
                        return resolve(Result);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(xhr.textStatus + " " + errorThrown);

                    }
                });
            })
        }
        //biến chứa kết quả trả về từ API
        const info = await getInfo();

        if (info.success == false) {
            toastr.error("Sửa không thành công!")
        }
        else {
            toastr.success("Sửa thành công!");
            setTimeout(function () {
                location.reload();
            }, 1500);
        }
    });
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
$('#addcmt').click(async function (e) {
    e.preventDefault();

    var content = $('#cmt_text').val();
    var idPost = _id;
    //lấy kết quả trả về từ API
    const getInfo = () => {
        return new Promise(resolve => {
            $.ajax({
                url: 'https://blog-nghiemle.herokuapp.com/comment/',
                type: 'POST',
                dataType: 'json',
                data: { content, idPost },
                headers: {
                    token
                },
                success: function (Result, textStatus, xhr) {
                    return resolve(Result);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(xhr.textStatus + " " + errorThrown);

                }
            });
        })
    }
    //biến chứa kết quả trả về từ API
    const info = await getInfo();

    if (info.success == false) {
        toastr.error("Fail")
    }
    else {
        getlist();
    }
});
$('#addLike').click(async function (e) {
    e.preventDefault();
    getlist();
    console.log(fans)
    var kq = checkLike(fans)
    console.log(kq)
    if (!token) {
        return;
    }
    else {
        //like
        if (kq == 1) {
            like();
        }
        //dislike
        else {
            dislike();
        }
    }
});

async function dislike() {
    const getInfo = () => {
        return new Promise(resolve => {
            $.ajax({
                url: 'https://blog-nghiemle.herokuapp.com/post/dislike/' + _id,
                type: 'POST',
                dataType: 'json',
                data: {},
                headers: {
                    token
                },
                success: function (Result, textStatus, xhr) {
                    return resolve(Result);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(xhr.textStatus + " " + errorThrown);

                }
            });
        })
    }
    //biến chứa kết quả trả về từ API
    const info = await getInfo();

    if (info.success == false) {
        toastr.error("Fail")
    }
    else {
        getlist();
    }
}

async function like() {
    const getInfo = () => {
        return new Promise(resolve => {
            $.ajax({
                url: 'https://blog-nghiemle.herokuapp.com/post/like/' + _id,
                type: 'POST',
                dataType: 'json',
                data: {},
                headers: {
                    token
                },
                success: function (Result, textStatus, xhr) {
                    return resolve(Result);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(xhr.textStatus + " " + errorThrown);

                }
            });
        })
    }
    //biến chứa kết quả trả về từ API
    const info = await getInfo();

    if (info.success == false) {
        toastr.error("Fail")
    }
    else {
        getlist();
    }
}

function checkLike(fans) {
    var cd = fans.length;
    console.log(fans.length)
    var kq=0;
    if (cd == 0) {
        kq= 1;
    }
    else {
        for (var k = 0; k < cd; k++) {
            if (fans[k] == id) {
                kq= 0;
            }
            else {
                kq =1;
            }
        }
    }
    return kq;
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
