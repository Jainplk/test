export const formateTime = (timestamp) => {
    const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

  return `${hours}:${minutes} ${ampm}`
}

export const determineUserRole = (loginUserId, listingOwnerId ) => {
  if (loginUserId === listingOwnerId) {
    return "Host";
  } else {
    return "Guest";
  }
};

export const formatName = (name) => {
  if (!name) return "";

  const names = name.trim().split(" ");
  const firstPart = names.slice(0, -1).join(" ") || names[0];

  return firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
};


