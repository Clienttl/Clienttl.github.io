function buypass() {
    if (!window.PaymentRequest) {
        return alert("Payment Request API is not supported.");
    }

    new PaymentRequest(
        [
            {
                supportedMethods: location.origin + "/payment-manifest.json",
                data: {
                    url: document.querySelector("input").value
                }
            }
        ],
        {
            total: {
                label: "_",
                amount: {
                    value: "1",
                    currency: "USD"
                }
            }
        }
    ).show();
}

document.querySelector("button").onclick = buypass;
