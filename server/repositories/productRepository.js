async function getProducts() {
  return [
    {
      id: 1,
      img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/airpods-pro-2-hero-select-202409_FV1?wid=976&hei=916&fmt=jpeg&qlt=90&.v=1725492499003",
      name: "airpod pro 2",
      price: 6199000,
    },
    {
      id: 2,
      img: "https://product.hstatic.net/200000456445/product/i-gucci-nu-ophidia-gg-leather-beige-brown-550618-96i3b-8745_view_amp-3_4d17ca51dce9424dbee7a7106fe92883_master.png",
      name: "gucci bag",
      price: 35999000,
    },
    {
      id: 3,
      img: "https://boba.vn/static/san-pham/thoi-trang-nam/ao-khoac-nam/ao-khoac-ni/ao-khoac-alan-walker/ao-khoac-n.jpg",
      name: "Alan Walker hoodie",
      price: 85000,
    },
  ];
}

module.exports = { getProducts };
