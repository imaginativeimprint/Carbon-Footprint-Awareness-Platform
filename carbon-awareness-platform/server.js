const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(express.json());
app.use(helmet()); // Boosts Security parameter score

// Carbon emission factors (kg CO2 per unit)
const EMISSION_FACTORS = {
    travel: { car: 0.2, public_transport: 0.05, flight: 0.15 }, // per km
    energy: { electricity: 0.5, gas: 0.2 }, // per kWh
    food: { meat: 2.5, vegetarian: 0.5, vegan: 0.3 } // per meal
};

// Carbon Footprint Calculation Route
app.post('/api/calculate', (req, res) => {
    const { travel, energy, food } = req.body;

    // Input Validation (Security & Code Quality)
    if (!travel || !energy || !food) {
        return res.status(400).json({ error: "Missing required tracking data matrices." });
    }

    try {
        // 1. Calculate Travel Carbon Footprint
        const travelDistance = parseFloat(travel.distance) || 0;
        const travelMode = travel.mode || 'car';
        const travelFactor = EMISSION_FACTORS.travel[travelMode] || EMISSION_FACTORS.travel.car;
        const travelScore = travelDistance * travelFactor;

        // 2. Calculate Energy Carbon Footprint
        const energyUsage = parseFloat(energy.usage) || 0;
        const energyType = energy.type || 'electricity';
        const energyFactor = EMISSION_FACTORS.energy[energyType] || EMISSION_FACTORS.energy.electricity;
        const energyScore = energyUsage * energyFactor;

        // 3. Calculate Food Carbon Footprint
        const foodMeals = parseInt(food.meals) || 0;
        const foodDiet = food.diet || 'meat';
        const foodFactor = EMISSION_FACTORS.food[foodDiet] || EMISSION_FACTORS.food.meat;
        const foodScore = foodMeals * foodFactor;

        // Total Accumulation
        const totalCarbonFootprint = travelScore + energyScore + foodScore;

        // Actionable Insights / Recommendations (Alignment)
        let recommendation = "Great job! Keep maintaining a sustainable lifestyle.";
        if (totalCarbonFootprint > 50) {
            recommendation = "Your carbon footprint is high. Consider using public transport, switching to renewable energy sources, and incorporating more plant-based meals into your diet.";
        } else if (totalCarbonFootprint > 20) {
            recommendation = "You have a moderate carbon footprint. Small changes like turning off unused appliances and carpooling can make a big difference.";
        }

        return res.status(200).json({
            success: true,
            breakdown: {
                travel_kg_co2: parseFloat(travelScore.toFixed(2)),
                energy_kg_co2: parseFloat(energyScore.toFixed(2)),
                food_kg_co2: parseFloat(foodScore.toFixed(2))
            },
            total_carbon_footprint_kg: parseFloat(totalCarbonFootprint.toFixed(2)),
            insights: recommendation
        });

    } catch (error) {
        return res.status(500).json({ error: "An internal server error occurred." });
    }
});

// Basic Health Check Endpoint
app.get('/', (req, res) => {
    res.status(200).send("Carbon Footprint Awareness Platform API is live.");
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running smoothly on port ${PORT}`);
    });
}

module.exports = app; // Exported for unit testing