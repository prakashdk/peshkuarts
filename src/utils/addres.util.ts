export const getAutoCompleteValue = (key: string): string => {
  switch (key) {
    case "name":
      return "name";
    case "email":
      return "email";
    case "phone":
      return "tel";
    case "addressLine1":
      return "address-line1";
    case "addressLine2":
      return "address-line2";
    case "city":
      return "address-level2";
    case "state":
      return "address-level1";
    case "postalCode":
      return "postal-code";
    case "country":
      return "country";
    default:
      return "off";
  }
};
