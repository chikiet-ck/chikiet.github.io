// Danh sách 11 tiêu chí
const criteriaList = [
    "Khả năng truyền đạt",
    "Thái độ giảng viên",
    "Sự tương tác với sinh viên",
    "Kiến thức chuyên môn",
    "Tổ chức bài giảng",
    "Khả năng giải đáp thắc mắc",
    "Sự nhiệt tình",
    "Thời gian giảng dạy phù hợp",
    "Thái độ đối với câu hỏi của sinh viên",
    "Ứng dụng công nghệ trong giảng dạy",
    "Khả năng khuyến khích tư duy sáng tạo"
];

// Chạy các hàm khởi tạo ngay khi trang web tải xong
$(document).ready(function() {
    renderTable();
  
    // Gắn sự kiện click cho nút Gửi
    $('#submitBtn').click(submitSurvey);
});

// Hàm 1: Đổ dữ liệu vào bảng
function renderTable() {
    const tbody = $('#surveyTable tbody');
    
    $.each(criteriaList, function(index, criterion) {
        let rowHtml = `<tr><td style="text-align: left; padding: 5px;">${criterion}</td>`;
        
        // Tạo 5 radio button cho mỗi hàng
        for (let i = 1; i <= 5; i++) {
            rowHtml += `<td><input type="radio" name="criteria${index + 1}" value="${i}" class="score-radio"></td>`;
        }
        
        rowHtml += `</tr>`;
        tbody.append(rowHtml);
    });

    // Lắng nghe sự kiện khi chọn bất kỳ radio button nào thì tính lại điểm
    $('.score-radio').change(calculateAverage);
}

// Hàm 2: Lấy ngày giờ hệ thống
function setCurrentTime() {
    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
    $('#submitTime').text(`${dateStr} ${timeStr}`);
}

// Hàm 3: Tính điểm trung bình
function calculateAverage() {
    let totalScore = 0;
    let answeredCount = 0;
    const totalCriteria = criteriaList.length;

    for (let i = 1; i <= totalCriteria; i++) {
        // Tìm radio button đang được check của từng tiêu chí
        const checkedVal = $(`input[name="criteria${i}"]:checked`).val();
        if (checkedVal) {
            totalScore += parseInt(checkedVal);
            answeredCount++;
        }
    }

    if (answeredCount === totalCriteria) {
        const average = (totalScore / totalCriteria).toFixed(2);
        $('#averageScore').text(average).css("color", "green");
        return average;
    } else {
        $('#averageScore').text("Chưa hoàn thành đánh giá").css("color", "red");
        return null;
    }
}

// Hàm 4: Xử lý nút Gửi form
function submitSurvey() {
    const averageScore = calculateAverage();

    if (!averageScore) {
        alert("Bạn cần phải đánh giá đủ tất cả các tiêu chí trước khi gửi form!");
        return;
    }

    setCurrentTime();
    
    // Gom điểm của từng tiêu chí
    let criteriaScores = {};
    for (let i = 1; i <= criteriaList.length; i++) {
        criteriaScores[`Tiêu chí ${i}`] = $(`input[name="criteria${i}"]:checked`).val();
    }

    // Đóng gói JSON
    const jsonData = {
        courseName: $('#courseName').val(),
        teacherName: $('#teacherName').val(),
        studentName: $('#studentName').val(),
        submitTime: $('#submitTime').text(),
        criteria: criteriaScores,
        averageScore: averageScore
    };

    // Hiển thị ra thẻ <pre>
    $('#jsonOutput').text(JSON.stringify(jsonData, null, 4));
}