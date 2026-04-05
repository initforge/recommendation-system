# BÀI 1: Giới thiệu Recommender System

## 1. Recommender System là gì?

**Định nghĩa đơn giản:**
> Khi bạn xem YouTube → nó gợi video tiếp. Mua đồ trên Shopee → nó gợi sản phẩm. Nghe nhạc trên Spotify → nó gợi bài mới. Tất cả những thứ "gợi ý" đó chính là **Recommender System (Hệ thống gợi ý)**.

**Tên tiếng Việt:** Hệ thống gợi ý / Hệ thống khuyến nghị

**Định nghĩa học thuật:**
Recommender System là một hệ thống lọc thông tin, dự đoán sở thích của user đối với một item (sản phẩm, phim, nhạc...) dựa trên dữ liệu lịch sử, để đưa ra gợi ý phù hợp nhất.

---

## 2. Bài toán cốt lõi

```
Thực tế:
  - YouTube có hơn 800 TRIỆU video
  - Shopee có hơn 1.5 TỶ sản phẩm
  - Spotify có hơn 100 TRIỆU bài nhạc

Vấn đề:
  → User không thể xem/hết được
  → Làm sao biết user sẽ THÍCH cái gì tiếp theo?

Recommender System giải quyết:
  → Phân tích hành vi quá khứ của user
  → Tìm pattern (khuôn mẫu) trong dữ liệu
  → Dự đoán → Gợi ý những item phù hợp nhất
```

---

## 3. Ví dụ thực tế hằng ngày

| Nền tảng | Gợi ý gì? | Dựa trên? |
|----------|-----------|-----------|
| **Netflix** | Phim tiếp theo | Lịch sử xem, phim cùng thể loại |
| **Spotify** | Bài nhạc mới | Bài đã nghe, playlist đã tạo |
| **Shopee/Tiki** | Sản phẩm | Đã mua, đã xem, đã tìm kiếm |
| **YouTube** | Video | Đã xem, đã like, thời gian xem |
| **TikTok** | Video | Video đã xem, like, share |
| **Facebook** | Bạn bè / Nhóm | Friend list, group đã tham gia |
| **Google News** | Tin tức | Tin đã đọc, thể loại quan tâm |

---

## 4. Tại sao cần Recommender System?

### Không có Recommender System:
```
User A muốn tìm phim hay trên Netflix
  → Phải tự duyệt hàng triệu phim
  → Tốn thời gian → Bỏ cuộc
  → Không xem được nhiều phim hay
  → Không hài lòng → Chuyển sang nền tảng khác
```

### Có Recommender System:
```
User A muởn tìm phim hay trên Netflix
  → Hệ thống gợi "Phim hay cho bạn" (top 10)
  → Chọn nhanh → Xem → Thích → Ở lại
  → Netflix giữ chân được user
```

### Lợi ích kinh doanh:
```
1. Tăng engagement (user ở lại lâu hơn)
2. Tăng conversion (mua/bấm/xem nhiều hơn)
3. Giảm churn (ít user bỏ đi)
4. Cá nhân hóa trải nghiệm (mỗi user thấy khác nhau)
5. Khám phá nội dung mới (user không biết mình thích gì)
```

---

## 5. Hai cách để "đoán" user thích gì

### Cách 1: Dựa vào NGƯỜI KHÁC (Collaborative)
```
Tìm user có sở thích GIỐNG bạn → Gợi những thứ họ thích
"Alice thích A, B, C. Bob thích A, B, C, D.
 → Bob có thể sẽ thích D → Gợi D cho Bob"
```

### Cách 2: Dựa vào CHÍNH ITEM (Content-Based)
```
Phim A có đặc điểm: hành động, Marvel, Robert Downey Jr
Bạn thích Phim A → Hệ thống tìm phim có đặc điểm TƯƠNG TỰ
 → Gợi Phim B (cũng hành động, Marvel, RDJ)
```

---

## 6. Tổng kết Bài 1

```
✅ Recommender System = Hệ thống gợi ý
✅ Mục tiêu: Dự đoán user sẽ thích gì
✅ 2 hướng tiếp cận chính: Collaborative Filtering & Content-Based
✅ Ứng dụng: Netflix, YouTube, Shopee, Spotify...
✅ Lợi ích: Giữ chân user, tăng doanh thu
```

---

## Bài tiếp theo
[Tại sao chọn phim & dataset MovieLens](./02-tai-sao-chon-phim.md)
