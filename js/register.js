$('#submit').click(async function (e) {
    e.preventDefault();
    //lấy dữ liệu từ giao diện
    var name = $('#usn').val();
    var email = $('#mail').val();
    var plainPassword = $('#psw').val();
    var fd = new FormData();

    let file = $('#img').prop('files')[0];
    fd.append('file', file);
    fd.append('name', name);
    fd.append('email', email);
    fd.append('plainPassword', plainPassword);

    //lấy kết quả trả về từ API
    const getInfo = () => {
        return new Promise(resolve => {
            $.ajax({
                url: 'https://blog-nghiemle.herokuapp.com/user/signup',
                type: 'POST',
                dataType: 'json',
                data: fd,
                processData: false,
                contentType: false,
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
    var { success } = info;
    if (success) {
        toastr.success("Tạo tài khoản thành công!");
        window.location = "https://ntqnhu.github.io/login.html";
    }
    else {
        var { message } = info;
        toastr.error(message);
        setTimeout(function () {
            location.reload();
        }, 700)
    }
});