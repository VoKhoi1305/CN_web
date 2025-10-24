// --- PHẦN TÌM KIẾM ---
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
// Biến productItems đã bị XÓA khỏi đây để đảm bảo tìm kiếm luôn cập nhật

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  
  // SỬA LỖI: Lấy danh sách sản phẩm MỚI NHẤT mỗi khi lọc
  const currentProductItems = document.querySelectorAll(".product-item"); 

  currentProductItems.forEach((item) => { // Dùng danh sách mới nhất
    const productName = item.querySelector(".product-name").textContent.toLowerCase();

    if (searchTerm === "" || productName.includes(searchTerm)) {
      item.style.display = ""; // Hiển thị card (dùng rỗng thay vì "flex" hay "block")
    } else {
      item.style.display = "none";
    }
  });
  
  // Đặt lại carousel về slide đầu tiên và cập nhật trạng thái
  currentIndex = 0; 
  updateCarouselState();
}

searchBtn.addEventListener("click", filterProducts);
searchInput.addEventListener("keyup", filterProducts);

// --- PHẦN THÊM SẢN PHẨM ---
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const productForm = document.getElementById("productForm");

// THÊM MỚI: Lấy phần tử lỗi và nút hủy
const productError = document.getElementById("productError");
const cancelAddBtn = document.getElementById("cancelAddBtn");

// Khi nhấn nút "Thêm sản phẩm" (để mở form)
addProductBtn.addEventListener("click", () => {
  addProductForm.classList.toggle("hidden");
  productError.textContent = ""; // Xóa mọi thông báo lỗi cũ
  if (!addProductForm.classList.contains("hidden")) {
    addProductForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// THÊM MỚI: Sự kiện cho nút "Hủy"
cancelAddBtn.addEventListener("click", () => {
    addProductForm.classList.add("hidden");
    productForm.reset(); // Xóa nội dung đã nhập
    productError.textContent = ""; // Xóa lỗi
});


// --- PHẦN CAROUSEL ---
const carouselTrack = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

let currentIndex = 0;

function getCardsPerView() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function updateCarouselState() {
  // Lấy TẤT CẢ các card đang hiển thị (không bị "display: none" bởi bộ lọc)
  const visibleCards = Array.from(carouselTrack.querySelectorAll(".product-card")).filter(
    card => card.style.display !== "none"
  );
  
  const cardsPerView = getCardsPerView();
  const totalVisible = visibleCards.length;
  const maxIndex = Math.max(0, totalVisible - cardsPerView);
  
  // Đảm bảo index không vượt quá giới hạn
  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }
  
  // Tính toán dịch chuyển
  const cardWidth = 100 / cardsPerView; 
  carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
  
  // Cập nhật trạng thái nút
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= maxIndex || totalVisible <= cardsPerView;
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarouselState();
  }
});

nextBtn.addEventListener("click", () => {
  const visibleCards = Array.from(carouselTrack.querySelectorAll(".product-card")).filter(
    card => card.style.display !== "none"
  );
  const cardsPerView = getCardsPerView();
  const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
  
  if (currentIndex < maxIndex) {
    currentIndex++;
    updateCarouselState();
  }
});

window.addEventListener("resize", updateCarouselState);
updateCarouselState(); // Khởi tạo khi tải trang


// --- XỬ LÝ SUBMIT FORM (CẬP NHẬT LỚN VỚI VALIDATION) ---
productForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Ngăn trang tải lại
  
  // 1. Reset thông báo lỗi
  productError.textContent = "";

  // 2. Lấy giá trị và .trim() để xóa khoảng trắng thừa
  const name = document.getElementById("productName").value.trim();
  const image = document.getElementById("productImage").value.trim();
  const description = document.getElementById("productDescription").value.trim();
  const priceInput = document.getElementById("productPrice").value;
  const price = Number(priceInput); // Chuyển giá trị sang kiểu SỐ

  // 3. THÊM MỚI: Validate dữ liệu
  if (!name || !image || !description || !priceInput) {
    productError.textContent = "Vui lòng nhập đầy đủ các trường thông tin.";
    return; // Dừng hàm nếu có lỗi
  }

  if (isNaN(price) || price <= 0) {
    productError.textContent = "Giá sản phẩm phải là một số hợp lệ lớn hơn 0.";
    return; // Dừng hàm nếu giá không hợp lệ
  }

  // (Tùy chọn) Kiểm tra link ảnh cơ bản
  try {
    new URL(image); // Thử tạo một đối tượng URL, nếu thất bại (catch) -> link không hợp lệ
  } catch (_) {
    productError.textContent = "Vui lòng nhập một đường link ảnh hợp lệ.";
    return;
  }

  // 4. Nếu tất cả đều hợp lệ, tạo sản phẩm mới
  const newProduct = document.createElement("article");
  newProduct.className = "product-card product-item";
  
  // Sử dụng innerHTML để tạo cấu trúc thẻ
  newProduct.innerHTML = `
    <h3 class="product-name">${name}</h3>
    <img src="${image}" alt="${name}">
    <p>${description}</p>
    <p class="price">Giá: <strong>${priceInput} VNĐ</strong></p>
  `;

  // 5. Thêm sản phẩm vào DOM
  carouselTrack.appendChild(newProduct);

  // 6. Reset và ẩn form
  productForm.reset();
  addProductForm.classList.add("hidden");

  // 7. Cập nhật lại carousel
  currentIndex = 0; // Đưa về slide đầu
  updateCarouselState(); // Cập nhật carousel để tính toán lại
});