function startCheckout(meta) {
  const baseUrl = "https://mdn-bird-backend.onrender.com/create-checkout-session";

  const query = new URLSearchParams({
    product_type: "planning_pass",
    stadium: meta.stadium || '',
    city: meta.city || '',
    match: meta.match || '',
    entry_context: meta.entry_context || '',
    intent: meta.intent || 'full_plan'
  });

  window.location.href = `${baseUrl}?${query.toString()}`;
}
