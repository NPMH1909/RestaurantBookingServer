
export const ValidateInput = (...args) => {
    for (const arg of args) {
      if (arg === null || arg === undefined || arg === '') {
        return true; 
      }
    }
    return false;
  }
