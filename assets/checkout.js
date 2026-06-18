async function startCheckout(meta) {
  const baseUrl = "https://mdn-bird-backend.onrender.com/create-checkout-session";
  const payload = {
    product_type: meta.product_type || 'planning_pass',
    sender: meta.sender || meta.user_id || '',
    user_id: meta.user_id || meta.sender || '',
    stadium_id: meta.stadium_id || meta.stadium || '',
    stadium_name: meta.stadium_name || '',
    stadium_city: meta.stadium_city || meta.city || '',
    city_slug: meta.city_slug || '',
    match_id: meta.match_id || meta.match || '',
    match_label: meta.match_label || '',
    kickoff_text: meta.kickoff_text || meta.kickoff || '',
    entry_context: meta.entry_context || '',
    intent_context: meta.intent_context || meta.intent || 'full_plan',
    language: meta.language || 'en',
    user_location: meta.user_location || meta.premium_location || meta.stay || '',
    premium_transport: meta.premium_transport || '',
    premium_priority: meta.premium_priority || ''
  };

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorCode = data.error || `checkout_http_${response.status}`;
      console.error('Checkout session creation failed:', errorCode, data);
      alert('Unable to start checkout right now. Please try again in a moment.');
      return;
    }
    if (!data.url) {
      console.error('Checkout session response missing url:', data);
      alert('Unable to start checkout right now. Please try again in a moment.');
      return;
    }
    window.location.href = data.url;
  } catch (error) {
    console.error('Checkout request failed:', error);
    alert('Unable to start checkout right now. Please try again in a moment.');
  }
}
