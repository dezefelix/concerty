export enum Genre {
  'Hip-Hop',
  'R-B',
  'Pop',
  'Country',
  'Dancehall',
  'Reggae',
}

export namespace Genre {

  export function keys(): Array<string> {
    const keys = Object.keys(Genre);
    const keysTrimmed = keys.slice(0, keys.length - 1); // Remove this function (keys()) from keys array.
    return keysTrimmed.filter(val => {
      return val.length !== 1; // Filter out number values, while keeping the actual keys (UP, RIGHT).
    });
  }

  export function getDisplayValue(genre: Genre): string {
    if (Genre[genre].toLowerCase() === 'R-B') {
      return 'R&B';
    } else {
      return Genre[genre];
    }
  }
}
