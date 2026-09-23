export const coupons = [
  {
    code: "BACHAT50",
    discountType: "flat",
    discountValue: 50,
    minOrder: 499,
    description: "Flat ₹50 OFF on Kirana orders above ₹499"
  },
  {
    code: "KIRANA10",
    discountType: "percent",
    discountValue: 10,
    maxDiscount: 150,
    minOrder: 599,
    description: "10% OFF (Up to ₹150) on monthly ration above ₹599"
  },
  {
    code: "SHUBHLAABH",
    discountType: "flat",
    discountValue: 100,
    minOrder: 999,
    description: "Flat ₹100 OFF on mega family ration above ₹999"
  },
  {
    code: "PEHLIORDER",
    discountType: "percent",
    discountValue: 15,
    maxDiscount: 100,
    minOrder: 299,
    description: "15% OFF for first-time Kirana shoppers"
  }
];
