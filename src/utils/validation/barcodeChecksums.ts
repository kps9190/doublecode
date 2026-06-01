export function eanChecksum(value: string) {
    const body = value.slice(0, -1).split("").map(Number);
    const sum = body.reduce((total, digit, index) => {
        const weight = body.length % 2 !== index % 2 ? 3 : 1;
        return total + digit * weight;
    }, 0);
    return (10 - (sum % 10)) % 10;
}

export function itf14Checksum(value: string) {
    const sum = value
        .slice(0, 13)
        .split("")
        .map(Number)
        .reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 3 : 1), 0);
    return (10 - (sum % 10)) % 10;
}

export function expandUPCEToUPCA(middleDigits: string, numberSystem: string) {
    const last = middleDigits[5];
    const expansions = [
        "XX00000XXX",
        "XX10000XXX",
        "XX20000XXX",
        "XXX00000XX",
        "XXXX00000X",
        "XXXXX00005",
        "XXXXX00006",
        "XXXXX00007",
        "XXXXX00008",
        "XXXXX00009",
    ];

    return numberSystem + expansions[Number(last)]
        .split("")
        .map((char) => char === "X" ? middleDigits[0] : char)
        .join("");
}
