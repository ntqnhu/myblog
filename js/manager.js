let Username = sessionStorage.getItem('username');
let token = sessionStorage.getItem('token');
if (!token) {
    window.location = "https://ntqnhu.github.io/login.html";
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
    getlist();
    getlist_sum();
    setSelect();
});
function getlist() {
    $.ajax({
        url: 'https://blog-nghiemle.herokuapp.com/post/',
        type: 'PATCH',
        dataType: 'json',
        headers: {
            token
        },
        data: {},
        success: function (res) {
            render(res);
        }
    });
}

function render(list) {
    var cd = list.posts.length;
    var html = "";
        for (var i = cd - 1; i >= 0; i--) {
            html += "<tr>";
            html+= "<td>"
                + "<button class='btn-success btn-sm' onClick='Seen(this)' data-id='"+ list.posts[i]._id+"'><i class=\"fas fa-eye\"></i></button>"
                + "<button class='btn-danger btn-sm' onClick='sendDel(this)'data-id='" + list.posts[i]._id
                + "' data-toggle='modal' data-target='#myModalDel'><i class='fas fa-trash-alt'></i></button>"
                + "<button class='btn-dark btn-sm' onClick='sendUpd(this)' data-id='" + list.posts[i]._id
                + "' data-author='" + list.posts[i].author.name +"' data-date='" + list.posts[i].date + "' data-title='" + list.posts[i].title + "' data-mainContent='" + list.posts[i].mainContent + "' data-content='" + list.posts[i].content+ "' data-tagname='" + list.posts[i].tag.name
                + "' data-toggle='modal' data-target='#myModalUpd'><i class='fas fa-pencil-alt'></i></button>"
                + "</td>"
            html += "<td>" + list.posts[i].tag.name + "</td>";
            html += "<td>" + list.posts[i].title + "</td>";
            html += "<td>" + list.posts[i].date + "</td>";
            html += "<td>" + list.posts[i].mainContent + "</td>";
            // html += "<td>" + list.posts[i].content + "</td>";
            html += "<td background='"+list.posts[i].image+"'></td>";
            html += "</tr>";
        }

    $(".tb").html(html);
}
function Seen(blog){
    sessionStorage.setItem('postid',$(blog).data('id'));
    window.location = "https://ntqnhu.github.io/blog.html";
}
function sendDel(blog){
    var  _id= $(blog).data('id');

    $('#delete').click(async function (e) {
        e.preventDefault();

        //lấy kết quả trả về từ API
        const getInfo = () => {
            return new Promise(resolve => {
                $.ajax({
                    url: 'https://blog-nghiemle.herokuapp.com/post/'+_id,
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
                        console.log(xhr.textStatus +" "+errorThrown);
                        
                    }
                });
            })
        }
        //biến chứa kết quả trả về từ API
        const info = await getInfo();

        if (info.success==false) {
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
function sendUpd(blog){
    var date = new Date();
    $('#author').text($(blog).data('author'));
    $('#date').text(date+"");
    $('#title').val($(blog).data('title'));
    $('#mainContent').val($(blog).data('maincontent'));
    $('#content').val($(blog).data('content'));
    $('#tag').text($(blog).data('tagname'));

    $('#update').click(async function (e) {
        e.preventDefault();

        var  _id= $(blog).data('id');

        var mainContent = $('#mainContent').val();
        var content = $('#content').val();
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

        //lấy kết quả trả về từ API
        const getInfo = () => {
            return new Promise(resolve => {
                $.ajax({
                    url: 'https://blog-nghiemle.herokuapp.com/post/'+_id,
                    type: 'PUT',
                    dataType: 'json',
                    data: fd,
                    processData: false,
                    contentType: false,
                    headers: {
                        token
                    },
                    success: function (Result, textStatus, xhr) {
                        return resolve(Result);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(xhr.textStatus +" "+errorThrown);
                        
                    }
                });
            })
        }
        //biến chứa kết quả trả về từ API
        const info = await getInfo();

        if (info.success==false) {
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

function getlist_sum() {
    $.ajax({
        url: 'https://blog-nghiemle.herokuapp.com/post/',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (res) {
            var { success } = res;
            if (success == true) {
                //    list = res;
                render_sum(res)
            }
        }
        , error: function (xhr, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}
function render_sum(list) {
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

function checkImg(img){
    if (typeof (img)=== "undefined") {
       return "https://i.picsum.photos/id/92/1000/1000.jpg"
    }
    else{
        return img;
    }
}

function Seen(blog){
    sessionStorage.setItem('postid',$(blog).data('id'));
    window.location = "https://ntqnhu.github.io/blog.html";
}
$(document).on('click', '#out', function (e) {
    e.preventDefault();
    sessionStorage.setItem('username', "");
    sessionStorage.setItem('token', "");
    sessionStorage.setItem('id', "");
    window.location = "https://ntqnhu.github.io/home.html";

});