const calculatePrice = ({ pricePerNight, nights, taxPercent, securityDeposit, advancePercent }) => {
  const villaCharges = pricePerNight * nights;
  const taxAmount = Math.round((villaCharges * taxPercent) / 100);

  const taxableTotal = villaCharges + taxAmount;
  const advanceAmount = Math.round((taxableTotal * advancePercent) / 100);
  const remainingAmount = taxableTotal - advanceAmount;

  const totalAmount = villaCharges + taxAmount + securityDeposit;

  return {
    pricePerNight,
    villaCharges,
    taxAmount,
    securityDeposit,
    totalAmount,
    advancePercent,
    advanceAmount,
    remainingAmount,
  };
};

export default calculatePrice;