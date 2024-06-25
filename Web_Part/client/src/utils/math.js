export const numberWithCommas =  (number) => {
    // Convert the number to a string
    let numStr = number.toString();
  
    // Split the string into parts separated by every three characters from the end
    let parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    // Join the parts back together with the decimal point if necessary
    return parts.join('.');
}