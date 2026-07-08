export function getNumberFromText(textContent: string) {
  return parseFloat(textContent.replace(/\s/g, '').replace(',', '.')) // функцию чуть переписала, чтобы в теории учитывались копейки в цене
}
