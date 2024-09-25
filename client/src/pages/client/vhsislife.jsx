import React from 'react';

const products = [
  {
    name: "Spindle - VHS-C (1x)",
    id: "buy_btn_1Q346QDBmtvCmuyXaUH7bB1o",
    publishableKey: "pk_live_51LMKryDBmtvCmuyXkAYJswOSWeuuHIFf1Q2z9xes7EdDg0z1VJm6uoEweBZ5v5YkPPA6mv6lMtqAEKL7vg3KrSPY00znKL2Nma"
  },
  {
    name: "Spindle - BetaMax (2x)",
    id: "buy_btn_1Q34KODBmtvCmuyXgRmJ0MXz",
    publishableKey: "pk_live_51LMKryDBmtvCmuyXkAYJswOSWeuuHIFf1Q2z9xes7EdDg0z1VJm6uoEweBZ5v5YkPPA6mv6lMtqAEKL7vg3KrSPY00znKL2Nma"
  },
  {
    name: "Spindle - MiniDV (2x)",
    id: "buy_btn_1Q34RUDBmtvCmuyX0ElQsGxx",
    publishableKey: "pk_live_51LMKryDBmtvCmuyXkAYJswOSWeuuHIFf1Q2z9xes7EdDg0z1VJm6uoEweBZ5v5YkPPA6mv6lMtqAEKL7vg3KrSPY00znKL2Nma"
  },
  {
    name: "Spindle - Hi8 (2x)",
    id: "buy_btn_1Q34WnDBmtvCmuyXZtS3L30d",
    publishableKey: "pk_live_51LMKryDBmtvCmuyXkAYJswOSWeuuHIFf1Q2z9xes7EdDg0z1VJm6uoEweBZ5v5YkPPA6mv6lMtqAEKL7vg3KrSPY00znKL2Nma"
  },
  {
    name: "Spindle - 8MM (2x)",
    id: "buy_btn_1Q34aADBmtvCmuyXvkbllAH5",
    publishableKey: "pk_live_51LMKryDBmtvCmuyXkAYJswOSWeuuHIFf1Q2z9xes7EdDg0z1VJm6uoEweBZ5v5YkPPA6mv6lMtqAEKL7vg3KrSPY00znKL2Nma"
  },
  {
    name: "Spindle - Super 8MM (2x)",
    id: "buy_btn_1Q34byDBmtvCmuyXhe2vw4UT",
    publishableKey: "pk_live_51LMKryDBmtvCmuyXkAYJswOSWeuuHIFf1Q2z9xes7EdDg0z1VJm6uoEweBZ5v5YkPPA6mv6lMtqAEKL7vg3KrSPY00znKL2Nma"
  }
];

export default function VHSISLIFE() {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://js.stripe.com/v3/buy-button.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">VHSISLIFE</h1>
        <p className="text-lg text-center mb-8">
            Hi Tony, here you can find each of your VHSISLIFE products.
            You can click on each of the products to purchase them (make sure to adjust the quantity on the checkout page)
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">            
          {products.map((product, index) => (
            <div key={index} className="rounded-lg bg-card p-6 shadow-lg flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-center mb-4">{product.name}</h2>
                <stripe-buy-button
                    buy-button-id={product.id}
                    publishable-key={product.publishableKey}
                >
                </stripe-buy-button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}