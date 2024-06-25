export function GetStringsWithDelay(strings, onNext=(str)=>{}, delay=2000) {
    //Initialize a counter for the current index
    let currentIndex = 0;

    // Function to print the current string and set up the next print
    function printNext() {
        // Check if the current index is within the array bounds
        if (currentIndex < strings.length) {
            onNext(strings[currentIndex]);
            currentIndex++;
            // Set a timeout to call this function again after 2 seconds
            setTimeout(printNext, delay);
        }
    }

    // Start the printing process
    printNext();

}

export const getTimeDiff = (vehicleAd) => {
    const timeDiff = new Date() - new Date(vehicleAd.createdAt);
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}

export const getUpdatedAt = (obj) => {
    if (!obj) 
        return "1970-01-01"
    return obj?.updatedAt.substring(0, obj?.updatedAt.indexOf('T'));
}

export function ToNumberPrice(priceStr) {
    // Define conversion factors
    const lacToNum = 1e5;
    const croreToNum = 1e7;
    
    // Regular expressions to identify the price and unit
    const lacPattern = /(\d+(\.\d+)?)\s*lacs?/i;
    const crorePattern = /(\d+(\.\d+)?)\s*crores?/i;

    // Helper function to avoid floating-point issues
    function preciseMultiply(value, multiplier) {
        return Math.round(value * multiplier * 100) / 100;
    }

    // Check if the price is in lacs
    if (lacPattern.test(priceStr)) {
        const match = priceStr.match(lacPattern);
        return preciseMultiply(parseFloat(match[1]), lacToNum);
    }

    // Check if the price is in crores
    if (crorePattern.test(priceStr)) {
        const match = priceStr.match(crorePattern);
        return preciseMultiply(parseFloat(match[1]), croreToNum);
    }

    // If no match, return NaN (Not a Number)
    return NaN;
}

export function ToLacOrCrore(number) {
    // Define conversion thresholds and factors
    const lacThreshold = 1e5;
    const croreThreshold = 1e7;

    // Determine if the number should be in lacs or crores
    if (number >= croreThreshold) {
        const croreValue = number / croreThreshold;
        return `${croreValue.toFixed(2)} crore`;
    } else if (number >= lacThreshold) {
        const lacValue = number / lacThreshold;
        return `${lacValue.toFixed(2)} lac`;
    } else {
        return `${number}`;
    }
}

export function Includes(str, substr) {
    return str.toLowerCase().includes(substr.toLowerCase());
}

export function AryIncludes(ary, str){
    if (!ary)
        return false;
    for (const element of ary){
        console.log(element, str, Includes(element, str));
        if (Includes(element, str))
            return true
    }
    return false;
} 
