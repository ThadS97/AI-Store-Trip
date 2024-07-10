/*
 * This JavaScript file is an example of perceptrons,
 * one of the fundamental components of neural networks,
 * which is a method used in machine learning.
 * Machine learning is a subfield of artificial intelligence.
 * 
 * The 3 main functions (takeBusOrTaxi, storeScenario, and
 * takeTaxiOrBus) use perceptrons to simulate an AI agent
 * that will do three major events: get to the store from home,
 * buy a few items from the store, and return home from the
 * store. The agent has a limited amount of money and has
 * particular biases that play a role in the decisions it
 * makes. The agent does not know everything about its
 * environment beforehand so probability is an external factor 
 * that will influence the agent's decisions. Decisions the 
 * agent has taken previously will have an effect on its future
 * decisions and responses.
*/

/**
 * The Agent object acts as an rudimentary AI agent in AI/ML-related situations.
 *
 * @property environmentSequence -- This array stores what environments the
 * agent has perceived. The last element is the last environment the agent has
 * perceived.
 * 
 * @property actionSequence -- This array stores what actions the agent has taken.
 * The last action the agent has taken is the last element in the array.
 * 
 * @method addEnvironment(env) -- This function pushes the latest environment
 * the agent has perceived onto the environmentSequence property.
 * 
 * @method addAction(choice) -- This function pushes the latest action the agent
 * has taken in its environment onto the actionSequence property.
 * 
 * @param env - The newest environment the agent has entered (perceived).
 * @param choice - The latest action the agent has performed in its environment.
 */
const Agent = {
    environmentSequence: [],
    actionSequence: [],
    addEnvironment: function (env) {
        this.environmentSequence.push(env);
        return this.environmentSequence;
    },
    addAction: function (choice) {
        this.actionSequence.push(choice);
        return this.actionSequence;
    }
};

/**
 * Returns either 0 or 1 randomly; can think of it as returning either "false" or "true" randomly.
 * 
 * @returns 0 or 1
 */
function getZeroOrOne() {
    return Math.floor(Math.random() * 2);
}

/**
 * Returns the sum of the weighted inputs from both arrays plus the bias.
 * Bias may either be a positive value, negative value, or zero.
 * 
 * DEV NOTE: The for loop performs the perceptron's mathematicial
 * calculations by multiplying each input with its weight and adding
 * the product of each weighted input to the overall sum value. The bias is
 * added afterwards that, if not zero, affects the sum of the weighted inputs.
 * 
 * @param {*} sum The summation of the weighted inputs' products.
 * @param {*} inputsArray Array that contains the values for the inputs in the agent's environment. Must be an array object.
 * @param {*} weightsArray Array that contains the weights of the inputs from the environment. Must be an array object. 
 * @param {*} bias This value is independent of the sum and is added at the end to influence the sum.
 * @returns The sum and bias added together; the bias may or may not change the value of sum.
 */
function summationOfInputsAndWeights(sum, inputsArray, weightsArray, bias) {
    for (let i = 0; i < inputsArray.length; i++) {
        sum += inputsArray[i] * weightsArray[i];
    }

    return sum + bias;
}

let money = 75;
let atHome = true;
let onTheStreets = false;
let atStore = false;
Agent.addEnvironment(atHome);

console.log("\nStarting money: $" + money + "\n");

/* AGENT'S STREET PERCEPT: Should I take the bus or hail a taxi to get 
   to the store today? I have $75 in my wallet. The bus fare is $5. The taxi
   fare is $8, plus $1 per mile. The distance from home to the store is 2 miles.
   
   ADDITIONAL FACTORS
    - Is the weather bad? (increases likelihood of taking taxi)
    - Is traffic density high? (increases likelihood of taking taxi)
    - Is the bus crowded? (increases likelihood of taking taxi)
    - Agent prefers taking the bus to store (bias for taking bus)

   CRITERIA                 INPUT                   WEIGHT
   
   Cost                     x1 = 1                 w1 = 0.7
   Bad Weather         x2 = either 0 or 1          w2 = 0.5
   Heavy Traffic       x3 = either 0 or 1          w3 = 0.4
   Bus Crowding        x4 = either 0 or 1          w4 = 0.3
   Bias for Bus                                    w5 = -0.2

   DEV NOTE: The input values are to be interpreted as a boolean of 0 (false) or 1 (true).
   Because it costs money to take either the bus or taxi, the cost input value will
   always be 1 due to its certainity. The bias factor will decrease the sum of
   the weighted inputs by 0.2, which lowers the threshold for taking a taxi, making it
   less likely.
*/
let tookBus = false;
let tookTaxi = false;

