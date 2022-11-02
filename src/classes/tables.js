const validStyles = {
    "percent": true,
    "amount": true,
    "value": true
};

export function isValidStyle(table) {
    return table.style in validStyles;
}

export function cacheBrackets(table_in) {
    const { style, table, explanation } = table_in;

    if (!isValidStyle(table_in)) {
        throw Error(`Style ${style} not known`);
    }

    const brackets = [];
    let lastHigh = 0;
    let bracketSummation = 0;
    let additiveAmount = 0;

    table.forEach(([bracketHigh, rawValue]) => {
        const min = lastHigh;
        const max = bracketHigh;
        lastHigh = max;
        const range = max - min;
        const bracketPortion = ("percent" == style) ?
            range * rawValue : // tax rate
            rawValue; // just the value
        additiveAmount = bracketSummation; // PRIOR
        bracketSummation += bracketPortion; // CURRENT
        const transitoryTotal = ("percent" == style) ?
            max * rawValue : // tax rate by range max
            0; // doesn't apply
        const subtractionAmount = ("percent" == style) ?
            transitoryTotal - bracketSummation : // percent
            0; // doesn't apply

        brackets.push({
            min,
            max,
            rawValue,
            range,
            bracketPortion,
            bracketSummation,
            additiveAmount,
            transitoryTotal,
            subtractionAmount
        })
    });

    return {
        style,
        cachedBrackets: brackets,
        table,
        explanation
    };
}

// Return the value from finding the right bracket and using it.
export function lookupCached(amount, cachedTable) {
    const table = cachedTable.cachedBrackets;
    const style = cachedTable.style;
    const bracketsMatched = [];
    const result = {
        result: 0,
        brackets: bracketsMatched,
        style: style,
        origin: cachedTable.origin
    };

    table.forEach((bracket) => {

        // destructure
        const { min, max, range, bracketPortion, bracketSummation,
            additiveAmount, transitoryTotal,
            subtractionAmount, rawValue } = bracket;

        if (min <= amount) {

            // pass through
            bracketsMatched.push(bracket);

            // if this is last, exit out
            if (max == 0 || amount < max) {
                // last
                switch (style) {
                    case 'percent':
                        result.result = (amount * rawValue) - subtractionAmount;
                        break;
                    case 'amount': result.result = bracketSummation; break;
                    case 'value': result.result = rawValue; break;
                }
            }
        }

    });

    return result;
}

export function presentation(cachedTable, mode = 'additive') {

    // destructure the table to get our useful parts
    const { style, cachedBrackets } = cachedTable;

    if (!isValidStyle(cachedTable)) {
        throw Error(`Style ${style} not known`);
    }

    return cachedBrackets.map(({
        min,
        max,
        rawValue,
        range,
        bracketPortion,
        bracketSummation,
        additiveAmount,
        transitoryTotal,
        subtractionAmount }) => {
        const result = { min, max };

        switch (style) {
            case 'percent':
                result.percent = rawValue;
                if (mode == 'additive') {
                    result.add = additiveAmount;
                    result.value =
                        `${additiveAmount} + ((AMOUNT-${min}) * ${rawValue})`;
                } else {
                    result.subtract = subtractionAmount;
                    result.value =
                        `(AMOUNT * ${rawValue}) - ${subtractionAmount}`;
                }
                break;
            case 'amount':
                result.value = bracketSummation;
                result.amountPart = rawValue; break;
            case 'value': result.value = rawValue; break;
        }

        return result;
    });
}

