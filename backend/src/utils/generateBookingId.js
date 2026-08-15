const generateBookingId = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);

  const random4 = Math.floor(1000 + Math.random() * 9000);

  return `SV-${dd}${mm}${yy}-${random4}`;
};

export default generateBookingId;