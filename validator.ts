export function isValidCronExpression(expression: string): boolean {
  const fields = expression.trim().split(/\s+/);

  if (fields.length !== 6) {
    return false;
  }

  const [minutes, hours, dayOfMonth, month, dayOfWeek, year] = fields;

  if (!isValidField(minutes, 0, 59) || !isValidField(hours, 0, 23) || !isValidField(month, 1, 12)) {
    return false;
  }

  if (!isValidField(dayOfMonth, 1, 31, true) || !isValidField(dayOfWeek, 0, 7, true)) {
    return false;
  }

  if (!isValidField(year, 1970, 2199)) {
    return false;
  }

  return true;
}

function isValidField(field: string, min: number, max: number, allowQuestionMark = false): boolean {
  if (allowQuestionMark && field === "?") {
    return true;
  }

  if (field === "*") {
    return true;
  }

  if (field.includes(",")) {
    const values = field.split(",");
    return values.every((value) => isValidValue(value, min, max));
  }

  if (field.includes("-")) {
    const [start, end] = field.split("-");
    return isValidRange(parseInt(end), parseInt(start), max) && isValidRange(parseInt(start), min, parseInt(end));
  }

  if (field.includes("/")) {
    const [value, increment] = field.split("/");
    return isValidValue(value, min, max) && isValidIncrement(parseInt(increment), min, max);
  }

  if (field.includes("#")) {
    const [value, hash] = field.split("#");
    return (
      isValidValue(value, min, max) &&
      parseInt(hash) > 0 &&
      parseInt(hash) < 6 &&
      (parseInt(value) !== 0 || parseInt(hash) !== 1)
    );
  }

  return isValidValue(field, min, max);
}

function isValidValue(value: string, min: number, max: number): boolean {
  if (value === "L") {
    return true;
  }

  if (value === "W") {
    return true;
  }

  const intValue = parseInt(value);
  return Number.isInteger(intValue) && intValue >= min && intValue <= max;
}

function isValidRange(end: number, min: number, max: number): boolean {
  return Number.isInteger(end) && end >= min && end <= max;
}

function isValidIncrement(increment: number, min: number, max: number): boolean {
  return Number.isInteger(increment) && increment > 0 && max % increment === 0;
}
