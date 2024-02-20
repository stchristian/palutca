export function splitParamList(input: string) {
  // Match non-space characters or anything within double quotes
  const regex = /[^\s"]+|"([^"]*)"/g;
  const result: string[] = [];
  let match: RegExpExecArray | null = null;

  do {
    // Each call to exec returns the next match or null if there are no more matches
    match = regex.exec(input);
    if (match != null) {
      // Use the captured group if it exists, otherwise use the whole match
      result.push(match[1] ? match[1] : match[0]);
    }
  } while (match !== null);

  return result;
}
