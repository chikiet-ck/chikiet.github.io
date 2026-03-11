let userIndex = 0;

// Gắn sự kiện click bằng jQuery ngay khi trang web tải xong
$(document).ready(function() {
    $('#saveButton').click(saveUserInfo);
    $('#deleteButton').click(deleteUser);
});

function saveUserInfo() {
    const userName = $('#nameInput').val();
    const userAddress = $('#addressInput').val();

    if (userName.trim() === "" || userAddress.trim() === "") {
        alert("Vui lòng nhập đầy đủ tên và địa chỉ.");
        return;
    }

    const userInfo = { name: userName, address: userAddress };
    const userInfoJSON = JSON.stringify(userInfo);

    addToTable(userName, userAddress, userInfoJSON);

    // Xóa trắng form sau khi nhập xong
    $('#nameInput').val('');
    $('#addressInput').val('');
} 

function addToTable(userName, userAddress, userInfoJSON) {
    userIndex++;

    const table = $('#userTable tbody');
    const newrow = `
        <tr>
            <td>${userIndex}</td>
            <td>${userName}</td>
            <td>${userAddress}</td>
            <td>${userInfoJSON}</td>
            <td><input type="checkbox" class="deleteCheckbox" onchange="toggleDeleteInput()"></td>
        </tr> `;

    table.append(newrow);
}

function deleteUser() {
    const checkboxes = $('.deleteCheckbox');
    let anyChecked = false;

    // Duyệt qua các checkbox từ cuối danh sách về đầu
    for (let i = checkboxes.length - 1; i >= 0; i--) {
        if (checkboxes[i].checked) {
            anyChecked = true;
            $(checkboxes[i]).closest('tr').remove();
            userIndex--;
        }
    }

    // Nếu không có checkbox nào được tích, chuyển sang xóa bằng ô nhập STT
    if (!anyChecked) {
        const deleteIndex = $('#deleteIndex').val();

        if (deleteIndex.trim() === "" || isNaN(deleteIndex) || deleteIndex <= 0 || deleteIndex > userIndex) {
            alert("Vui lòng nhập chỉ số hợp lệ.");
            return;
        }

        $('#userTable tbody tr').eq(deleteIndex - 1).remove();
        userIndex--;
        $('#deleteIndex').val('');
    }

    updateRowIndexes(); 
    toggleDeleteInput(); 
}

function updateRowIndexes() {
    $('#userTable tbody tr').each(function(index) {
        $(this).find('td:first').text(index + 1);
    });
}

function toggleDeleteInput() {
    const checkboxes = $('.deleteCheckbox');
    let anyChecked = false;

    checkboxes.each(function() {
        if ($(this).is(':checked')) {
            anyChecked = true;
        }
    });

    $('#deleteIndex').prop('disabled', anyChecked);
}