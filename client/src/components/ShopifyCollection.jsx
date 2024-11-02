import React, { useEffect } from 'react';

function ShopifyCollection() {
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
      script.onload = ShopifyBuyInit;
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    };

    const ShopifyBuyInit = () => {
      if (!window.ShopifyBuy) return;
      
      const client = window.ShopifyBuy.buildClient({
        domain: 'shop.mandarin3d.com',
        storefrontAccessToken: '734e05b02bbfb1af4c6310ab1c264a74',
      });

      if (window.ShopifyBuy.UI) {
        window.ShopifyBuy.UI.onReady(client).then((ui) => {
          ui.createComponent('collection', {
            id: '487520403778',
            node: document.getElementById('collection-component-1730556426321'),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
              "product": {
                "styles": {
                  "product": {
                    "@media (min-width: 601px)": {
                      "max-width": "calc(25% - 20px)",
                      "margin-left": "20px", 
                      "margin-bottom": "50px",
                      "width": "calc(25% - 20px)"
                    },
                    "img": {
                      "height": "calc(100% - 15px)",
                      "position": "absolute",
                      "left": "0",
                      "right": "0", 
                      "top": "0"
                    },
                    "imgWrapper": {
                      "padding-top": "calc(75% + 15px)",
                      "position": "relative",
                      "height": "0"
                    }
                  },
                  "button": {
                    "font-family": "Inter, sans-serif",
                    ":hover": {
                      "background-color": "#009ba2"
                    },
                    "background-color": "#00acb4",
                    ":focus": {
                      "background-color": "#009ba2"
                    },
                    "border-radius": "28px",
                    "padding-left": "35px",
                    "padding-right": "35px"
                  },
                  "price": {
                    "font-family": "Inter, sans-serif"
                  },
                  "compareAt": {
                    "font-family": "Inter, sans-serif"
                  },
                  "unitPrice": {
                    "font-family": "Inter, sans-serif"
                  }
                },
                "text": {
                  "button": "Add to cart"
                }
              },
              "productSet": {
                "styles": {
                  "products": {
                    "@media (min-width: 601px)": {
                      "margin-left": "-20px"
                    }
                  }
                }
              },
              "modalProduct": {
                "contents": {
                  "img": false,
                  "imgWithCarousel": true,
                  "button": false,
                  "buttonWithQuantity": true
                },
                "styles": {
                  "product": {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0px",
                      "margin-bottom": "0px"
                    }
                  },
                  "button": {
                    "font-family": "Inter, sans-serif",
                    ":hover": {
                      "background-color": "#009ba2"
                    },
                    "background-color": "#00acb4",
                    ":focus": {
                      "background-color": "#009ba2"
                    },
                    "border-radius": "28px",
                    "padding-left": "35px",
                    "padding-right": "35px"
                  },
                  "price": {
                    "font-family": "Inter, sans-serif",
                    "font-weight": "normal",
                    "font-size": "18px",
                    "color": "#4c4c4c"
                  },
                  "compareAt": {
                    "font-family": "Inter, sans-serif",
                    "font-weight": "normal",
                    "font-size": "15.299999999999999px",
                    "color": "#4c4c4c"
                  },
                  "unitPrice": {
                    "font-family": "Inter, sans-serif",
                    "font-weight": "normal",
                    "font-size": "15.299999999999999px",
                    "color": "#4c4c4c"
                  }
                },
                "text": {
                  "button": "Add to cart"
                }
              },
              "option": {},
              "cart": {
                "styles": {
                  "button": {
                    "font-family": "Inter, sans-serif",
                    ":hover": {
                      "background-color": "#009ba2"
                    },
                    "background-color": "#00acb4",
                    ":focus": {
                      "background-color": "#009ba2"
                    },
                    "border-radius": "28px"
                  }
                },
                "text": {
                  "total": "Subtotal",
                  "button": "Checkout"
                }
              },
              "toggle": {
                "styles": {
                  "toggle": {
                    "font-family": "Inter, sans-serif",
                    "background-color": "#00acb4",
                    ":hover": {
                      "background-color": "#009ba2"
                    },
                    ":focus": {
                      "background-color": "#009ba2"
                    }
                  }
                }
              }
            }
          });
        });
      }
    };

    if (!window.ShopifyBuy) {
      loadScript();
    } else if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return <div id="collection-component-1730556426321"></div>;
}

export default ShopifyCollection;