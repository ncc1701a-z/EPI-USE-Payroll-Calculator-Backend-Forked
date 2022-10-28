import * as asyncCommands from './asyncCommands.js';
import * as ioCommands from './IOCommands.js';
import * as compositeCommands from './compositeCommands.js';
import * as basicCommands from './basicCommands.js';

export function addCommands(factoryInput) {
    return asyncCommands.addCommands(
        ioCommands.addCommands(
            compositeCommands.addCommands(
                basicCommands.addCommands(factoryInput)
            )
        )
    )
}