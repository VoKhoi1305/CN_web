// --- CÁC BIẾN DOM CHÍNH ---
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const productForm = document.getElementById("productForm");
const productError = document.getElementById("productError");
const cancelAddBtn = document.getElementById("cancelAddBtn");

const carouselTrack = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

// --- TRẠNG THÁI (STATE) CỦA ỨNG DỤNG ---
let currentIndex = 0;
let productList = []; // Mảng chứa toàn bộ sản phẩm (thay vì đọc từ DOM)

// Dữ liệu mẫu (nếu localStorage trống)
// (Giá được lưu dưới dạng SỐ để dễ xử lý)
const defaultProducts = [
    {
        name: "Cốc sứ in hình du lịch",
        image: "https://tse3.mm.bing.net/th/id/OIP.Tr8uYhFo8S9sCaPGSKNXRAHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3",
        description: "Cốc sứ cao cấp với thiết kế in hình các đặc điểm nổi tiếng đặc trưng của khu du lịch. Thích hợp làm quà tặng hoặc sử dụng hàng ngày.",
        price: 150000
    },
    {
        name: "Móc khóa gỗ thủ công",
        image: "https://th.bing.com/th/id/OIP.XR_6-KorxZ9N9mjXxShj7QHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
        description: "Móc khóa được chế tác thủ công từ gỗ tự nhiên, có thiết kế tinh tế và bền bỉ. Mỗi sản phẩm là một tác phẩm độc nhất.",
        price: 80000
    },
    {
        name: "Hộp nhạc gỗ mini",
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lfavy4966mbo56",
        description: "Hộp nhạc được làm từ gỗ tự nhiên, có thiết kế tinh xảo và giai điệu du dương. Món quà lưu niệm hoàn hảo để tặng bạn bè hoặc người thân.",
        price: 250000
    }
];

// --- CÁC HÀM QUẢN LÝ DỮ LIỆU VÀ LOCALSTORAGE ---

/**
 * Lưu mảng productList hiện tại vào localStorage
 */
function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(productList));
}

/**
 * Tải sản phẩm từ localStorage.
 * Nếu không có, dùng defaultProducts và lưu lại.
 */
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        productList = JSON.parse(storedProducts);
    } else {
        // Nếu localStorage trống, khởi tạo với dữ liệu mẫu
        productList = [...defaultProducts]; // Dùng spread (...) để copy mảng
        saveProductsToStorage(); // Lưu lại dữ liệu mẫu
    }
}

/**
 * Tạo một phần tử DOM cho sản phẩm từ object
 */
function createProductElement(product) {
    const newProduct = document.createElement("article");
    newProduct.className = "product-card product-item";
    
    // Sử dụng toLocaleString để format giá tiền (ví dụ: 150000 -> 150.000)
    const formattedPrice = product.price.toLocaleString('vi-VN');

    newProduct.innerHTML = `
        <h3 class="product-name">${product.name}</h3>
        <img src="${product.image}" alt="${product.name}">
        <p>${product.description}</p>
        <p class="price">Giá: <strong>${formattedPrice} VNĐ</strong></p>
    `;
    return newProduct;
}

/**
 * Xóa tất cả sản phẩm trên DOM và vẽ lại từ mảng productList
 */
function renderAllProducts() {
    // 1. Xóa sạch mọi thứ trong track
    carouselTrack.innerHTML = "";

    // 2. Lặp qua mảng productList và tạo lại DOM
    productList.forEach(product => {
        const productElement = createProductElement(product);
        carouselTrack.appendChild(productElement);
    });

    // 3. Cập nhật lại carousel (vì số lượng sản phẩm có thể đã thay đổi)
    // Phải reset currentIndex về 0 để đảm bảo an toàn
    currentIndex = 0;
    updateCarouselState();
    
    // 4. (Quan trọng) Cập nhật lại bộ lọc
    // Vì các sản phẩm đã được vẽ lại, hàm filter cũ (nếu đang chạy) sẽ không
    // ảnh hưởng đến chúng. Chúng ta gọi lại filterProducts để áp dụng
    // bộ lọc hiện tại (nếu có) lên danh sách mới.
    filterProducts();
}

// --- CÁC HÀM TÌM KIẾM VÀ CAROUSEL (Giữ nguyên logic từ Bài 4) ---

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Luôn lấy danh sách mới nhất từ DOM
    const currentProductItems = document.querySelectorAll(".product-item"); 

    currentProductItems.forEach((item) => {
        const productName = item.querySelector(".product-name").textContent.toLowerCase();

        if (searchTerm === "" || productName.includes(searchTerm)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
    
    currentIndex = 0; 
    updateCarouselState();
}

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
    
    if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }
    
    const cardWidth = 100 / cardsPerView; 
    carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
    
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex || totalVisible <= cardsPerView;
}

// --- GẮN CÁC SỰ KIỆN ---

searchBtn.addEventListener("click", filterProducts);
searchInput.addEventListener("keyup", filterProducts);

addProductBtn.addEventListener("click", () => {
    addProductForm.classList.toggle("hidden");
    productError.textContent = ""; 
    if (!addProductForm.classList.contains("hidden")) {
        addProductForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
});

cancelAddBtn.addEventListener("click", () => {
    addProductForm.classList.add("hidden");
    productForm.reset(); 
    productError.textContent = "";
});

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

// --- XỬ LÝ SUBMIT FORM (CẬP NHẬT CHO LOCALSTORAGE) ---

productForm.addEventListener("submit", (e) => {
    e.preventDefault(); 
    
    // 1. Reset lỗi
    productError.textContent = "";

    // 2. Lấy giá trị
    const name = document.getElementById("productName").value.trim();
    const image = document.getElementById("productImage").value.trim();
    const description = document.getElementById("productDescription").value.trim();
    const priceInput = document.getElementById("productPrice").value;
    const price = Number(priceInput); 

    // 3. Validate
    if (!name || !image || !description || !priceInput) {
        productError.textContent = "Vui lòng nhập đầy đủ các trường thông tin.";
        return; 
    }
    if (isNaN(price) || price <= 0) {
        productError.textContent = "Giá sản phẩm phải là một số hợp lệ lớn hơn 0.";
        return; 
    }
    try {
        new URL(image); 
    } catch (_) {
        productError.textContent = "Vui lòng nhập một đường link ảnh hợp lệ.";
        return;
    }

    // 4. THAY ĐỔI: Tạo object mới thay vì tạo DOM
    const newProductData = {
        name: name,
        image: image,
        description: description,
        price: price // Lưu giá dưới dạng SỐ
    };

    // 5. THAY ĐỔI: Thêm vào mảng, lưu vào storage, và vẽ lại toàn bộ
    productList.push(newProductData); // Thêm vào mảng state
    saveProductsToStorage(); // Lưu mảng mới vào localStorage
    renderAllProducts(); // Vẽ lại toàn bộ danh sách sản phẩm

    // 6. Reset và ẩn form
    productForm.reset();
    addProductForm.classList.add("hidden");
});


// --- KHỞI TẠO TRANG (PAGE LOAD) ---
// Đây là điểm bắt đầu của ứng dụng
loadProductsFromStorage(); // 1. Tải dữ liệu từ localStorage (hoặc dùng mẫu)
renderAllProducts();       // 2. Vẽ các sản phẩm lên giao diện