function takeBusOrTaxi() {
    atHome = false;
    onTheStreets = true;
    Agent.addEnvironment(onTheStreets);

    console.log("I need to get to the store.\n");

    const taxi_choice_threshold = 1.5;

    const cost_factor = 1;
    console.log("It's cheaper to take the bus ($5) than to hail a taxi ($10).");

    let weatherFactor = getZeroOrOne();
    if (weatherFactor == 0) {
        console.log("It's nice outside today! ");
    } else if (weatherFactor == 1) {
        console.log("The weather looks awful today... ");
    }

    let trafficFactor = getZeroOrOne();
    if (trafficFactor == 0) {
        console.log("Traffic flow is normal for now. ");
    } else if (trafficFactor == 1) {
        console.log("There is a lot of traffic on the roads... ");
    }

    let busCrowdingFactor = getZeroOrOne();
    if (busCrowdingFactor == 0) {
        console.log("Plenty of space on the bus.\n");
    } else if (busCrowdingFactor == 1) {
        console.log("There is a lot of people on the bus.\n");
    }

    const cost_weight = 0.7;
    const weather_weight = 0.5;
    const traffic_weight = 0.4;
    const bus_crowding_weight = 0.3;
    const bus_bias = -0.2;

    const inputs = [cost_factor, weatherFactor, trafficFactor, busCrowdingFactor];
    const weights = [cost_weight, weather_weight, traffic_weight, bus_crowding_weight];
    let sum = 0;
    
    sum = summationOfInputsAndWeights(sum, inputs, weights, bus_bias);

    console.log("Threshold to take a taxi is 1.5. Current conditions: " + sum.toPrecision(2));

    if (sum >= taxi_choice_threshold) {
        console.log("I have to hail a taxi.");
        money -= 10;
        tookTaxi = true;
        Agent.addAction(tookTaxi);
        onTheStreets = false;
        return tookTaxi;
    } else {
        console.log("I'll take the bus.");
        money -= 5;
        tookBus = true;
        Agent.addAction(tookBus);
        onTheStreets = false;
        return tookBus;
    }
}

takeBusOrTaxi();
console.log("Current money: $" + money + "\n");

/* AGENT'S STORE PERCEPT: I am at the store. I need milk, eggs, and a lighter.
   I want an energy drink as well but not if I have less than $40.
   How I got to the store will determine how I spend.
   I know that locally produced items are cheaper but the store has
   sparse inventory of them, if at all. I won't know until I go to the
   side of the store that has what I need. Brand name items are
   always available but more expensive. Sales tax on all groceries is
   5% of the subtotal of all items.

   ADDITIONAL FACTORS
    - Cost of item
    - Local goods (if available in store, the agent will buy the item instead of brand name)
    - Spending bias (more likely to save money by buying available local goods if arrived by taxi)

   CRITERIA                 INPUT                   WEIGHT
   
   Cost                     x1 = 1                 w1 = 0.6
   Local Goods         x2 = either 0 or 1          w2 = -0.3
   Brand Name               x4 = 1                 w4 = 0.6
   Spending Bias                                   w5 = -0.2 if tookTaxi is true, 0 if tookBus is true

   DEV NOTE: The input value for Local Goods is to be interpreted as boolean.
   If there are any local goods on that side of the store, it will be the factor
   that makes the agent decide to choose the item. If there are no local goods available, 
   the agent has no other choice but to buy the brand name item. Cost will always be a 
   certainity so its value is 1. The store always has brand name items in stock 
   so its value is also 1. If the agent arrived to the store by taxi, they will 
   be more inclined to buy local goods, if available.
*/
let gotEnergyDrink = false;

