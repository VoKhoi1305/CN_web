// --- 1. Lấy các phần tử DOM ---

// Chức năng Tìm kiếm
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Chức năng Thêm sản phẩm
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");

// Chức năng Carousel 
const carouselTrack = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
let currentIndex = 0;

// --- 2. Xử lý sự kiện tìm kiếm ---

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  
  // Lấy danh sách sản phẩm (cần query lại mỗi lần lọc)
  const productItems = document.querySelectorAll(".product-item");

  productItems.forEach((item) => {
    const productNameElement = item.querySelector(".product-name");
    if (productNameElement) {
        const productName = productNameElement.textContent.toLowerCase();
        
        if (searchTerm === "" || productName.includes(searchTerm)) {
          item.style.display = ""; // Hiển thị
        } else {
          item.style.display = "none"; // Ẩn
        }
    }
  });
  
  // FIX: Reset carousel sau khi filter.
  currentIndex = 0; // Đặt lại về slide đầu tiên
  updateCarouselState();
}

searchBtn.addEventListener("click", filterProducts);
searchInput.addEventListener("keyup", filterProducts);


// --- 3. Xử lý sự kiện thêm sản phẩm ---

addProductBtn.addEventListener("click", () => {

  addProductForm.classList.toggle("hidden");
 
  if (!addProductForm.classList.contains("hidden")) {
    addProductForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});



function getCardsPerView() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}


function updateCarouselState() {

  const visibleCards = Array.from(carouselTrack.querySelectorAll(".product-card")).filter(
    card => card.style.display !== "none"
  );
  
  const cardsPerView = getCardsPerView();
  const totalVisible = visibleCards.length;
  const maxIndex = Math.max(0, totalVisible - cardsPerView);
  
  // Giới hạn currentIndex nếu nó vượt quá maxIndex (xảy ra khi lọc)
  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }
  
  // Cập nhật vị trí trượt
  const cardWidth = 100 / cardsPerView;
  carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
  
  // Disable/enable các nút prev/next
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= maxIndex || totalVisible <= cardsPerView;
}

// Gắn sự kiện cho các nút carousel
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

// Xử lý khi thay đổi kích thước cửa sổ
window.addEventListener("resize", updateCarouselState);

// Khởi tạo carousel lần đầu khi tải trang
updateCarouselState();