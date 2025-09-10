
// Helper function for random choice
export function chooseRandom<T>(x: Array<T>): T {
    const index: number = Math.floor(Math.random() * x.length);
    return x[index]
}

// takes float 0<n<1 and return if random if less than it
export function binaryChoice(prob: number): Boolean {
    return Math.random() < prob
}

export class functionalGroup {

    name: String;
    SMILES: String;
    stericAvailable: number;
    // attachValue, required bond level, example double to bond
    attachValue: number;
    rGroups: Array<functionalGroup>;

    constructor (
        name: String,
        SMILES: String,
        stericAvailable: number,
        attachValue: number, 
    ) {
        this.name = name;
        this.SMILES = SMILES;
        this.stericAvailable = stericAvailable;
        this.attachValue = attachValue;
        this.rGroups = [];
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

            if (i == this.rGroups.length - 1) {
                // handle non () case
                fullSMILES += `${this.rGroups[i].toSmiles()}`;
            }
            else {
                fullSMILES += `(${this.rGroups[i].toSmiles()})`;
            }
        }

        return fullSMILES
    }

}

export const newStartCarbon = () => {return new functionalGroup(
    'Starting Carbon',
    'C',
    4,
    1
)}

export const newSingleCarbon = () => {return new functionalGroup(
    'Single Carbon',
    'C',
    3, // account for being attached
    1
)}

export const newDoubleCarbon = () => {return new functionalGroup(
    'Double Bond Carbon',
    '=C',
    2,
    2
)}

export const generateLinearBackbone = (length: number, hydroProb: number): Array<functionalGroup> => {

    let lastCarbon = newStartCarbon();

    let backboneFuncGroups = [lastCarbon];

    for (let i = 0; i < length - 1; i++) {
        if (!binaryChoice(hydroProb)) {
            // Add double carbon

            const next = newDoubleCarbon();

            lastCarbon.attachFuncGroup(next)

            backboneFuncGroups.push(next);

            lastCarbon = next;

        }
        else {
            // Add single carbon
            const next = newSingleCarbon();

            lastCarbon.attachFuncGroup(next);

            backboneFuncGroups.push(next);

            lastCarbon = next;
        }
    }

    return backboneFuncGroups
}

export const allFuncGroups = [
    newSingleCarbon,
    newDoubleCarbon,
]