function storeScenario() {
    atStore = true;
    Agent.addEnvironment(atStore);
    const brand_name_item_threshold = 1.0;
    
    if (Agent.actionSequence.includes(tookTaxi)) {
        const spending_bias = -0.2;
        const cost_factor = 1;
        const brand_name_factor = 1;
        let checkListIncomplete = true;
        let shoppingCart = [];

        console.log("I'm at the store.\n");

        let gotEggs = false;
        let gotMilk = false;
        let gotLighter = false;

        while (checkListIncomplete) {
            console.log("The eggs are on the left side of the store.");
            console.log("The milk is on the right side of the store.");
            console.log("And the home supplies is straight ahead. I can buy lighters there.");
            console.log("Do I want to go left, right, or straight ahead?\n");

            const readline = require("readline-sync");

            let routeDecision = String(readline.question("Choose l for left, r for right, s for straight ahead> "));

            if (routeDecision.toLowerCase() === 'l' && !Agent.actionSequence.includes(gotEggs, 1)) {
                let localGoodsFactor = getZeroOrOne();
                
                const localEggs = {item: 'eggs', type: 'local', price: 6};
                const brandNameEggs = {item: 'eggs', type: 'brand name', price: 8};

                const cost_weight = 0.6;
                const local_goods_weight = -0.3;
                const brand_name_weight = 0.6;

                const inputs = [cost_factor, localGoodsFactor, brand_name_factor];
                const weights = [cost_weight, local_goods_weight, brand_name_weight];
                let sum = 0;

                console.log("Are there local goods available? 1 for yes, 0 for no: " + localGoodsFactor);

                sum = summationOfInputsAndWeights(sum, inputs, weights, spending_bias);

                console.log("Threshold to buy brand name is 1.0. Current value: " + sum.toPrecision(2));

                if (sum >= brand_name_item_threshold) {
                    console.log("Going to get brand name.");
                    shoppingCart.push(brandNameEggs);
                    gotEggs = true;
                    Agent.addAction(gotEggs);
                } else {
                    console.log("I'm buying local.");
                    shoppingCart.push(localEggs);
                    gotEggs = true;
                    Agent.addAction(gotEggs);
                }

                console.log("\n");

            } else if (routeDecision.toLowerCase() === 'l' && Agent.actionSequence.includes(gotEggs, 1)) {
                console.log("I already have what I need from here. Better backtrack.\n");
                continue;

            } else if (routeDecision.toLowerCase() === 'r' && !Agent.actionSequence.includes(gotMilk, 1)) {
                let localGoodsFactor = getZeroOrOne();
                
                const localMilk = {item: 'milk', type: 'local', price: 7};
                const brandNameMilk = {item: 'milk', type: 'brand name', price: 9};

                const cost_weight = 0.6;
                const local_goods_weight = -0.3;
                const brand_name_weight = 0.6;

                const inputs = [cost_factor, localGoodsFactor, brand_name_factor];
                const weights = [cost_weight, local_goods_weight, brand_name_weight];
                let sum = 0;

                console.log("Are there local goods available? 1 for yes, 0 for no: " + localGoodsFactor);

                sum = summationOfInputsAndWeights(sum, inputs, weights, spending_bias);

                console.log("Threshold to buy brand name is 1.0. Current value: " + sum.toPrecision(2));

                if (sum >= brand_name_item_threshold) {
                    console.log("Going to get brand name.");
                    shoppingCart.push(brandNameMilk);
                    gotMilk = true;
                    Agent.addAction(gotMilk);
                } else {
                    console.log("I'm buying local.");
                    shoppingCart.push(localMilk);
                    gotMilk = true;
                    Agent.addAction(gotMilk);
                }

                console.log("\n");

            } else if (routeDecision.toLowerCase() === 'r' && Agent.actionSequence.includes(gotMilk, 1)) {
                console.log("I already have what I need from here. Better backtrack.\n");
                continue;

            } else if (routeDecision.toLowerCase() === 's' && !Agent.actionSequence.includes(gotLighter, 1)) {
                let localGoodsFactor = getZeroOrOne();
                
                const localLighter = {item: 'lighter', type: 'local', price: 3};
                const brandNameLighter = {item: 'lighter', type: 'brand name', price: 5};

                const cost_weight = 0.6;
                const local_goods_weight = -0.3;
                const brand_name_weight = 0.6;

                const inputs = [cost_factor, localGoodsFactor, brand_name_factor];
                const weights = [cost_weight, local_goods_weight, brand_name_weight];
                let sum = 0;

                console.log("Are there local goods available? 1 for yes, 0 for no: " + localGoodsFactor);

                sum = summationOfInputsAndWeights(sum, inputs, weights, spending_bias);

                console.log("Threshold to buy brand name is 1.0. Current value: " + sum.toPrecision(2));

                if (sum >= brand_name_item_threshold) {
                    console.log("Going to get brand name.\n");
                    shoppingCart.push(brandNameLighter);
                    gotLighter = true;
                    Agent.addAction(gotLighter);
                } else {
                    console.log("I'm buying local.\n");
                    shoppingCart.push(localLighter);
                    gotLighter = true;
                    Agent.addAction(gotLighter);
                }

                console.log("\n");

            } else if (routeDecision.toLowerCase() === 's' && Agent.actionSequence.includes(gotLighter, 1)) {
                console.log("I already have what I need from here. Better backtrack.\n");
                continue;

            } else {
                console.log("ERROR: Invalid input. Try again.\n");
            }

            if (Agent.actionSequence.includes(gotEggs) &&
                Agent.actionSequence.includes(gotMilk) && 
                Agent.actionSequence.includes(gotLighter)
            ) checkListIncomplete = false;
        }

        let shoppingSubTotal = 0;

        for (let i = 0; i < shoppingCart.length; i++) {
            shoppingSubTotal += shoppingCart[i].price;
        }

        const sales_tax_percent = 0.05;
        let salesTaxofSubTotal = shoppingSubTotal * sales_tax_percent;
        let totalPrice = shoppingSubTotal + salesTaxofSubTotal;
        console.log("Total price of groceries: $" + totalPrice);
        money -= totalPrice;

        console.log("Money left: $" + money);

        if (money < 40) {
            console.log("Ugh, if I get a drink, I won't have enough money for other things...");
        } else {
            console.log("I'll get a drink.");

            money -= 6;
            gotEnergyDrink = true;

            console.log("Money left: $" + money);
        }

    } else if (Agent.actionSequence.includes(tookBus)) {
        const spending_bias = 0;
        const cost_factor = 1;
        const brand_name_factor = 1;
        let checkListIncomplete = true;
        let shoppingCart = [];

        console.log("I'm at the store.\n");

        let gotEggs = false;
        let gotMilk = false;
        let gotLighter = false;

        while (checkListIncomplete) {
            console.log("The eggs are on the left side of the store.");
            console.log("The milk is on the right side of the store.");
            console.log("And the home supplies is straight ahead. I can buy lighters there.");
            console.log("Do I want to go left, right, or straight ahead?\n");

            const readline = require("readline-sync");

            console.log("Choose l for left, r for right, s for straight ahead: ");
            let routeDecision = String(readline.question());

            if (routeDecision.toLowerCase() === 'l' && !Agent.actionSequence.includes(gotEggs, 1)) {
                let localGoodsFactor = getZeroOrOne();
                
                const localEggs = {item: 'eggs', type: 'local', price: 6};
                const brandNameEggs = {item: 'eggs', type: 'brand name', price: 8};

                const cost_weight = 0.6;
                const local_goods_weight = -0.3;
                const brand_name_weight = 0.6;

                const inputs = [cost_factor, localGoodsFactor, brand_name_factor];
                const weights = [cost_weight, local_goods_weight, brand_name_weight];
                let sum = 0;

                console.log("Are there local goods available? 1 for yes, 0 for no: " + localGoodsFactor);

                sum = summationOfInputsAndWeights(sum, inputs, weights, spending_bias);

                console.log("Threshold to buy brand name is 1.0. Current value: " + sum.toPrecision(2));

                if (sum >= brand_name_item_threshold) {
                    console.log("Going to get brand name.");
                    shoppingCart.push(brandNameEggs);
                    gotEggs = true;
                    Agent.addAction(gotEggs);
                } else {
                    console.log("I'm buying local.");
                    shoppingCart.push(localEggs);
                    gotEggs = true;
                    Agent.addAction(gotEggs);
                }

                console.log("\n");

            } else if (routeDecision.toLowerCase() === 'l' && Agent.actionSequence.includes(gotEggs, 1)) {
                console.log("I already have what I need from here. Better backtrack.\n");
                continue;

            } else if (routeDecision.toLowerCase() === 'r' && !Agent.actionSequence.includes(gotMilk, 1)) {
                let localGoodsFactor = getZeroOrOne();
                
                const localMilk = {item: 'milk', type: 'local', price: 7};
                const brandNameMilk = {item: 'milk', type: 'brand name', price: 9};

                const cost_weight = 0.6;
                const local_goods_weight = -0.3;
                const brand_name_weight = 0.6;

                const inputs = [cost_factor, localGoodsFactor, brand_name_factor];
                const weights = [cost_weight, local_goods_weight, brand_name_weight];
                let sum = 0;

                console.log("Are there local goods available? 1 for yes, 0 for no: " + localGoodsFactor);

                sum = summationOfInputsAndWeights(sum, inputs, weights, spending_bias);

                console.log("Threshold to buy brand name is 1.0. Current value: " + sum.toPrecision(2));

                if (sum >= brand_name_item_threshold) {
                    console.log("Going to get brand name.");
                    shoppingCart.push(brandNameMilk);
                    gotMilk = true;
                    Agent.addAction(gotMilk);
                } else {
                    console.log("I'm buying local.");
                    shoppingCart.push(localMilk);
                    gotMilk = true;
                    Agent.addAction(gotMilk);
                }

                console.log("\n");

            } else if (routeDecision.toLowerCase() === 'r' && Agent.actionSequence.includes(gotMilk, 1)) {
                console.log("I already have what I need from here. Better backtrack.\n");
                continue;

            } else if (routeDecision.toLowerCase() === 's' && !Agent.actionSequence.includes(gotLighter, 1)) {
                let localGoodsFactor = getZeroOrOne();
                
                const localLighter = {item: 'lighter', type: 'local', price: 3};
                const brandNameLighter = {item: 'lighter', type: 'brand name', price: 5};

                const cost_weight = 0.6;
                const local_goods_weight = -0.3;
                const brand_name_weight = 0.6;

                const inputs = [cost_factor, localGoodsFactor, brand_name_factor];
                const weights = [cost_weight, local_goods_weight, brand_name_weight];
                let sum = 0;

                console.log("Are there local goods available? 1 for yes, 0 for no: " + localGoodsFactor);

                sum = summationOfInputsAndWeights(sum, inputs, weights, spending_bias);

                console.log("Threshold to buy brand name is 1.0. Current value: " + sum.toPrecision(2));

                if (sum >= brand_name_item_threshold) {
                    console.log("Going to get brand name.");
                    shoppingCart.push(brandNameLighter);
                    gotLighter = true;
                    Agent.addAction(gotLighter);
                } else {
                    console.log("I'm buying local.");
                    shoppingCart.push(localLighter);
                    gotLighter = true;
                    Agent.addAction(gotLighter);
                }

                console.log("\n");

            } else if (routeDecision.toLowerCase() === 's' && Agent.actionSequence.includes(gotLighter, 1)) {
                console.log("I already have what I need from here. Better backtrack.\n");
                continue;

            } else {
                console.log("ERROR: Invalid input. Try again.\n");
            }

            if (Agent.actionSequence.includes(gotEggs) &&
                Agent.actionSequence.includes(gotMilk) && 
                Agent.actionSequence.includes(gotLighter)
            ) checkListIncomplete = false;
        }

        let shoppingSubTotal = 0;

        for (let i = 0; i < shoppingCart.length; i++) {
            shoppingSubTotal += shoppingCart[i].price;
        }

        const sales_tax_percent = 0.05;
        let salesTaxofSubTotal = shoppingSubTotal * sales_tax_percent;
        let totalPrice = shoppingSubTotal + salesTaxofSubTotal;
        console.log("Total price of groceries: $" + totalPrice);
        money -= totalPrice;

        console.log("Money left: $" + money);

        if (money < 40) {
            console.log("Ugh, if I get a drink, I won't have enough money for other things...\n");
        } else {
            console.log("I'll get a drink.");

            money -= 6;
            gotEnergyDrink = true;

            console.log("Money left: $" + money + "\n");
        }
    }
}

