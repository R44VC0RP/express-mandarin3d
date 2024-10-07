// Pricing Algorithm and Rules
// Each item is at least $1 if an item is less than $1 then add $1 to the price


export const calculatePrice = (fileDetails, filament, file, profitMargin = 0.5) => {
    
    const quantity = file.quality;

    if (fileDetails.price_override != null) {
        return fileDetails.price_override;
    }

    const quantityMultiplier = {
        '0.12mm': 2.4,
        '0.16mm': 2.2,
        '0.20mm': 1.7,
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
    let baseCost = (2 * massInGrams) * (filamentUnitPrice / 1000);

    if (baseCost < 1) {
        baseCost += 1;
    }

    // Apply profit margin
    let price = baseCost * quantityMultiplier[quantity];

    

    return price.toFixed(2);
}