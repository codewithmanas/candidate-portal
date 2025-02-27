const cleanDataIntoNormalText = (inputString: string) => {
    const formattedText = inputString.split("\n").join(" ").replace(/\s+/g, " ");
    return formattedText;
}

export { cleanDataIntoNormalText };