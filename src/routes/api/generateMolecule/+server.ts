import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateLinearBackbone, chooseRandom, allFuncGroups } from '$lib/functionalGroup';

export const POST: RequestHandler = async ({ request }) => {
    const { level = 1, numberFunctionalGroups = 3 }: 
        { level: number, numberFunctionalGroups: number } = await request.json();

    // Probability of pulling a hydrogen instead of a functional group
    // Lower value would lead to more branching I think
    const hydroProp = Math.pow(0.95, level);

    // Backbone length, should be 1 < n
    const suggestedBackboneLength = Math.ceil(Math.pow((Math.random() * 4),  1 / hydroProp));

    // should be between 3 - 10
    let backboneLength;
    if (suggestedBackboneLength < 3) {
        backboneLength = 3;
    }
    else if (suggestedBackboneLength > 10) {
        backboneLength = 10;
    }
    else {
        backboneLength = suggestedBackboneLength;
    }

    let backbone = generateLinearBackbone(backboneLength, hydroProp);

    // track that numberFuncAdded < numberFunctionGroup
    let numberFuncAdded = 0;
    let stack = backbone.filter((funcGroup) => funcGroup.stericAvailable > 0);

    let numberSucsessful = 0;

    while (numberSucsessful < numberFunctionalGroups && stack.length > 0) {

        const target = chooseRandom(stack);

        const funcGroupChoice = chooseRandom(allFuncGroups)();

        let sucsessful = false;
        // Do skip chance for victim, if level higher more weird structures
        if (funcGroupChoice.skipChance > Math.random() ** level) {
            // pass as it is not sucsessful
        }

        else {
            sucsessful = target.attachFuncGroup(funcGroupChoice);
        }

        if (sucsessful) {
            // Check that target has enough to stay in stack else pop
            if (target.stericAvailable < 1) {
                const targetIndex = stack.indexOf(target);
                stack.splice(targetIndex, 1);
            }

            numberSucsessful++;

            // Add the functional group to stack if it has stericAvailability
            if (funcGroupChoice.stericAvailable > 0) {
                stack.push(funcGroupChoice);
            }
        }

    }

    // Still works as linked, hopefully
    let SMILES = backbone[0].toSmiles()

    console.log(SMILES)

    return json({ SMILES })

}