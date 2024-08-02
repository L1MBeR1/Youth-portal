export const textDeclension = (count, form1, form2, form5, includeNumber = true) => {
    const text = count % 10 === 1 && count % 100 !== 11
        ? form1
        : [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)
        ? form2
        : form5;

    return includeNumber ? `${count} ${text}` : text;
};