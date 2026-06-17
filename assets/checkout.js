function startCheckout(meta){
  const url = "https://mdn-bird-backend.onrender.com/create-checkout-session";
  const params = new URLSearchParams(meta);
  window.location.href = url + "?" + params.toString();
}
