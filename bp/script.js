function buypass() {
  if (!window.PaymentRequest) return alert("Payment Request APIã«æœªå¯¾å¿œãªãŸã‚ä½¿ãˆã¾ã›ã‚“");

  new PaymentRequest(
    [
      {
        supportedMethods: location.origin + "/payment-manifest.json",
        data: {
          url: document.querySelector("input").value
        },
      },
    ],
    {
      total: {
        label: "_",
        amount: {
          value: "1", currency: "USD"
        },
      },
    }
  ).show();
}

document.querySelector("button").onclick = buypass;
