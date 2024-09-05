// Pricing Algorithm and Rules
// Each item is at least $1 if an item is less than $1 then add $1 to the price


export const calculatePrice = (fileDetails, filament, file, profitMargin = 0.5) => {
    
    const quantity = file.quality;
    const quantityMultiplier = {
        '0.12mm': 1.9,
        '0.16mm': 1.7,
        '0.20mm': 1.5,
        '0.25mm': 1.3
    };
    if (fileDetails.mass_in_grams === null) {
        return 1;
    }
    if (filament.filament_unit_price === null) {
        return 1;
    }
    const massInGrams = parseFloat(fileDetails.mass_in_grams);
    const filamentUnitPrice = parseFloat(filament.filament_unit_price);

    // Calculate base cost
    let baseCost = (massInGrams * (filamentUnitPrice / 1000));

    // Apply profit margin
    let price = baseCost * quantityMultiplier[quantity];

    // Ensure minimum price of $1
    if (price < 1) {
        price += 1;
    }

    return price.toFixed(2);
}