storeScenario();

/* AGENT'S TRANSIT PERCEPT: I am done shopping. Now to get back home.
   Because I have grocery bags, it would be preferable to take
   a taxi home so I don't have to hold on to the bags on the bus.
   Bus and taxi fares are still the same. Unfortunately, one of
   the main roads is now closed so now it will take an additional
   mile to get home from the store, regardless of whether I take
   the bus or taxi.

   ADDITIONAL FACTORS
    - Is the weather bad? (increases likelihood of taking taxi)
    - Is traffic density high? (now increases likelihood of taking bus)
    - Is the bus crowded? (increases likelihood of taking taxi)
    - Money left (increases likelihood of taking bus)
    - Preference for taxi due to groceries (bias for taxi)

   CRITERIA                 INPUT                   WEIGHT
   
   Cost                     x1 = 1                 w1 = 0.7
   Bad Weather        x2 = either 0 or 1           w2 = -0.5
   Heavy Traffic      x3 = either 0 or 1           w3 = 0.6
   Bus Crowding       x4 = either 0 or 1           w4 = -0.3
   Money Left         x5 = either 0 or 1           w5 = 0.4
   Bias for Taxi                                   w6 = -0.2

   DEV NOTE: The input values for Bad Weather, Heavy Traffic, and
   Bus Crowding are to be interpreted as a boolean of either 0 (false)
   or 1 (true). The input value for Money Left is determined on how 
   much money the agent has left. If they have less than $40, then
   they will be more likely to take the bus (1). The Bias for Taxi
   is factored into the decision for the agent as well as Cost.
*/

