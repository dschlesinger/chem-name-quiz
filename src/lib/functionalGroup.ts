
// Helper function for random choice
export function chooseRandom<T>(x: Array<T>): T {
    const index: number = Math.floor(Math.random() * x.length);
    return x[index]
}

// takes float 0<n<1 and return if random if less than it
export function binaryChoice(prob: number): Boolean {
    return Math.random() < prob
}

function getRingNumber(): String {
    const n = Math.floor(Math.random() * 99);

    if (n > 9) {
        return `%${n}`
    }

    return `${n}`
}

export class functionalGroup {

    name: String;
    SMILES: String;
    stericAvailable: number;
    // attachValue, required bond level, example double to bond
    attachValue: number;
    rGroups: Array<functionalGroup>;
    skipChance: number;

    constructor (
        name: String,
        SMILES: String,
        stericAvailable: number,
        attachValue: number, 
        skipChance: number = 0,
    ) {
        this.name = name;
        this.SMILES = SMILES;
        this.stericAvailable = stericAvailable;
        this.attachValue = attachValue;
        this.rGroups = [];
        this.skipChance = skipChance;
    }

    // Returns true if sucsessful false if failed probably cant attatch or smth
    attachFuncGroup (victim: functionalGroup): Boolean {

        // Cannot bond as does not have available steric values
        if (this.stericAvailable < victim.attachValue) {
            return false
        }

        // Can bind
        this.stericAvailable -= victim.attachValue;
        this.rGroups.push(victim);

        // Remember to remove from que if stericAvailable == 0

        return true
    }

    toSmiles (): String {

        let fullSMILES = this.SMILES;

        for (let i = 0; i < this.rGroups.length; i++) {
            // Always use () it causes less problems with Arenes
            fullSMILES = fullSMILES.replace('?', `(${this.rGroups[i].toSmiles()})`);
        }

        fullSMILES = fullSMILES.replaceAll('?', '')

        console.log('inprogress', fullSMILES)

        return fullSMILES
    }

}

export const newStartCarbon = () => {return new functionalGroup(
    'Starting Carbon',
    'C????',
    4,
    1
)}

export const newSingleCarbon = () => {return new functionalGroup(
    'Single Carbon',
    'C???',
    3, // account for being attached
    1,
    0.1,
)}

export const newDoubleCarbon = () => {return new functionalGroup(
    'Double Bond Carbon',
    '=C??',
    2,
    2,
    0.2,
)}

export const hydroxyl = () => {return new functionalGroup(
    'Hydroxyl Group',
    'O',
    0,
    1
)}

export const thiol = () => {return new functionalGroup(
    'Thiol Group',
    'S?',
    1,
    1,
    0.5,
)}

export const hexaneRing = () => {
    // to prevent ring numbering conflicts

    const ringNumber = getRingNumber();

    return new functionalGroup(
    'Cyclohexane',
    `C${ringNumber}?C??C??C??C??C${ringNumber}??`,
    11,
    1,
    0.75,
)}

export const benzene = () => {

    const ringNumber = getRingNumber();
    
    return new functionalGroup(
    'Benzene Ring',
    `C${ringNumber}=C?C?=C?C?=C${ringNumber}?`,
    5,
    1,
    0.75
)}

export const cycloPropane = () => {

    const ringNumber = getRingNumber();
    
    return new functionalGroup(
    'Cyclo Propane',
    `C${ringNumber}??C??C${ringNumber}??`,
    6,
    1,
    0.9,
)}

export const epoxide = () => {

    const ringNumber = getRingNumber();
    
    return new functionalGroup(
    'Epoxide Triangle',
    `C${ringNumber}??C??O${ringNumber}`,
    4,
    1,
    0.9,
)}

export const amine = () => {
    
    return new functionalGroup(
    'Amine',
    `N??`,
    2,
    1,
    0.2,
)}

export const generateLinearBackbone = (length: number, hydroProb: number): Array<functionalGroup> => {

    let lastCarbon = newStartCarbon();

    let backboneFuncGroups = [lastCarbon];

    for (let i = 0; i < length - 1; i++) {
        // if (!binaryChoice(hydroProb)) {
        //     // Add double carbon

        //     const next = newDoubleCarbon();

        //     lastCarbon.attachFuncGroup(next)

        //     backboneFuncGroups.push(next);

        //     lastCarbon = next;

        // }
        // else {
            // Add single carbon
            const next = newSingleCarbon();

            lastCarbon.attachFuncGroup(next);

            backboneFuncGroups.push(next);

            lastCarbon = next;
        // }
    }

    return backboneFuncGroups
}

export const allFuncGroups = [
    newSingleCarbon,
    // newDoubleCarbon,
    hydroxyl,
    thiol,
    hexaneRing,
    benzene,
    cycloPropane,
    epoxide,
    amine,
]