let tookBusHome = false;
let tookTaxiHome = false;

function takeTaxiOrBus() {
    atStore = false;
    onTheStreets = true;
    Agent.addEnvironment(onTheStreets);

    console.log("Time to head home.\n");

    const bus_choice_threshold = 1.3;

    const cost_factor = 1;
    console.log("It's cheaper to take the bus ($5) than to hail a taxi ($11).");

    let weatherFactor = getZeroOrOne();
    if (weatherFactor == 0.0) {
        console.log("It's nice outside today! ");
    } else if (weatherFactor == 1.0) {
        console.log("The weather looks awful today... ");
    }

    let trafficFactor = getZeroOrOne();
    if (trafficFactor == 0.0) {
        console.log("Traffic flow is normal for now. ");
    } else if (trafficFactor == 1.0) {
        console.log("There is a lot of traffic on the roads... ");
    }

    let busCrowdingFactor = getZeroOrOne();
    if (busCrowdingFactor == 0) {
        console.log("Plenty of space on the bus.");
    } else if (busCrowdingFactor == 1.0) {
        console.log("There is a lot of people on the bus.");
    }

    let moneyUnder$40 = 0;
    if (money < 40) {
        moneyUnder$40 = 1;
        console.log("Don't have much cash left...\n");
    }

    const cost_weight = 0.7;
    const weather_weight = -0.5;
    const traffic_weight = 0.6;
    const bus_crowding_weight = -0.3;
    const money_weight = 0.4;
    const taxi_bias = -0.2;

    const inputs = [cost_factor, weatherFactor, trafficFactor, busCrowdingFactor, moneyUnder$40];
    const weights = [cost_weight, weather_weight, traffic_weight, bus_crowding_weight, money_weight];
    let sum = 0;

    sum = summationOfInputsAndWeights(sum, inputs, weights, taxi_bias);

    console.log("Threshold to take a bus is 1.3. Current conditions: " + sum.toPrecision(2));

    if (sum >= bus_choice_threshold) {
        console.log("Got to take the bus.");
        money -= 5;
        tookBusHome = true;
        Agent.addAction(tookBusHome);
        onTheStreets = false;
        return tookBusHome;
    } else {
        console.log("I'll take the taxi.");
        money -= 11;
        tookTaxiHome = true;
        Agent.addAction(tookTaxiHome);
        onTheStreets = false;
        return tookTaxiHome;
    }
}

takeTaxiOrBus();
atHome = true;
console.log("Money left: $" + money + "\n");

if (Agent.actionSequence.includes(tookBusHome)) {
    console.log("I would have rather took a cab but I got to save what money I have.\n");
} else if (Agent.actionSequence.includes(tookTaxiHome)) {
    console.log("Smooth ride back home...\n");
}

if (money < 35 && gotEnergyDrink == false) {
    console.log("I got everything I needed but I have little money left.");
    console.log("And I couldn't get a energy drink without spending too much...\n");

} else if (money >= 35 && gotEnergyDrink == false) {
    console.log("I got everything I needed and still have plenty of money left.");
    console.log("But no energy drink.\n");

} else if (money < 35 && gotEnergyDrink == true) {
    console.log("I got everything I needed but I have little money left.");
    console.log("But at least I got an energy drink.\n");

} else if (money >= 35 && gotEnergyDrink == true) {
    console.log("I got everything I needed and still have plenty of money left.");
    console.log("And I got an energy drink! Nice!\n");
}